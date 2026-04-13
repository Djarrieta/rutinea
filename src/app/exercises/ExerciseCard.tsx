"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import ExercisePlayerModal from "./ExercisePlayerModal";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <EntityCard
        href={`/exercises/${exercise.id}`}
        title={exercise.title}
        description={exercise.description}
        tags={exercise.tags}
        meta={
          <>
            <span>{exercise.duration_secs}s/rep</span>
            {exercise.repetitions > 1 && (
              <span>{exercise.repetitions} reps</span>
            )}
            {exercise.images.length > 0 && (
              <span>{exercise.images.length} imagen(es)</span>
            )}
          </>
        }
        action={
          exercise.images.length > 0 ? (
            <PlayButton onClick={() => setShowPlayer(true)} />
          ) : undefined
        }
      />

      {showPlayer && (
        <ExercisePlayerModal
          exercise={exercise}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
