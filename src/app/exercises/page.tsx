import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types";

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Exercise[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exercises</h1>

      {!exercises?.length ? (
        <p className="text-gray-500">
          No exercises yet.{" "}
          <Link href="/exercises/new" className="text-blue-600 underline">
            Create one
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-lg">{exercise.title}</h2>
              {exercise.description && (
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {exercise.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>{exercise.duration_secs}s</span>
                {exercise.image_urls.length > 0 && (
                  <span>{exercise.image_urls.length} image(s)</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
