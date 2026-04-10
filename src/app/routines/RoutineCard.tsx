import Link from "next/link";
import type { Routine } from "@/types";

export default function RoutineCard({
  routine,
  exerciseCount,
}: {
  routine: Routine;
  exerciseCount: number;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <Link href={`/routines/${routine.id}`}>
        <h2 className="font-semibold text-lg">{routine.name}</h2>
        {routine.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {routine.description}
          </p>
        )}
      </Link>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <span>
          {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
        </span>
        <span>{routine.rest_secs}s descanso</span>
      </div>
    </div>
  );
}
