export const RING_RADIUS = 54;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.ceil(secs % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}
