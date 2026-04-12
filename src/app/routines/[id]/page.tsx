import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteRoutine } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import type { RoutineWithSets } from "@/types";

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: routine } = await supabase
    .from("routines")
    .select(
      "*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))",
    )
    .eq("id", id)
    .single<RoutineWithSets>();

  if (!routine) notFound();

  const user = await getUser();
  const isOwner = user?.id === routine.user_id;

  const deleteWithId = deleteRoutine.bind(null, id);

  const sortedSets = [...routine.routine_sets].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Rutinas", href: "/routines" },
          { label: routine.name },
        ]}
      />
      <h1 className="text-2xl font-bold mb-2">{routine.name}</h1>

      {routine.description && (
        <p className="text-slate-600 mb-4">{routine.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-slate-400">Descanso entre sets</dt>
          <dd>{routine.rest_secs}s</dd>
        </div>
        <div>
          <dt className="text-slate-400">Sets</dt>
          <dd>{sortedSets.length}</dd>
        </div>
      </dl>

      {sortedSets.length > 0 && (
        <div className="mb-6 space-y-5">
          <h2 className="text-sm font-medium text-slate-500">Orden de sets</h2>
          {sortedSets.map((rs, si) => {
            const sortedExercises = [...rs.set.set_exercises].sort(
              (a, b) => a.position - b.position,
            );
            return (
              <div key={rs.id} className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {si + 1}. {rs.set.name}
                  {rs.rounds > 1 && (
                    <span className="ml-1 text-slate-400 font-normal">
                      ×{rs.rounds}
                    </span>
                  )}
                </h3>
                <ol className="space-y-2">
                  {sortedExercises.map((se, i) => (
                    <li
                      key={se.id}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3"
                    >
                      <span className="text-slate-400 font-mono text-sm w-5 text-center">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <Link
                          href={`/exercises/${se.exercise.id}`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          {se.exercise.title}
                        </Link>
                        {se.exercise.description && (
                          <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                            {se.exercise.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {se.exercise.duration_secs}s
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/routines/${id}/edit`}
            className="bg-slate-100 px-4 py-2 rounded-lg text-sm hover:bg-slate-200"
          >
            Editar
          </Link>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
