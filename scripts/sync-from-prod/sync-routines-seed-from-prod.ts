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
  const seedPath = join(root, "supabase/seed/03_routines.sql");
  let seedSql = readFileSync(seedPath, "utf-8");

  console.log(`→ Fetching routines for user ${PROD_USER_ID} from prod...`);
  const prodRoutines = await sql`
    SELECT name, description, rest_secs FROM public.routines WHERE user_id = ${PROD_USER_ID}
  `;
  const prodLinks = await sql`
    SELECT r.name as routine_name, s.name as set_name, rs.position, rs.rounds
    FROM public.routines r
    JOIN public.routine_sets rs ON r.id = rs.routine_id
    JOIN public.sets s ON rs.set_id = s.id
    WHERE r.user_id = ${PROD_USER_ID}
    ORDER BY r.name, rs.position
  `;

  console.log(`  Found ${prodRoutines.length} routines in prod: ${prodRoutines.map(r => r.name).join(", ")}\n`);

  const routineMap = new Map<string, { description: string; rest_secs: number; sets: { set_name: string; rounds: number }[] }>();
  for (const r of prodRoutines) {
    const name = r.name.replace(/ \[clon\]$/i, "");
    routineMap.set(name, { description: r.description, rest_secs: r.rest_secs, sets: [] });
  }

  for (const link of prodLinks) {
    const rName = link.routine_name.replace(/ \[clon\]$/i, "");
    const sName = link.set_name.replace(/ \[clon\]$/i, "");
    if (routineMap.has(rName)) {
      routineMap.get(rName)!.sets.push({ set_name: sName, rounds: link.rounds });
    }
  }

  const existingRoutineNames = new Set<string>();
  const routineEntryRe = /(\(\s*'[^']*(?:''[^']*)*',\s*'([^']*(?:''[^']*)*)',\s*'[^']*(?:''[^']*)*',\s*)(\d+)(\s*\))/g;

  // 1. Update existing routines and track what we have
  seedSql = seedSql.replace(routineEntryRe, (full, prefix, nameEscaped, oldRest, suffix) => {
    const name = nameEscaped.replace(/''/g, "'");
    existingRoutineNames.add(name);
    const prodData = routineMap.get(name);
    if (prodData && prodData.rest_secs !== parseInt(oldRest)) {
      console.log(`  Updating rest_secs for ${name}: ${oldRest} → ${prodData.rest_secs}`);
      return prefix + prodData.rest_secs + suffix;
    }
    return full;
  });

  const newRoutines = Array.from(routineMap.keys()).filter(name => !existingRoutineNames.has(name));

  // 2. Add NEW routines to the values list
  if (newRoutines.length > 0) {
    console.log(`→ Adding ${newRoutines.length} new routines to seed: ${newRoutines.join(", ")}`);
    
    // Find the end of the values block for public.routines
    // It looks like:
    // ...
    //         12
    //     );
    const routineValuesEndRe = /(insert into\s+public\.routines[\s\S]*?values[\s\S]*?)\s*\);/i;
    seedSql = seedSql.replace(routineValuesEndRe, (full, currentValues) => {
      const addedValues = newRoutines.map(name => {
        const r = routineMap.get(name)!;
        return `    (
        '00000000-0000-0000-0000-000000000000',
        '${name.replace(/'/g, "''")}',
        '${(r.description || "").replace(/'/g, "''")}',
        ${r.rest_secs}
    )`;
      }).join(",\n");
      
      return `${currentValues},\n${addedValues}\n    );`;
    });
  }

  // 3. Update links (routine_sets)
  for (const [rName, data] of routineMap.entries()) {
    const rNameEsc = rName.replace(/'/g, "''");
    const blockPattern = new RegExp(
      `insert into\\s+public\\.routine_sets\\s*\\([\\s\\S]*?\\)\\s*select[\\s\\S]*?where\\s+r\\.name\\s+=\\s+'${rNameEsc}'\\s+and\\s+s\\.name\\s+=\\s+'[^']*(?:''[^']*)*';`,
      "g"
    );

    const matches = Array.from(seedSql.matchAll(blockPattern));
    
    const newBlocks = data.sets.map((s, idx) => {
      const sNameEsc = s.set_name.replace(/'/g, "''");
      return `insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, ${idx}, ${s.rounds}
from public.routines r, public.sets s
where
    r.name = '${rNameEsc}'
    and s.name = '${sNameEsc}';`;
    }).join("\n\n");

    if (matches.length > 0) {
      // Replace existing
      const firstMatch = matches[0];
      const lastMatch = matches[matches.length - 1];
      const startIdx = firstMatch.index!;
      const endIdx = lastMatch.index! + lastMatch[0].length;
      seedSql = seedSql.substring(0, startIdx) + newBlocks + seedSql.substring(endIdx);
    } else if (newRoutines.includes(rName)) {
      // Append new routine's sets at the end
      seedSql += `\n\n-- ${rName}\n${newBlocks}`;
    }
  }

  writeFileSync(seedPath, seedSql, "utf-8");
  await sql.end();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
