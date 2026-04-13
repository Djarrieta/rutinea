import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteExercise } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import Badge from "@/app/components/Badge";
import ExerciseDetailPlay from "../ExerciseDetailPlay";
import { properCase } from "@/lib/format";
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

  const user = await getUser();
  const isOwner = user?.id === exercise.user_id;

  const deleteWithId = deleteExercise.bind(null, id);

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Ejercicios", href: "/exercises" },
          { label: properCase(exercise.title) },
        ]}
      />
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{properCase(exercise.title)}</h1>
        <ExerciseDetailPlay exercise={exercise} />
      </div>

      {exercise.description && (
        <p className="text-text-secondary mb-4">
          {properCase(exercise.description)}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-text-faint">Duración</dt>
          <dd>{exercise.duration_secs}s</dd>
        </div>
        <div>
          <dt className="text-text-faint">Repeticiones</dt>
          <dd>{exercise.repetitions}</dd>
        </div>
        <div>
          <dt className="text-text-faint">Imágenes</dt>
          <dd>{exercise.images.length || "Ninguna"}</dd>
        </div>
      </dl>

      {exercise.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {exercise.tags.map((tag) => (
            <Badge key={tag}>{properCase(tag)}</Badge>
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
                <span className="text-xs text-text-muted text-center max-w-[8rem]">
                  {img.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/exercises/${id}/edit`}
            className="bg-surface-alt px-4 py-2 rounded-lg text-sm hover:bg-surface-hover"
          >
            Editar
          </Link>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="bg-danger-50 text-danger-600 px-4 py-2 rounded-lg text-sm hover:bg-danger-100"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
