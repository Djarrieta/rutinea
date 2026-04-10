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
          <dt className="text-gray-400">Duration</dt>
          <dd>{exercise.duration_secs}s</dd>
        </div>
        <div>
          <dt className="text-gray-400">Images</dt>
          <dd>{exercise.image_urls.length || "None"}</dd>
        </div>
      </dl>

      {exercise.image_urls.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-6">
          {exercise.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${exercise.title} ${i + 1}`}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/exercises/${id}/edit`}
          className="bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          Edit
        </Link>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
