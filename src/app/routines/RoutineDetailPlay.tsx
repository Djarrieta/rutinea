"use client";

import { useState } from "react";
import type { RoutineWithSets } from "@/types";
import PlayButton from "@/app/components/PlayButton";
import RoutinePlayerModal from "./RoutinePlayerModal";

export default function RoutineDetailPlay({
  routine,
}: {
  routine: RoutineWithSets;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (routine.routine_sets.length === 0) return null;

  return (
    <>
      <PlayButton onClick={() => setShowPlayer(true)} />
      {showPlayer && (
        <RoutinePlayerModal
          routine={routine}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
