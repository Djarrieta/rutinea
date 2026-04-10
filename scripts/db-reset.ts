import postgres from "postgres";
import { readFileSync } from "fs";
import { join, dirname } from "path";

const root = join(dirname(new URL(import.meta.url).pathname), "..");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set. Add it to .env\n" +
      "Find it in Supabase: Settings → Database → Connection string (URI)"
  );
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function run() {
  const migrationPath = join(
    root,
    "supabase/migrations/20240101000000_exercises.sql"
  );
  const seedPath = join(root, "supabase/seed.sql");

  const migrationSql = readFileSync(migrationPath, "utf-8");
  const seedSql = readFileSync(seedPath, "utf-8");

  console.log("⚠  Resetting database...");

  console.log("→ Dropping all tables in public schema...");
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const { tablename } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS public."${tablename}" CASCADE`);
  }

  console.log("→ Running migrations...");
  await sql.unsafe(migrationSql);

  console.log("→ Seeding data...");
  await sql.unsafe(seedSql);

  console.log("✓ Database reset complete.");

  await sql.end();
}

run().catch((err) => {
  console.error("Reset failed:", err.message);
  sql.end();
  process.exit(1);
});
