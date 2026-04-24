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
}: {
  exercise: Exercise;
  selectable?: boolean;
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
