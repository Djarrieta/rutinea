import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteRoutine } from "../actions";
import type { RoutineWithExercises } from "@/types";

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: routine } = await supabase
    .from("routines")
    .select("*, routine_exercises(*, exercise:exercises(*))")
    .eq("id", id)
    .single<RoutineWithExercises>();

  if (!routine) notFound();

  const deleteWithId = deleteRoutine.bind(null, id);

  const sortedExercises = [...routine.routine_exercises].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">{routine.name}</h1>

      {routine.description && (
        <p className="text-gray-600 mb-4">{routine.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-gray-400">Descanso</dt>
          <dd>{routine.rest_secs}s</dd>
        </div>
        <div>
          <dt className="text-gray-400">Ejercicios</dt>
          <dd>{sortedExercises.length}</dd>
        </div>
      </dl>

      {sortedExercises.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-medium text-gray-500">
            Orden de ejercicios
          </h2>
          <ol className="space-y-2">
            {sortedExercises.map((re, i) => (
              <li
                key={re.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <span className="text-gray-400 font-mono text-sm w-5 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <Link
                    href={`/exercises/${re.exercise.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {re.exercise.title}
                  </Link>
                  {re.exercise.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                      {re.exercise.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {re.exercise.duration_secs}s
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/routines/${id}/edit`}
          className="bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
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
    </div>
  );
}
