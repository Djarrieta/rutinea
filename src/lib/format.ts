/** Capitalize first letter of each word */
export function properCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Compute total duration in seconds for a routine (exercises + rests) */
export function getRoutineDuration(routine: {
  rest_secs: number;
  routine_sets: {
    rounds: number;
    set: { set_exercises: { exercise: { duration_secs: number; repetitions: number } }[] };
  }[];
}): number {
  const totalExpandedSets = routine.routine_sets.reduce(
    (sum, rs) => sum + rs.rounds,
    0,
  );
  const exerciseTime = routine.routine_sets.reduce(
    (sum, rs) =>
      sum +
      rs.set.set_exercises.reduce((s, se) => s + se.exercise.duration_secs * se.exercise.repetitions, 0) *
        rs.rounds,
    0,
  );
  const restSteps = Math.max(0, totalExpandedSets - 1);
  return exerciseTime + restSteps * routine.rest_secs;
}

/** Format seconds into a human-readable duration string (e.g. "5m 30s", "1h 2m") */
export function formatDuration(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return s > 0 ? `${h}h ${m}m ${s}s` : `${h}h ${m}m`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}
