#!/usr/bin/env bun
/**
 * Step 1: Extract images from URLs based on input JSON.
 *
 * Reads scripts/importFromYouTube/.temp/01-url-links.json and downloads images
 * to scripts/importFromYouTube/.temp/01-extracted-frames/, then generates
 * scripts/importFromYouTube/.temp/02-proccessed-frames.json with file paths.
 *
 * Usage:
 *   bun scripts/importFromYouTube/01-extract-from-url.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync } from "fs";
import { join, basename, extname } from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const INPUT_JSON = "scripts/importFromYouTube/.temp/01-url-links.json";
const OUTPUT_JSON = "scripts/importFromYouTube/.temp/02-proccessed-frames.json";
const FRAMES_DIR = "scripts/importFromYouTube/.temp/01-extracted-frames";

// ── Types ───────────────────────────────────────────────────────────────────

interface ImageEntry {
	url: string;
	file?: string;
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

async function downloadImage(url: string, outputPath: string): Promise<void> {
	console.log(`⬇  Downloading image: ${url} → ${outputPath}`);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download image from ${url}: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	writeFileSync(outputPath, Buffer.from(arrayBuffer));
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
	if (!existsSync(INPUT_JSON)) {
		console.error(`❌ Input file not found: ${INPUT_JSON}`);
		process.exit(1);
	}

	// Read input JSON
	const data: RoutineJson = JSON.parse(readFileSync(INPUT_JSON, "utf-8"));

	// Collect unique URLs
	const uniqueUrls = new Set<string>();
	for (const set of data.sets) {
		for (const exercise of set.exercises) {
			for (const img of exercise.images) {
				if (img.url) {
					uniqueUrls.add(img.url);
				}
			}
		}
	}

	console.log(`📋 Found ${uniqueUrls.size} unique images to download.`);

	// Create frames directory if it doesn't exist
	if (!existsSync(FRAMES_DIR)) {
		mkdirSync(FRAMES_DIR, { recursive: true });
	} else {
		// Optional: clean up previous frames? 
		// The original script cleans up .jpg files.
		console.log(`🗑  Cleaning up previous frames in ${FRAMES_DIR}`);
		const files = readdirSync(FRAMES_DIR);
		for (const file of files) {
			const filePath = join(FRAMES_DIR, file);
			if (statSync(filePath).isFile()) {
				rmSync(filePath);
			}
		}
	}

	const urlToFilePath = new Map<string, string>();
	let index = 0;

	for (const url of uniqueUrls) {
		// Determine extension from URL or default to .jpg
		let ext = extname(new URL(url).pathname);
		if (!ext) ext = ".jpg";
		
		const filename = `image-${String(index).padStart(4, "0")}${ext}`;
		const filePath = join(FRAMES_DIR, filename);
		
		try {
			await downloadImage(url, filePath);
			urlToFilePath.set(url, filePath);
			index++;
		} catch (error: unknown) {
			console.error(`❌ Failed to download ${url}:`, error);
		}
	}

	console.log(`✅ Downloaded ${urlToFilePath.size} images.`);

	// Assign local file paths to images
	for (const set of data.sets) {
		for (const exercise of set.exercises) {
			for (const img of exercise.images) {
				if (img.url) {
					const filePath = urlToFilePath.get(img.url);
					if (filePath) {
						img.file = filePath;
					}
				}
			}
		}
	}

	// Write output JSON
	writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2) + "\n");
	console.log(`\n✅ Done! Processed images saved to ${OUTPUT_JSON}`);
}

main().catch((e) => {
	console.error("❌ Script failed:", e);
	process.exit(1);
});
