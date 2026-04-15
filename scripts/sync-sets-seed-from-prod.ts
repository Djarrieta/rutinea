import postgres from "postgres";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";

const root = join(dirname(new URL(import.meta.url).pathname), "..");
const PROD_USER_ID = "ec507c0b-6185-4c54-9cc5-2aa357e4bb6d";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set. Export your production DATABASE_URL first.\n" +
    "  export DATABASE_URL=postgresql://..."
  );
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function run() {
  const seedPath = join(root, "supabase/seed/02_sets.sql");
  let seedSql = readFileSync(seedPath, "utf-8");

  console.log(`→ Fetching sets and exercises for user ${PROD_USER_ID} from prod...`);
  const prodData = await sql`
    SELECT s.name as set_name, e.title as exercise_title
    FROM public.sets s
    JOIN public.set_exercises se ON s.id = se.set_id
    JOIN public.exercises e ON se.exercise_id = e.id
    WHERE s.user_id = ${PROD_USER_ID}
    ORDER BY s.name, se.position
  `;

  console.log(`  Found ${prodData.length} exercise links in prod.\n`);

  if (prodData.length === 0) {
    console.log("No data found in prod. Exiting.");
    await sql.end();
    return;
  }

  // Build a map: set_name → string[] of exercise titles
  const prodMap = new Map<string, string[]>();
  for (const row of prodData) {
    // Strip [clon] from both set names and exercise titles for matching
    const setName = row.set_name.replace(/ \[clon\]$/i, "");
    const exerciseTitle = row.exercise_title.replace(/ \[clon\]$/i, "");

    if (!prodMap.has(setName)) {
      prodMap.set(setName, []);
    }
    prodMap.get(setName)!.push(exerciseTitle);
  }

  // Regex to find each set block:
  // We look for:
  //   s.name = 'SET_NAME'
  //   and e.title in ( ... )
  //
  // Capturing groups:
  // 1: Prefix up to the start of titles
  // 2: Set name
  // 3: Titles block
  // 4: Suffix
  const setBlockRe = /(s\.name\s+=\s+'([^']*(?:''[^']*)*)'\s+and\s+e\.title\s+in\s+\()([\s\S]+?)(\);)/g;

  const updated: string[] = [];
  const notInProd: string[] = [];
  const unchanged: string[] = [];

  seedSql = seedSql.replace(setBlockRe, (full, prefix, setNameEscaped, titlesBlock, suffix) => {
    const setName = setNameEscaped.replace(/''/g, "'");
    const prodExercises = prodMap.get(setName);

    if (!prodExercises) {
      notInProd.push(setName);
      return full;
    }

    // Format new titles block
    // We want to preserve indentation. Let's assume 8 spaces as seen in the file.
    const newTitlesContent = prodExercises
      .map(t => `        '${t.replace(/'/g, "''")}'`)
      .join(",\n");

    const newTitlesBlock = `\n${newTitlesContent}\n    `;

    if (titlesBlock.trim() === newTitlesContent.trim()) {
      unchanged.push(setName);
      return full;
    }

    updated.push(`  ${setName}: updated with ${prodExercises.length} exercises`);
    return prefix + newTitlesBlock + suffix;
  });

  writeFileSync(seedPath, seedSql, "utf-8");

  if (updated.length > 0) {
    console.log(`✓ Updated ${updated.length} sets:`);
    for (const msg of updated) console.log(msg);
  }

  if (unchanged.length > 0) {
    console.log(`\n— ${unchanged.length} sets already up to date.`);
  }

  if (notInProd.length > 0) {
    console.log(`\n⚠ ${notInProd.length} sets in seed not found in prod (skipped):`);
    for (const s of notInProd) console.log(`  ${s}`);
  }

  await sql.end();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
