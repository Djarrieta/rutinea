import postgres from "postgres";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(new URL(import.meta.url).pathname), "..");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set. Add it to .env\n" +
      "Find it in Supabase: Settings → Database → Connection string (URI)"
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const sql = postgres(databaseUrl);

async function run() {
  const migrationsDir = join(root, "supabase/migrations");

  const migrationFiles = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log("⚠  Resetting database...");

  console.log("→ Dropping all tables in public schema...");
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const { tablename } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS public."${tablename}" CASCADE`);
  }

  console.log("→ Running migrations...");
  for (const file of migrationFiles) {
    console.log(`  → ${file}`);
    const migrationSql = readFileSync(join(migrationsDir, file), "utf-8");
    await sql.unsafe(migrationSql);
  }

  console.log("→ Cleaning storage bucket...");
  const bucket = "exercise-images";
  const { data: existingFiles } = await supabase.storage.from(bucket).list("", { limit: 1000 });
  if (existingFiles && existingFiles.length > 0) {
    // List recursively — handle top-level files and folders
    const allPaths: string[] = [];
    async function collectPaths(prefix: string) {
      const { data } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
      if (!data) return;
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
    if (allPaths.length > 0) {
      const { error } = await supabase.storage.from(bucket).remove(allPaths);
      if (error) console.warn("  ⚠ Could not clean storage:", error.message);
      else console.log(`  → Removed ${allPaths.length} file(s)`);
    }
  }

  console.log("→ Uploading seed assets...");
  const seedAssetsDir = join(root, "supabase/seed-assets");
  if (existsSync(seedAssetsDir)) {
    const assets = readdirSync(seedAssetsDir).filter((f) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );
    for (const file of assets) {
      const filePath = join(seedAssetsDir, file);
      const fileData = readFileSync(filePath);
      const storagePath = `seed/${file}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileData, {
          contentType: `image/${file.split(".").pop()}`,
          upsert: true,
        });
      if (error) console.warn(`  ⚠ Failed to upload ${file}:`, error.message);
      else console.log(`  → ${storagePath}`);
    }
  }

  console.log("→ Seeding data...");
  const seedDir = join(root, "supabase/seed");
  const seedFiles = readdirSync(seedDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of seedFiles) {
    console.log(`  → ${file}`);
    const seedSql = readFileSync(join(seedDir, file), "utf-8");
    const seedSqlResolved = seedSql.replaceAll("{{STORAGE_URL}}", supabaseUrl);
    await sql.unsafe(seedSqlResolved);
  }

  console.log("✓ Database reset complete.");

  await sql.end();
}

run().catch((err) => {
  console.error("Reset failed:", err.message);
  sql.end();
  process.exit(1);
});
