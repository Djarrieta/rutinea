import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: routine } = await supabase
    .from("routines")
    .select("title")
    .eq("id", id)
    .single();

  return { title: routine?.title ?? "Rutina" };
}

export default async function RoutineDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: routine } = await supabase
    .from("routines")
    .select("id, title, description, slug, is_public, created_at, user_id")
    .eq("id", id)
    .single();

  if (!routine) notFound();

  const { data: sets } = await supabase
    .from("sets")
    .select(
      "id, position, reps, duration_seconds, rest_seconds, notes, exercise:exercises(id, name)",
    )
    .eq("routine_id", routine.id)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        ← Mis Rutinas
      </Link>

      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{routine.title}</h1>
          {routine.is_public && (
            <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full">
              Pública
            </span>
          )}
        </div>
        {routine.description && (
          <p className="text-sm text-zinc-400">{routine.description}</p>
        )}
        <p className="text-xs text-zinc-500">
          {new Date(routine.created_at).toLocaleDateString("es", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Ejercicios{sets && sets.length > 0 ? ` (${sets.length})` : ""}
        </h2>

        {sets && sets.length > 0 ? (
          <ol className="space-y-3">
            {sets.map((set) => (
              <li
                key={set.id}
                className="bg-zinc-900/50 border border-zinc-700/60 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {(
                      set.exercise as unknown as {
                        id: string;
                        name: string;
                      } | null
                    )?.name ?? "Ejercicio"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    #{set.position + 1}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">
                  {set.reps != null && <span>{set.reps} reps</span>}
                  {set.duration_seconds != null && (
                    <span>{set.duration_seconds}s</span>
                  )}
                  <span>Descanso: {set.rest_seconds}s</span>
                </div>

                {set.notes && (
                  <p className="mt-2 text-xs text-zinc-500">{set.notes}</p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-zinc-500 text-sm py-6">
            Esta rutina no tiene ejercicios aún.
          </p>
        )}
      </section>
    </main>
  );
}
