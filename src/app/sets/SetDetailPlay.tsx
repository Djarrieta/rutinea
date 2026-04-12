"use client";

import { useState } from "react";
import type { SetWithExercises } from "@/types";
import PlayButton from "@/app/components/PlayButton";
import SetPlayerModal from "./SetPlayerModal";

export default function SetDetailPlay({ set }: { set: SetWithExercises }) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (set.set_exercises.length === 0) return null;

  return (
    <>
      <PlayButton onClick={() => setShowPlayer(true)} />
      {showPlayer && (
        <SetPlayerModal set={set} onClose={() => setShowPlayer(false)} />
      )}
    </>
  );
}
