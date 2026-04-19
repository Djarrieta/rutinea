#!/usr/bin/env bun
/**
 * Step 2: Upload reviewed local images to Supabase and produce final JSON.
 *
 * Input JSON — output from extract-routine-frames.ts with local `file` paths:
 *
 *   {
 *     "routine": { "name": "Abs 8 Min" },
 *     "sets": [{
 *       "exercises": [{
 *         "title": "Crunch",
 *         "description": "...",
 *         "images": [
 *           { "youtube": "...", "timestamp": "0:05", "file": "scripts/importFromYouTube/.temp/01-extracted-frames/crunch-1.jpg", "description": "down" }
 *         ]
 *       }]
 *     }]
 *   }
 *
 * Output JSON — `file`/`youtube`/`timestamp` replaced with `url` (Supabase public URL):
 *
 *   "images": [{ "url": "https://....supabase.co/.../crunch-1.jpg", "description": "down" }]
 *
 * Additionally writes import-ready JSON to:
 *   scripts/importFromYouTube/03-uploaded-frames.json
 *
 * Usage:
 *   bun scripts/importFromYouTube/02-upload-routine-images.ts [input.json]
 *
 * If no input is provided, the script defaults to:
 *   scripts/importFromYouTube/02-proccessed-frames.json
 *
 * Pass --cleanup to delete local frames folder after upload.
 */

import { $ } from "bun";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname } from "path";

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const cleanup = args.includes("--cleanup");
const paths = args.filter((a) => !a.startsWith("--"));
const [inputPathArg] = paths;
const DEFAULT_INPUT =
	"scripts/importFromYouTube/.temp/02-proccessed-frames.json";
const inputPath = inputPathArg ?? DEFAULT_INPUT;

if (!existsSync(inputPath)) {
	console.error(
		"Usage: bun scripts/importFromYouTube/02-upload-routine-images.ts [input.json] [--cleanup]",
	);
	console.error(`❌ Input file not found: ${inputPath}`);
	process.exit(1);
}

if (!inputPathArg) {
	console.log(`ℹ️  Using default input: ${DEFAULT_INPUT}`);
}

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "exercise-images";
const IMPORT_BUNDLE_OUTPUT =
	"scripts/importFromYouTube/.temp/03-uploaded-frames.json";

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error(
		"❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env",
	);
	process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function uploadToSupabase(
	localPath: string,
	remoteName: string,
): Promise<string> {
	const fileData = readFileSync(localPath);

	const res = await fetch(
		`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${remoteName}`,
		{
			method: "POST",
			headers: {
				apikey: SUPABASE_KEY!,
				Authorization: `Bearer ${SUPABASE_KEY}`,
				"Content-Type": "image/jpeg",
			},
			body: fileData,
		},
	);

	if (!res.ok) {
		if (res.status === 409) {
			const res2 = await fetch(
				`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${remoteName}`,
				{
					method: "PUT",
					headers: {
						apikey: SUPABASE_KEY!,
						Authorization: `Bearer ${SUPABASE_KEY}`,
						"Content-Type": "image/jpeg",
					},
					body: fileData,
				},
			);
			if (!res2.ok)
				throw new Error(`Upload failed (upsert): ${await res2.text()}`);
		} else {
			throw new Error(`Upload failed: ${await res.text()}`);
		}
	}

	return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${remoteName}`;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ImageEntry {
	youtube?: string;
	timestamp?: string;
	file?: string;
	url?: string;
	description?: string;
	[key: string]: unknown;
}

interface Exercise {
	title: string;
	images: ImageEntry[];
	[key: string]: unknown;
}

interface SetBlock {
	exercises: Exercise[];
	[key: string]: unknown;
}

interface RoutineJson {
	routine: Record<string, unknown>;
	sets: SetBlock[];
}

interface BundleExercise {
	id?: string;
	title: string;
	description?: string;
	images?: { url: string; description?: string }[];
	tags?: string[];
	preparation_secs: number;
	duration_secs: number;
	repetitions: number;
}

interface BundleSet {
	name: string;
	description?: string;
	rounds: number;
	exercises: BundleExercise[];
}

interface RoutineBundleJson {
	routine: { name: string; description?: string; rest_secs: number };
	sets: BundleSet[];
}

function buildRoutineBundle(data: RoutineJson): RoutineBundleJson {
	return {
		routine: {
			name: String(data.routine.name ?? "Rutina importada"),
			description:
				typeof data.routine.description === "string"
					? data.routine.description
					: undefined,
			rest_secs:
				typeof data.routine.rest_secs === "number"
					? data.routine.rest_secs
					: 30,
		},
		sets: data.sets.map((set, si) => ({
			name:
				typeof set.name === "string" && set.name ? set.name : `set ${si + 1}`,
			description:
				typeof set.description === "string" ? set.description : undefined,
			rounds:
				typeof set.rounds === "number" && set.rounds >= 1 ? set.rounds : 1,
			exercises: set.exercises.map((ex) => ({
				id: typeof ex.id === "string" ? ex.id : undefined,
				title: ex.title,
				description:
					typeof ex.description === "string" ? ex.description : undefined,
				images: ex.images
					?.filter(
						(img): img is { url: string; description?: string } =>
							typeof img.url === "string",
					)
					.map((img) => ({
						url: img.url,
						description:
							typeof img.description === "string" ? img.description : undefined,
					})),
				tags: Array.isArray(ex.tags)
					? ex.tags.filter((tag) => typeof tag === "string")
					: undefined,
				preparation_secs:
					typeof ex.preparation_secs === "number" ? ex.preparation_secs : 3,
				duration_secs:
					typeof ex.duration_secs === "number" ? ex.duration_secs : 3,
				repetitions: typeof ex.repetitions === "number" ? ex.repetitions : 10,
			})),
		})),
	};
}

// ── Main ────────────────────────────────────────────────────────────────────

const data: RoutineJson = JSON.parse(readFileSync(inputPath, "utf-8"));
const framesDirs = new Set<string>();
const uploadedImages = new Map<string, string>();

for (const set of data.sets) {
	for (const exercise of set.exercises) {
		const newImages: ImageEntry[] = [];

		for (const img of exercise.images) {
			// Already has a URL — keep as-is
			if (img.url && !img.file) {
				newImages.push({ url: img.url, description: img.description });
				continue;
			}

			if (img.file && uploadedImages.has(img.file)) {
				const publicUrl = uploadedImages.get(img.file)!;
				console.log(
					`☁  [${exercise.title}] Reusing uploaded ${basename(img.file)}`,
				);
				newImages.push({ url: publicUrl, description: img.description });
				continue;
			}

			if (!img.file) {
				console.warn(`⚠  [${exercise.title}] Image missing 'file' — skipping`);
				newImages.push(img);
				continue;
			}

			if (!existsSync(img.file)) {
				console.error(`❌ [${exercise.title}] File not found: ${img.file}`);
				process.exit(1);
			}

			const remoteName = `${Date.now()}-${basename(img.file)}`;
			console.log(`☁  [${exercise.title}] Uploading ${remoteName}`);
			const publicUrl = await uploadToSupabase(img.file, remoteName);

			uploadedImages.set(img.file, publicUrl);
			framesDirs.add(dirname(img.file));
			newImages.push({ url: publicUrl, description: img.description });
		}

		exercise.images = newImages;
	}
}

// ── Cleanup ─────────────────────────────────────────────────────────────────

if (cleanup) {
	for (const dir of framesDirs) {
		if (existsSync(dir)) {
			console.log(`🗑  Cleaning up ${dir}`);
			await $`rm -rf ${dir}`.quiet();
		}
	}
}

// ── Write output ────────────────────────────────────────────────────────────

const bundle = buildRoutineBundle(data);
writeFileSync(IMPORT_BUNDLE_OUTPUT, JSON.stringify(bundle, null, 2) + "\n");

console.log(
	`\n✅ Done! Import-ready bundle written to ${IMPORT_BUNDLE_OUTPUT}`,
);
if (!cleanup) {
	console.log(`💡 Use --cleanup to delete local frames after upload.`);
}
