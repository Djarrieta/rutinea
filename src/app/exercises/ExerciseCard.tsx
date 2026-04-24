"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import ExercisePlayerModal from "./ExercisePlayerModal";
import { useSelection } from "@/app/components/SelectionProvider";
import { RepetitionsIndicator, DurationIndicator } from "@/app/components/StatusIndicators";

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
        isApproved={exercise.is_approved}
        selectable={selectable}
        selected={selection?.selected}
        onSelect={selection?.toggle}
        meta={
          <div className="flex items-center gap-3">
            <DurationIndicator label={`${exercise.duration_secs}s`} />
            <RepetitionsIndicator count={exercise.repetitions} />
            {exercise.images.length > 0 && (
              <>
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
