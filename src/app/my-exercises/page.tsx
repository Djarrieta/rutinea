import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Mis Ejercicios" };

export default async function MyExercisesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: exercises } = await supabase
    .from("exercises")
    .select(
      "id, name, image_url, tips, default_duration_seconds, is_public, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Ejercicios</h1>
        <Link
          href="/exercises/new"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold rounded-lg px-4 py-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> Nuevo
        </Link>
      </div>

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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{exercise.name}</h3>
                  {exercise.is_public && (
                    <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full flex-shrink-0">
                      Público
                    </span>
                  )}
                </div>
                {exercise.tips && (
                  <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">
                    {exercise.tips}
                  </p>
                )}
                {exercise.default_duration_seconds && (
                  <span className="text-xs text-zinc-500 mt-1 inline-block">
                    {exercise.default_duration_seconds}s por defecto
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 text-sm py-16">
          Aún no tienes ejercicios. ¡Crea el primero!
        </p>
      )}
    </main>
  );
}
