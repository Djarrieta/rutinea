import postgres from "postgres";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(new URL(import.meta.url).pathname), "..");
const backupsDir = join(root, "backups");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set. Add it to .env or export it:\n" +
      "  export DATABASE_URL=postgresql://...\n" +
      "Find it in Supabase: Settings → Database → Connection string (URI)"
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const sql = postgres(databaseUrl);

const TABLES = [
  "profiles",
  "exercises",
  "sets",
  "set_exercises",
  "routines",
  "routine_sets",
  "plans",
  "plan_days",
  "plan_day_routines",
  "progress_entries",
] as const;

function escapeValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (Array.isArray(value)) {
    const inner = value.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(",");
    return `'{${inner}}'`;
  }
  const str = String(value).replace(/'/g, "''");
  return `'${str}'`;
}

function rowToInsert(table: string, row: Record<string, unknown>): string {
  const columns = Object.keys(row);
  const values = columns.map((col) => escapeValue(row[col]));
  return `INSERT INTO public."${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${values.join(", ")});`;
}

async function run() {
  mkdirSync(backupsDir, { recursive: true });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filePath = join(backupsDir, `backup_${timestamp}.sql`);

  console.log("📦 Starting database backup...\n");

  const lines: string[] = [
    `-- Rutinea database backup — ${new Date().toISOString()}`,
    `-- Source: ${databaseUrl!.replace(/\/\/.*:.*@/, "//***:***@")}`,
    "",
    "BEGIN;",
    "",
  ];

  let totalRows = 0;

  for (const table of TABLES) {
    process.stdout.write(`→ ${table}... `);

    try {
      const rows = await sql`SELECT * FROM public.${sql(table)}`;

      if (rows.length === 0) {
        console.log("(empty)");
        continue;
      }

      lines.push(`-- ─── ${table} (${rows.length} rows) ───`);

      for (const row of rows) {
        lines.push(rowToInsert(table, row as Record<string, unknown>));
      }

      lines.push("");
      totalRows += rows.length;
      console.log(`${rows.length} rows`);
    } catch (err) {
      // Table might not exist yet (e.g. progress_entries before migration)
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("does not exist")) {
        console.log("(table not found, skipping)");
      } else {
        throw err;
      }
    }
  }

  lines.push("COMMIT;");
  lines.push("");

  writeFileSync(filePath, lines.join("\n"), "utf-8");

  console.log(`\n✓ Backup saved to ${filePath}`);
  console.log(`  ${totalRows} total rows across ${TABLES.length} tables`);

  // ─── Storage backup ──────────────────────────────────────────────────────
  const BUCKETS = ["exercise-images", "progress-images"];

  console.log("\n🖼  Backing up storage buckets...\n");

  let totalFiles = 0;

  for (const bucket of BUCKETS) {
    const bucketDir = join(backupsDir, "storage", bucket);
    mkdirSync(bucketDir, { recursive: true });

    process.stdout.write(`→ ${bucket}... `);

    const allPaths: string[] = [];

    async function collectPaths(prefix: string) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(prefix, { limit: 1000 });

      if (error || !data) return;

      for (const item of data) {
        const path = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.metadata) {
          allPaths.push(path);
        } else {
          await collectPaths(path);
        }
      }
    }

    await collectPaths("");

    if (allPaths.length === 0) {
      console.log("(empty)");
      continue;
    }

    let downloaded = 0;

    for (const filePath of allPaths) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error || !data) {
        console.warn(`\n  ⚠ Failed to download ${bucket}/${filePath}: ${error?.message}`);
        continue;
      }

      const localDir = join(bucketDir, dirname(filePath) === "." ? "" : dirname(filePath));
      mkdirSync(localDir, { recursive: true });

      const buffer = Buffer.from(await data.arrayBuffer());
      const localPath = join(bucketDir, filePath);
      writeFileSync(localPath, buffer);
      downloaded++;
    }

    totalFiles += downloaded;
    console.log(`${downloaded} files`);
  }

  console.log(`\n✓ Storage backup: ${totalFiles} files saved to backups/storage/`);

  await sql.end();
}

run().catch((err) => {
  console.error("Backup failed:", err.message);
  sql.end();
  process.exit(1);
});
