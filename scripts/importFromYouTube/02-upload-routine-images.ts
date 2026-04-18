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
 *           { "youtube": "...", "timestamp": "0:05", "file": "supabase/.temp/frames/.../crunch-1.jpg", "description": "down" }
 *         ]
 *       }]
 *     }]
 *   }
 *
 * Output JSON — `file`/`youtube`/`timestamp` replaced with `url` (Supabase public URL):
 *
 *   "images": [{ "url": "https://....supabase.co/.../crunch-1.jpg", "description": "down" }]
 *
 * Usage:
 *   bun scripts/upload-routine-images.ts <input.json> [output.json]
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
const [inputPath, outputPath] = paths;

if (!inputPath) {
  console.error("Usage: bun scripts/upload-routine-images.ts <input.json> [output.json] [--cleanup]");
  process.exit(1);
}

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "exercise-images";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env");
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function uploadToSupabase(localPath: string, remoteName: string): Promise<string> {
  const fileData = readFileSync(localPath);

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${remoteName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "image/jpeg",
    },
    body: fileData,
  });

  if (!res.ok) {
    if (res.status === 409) {
      const res2 = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${remoteName}`, {
        method: "PUT",
        headers: {
          apikey: SUPABASE_KEY!,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "image/jpeg",
        },
        body: fileData,
      });
      if (!res2.ok) throw new Error(`Upload failed (upsert): ${await res2.text()}`);
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

// ── Main ────────────────────────────────────────────────────────────────────

const data: RoutineJson = JSON.parse(readFileSync(inputPath, "utf-8"));
const framesDirs = new Set<string>();

for (const set of data.sets) {
  for (const exercise of set.exercises) {
    const newImages: ImageEntry[] = [];

    for (const img of exercise.images) {
      // Already has a URL — keep as-is
      if (img.url && !img.file) {
        newImages.push({ url: img.url, description: img.description });
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

      const remoteName = basename(img.file);
      console.log(`☁  [${exercise.title}] Uploading ${remoteName}`);
      const publicUrl = await uploadToSupabase(img.file, remoteName);

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

const dest = outputPath ?? inputPath;
writeFileSync(dest, JSON.stringify(data, null, 2) + "\n");

console.log(`\n✅ Done! Written to ${dest}`);
if (!cleanup) {
  console.log(`💡 Use --cleanup to delete local frames after upload.`);
}
