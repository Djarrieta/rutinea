import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteExercise } from "../actions";
import type { Exercise } from "@/types";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single<Exercise>();

  if (!exercise) notFound();

  const deleteWithId = deleteExercise.bind(null, id);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>

      {exercise.description && (
        <p className="text-gray-600 mb-4">{exercise.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-gray-400">Duración</dt>
          <dd>{exercise.duration_secs}s</dd>
        </div>
        <div>
          <dt className="text-gray-400">Repeticiones</dt>
          <dd>{exercise.repetitions}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Imágenes</dt>
          <dd>{exercise.images.length || "Ninguna"}</dd>
        </div>
      </dl>

      {exercise.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
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

      {exercise.images.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-6">
          {exercise.images.map((img, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <img
                src={img.url}
                alt={img.description || `${exercise.title} ${i + 1}`}
                className="w-32 h-32 object-cover rounded-lg border"
              />
              {img.description && (
                <span className="text-xs text-gray-500 text-center max-w-[8rem]">
                  {img.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/exercises/${id}/edit`}
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
