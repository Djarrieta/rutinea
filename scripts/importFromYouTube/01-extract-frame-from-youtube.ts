#!/usr/bin/env bun
/**
 * Step 1: Extract frames from YouTube videos based on input JSON.
 *
 * Reads scripts/importFromYouTube/01-youtube-links.json and extracts frames
 * to scripts/importFromYouTube/01-extracted-frames/, then generates
 * scripts/importFromYouTube/02-proccessed-frames.json with file paths.
 *
 * Usage:
 *   bun scripts/importFromYouTube/01-extract-frame-from-youtube.ts
 *
 * Requires: yt-dlp, ffmpeg
 */

import { $ } from "bun";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
	rmSync,
	readdirSync,
	statSync,
} from "fs";
import { join, dirname } from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const INPUT_JSON = "scripts/importFromYouTube/01-youtube-links.json";
const OUTPUT_JSON = "scripts/importFromYouTube/02-proccessed-frames.json";
const FRAMES_DIR = "scripts/importFromYouTube/01-extracted-frames";

// ── Types ───────────────────────────────────────────────────────────────────

interface ImageEntry {
	youtube: string;
	timestamp: string;
	file: string;
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

// ── Helpers ─────────────────────────────────────────────────────────────────

async function ensureInstalled(commandName: string, installHint: string) {
	try {
		await $`command -v ${commandName}`.quiet();
	} catch {
		console.error(`❌ ${commandName} no está instalado.`);
		console.error(`   Instálalo con: ${installHint}`);
		process.exit(1);
	}
}

async function extractFrame(
	url: string,
	timestamp: string,
	outputPath: string,
): Promise<void> {
	// Ensure output directory exists
	const dir = dirname(outputPath);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

	const TEMP_DIR = "scripts/importFromYouTube/.temp";
	const tmpVideo = join(TEMP_DIR, `_dl_${Date.now()}.mp4`);
	if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

	try {
		// Normalize timestamp to HH:MM:SS
		const parts = timestamp.split(":").map(Number);
		let ss: string;
		if (parts.length === 3) {
			ss = parts.map((p) => String(p).padStart(2, "0")).join(":");
		} else if (parts.length === 2) {
			ss = `00:${String(parts[0]).padStart(2, "0")}:${String(parts[1]).padStart(2, "0")}`;
		} else {
			ss = `00:00:${String(parts[0]).padStart(2, "0")}`;
		}

		console.log(`⬇  Downloading video for ${url}...`);
		await $`yt-dlp -f "best[height<=480]" -o ${tmpVideo} --no-playlist ${url}`.quiet();

		console.log(`🎬 Extracting frame at ${ss} → ${outputPath}`);
		await $`ffmpeg -ss ${ss} -i ${tmpVideo} -frames:v 1 -q:v 2 ${outputPath} -y`.quiet();

		console.log(`✅ Saved: ${outputPath}`);
	} catch (e: unknown) {
		console.error("❌ Error extracting frame:", e);
		throw e;
	} finally {
		// Clean up temp video
		if (existsSync(tmpVideo)) {
			await $`rm ${tmpVideo}`.quiet();
		}
	}
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
	await ensureInstalled("ffmpeg", "brew install ffmpeg");
	await ensureInstalled("yt-dlp", "brew install yt-dlp");

	if (!existsSync(INPUT_JSON)) {
		console.error(`❌ Input file not found: ${INPUT_JSON}`);
		process.exit(1);
	}

	// Read input JSON
	const data: RoutineJson = JSON.parse(readFileSync(INPUT_JSON, "utf-8"));

	// Clean up previous frames
	if (existsSync(FRAMES_DIR)) {
		console.log(`🗑  Cleaning up previous frames in ${FRAMES_DIR}`);
		const files = readdirSync(FRAMES_DIR);
		for (const file of files) {
			if (file.endsWith(".jpg")) {
				const filePath = join(FRAMES_DIR, file);
				if (statSync(filePath).isFile()) {
					rmSync(filePath);
				}
			}
		}
	} else {
		mkdirSync(FRAMES_DIR, { recursive: true });
	}

	// Process each image
	for (const set of data.sets) {
		for (const exercise of set.exercises) {
			for (let i = 0; i < exercise.images.length; i++) {
				const img = exercise.images[i];
				if (!img.youtube || !img.timestamp) {
					console.warn(
						`⚠  Skipping image ${i} in ${exercise.title}: missing youtube or timestamp`,
					);
					continue;
				}

				// Generate filename
				const sanitizedTitle = exercise.title
					.replace(/[^a-zA-Z0-9]/g, "-")
					.toLowerCase();
				const filename = `${sanitizedTitle}-${i + 1}.jpg`;
				const filePath = join(FRAMES_DIR, filename);

				try {
					await extractFrame(img.youtube, img.timestamp, filePath);
					img.file = filePath;
				} catch (e) {
					console.error(
						`❌ Failed to extract frame for ${exercise.title} image ${i + 1}`,
					);
					// Continue with others
				}
			}
		}
	}

	// Write output JSON
	writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2) + "\n");
	console.log(`\n✅ Done! Processed frames saved to ${OUTPUT_JSON}`);
}

main().catch((e) => {
	console.error("❌ Script failed:", e);
	process.exit(1);
});
