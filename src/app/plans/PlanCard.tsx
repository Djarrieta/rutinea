"use client";

import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS, getTodayDayIndex } from "@/types";
import EntityCard from "@/app/components/EntityCard";
import { properCase } from "@/lib/format";
import { DaysIndicator } from "@/app/components/StatusIndicators";

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
      isApproved={plan.is_approved}
      meta={
        <div className="flex items-center gap-3">
          <DaysIndicator count={dayCount} />
          {todayRoutine ? (
            <span className="text-primary-400 font-bold truncate flex items-center gap-1.5 h-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase">
                Hoy: {properCase(todayRoutine.routine.name)}
              </span>
            </span>
          ) : (
            <span className="truncate opacity-60 italic text-[10px] lowercase first-letter:uppercase h-5 flex items-center">
              {dayNames}
            </span>
          )}
        </div>
      }
    />
  );
}
