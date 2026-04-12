"use client";

import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS } from "@/types";
import EntityCard from "@/app/components/EntityCard";

export default function PlanCard({
  plan,
  dayCount,
}: {
  plan: PlanWithRoutines;
  dayCount: number;
}) {
  const sortedDays = [...plan.plan_routines].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  const dayNames = sortedDays
    .map((pr) => DAY_LABELS[pr.day_of_week])
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
          <span className="truncate">{dayNames}</span>
        </>
      }
    />
  );
}
