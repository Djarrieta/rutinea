"use client";

import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS, getTodayDayIndex } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import { properCase } from "@/lib/format";

export default function PlanCard({
  plan,
  dayCount,
}: {
  plan: PlanWithRoutines;
  dayCount: number;
}) {
  const today = getTodayDayIndex();
  const sortedDays = [...plan.plan_routines].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  const todayRoutine = sortedDays.find((pr) => pr.day_of_week === today);

  const dayNames = sortedDays
    .map((pr) => {
      const label = DAY_LABELS[pr.day_of_week];
      return pr.day_of_week === today ? `▶ ${label}` : label;
    })
    .join(", ");

  const thumbnail = plan.plan_routines
    .flatMap((pr) => pr.routine.routine_sets)
    .flatMap((rs) => rs.set.set_exercises)
    .find((se) => se.exercise.images.length > 0)?.exercise.images[0]?.url;

  return (
    <EntityCard
      href={`/plans/${plan.id}`}
      title={plan.name}
      description={plan.description}
      thumbnail={thumbnail}
      creatorName={plan.profile?.display_name}
      creatorAvatar={plan.profile?.avatar_url}
      cloneCount={plan.clone_count}
      meta={
        <>
          <span>
            {dayCount} día{dayCount !== 1 ? "s" : ""}
          </span>
          {todayRoutine ? (
            <span className="text-primary-400 font-medium truncate">
              Hoy: {properCase(todayRoutine.routine.name)}
            </span>
          ) : (
            <span className="truncate">{dayNames}</span>
          )}
        </>
      }
    />
  );
}
