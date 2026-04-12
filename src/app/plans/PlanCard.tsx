"use client";

import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS, getTodayDayIndex } from "@/types";
import EntityCard from "@/app/components/EntityCard";

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

  return (
    <EntityCard
      href={`/plans/${plan.id}`}
      title={plan.name}
      description={plan.description}
      meta={
        <>
          <span>
            {dayCount} día{dayCount !== 1 ? "s" : ""}
          </span>
          {todayRoutine ? (
            <span className="text-primary-400 font-medium truncate">
              Hoy: {todayRoutine.routine.name}
            </span>
          ) : (
            <span className="truncate">{dayNames}</span>
          )}
        </>
      }
    />
  );
}
