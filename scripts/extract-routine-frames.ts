#!/usr/bin/env bun
/**
 * Step 1: Extract frames from YouTube videos for review.
 *
 * Input JSON — exercises with youtube URLs and timestamps:
 *
 *   {
 *     "routine": { "name": "Abs 8 Min" },
 *     "sets": [{
 *       "exercises": [{
 *         "title": "Crunch",
 *         "images": [
 *           { "youtube": "https://youtube.com/watch?v=abc", "timestamp": "0:05" },
 *           { "youtube": "https://youtube.com/watch?v=abc", "timestamp": "0:06" }
 *         ]
 *       }]
 *     }]
 *   }
 *
 * Output JSON — same structure but images now have a local `file` path:
 *
 *   "images": [
 *     { "youtube": "...", "timestamp": "0:05", "file": "supabase/.temp/frames/abs-8-min/crunch-1.jpg" }
 *   ]
 *
 * Review the images, adjust timestamps, re-run if needed.
 * Then pass the output to upload-routine-images.ts.
 *
 * Usage:
 *   bun scripts/extract-routine-frames.ts <input.json> [output.json]
 *
 * Requires: yt-dlp, ffmpeg
 */

import { $ } from "bun";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

// ── CLI ─────────────────────────────────────────────────────────────────────

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error("Usage: bun scripts/extract-routine-frames.ts <input.json> [output.json]");
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeTimestamp(ts: string): string {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3)
    return parts.map((p) => String(p).padStart(2, "0")).join(":");
  if (parts.length === 2)
    return `00:${String(parts[0]).padStart(2, "0")}:${String(parts[1]).padStart(2, "0")}`;
  return `00:00:${String(parts[0]).padStart(2, "0")}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const videoCache = new Map<string, string>();

async function ensureVideo(url: string, dlDir: string): Promise<string> {
  if (videoCache.has(url)) return videoCache.get(url)!;

  const id = url.match(/[?&]v=([^&]+)/)?.[1] ?? url.split("/").pop() ?? "video";
  const localPath = `${dlDir}/${id}.mp4`;

  if (!existsSync(localPath)) {
    console.log(`⬇  Downloading ${url} ...`);
    await $`yt-dlp -f "best[height<=480]" -o ${localPath} --no-playlist ${url}`.quiet();
  } else {
    console.log(`♻  Reusing cached video for ${id}`);
  }

  videoCache.set(url, localPath);
  return localPath;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ImageEntry {
  youtube?: string;
  timestamp?: string;
  file?: string;
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

// ── Main ────────────────────────────────────────────────────────────────────

const data: RoutineJson = JSON.parse(readFileSync(inputPath, "utf-8"));

const routineSlug = slugify((data.routine.name as string) ?? "routine");
const framesDir = `supabase/.temp/frames/${routineSlug}`;
const dlDir = `supabase/.temp/frames/_videos`;

// Clean previous frames
if (existsSync(framesDir)) await $`rm -rf ${framesDir}`.quiet();

mkdirSync(framesDir, { recursive: true });
mkdirSync(dlDir, { recursive: true });

let imgIndex = 0;

for (const set of data.sets) {
  for (const exercise of set.exercises) {
    const exSlug = slugify(exercise.title);

    for (const img of exercise.images) {
      if (!img.youtube || !img.timestamp) continue;
      if (img.file && existsSync(img.file)) {
        console.log(`♻  Skipping ${img.file} (already exists)`);
        continue;
      }

      imgIndex++;
      const localFile = `${framesDir}/${exSlug}-${imgIndex}.jpg`;

      const videoPath = await ensureVideo(img.youtube, dlDir);
      const ss = normalizeTimestamp(img.timestamp);

      console.log(`🎬 [${exercise.title}] ${img.timestamp} → ${localFile}`);
      await $`ffmpeg -ss ${ss} -i ${videoPath} -frames:v 1 -q:v 2 ${localFile} -y`.quiet();

      img.file = localFile;
    }
  }
}

// Cleanup downloaded videos
for (const vp of videoCache.values()) {
  if (existsSync(vp)) await $`rm ${vp}`.quiet();
}
if (existsSync(dlDir)) await $`rmdir ${dlDir} 2>/dev/null || true`;

// ── Write output ────────────────────────────────────────────────────────────

const dest = outputPath ?? inputPath;
writeFileSync(dest, JSON.stringify(data, null, 2) + "\n");

console.log(`\n✅ Frames extracted to ${framesDir}/`);
console.log(`📄 JSON written to ${dest}`);
console.log(`\n👉 Review the images, adjust timestamps if needed, re-run.`);
console.log(`👉 Then: bun scripts/upload-routine-images.ts ${dest}`);
