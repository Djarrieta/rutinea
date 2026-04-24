"use client";

import { useState } from "react";
import type { SetWithExercises } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import PlayButton from "@/app/components/PlayButton";
import SetPlayerModal from "./SetPlayerModal";
import { useSelection } from "@/app/components/SelectionProvider";
import { ExercisesCountIndicator, DurationIndicator } from "@/app/components/StatusIndicators";

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
}: {
  set: SetWithExercises;
  exerciseCount: number;
  selectable?: boolean;
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
        isApproved={set.is_approved}
        selectable={selectable}
        selected={selection?.selected}
        onSelect={selection?.toggle}
        meta={
          <div className="flex items-center gap-3">
            <ExercisesCountIndicator count={exerciseCount} />
            <DurationIndicator label={formatTime(totalSecs)} />
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
