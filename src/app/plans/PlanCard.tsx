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
      isApproved={plan.is_approved}
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
                d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3h.75A1.75 1.75 0 0 1 14.5 4.75v8.5a1.75 1.75 0 0 1-1.75 1.75H3.25a1.75 1.75 0 0 1-1.75-1.75v-8.5A1.75 1.75 0 0 1 3.25 3H4V1.75ZM3.25 4.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-9.5Z"
                clipRule="evenodd"
              />
            </svg>
            {dayCount}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/25" />
          {todayRoutine ? (
            <span className="text-primary-400 font-bold truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Hoy: {properCase(todayRoutine.routine.name)}
            </span>
          ) : (
            <span className="truncate opacity-60 italic">{dayNames}</span>
          )}
        </div>
      }
    />
  );
}
