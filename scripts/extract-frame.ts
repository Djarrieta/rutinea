#!/usr/bin/env bun
/**
 * Extract a frame from a YouTube video at a specific timestamp.
 *
 * Usage:
 *   bun scripts/extract-frame.ts <youtube-url> <timestamp> [output-path]
 *
 * Examples:
 *   bun scripts/extract-frame.ts https://www.youtube.com/watch?v=W-9L0J_9qag 00:05 supabase/.temp/crunch.jpg
 *   bun scripts/extract-frame.ts "https://youtu.be/W-9L0J_9qag" 1:30 supabase/.temp/exercise.jpg
 *
 * Requires: yt-dlp, ffmpeg
 */

import { $ } from "bun";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const [url, timestamp, outputPath = `supabase/.temp/frame-${Date.now()}.jpg`] =
  process.argv.slice(2);

if (!url || !timestamp) {
  console.error(
    "Usage: bun scripts/extract-frame.ts <youtube-url> <timestamp> [output-path]"
  );
  console.error(
    '  e.g. bun scripts/extract-frame.ts "https://youtube.com/watch?v=abc" 00:05 supabase/.temp/out.jpg'
  );
  process.exit(1);
}

// Ensure output directory exists
const dir = dirname(outputPath);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const tmpVideo = `supabase/.temp/_dl_${Date.now()}.mp4`;
if (!existsSync("supabase/.temp")) mkdirSync("supabase/.temp", { recursive: true });

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

  console.log(`⬇  Downloading video...`);
  await $`yt-dlp -f "best[height<=480]" -o ${tmpVideo} --no-playlist ${url}`.quiet();

  console.log(`🎬 Extracting frame at ${ss} → ${outputPath}`);
  await $`ffmpeg -ss ${ss} -i ${tmpVideo} -frames:v 1 -q:v 2 ${outputPath} -y`.quiet();

  console.log(`✅ Saved: ${outputPath}`);
} catch (e: unknown) {
  console.error("❌ Error:",  e);
  process.exit(1);
} finally {
  // Clean up temp video
  if (existsSync(tmpVideo)) {
    await $`rm ${tmpVideo}`.quiet();
  }
}
