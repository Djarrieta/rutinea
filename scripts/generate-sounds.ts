// Generate simple beep WAV files for rep sounds
import { writeFileSync } from "fs";
import { join, dirname } from "path";

const root = join(dirname(new URL(import.meta.url).pathname), "..");

function generateWav(
  frequency: number,
  durationMs: number,
  volume: number = 0.5,
): Buffer {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const dataSize = numSamples * 2; // 16-bit mono
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate sine wave with fade-out
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const fadeOut = 1 - i / numSamples;
    const sample = Math.sin(2 * Math.PI * frequency * t) * volume * fadeOut;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Normal rep: short medium-pitch beep (880 Hz, 150ms)
const repSound = generateWav(880, 150, 0.4);
writeFileSync(join(root, "public/sounds/rep.wav"), repSound);
console.log("✓ rep.wav");

// Last rep: higher pitch, longer, two-tone (1200 Hz, 300ms)
const lastRepSound = generateWav(1200, 300, 0.5);
writeFileSync(join(root, "public/sounds/last-rep.wav"), lastRepSound);
console.log("✓ last-rep.wav");

// Rest tick: clock-like tick sound
// Use a short burst of white-noise-like click + high freq for a mechanical feel
function generateTick(durationMs: number, volume: number): Buffer {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const dataSize = numSamples * 2;
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 80); // very fast decay — sharp click
    // Mix of two freqs for a woody/mechanical tick
    const sample =
      (Math.sin(2 * Math.PI * 3500 * t) * 0.6 +
        Math.sin(2 * Math.PI * 1800 * t) * 0.4) *
      volume *
      decay;
    const intSample = Math.max(
      -32768,
      Math.min(32767, Math.floor(sample * 32767)),
    );
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const tickSound = generateTick(60, 0.35);
writeFileSync(join(root, "public/sounds/tick.wav"), tickSound);
console.log("✓ tick.wav");

console.log("Done! Sound files generated in public/sounds/");
