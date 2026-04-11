"use client";

import { useState } from "react";
import type { RoutineWithSets } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import RoutinePlayerModal from "./RoutinePlayerModal";

export default function RoutineCard({
  routine,
  setCount,
}: {
  routine: RoutineWithSets;
  setCount: number;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

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
