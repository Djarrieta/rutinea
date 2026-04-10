import Link from "next/link";
import type { SetWithExercises } from "@/types";

export default function SetCard({
  set,
  exerciseCount,
}: {
  set: SetWithExercises;
  exerciseCount: number;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <Link href={`/sets/${set.id}`}>
        <h2 className="font-semibold text-lg">{set.name}</h2>
        {set.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {set.description}
          </p>
        )}
      </Link>
      <div className="mt-3 text-xs text-gray-400">
        <span>
          {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
