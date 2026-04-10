"use client";

import { useState } from "react";
import Link from "next/link";
import type { RoutineWithExercises } from "@/types";
import RoutinePlayerModal from "./RoutinePlayerModal";

export default function RoutineCard({
  routine,
  exerciseCount,
}: {
  routine: RoutineWithExercises;
  exerciseCount: number;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <Link href={`/routines/${routine.id}`}>
          <h2 className="font-semibold text-lg">{routine.name}</h2>
          {routine.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {routine.description}
            </p>
          )}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>
              {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
            </span>
            <span>{routine.rest_secs}s descanso</span>
          </div>
          {exerciseCount > 0 && (
            <button
              onClick={() => setShowPlayer(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
              </svg>
              Reproducir
            </button>
          )}
        </div>
      </div>

      {showPlayer && (
        <RoutinePlayerModal
          routine={routine}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
