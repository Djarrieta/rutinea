#!/usr/bin/env bun
/**
 * Step 1: Extract frames from YouTube videos based on input JSON.
 *
 * Reads scripts/importFromYouTube/.temp/01-youtube-links.json and extracts frames
 * to scripts/importFromYouTube/.temp/01-extracted-frames/, then generates
 * scripts/importFromYouTube/.temp/02-proccessed-frames.json with file paths.
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

const INPUT_JSON = "scripts/importFromYouTube/.temp/01-youtube-links.json";
const OUTPUT_JSON = "scripts/importFromYouTube/.temp/02-proccessed-frames.json";
const FRAMES_DIR = "scripts/importFromYouTube/.temp/01-extracted-frames";

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

async function downloadVideo(url: string, outputPath: string): Promise<void> {
	console.log(`⬇  Downloading video: ${url} → ${outputPath}`);
	await $`yt-dlp -f "best[height<=480]" -o ${outputPath} --no-playlist ${url}`.quiet();
}

async function extractFrame(
	videoPath: string,
	timestamp: string,
	outputPath: string,
): Promise<void> {
	// Ensure output directory exists
	const dir = dirname(outputPath);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

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

		console.log(
			`🎬 Extracting frame at ${ss} from ${videoPath} → ${outputPath}`,
		);
		await $`ffmpeg -ss ${ss} -i ${videoPath} -frames:v 1 -q:v 2 ${outputPath} -y`.quiet();

		console.log(`✅ Saved: ${outputPath}`);
	} catch (error: unknown) {
		console.error("❌ Error extracting frame:", error);
		throw error;
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

	// Collect unique YouTube URLs
	const uniqueUrls = new Set<string>();
	for (const set of data.sets) {
		for (const exercise of set.exercises) {
			for (const img of exercise.images) {
				if (img.youtube) {
					uniqueUrls.add(img.youtube);
				}
			}
		}
	}

	console.log(`📋 Found ${uniqueUrls.size} unique videos to download.`);

	// Download all unique videos temporarily
	const TEMP_DIR = "scripts/importFromYouTube/.temp";
	if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

	const urlToVideoPath = new Map<string, string>();
	for (const url of uniqueUrls) {
		const videoPath = join(
			TEMP_DIR,
			`_dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`,
		);
		try {
			await downloadVideo(url, videoPath);
			urlToVideoPath.set(url, videoPath);
		} catch (error: unknown) {
			console.error(`❌ Failed to download ${url}:`, error);
			// Continue with others
		}
	}

	console.log(`✅ Downloaded ${urlToVideoPath.size} videos.`);

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

	// 1. Collect unique (youtube, timestamp) combinations
	const uniqueFrameKeys = new Set<string>();
	const frameKeyToFilePath = new Map<string, string>();

	for (const set of data.sets) {
		for (const exercise of set.exercises) {
			for (const img of exercise.images) {
				if (img.youtube && img.timestamp) {
					const key = `${img.youtube}|${img.timestamp}`;
					uniqueFrameKeys.add(key);
				}
			}
		}
	}

	console.log(`📦 Found ${uniqueFrameKeys.size} unique frames to extract.`);

	// 2. Extract each unique frame once
	let frameIndex = 0;
	for (const key of uniqueFrameKeys) {
		const [youtube, timestamp] = key.split("|");
		const videoPath = urlToVideoPath.get(youtube);
		if (!videoPath) {
			console.warn(`⚠  Skipping frame: video not downloaded for ${youtube}`);
			continue;
		}

		// Generate filename based on frame index (ensures unique names)
		const filename = `frame-${String(frameIndex).padStart(4, "0")}.jpg`;
		const filePath = join(FRAMES_DIR, filename);
		frameIndex++;

		try {
			await extractFrame(videoPath, timestamp, filePath);
			frameKeyToFilePath.set(key, filePath);
		} catch (error: unknown) {
			console.error(
				`❌ Failed to extract frame at ${timestamp} from ${youtube}:`,
				error,
			);
			// Continue with others
		}
	}

	// 3. Now assign frames to images (multiple images can reference the same frame)
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

				const key = `${img.youtube}|${img.timestamp}`;
				const filePath = frameKeyToFilePath.get(key);
				if (filePath) {
					img.file = filePath;
				} else {
					console.warn(
						`⚠  Skipping image ${i} in ${exercise.title}: frame extraction failed`,
					);
				}
			}
		}
	}

	// Clean up temp videos
	console.log(`🗑  Cleaning up temporary videos...`);
	for (const videoPath of urlToVideoPath.values()) {
		if (existsSync(videoPath)) {
			rmSync(videoPath);
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
