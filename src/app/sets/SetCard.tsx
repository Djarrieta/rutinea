"use client";

import { useState } from "react";
import type { SetWithExercises } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import SetPlayerModal from "./SetPlayerModal";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function SetCard({
  set,
  exerciseCount,
}: {
  set: SetWithExercises;
  exerciseCount: number;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  const totalSecs = set.set_exercises.reduce(
    (sum, se) => sum + se.exercise.duration_secs * se.exercise.repetitions,
    0,
  );

  return (
    <>
      <EntityCard
        href={`/sets/${set.id}`}
        title={set.name}
        description={set.description}
        meta={
          <>
            <span>
              {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
            </span>
            {totalSecs > 0 && <span>{formatTime(totalSecs)}</span>}
          </>
        }
        action={
          exerciseCount > 0 ? (
            <PlayButton onClick={() => setShowPlayer(true)} />
          ) : undefined
        }
      />

      {showPlayer && (
        <SetPlayerModal set={set} onClose={() => setShowPlayer(false)} />
      )}
    </>
  );
}
