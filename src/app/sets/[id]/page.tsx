import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteSet } from "../actions";
import type { SetWithExercises } from "@/types";

export default async function SetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: set } = await supabase
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))")
    .eq("id", id)
    .single<SetWithExercises>();

  if (!set) notFound();

  const deleteWithId = deleteSet.bind(null, id);

  const sortedExercises = [...set.set_exercises].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">{set.name}</h1>

      {set.description && (
        <p className="text-gray-600 mb-4">{set.description}</p>
      )}

      <dl className="text-sm mb-6">
        <dt className="text-gray-400">Ejercicios</dt>
        <dd>{sortedExercises.length}</dd>
      </dl>

      {sortedExercises.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-medium text-gray-500">
            Orden de ejercicios
          </h2>
          <ol className="space-y-2">
            {sortedExercises.map((se, i) => (
              <li
                key={se.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <span className="text-gray-400 font-mono text-sm w-5 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <Link
                    href={`/exercises/${se.exercise.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {se.exercise.title}
                  </Link>
                  {se.exercise.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                      {se.exercise.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {se.exercise.duration_secs}s
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/sets/${id}/edit`}
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
