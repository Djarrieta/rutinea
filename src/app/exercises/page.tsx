import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ejercicios" };

export default async function ExercisesPage() {
  const supabase = await createClient();

  const { data: exercises } = await supabase
    .from("exercises")
    .select(
      "id, name, image_url, tips, default_duration_seconds, created_at, profiles(full_name)",
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold">Ejercicios</h1>

      {exercises && exercises.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="flex gap-3 bg-zinc-900/50 border border-zinc-700/60 rounded-xl p-4 hover:border-zinc-600 transition-colors"
            >
              {exercise.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exercise.image_url}
                  alt={exercise.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-zinc-700"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{exercise.name}</h3>
                {exercise.tips && (
                  <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">
                    {exercise.tips}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  {exercise.default_duration_seconds && (
                    <span className="text-xs text-zinc-500">
                      {exercise.default_duration_seconds}s
                    </span>
                  )}
                  {exercise.profiles && (
                    <span className="text-xs text-zinc-500">
                      por{" "}
                      {(
                        exercise.profiles as unknown as {
                          full_name: string | null;
                        }
                      ).full_name ?? "Anónimo"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 text-sm py-16">
          Aún no hay ejercicios públicos.
        </p>
      )}
    </main>
  );
}
