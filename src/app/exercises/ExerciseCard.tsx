"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import ExercisePlayerModal from "./ExercisePlayerModal";
import { useSelection } from "@/app/components/SelectionProvider";

export default function ExerciseCard({
  exercise,
  selectable,
  userId,
}: {
  exercise: Exercise;
  selectable?: boolean;
  userId?: string;
}) {
  const [showPlayer, setShowPlayer] = useState(false);
  const selection = useSelection(exercise.id, exercise.user_id);

  return (
    <>
      <EntityCard
        href={`/exercises/${exercise.id}`}
        title={exercise.title}
        description={exercise.description}
        tags={exercise.tags}
        thumbnail={exercise.images[0]?.url}
        creatorName={exercise.profile?.display_name}
        creatorAvatar={exercise.profile?.avatar_url}
        cloneCount={exercise.clone_count}
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
                <path
                  fillRule="evenodd"
                  d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5h-2.25V3.75Z"
                  clipRule="evenodd"
                />
              </svg>
              {exercise.duration_secs}s
            </span>
            {exercise.repetitions > 1 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3 h-3 opacity-50"
                  >
                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    <path
                      fillRule="evenodd"
                      d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm12.5 0A5.5 5.5 0 1 1 2.5 8 5.5 5.5 0 0 1 13.5 8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {exercise.repetitions} reps
                </span>
              </>
            )}
            {exercise.images.length > 0 && (
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
                      d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM4 4h8v4.428l-2.09-2.09a1.5 1.5 0 0 0-2.12 0L4 10.139V4Zm8 8H4v-.639l4.29-4.29a.5.5 0 0 1 .708 0L12 10.071V12Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {exercise.images.length}
                </span>
              </>
            )}
          </div>
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
