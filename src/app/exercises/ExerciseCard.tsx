"use client";

import { useState } from "react";
import Link from "next/link";
import type { Exercise } from "@/types";
import ExercisePlayerModal from "./ExercisePlayerModal";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <Link href={`/exercises/${exercise.id}`}>
          <h2 className="font-semibold text-lg">{exercise.title}</h2>
          {exercise.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {exercise.description}
            </p>
          )}
        </Link>
        {exercise.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {exercise.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{exercise.duration_secs}s</span>
            {exercise.image_urls.length > 0 && (
              <span>{exercise.image_urls.length} imagen(es)</span>
            )}
          </div>
          {exercise.image_urls.length > 0 && (
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
        <ExercisePlayerModal
          exercise={exercise}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}
