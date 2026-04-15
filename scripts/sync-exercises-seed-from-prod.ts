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
  const seedPath = join(root, "supabase/seed/01_exercises.sql");
  let seedSql = readFileSync(seedPath, "utf-8");

  console.log(`→ Fetching exercises for user ${PROD_USER_ID} from prod...`);
  const prodExercises = await sql`
    SELECT title, preparation_secs, duration_secs, repetitions
    FROM public.exercises
    WHERE user_id = ${PROD_USER_ID}
  `;

  console.log(`  Found ${prodExercises.length} exercises in prod.\n`);

  if (prodExercises.length === 0) {
    console.log("No exercises found. Exiting.");
    await sql.end();
    return;
  }

  // Build a map: title → { preparation_secs, duration_secs, repetitions }
  const prodMap = new Map<
    string,
    { preparation_secs: number; duration_secs: number; repetitions: number }
  >();
  for (const ex of prodExercises) {
    // Cloned exercises have " [clon]" appended — strip it for matching
    const title = ex.title.replace(/ \[clon\]$/, "");
    prodMap.set(title, {
      preparation_secs: ex.preparation_secs,
      duration_secs: ex.duration_secs,
      repetitions: ex.repetitions,
    });
  }

  // Match each exercise block in the seed SQL by title and replace timing values.
  //
  // Seed format per exercise (inside VALUES):
  //   '00000000-...',
  //   'title',
  //   'description',
  //   '[...]'::jsonb,
  //   '{"tag", ...}',
  //   <preparation_secs>,
  //   <duration_secs>,
  //   <repetitions>
  // )  or  ),
  //
  // Strategy: find each title string literal, then from that position find the
  // closing pattern (3 consecutive number lines followed by ")," or ");").

  const updated: string[] = [];
  const noMatch: string[] = [];
  const unchanged: string[] = [];

  // Regex anchors on the UUID line to correctly identify the title that follows.
  //
  // We match:
  //   '00000000-...',\n   (user_id — the anchor)
  //   'title',\n          (title line)
  //   ...stuff...         (description, images, tags — lazy)
  //   <number>,\n         (preparation_secs)
  //   <number>,\n         (duration_secs)
  //   <number>\n           (repetitions)
  //   whitespace + )
  const exerciseBlockRe =
    /('00000000-0000-0000-0000-000000000000',\s*\n\s*'([^']*(?:''[^']*)*)',\s*\n([\s\S]*?))(\s+(\d+),\s*\n\s+(\d+),\s*\n\s+(\d+)\s*\n\s*\))/g;

  const seenTitles = new Set<string>();

  seedSql = seedSql.replace(exerciseBlockRe, (full, prefix, title, _middle, timingBlock, prep, dur, reps) => {
    // Unescape SQL single-quote escaping ('' → ')
    const cleanTitle = title.replace(/''/g, "'");
    seenTitles.add(cleanTitle);

    const prodValues = prodMap.get(cleanTitle);
    if (!prodValues) {
      unchanged.push(cleanTitle);
      return full;
    }

    const oldPrep = parseInt(prep);
    const oldDur = parseInt(dur);
    const oldReps = parseInt(reps);

    if (
      oldPrep === prodValues.preparation_secs &&
      oldDur === prodValues.duration_secs &&
      oldReps === prodValues.repetitions
    ) {
      unchanged.push(cleanTitle);
      return full;
    }

    // Replace the timing block, preserving surrounding whitespace
    const newTimingBlock = timingBlock
      .replace(/\d+,\s*\n/, `${prodValues.preparation_secs},\n`)
      .replace(/\d+,\s*\n/, `${prodValues.duration_secs},\n`)
      .replace(/\d+\s*\n/, `${prodValues.repetitions}\n`);

    updated.push(
      `  ${cleanTitle}: (${oldPrep},${oldDur},${oldReps}) → (${prodValues.preparation_secs},${prodValues.duration_secs},${prodValues.repetitions})`
    );

    return prefix + newTimingBlock;
  });

  // Check for prod exercises that didn't match any seed title
  for (const title of prodMap.keys()) {
    if (!seenTitles.has(title)) {
      noMatch.push(title);
    }
  }

  writeFileSync(seedPath, seedSql, "utf-8");

  console.log(`✓ Updated ${updated.length} exercises:`);
  for (const msg of updated) console.log(msg);

  if (unchanged.length > 0) {
    console.log(`\n— ${unchanged.length} seed exercises unchanged (no match in prod or same values)`);
  }

  if (noMatch.length > 0) {
    console.log(`\n⚠ ${noMatch.length} prod exercises not found in seed (skipped):`);
    for (const t of noMatch) console.log(`  ${t}`);
  }

  await sql.end();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
