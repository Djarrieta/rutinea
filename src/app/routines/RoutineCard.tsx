"use client";

import { useState, useEffect } from "react";
import type { RoutineWithSets } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import RoutinePlayerModal from "./RoutinePlayerModal";
import { isRoutineSavedOffline } from "@/lib/offline-store";

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
        meta={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3 opacity-50"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11Zm3.5 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
              </svg>
              {setCount}s
            </span>
            <span className="w-1 h-1 rounded-full bg-white/25" />
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3 opacity-50"
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5h-2.25V3.75Z"
                  clipRule="evenodd"
                />
              </svg>
              {totalSecs > 0
                ? formatTime(totalSecs)
                : `${routine.rest_secs}s rest`}
            </span>
            {isOffline && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/25" />
                <span className="flex items-center gap-1 text-primary-400" title="Disponible offline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </span>
              </>
            )}
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
