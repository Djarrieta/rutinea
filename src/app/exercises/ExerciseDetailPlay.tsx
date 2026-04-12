"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import PlayButton from "@/app/components/PlayButton";
import ExercisePlayerModal from "./ExercisePlayerModal";

export default function ExerciseDetailPlay({
  exercise,
}: {
  exercise: Exercise;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (exercise.images.length === 0) return null;

  return (
    <>
      <PlayButton onClick={() => setShowPlayer(true)} />
      {showPlayer && (
        <ExercisePlayerModal
          exercise={exercise}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
