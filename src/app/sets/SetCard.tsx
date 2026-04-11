"use client";

import { useState } from "react";
import type { SetWithExercises } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import SetPlayerModal from "./SetPlayerModal";

export default function SetCard({
  set,
  exerciseCount,
}: {
  set: SetWithExercises;
  exerciseCount: number;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <EntityCard
        href={`/sets/${set.id}`}
        title={set.name}
        description={set.description}
        meta={
          <span>
            {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
          </span>
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
