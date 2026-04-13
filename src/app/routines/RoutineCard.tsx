"use client";

import { useState } from "react";
import type { RoutineWithSets } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import RoutinePlayerModal from "./RoutinePlayerModal";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function RoutineCard({
  routine,
  setCount,
}: {
  routine: RoutineWithSets;
  setCount: number;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  const sortedSets = routine.routine_sets;
  let totalSecs = 0;
  let totalExpandedSets = 0;
  sortedSets.forEach((rs) => {
    const setDuration = rs.set.set_exercises.reduce(
      (sum, se) => sum + se.exercise.duration_secs * se.exercise.repetitions,
      0,
    );
    totalSecs += setDuration * rs.rounds;
    totalExpandedSets += rs.rounds;
  });
  // Rest between each expanded set (not after the last)
  if (totalExpandedSets > 1) {
    totalSecs += routine.rest_secs * (totalExpandedSets - 1);
  }

  return (
    <>
      <EntityCard
        href={`/routines/${routine.id}`}
        title={routine.name}
        description={routine.description}
        meta={
          <>
            <span>
              {setCount} set{setCount !== 1 ? "s" : ""}
            </span>
            <span>{routine.rest_secs}s descanso</span>
            {totalSecs > 0 && <span>{formatTime(totalSecs)}</span>}
          </>
        }
        action={
          setCount > 0 ? (
            <PlayButton onClick={() => setShowPlayer(true)} />
          ) : undefined
        }
      />

      {showPlayer && (
        <RoutinePlayerModal
          routine={routine}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
