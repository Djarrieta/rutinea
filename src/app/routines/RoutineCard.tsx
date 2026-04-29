"use client";

import { useState, useEffect } from "react";
import type { RoutineWithSets } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import RoutinePlayerModal from "./RoutinePlayerModal";
import { isRoutineSavedOffline } from "@/lib/offline-store";
import { SetsIndicator, OfflineIndicator, DurationIndicator } from "@/app/components/StatusIndicators";

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
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    isRoutineSavedOffline(routine.id).then((saved) => {
      setIsOffline(saved);
    });
  }, [routine.id]);

  const sortedSets = routine.routine_sets;
  let totalSecs = 0;
  let totalExpandedSets = 0;
  sortedSets.forEach((rs) => {
    const setDuration = (rs.set.preparation_secs ?? 0) + rs.set.set_exercises.reduce(
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

  const thumbnail = routine.routine_sets
    .flatMap((rs) => rs.set.set_exercises)
    .find((se) => se.exercise.images.length > 0)?.exercise.images[0]?.url;

  return (
    <>
      <EntityCard
        href={`/routines/${routine.id}`}
        title={routine.name}
        description={routine.description}
        thumbnail={thumbnail}
        creatorName={routine.profile?.display_name}
        creatorAvatar={routine.profile?.avatar_url}
        cloneCount={routine.clone_count}
        isApproved={routine.is_approved}
        meta={
          <div className="flex items-center gap-3">
            <SetsIndicator count={setCount} />
            <DurationIndicator 
              label={totalSecs > 0 ? formatTime(totalSecs) : `${routine.rest_secs}s rest`} 
            />
            {isOffline && <OfflineIndicator />}
          </div>
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
