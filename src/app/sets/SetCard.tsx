"use client";

import { useState } from "react";
import type { SetWithExercises } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import SetPlayerModal from "./SetPlayerModal";
import { useSelection } from "@/app/components/SelectionProvider";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function SetCard({
  set,
  exerciseCount,
  selectable,
  userId,
}: {
  set: SetWithExercises;
  exerciseCount: number;
  selectable?: boolean;
  userId?: string;
}) {
  const [showPlayer, setShowPlayer] = useState(false);
  const selection = useSelection(set.id, set.user_id);

  const totalSecs = set.set_exercises.reduce(
    (sum, se) => sum + se.exercise.duration_secs * se.exercise.repetitions,
    0,
  );

  const thumbnail = set.set_exercises.find(
    (se) => se.exercise.images.length > 0,
  )?.exercise.images[0]?.url;

  return (
    <>
      <EntityCard
        href={`/sets/${set.id}`}
        title={set.name}
        description={set.description}
        thumbnail={thumbnail}
        creatorName={set.profile?.display_name}
        creatorAvatar={set.profile?.avatar_url}
        cloneCount={set.clone_count}
        selectable={selectable}
        selected={selection?.selected}
        onSelect={selection?.toggle}
        meta={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3 opacity-50"
              >
                <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5ZM14 5.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5ZM14 8a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5ZM2.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM2.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM2.5 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM3.5 14.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM3.5 4.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
              </svg>
              {exerciseCount}
            </span>
            {totalSecs > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
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
                  {formatTime(totalSecs)}
                </span>
              </>
            )}
          </div>
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
