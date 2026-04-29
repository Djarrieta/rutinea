#!/usr/bin/env bun

/**
 * Step 3: Create routine, sets and exercises from scripts/importFromYouTube/.temp/03-uploaded-frames.json
 *
 * Usage:
 *   bun scripts/importFromYouTube/03-create-routine.ts [input.json] [--user-id=<user_id>]
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_IMPORT_USER_ID or IMPORT_USER_ID (or pass --user-id)
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

const args = process.argv.slice(2);
const flags = args.filter((arg) => arg.startsWith("--"));
const paths = args.filter((arg) => !arg.startsWith("--"));
const [inputPathArg] = paths;
const DEFAULT_INPUT = "scripts/importFromYouTube/.temp/03-uploaded-frames.json";
const INPUT_PATH = inputPathArg ?? DEFAULT_INPUT;

function getFlag(name: string): string | undefined {
	const flag = flags.find((arg) => arg.startsWith(`${name}=`));
	return flag?.split("=")[1];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID =
	process.env.SUPABASE_IMPORT_USER_ID ??
	process.env.IMPORT_USER_ID ??
	getFlag("--user-id") ??
	"00000000-0000-0000-0000-000000000000";

if (!existsSync(INPUT_PATH)) {
	console.error(`❌ Input file not found: ${INPUT_PATH}`);
	process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error(
		"❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
	);
	process.exit(1);
}

if (!USER_ID) {
	console.error(
		"❌ Missing user id. Set SUPABASE_IMPORT_USER_ID, IMPORT_USER_ID, or pass --user-id=<id>",
	);
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface UploadedImage {
	url: string;
	description?: string;
}

interface BundleExercise {
	id?: string;
	title: string;
	description?: string;
	images?: UploadedImage[];
	tags?: string[];
	preparation_secs: number;
	duration_secs: number;
	repetitions: number;
}

interface BundleSet {
	name: string;
	description?: string;
	preparation_secs?: number;
	rounds: number;
	exercises: BundleExercise[];
}

interface RoutineBundle {
	routine: {
		name: string;
		description?: string;
		rest_secs: number;
	};
	sets: BundleSet[];
}

function validateBundle(data: unknown): RoutineBundle {
	if (!data || typeof data !== "object") {
		throw new Error("Invalid JSON: expected object");
	}

	const bundle = data as RoutineBundle;
	if (!bundle.routine || typeof bundle.routine.name !== "string") {
		throw new Error("Invalid bundle: routine.name is required");
	}
	if (!Array.isArray(bundle.sets) || bundle.sets.length === 0) {
		throw new Error("Invalid bundle: sets array is required");
	}
	return bundle;
}

async function createExercise(ex: BundleExercise): Promise<string> {
	if (ex.id) {
		const { data: existing } = await supabase
			.from("exercises")
			.select("id")
			.eq("id", ex.id)
			.single();

		if (existing?.id) {
			return existing.id;
		}
	}

	const { data, error } = await supabase
		.from("exercises")
		.insert({
			user_id: USER_ID,
			title: ex.title.toLowerCase(),
			description: ex.description?.toLowerCase() ?? null,
			images: ex.images ?? [],
			tags: ex.tags ?? [],
			preparation_secs: ex.preparation_secs,
			duration_secs: ex.duration_secs,
			repetitions: ex.repetitions,
			is_approved: true,
		})
		.select("id")
		.single();

	if (error) {
		throw new Error(`Failed to create exercise ${ex.title}: ${error.message}`);
	}

	if (!data?.id) {
		throw new Error(`Failed to create exercise ${ex.title}: no id returned`);
	}

	return data.id;
}

async function createSet(
	name: string,
	description: string | null,
	preparationSecs: number,
): Promise<string> {
	const { data, error } = await supabase
		.from("sets")
		.insert({
			name: name.toLowerCase(),
			description,
			preparation_secs: preparationSecs,
			user_id: USER_ID,
			is_approved: true,
		})
		.select("id")
		.single();

	if (error) {
		throw new Error(`Failed to create set ${name}: ${error.message}`);
	}
	if (!data?.id) {
		throw new Error(`Failed to create set ${name}: no id returned`);
	}
	return data.id;
}

async function linkExercisesToSet(setId: string, exerciseIds: string[]) {
	const rows = exerciseIds.map((exercise_id, position) => ({
		set_id: setId,
		exercise_id,
		position,
	}));

	const { error } = await supabase.from("set_exercises").insert(rows);
	if (error) {
		throw new Error(
			`Failed linking exercises to set ${setId}: ${error.message}`,
		);
	}
}

async function createRoutine(
	name: string,
	description: string | null,
	rest_secs: number,
) {
	const { data, error } = await supabase
		.from("routines")
		.insert({
			name: name.toLowerCase(),
			description,
			rest_secs,
			user_id: USER_ID,
			is_approved: true,
		})
		.select("id")
		.single();

	if (error) {
		throw new Error(`Failed to create routine ${name}: ${error.message}`);
	}

	if (!data?.id) {
		throw new Error(`Failed to create routine ${name}: no id returned`);
	}

	return data.id;
}

async function linkSetsToRoutine(
	routineId: string,
	setEntries: { id: string; rounds: number }[],
) {
	const rows = setEntries.map((entry, position) => ({
		routine_id: routineId,
		set_id: entry.id,
		position,
		rounds: entry.rounds,
	}));

	const { error } = await supabase.from("routine_sets").insert(rows);
	if (error) {
		throw new Error(
			`Failed linking sets to routine ${routineId}: ${error.message}`,
		);
	}
}

async function main() {
	const raw = readFileSync(INPUT_PATH, "utf-8");
	const data = JSON.parse(raw);
	const bundle = validateBundle(data);

	console.log(`📦 Importing routine: ${bundle.routine.name}`);

	const exerciseIdMap = new Map<string, string>();
	for (let si = 0; si < bundle.sets.length; si++) {
		for (let ei = 0; ei < bundle.sets[si].exercises.length; ei++) {
			const ex = bundle.sets[si].exercises[ei];
			const key = `${si}-${ei}`;
			const exerciseId = await createExercise(ex);
			exerciseIdMap.set(key, exerciseId);
			console.log(
				`  ✅ Exercise created/resolved: ${ex.title} → ${exerciseId}`,
			);
		}
	}

	const setEntries: { id: string; rounds: number }[] = [];
	for (let si = 0; si < bundle.sets.length; si++) {
		const set = bundle.sets[si];
		const setId = await createSet(
			set.name,
			set.description?.toLowerCase() ?? null,
			set.preparation_secs ?? 0,
		);
		const exerciseIds = set.exercises.map(
			(_, ei) => exerciseIdMap.get(`${si}-${ei}`)!,
		);
		await linkExercisesToSet(setId, exerciseIds);
		setEntries.push({ id: setId, rounds: set.rounds });
		console.log(`  ✅ Set created: ${set.name} → ${setId}`);
	}

	const routineId = await createRoutine(
		bundle.routine.name,
		bundle.routine.description?.toLowerCase() ?? null,
		bundle.routine.rest_secs,
	);

	await linkSetsToRoutine(routineId, setEntries);

	console.log(`\n🎉 Routine created: ${bundle.routine.name} → ${routineId}`);
}

main().catch((error) => {
	console.error("❌ Script failed:", error);
	process.exit(1);
});
