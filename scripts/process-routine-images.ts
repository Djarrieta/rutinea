#!/usr/bin/env bun
/**
 * Process a routine JSON: download YouTube videos, extract frames,
 * upload to Supabase storage, and output the JSON with real image URLs.
 *
 * Input JSON format — images use `youtube` + `timestamp` instead of `url`:
 *
 *   {
 *     "routine": { "name": "...", ... },
 *     "sets": [{
 *       "exercises": [{
 *         "title": "Crunch",
 *         "images": [
 *           { "youtube": "https://youtube.com/watch?v=abc", "timestamp": "0:05", "description": "down" },
 *           { "youtube": "https://youtube.com/watch?v=abc", "timestamp": "0:06", "description": "up" }
 *         ],
 *         ...
 *       }]
 *     }]
 *   }
 *
 * Usage:
 *   bun scripts/process-routine-images.ts <input.json> [output.json]
 *
 * If output is omitted, the input file is overwritten in-place.
 *
 * Requires: yt-dlp, ffmpeg
 */

import { $ } from "bun";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

// ── CLI args ────────────────────────────────────────────────────────────────

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error(
    "Usage: bun scripts/process-routine-images.ts <input.json> [output.json]"
  );
  process.exit(1);
}

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "exercise-images";
const WORK_DIR = `supabase/.temp/process-${Date.now()}`;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env");
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

/** Download a YouTube video once. Returns local path. */
const videoCache = new Map<string, string>();

async function ensureVideo(url: string): Promise<string> {
  if (videoCache.has(url)) return videoCache.get(url)!;

  const id = url.match(/[?&]v=([^&]+)/)?.[1] ?? url.split("/").pop() ?? "video";
  const localPath = `${WORK_DIR}/_dl_${id}.mp4`;

  if (!existsSync(localPath)) {
    console.log(`⬇  Downloading ${url} ...`);
    await $`yt-dlp -f "best[height<=480]" -o ${localPath} --no-playlist ${url}`.quiet();
  } else {
    console.log(`♻  Reusing cached video for ${id}`);
  }

  videoCache.set(url, localPath);
  return localPath;
}

async function extractFrame(
  videoPath: string,
  timestamp: string,
  outPath: string
): Promise<void> {
  const ss = normalizeTimestamp(timestamp);
  await $`ffmpeg -ss ${ss} -i ${videoPath} -frames:v 1 -q:v 2 ${outPath} -y`.quiet();
}

async function uploadToSupabase(
  localPath: string,
  remoteName: string
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
    }
  );

  if (!res.ok) {
    const body = await res.text();
    // If duplicate, try upsert
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
        }
      );
      if (!res2.ok) throw new Error(`Upload failed (upsert): ${await res2.text()}`);
    } else {
      throw new Error(`Upload failed: ${body}`);
    }
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${remoteName}`;
}

// ── Types ───────────────────────────────────────────────────────────────────

interface InputImage {
  youtube: string;
  timestamp: string;
  description: string;
}

interface OutputImage {
  url: string;
  description: string;
}

interface Exercise {
  title: string;
  images: (InputImage | OutputImage)[];
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

mkdirSync(WORK_DIR, { recursive: true });

const data: RoutineJson = JSON.parse(readFileSync(inputPath, "utf-8"));

const routineSlug = slugify(
  (data.routine.name as string) ?? "routine"
);

let imgIndex = 0;

for (const set of data.sets) {
  for (const exercise of set.exercises) {
    const exSlug = slugify(exercise.title);
    const newImages: OutputImage[] = [];

    for (const img of exercise.images) {
      // Skip already-processed images (have url instead of youtube)
      if ("url" in img && !("youtube" in img)) {
        newImages.push(img as OutputImage);
        continue;
      }

      const input = img as InputImage;
      imgIndex++;

      const localFile = `${WORK_DIR}/${routineSlug}-${exSlug}-${imgIndex}.jpg`;
      const remoteName = `${routineSlug}-${exSlug}-${imgIndex}.jpg`;

      // Download video (cached per URL)
      const videoPath = await ensureVideo(input.youtube);

      // Extract frame
      console.log(`🎬 [${exercise.title}] Extracting ${input.timestamp} → ${localFile}`);
      await extractFrame(videoPath, input.timestamp, localFile);

      // Upload
      console.log(`☁  Uploading ${remoteName}`);
      const publicUrl = await uploadToSupabase(localFile, remoteName);

      newImages.push({ url: publicUrl, description: input.description });
    }

    exercise.images = newImages;
  }
}

// ── Cleanup work directory ───────────────────────────────────────────────────

await $`rm -rf ${WORK_DIR}`.quiet();

// ── Write output ────────────────────────────────────────────────────────────

const dest = outputPath ?? inputPath;
writeFileSync(dest, JSON.stringify(data, null, 2) + "\n");
console.log(`\n✅ Done! Written to ${dest}`);
