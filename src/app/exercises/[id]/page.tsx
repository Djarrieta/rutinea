import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteExercise, cloneExercise } from "../actions";
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
        {user && (
          <form action={cloneExercise.bind(null, id)}>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-primary-500 text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v.25h3v-.25z"
                  clipRule="evenodd"
                />
                <path d="M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.379a1.5 1.5 0 00-.44-1.06l-3.12-3.122A1.5 1.5 0 007.378 7.5H3.5z" />
              </svg>
              Clonar
            </button>
          </form>
        )}
      </div>

      {exercise.description && (
        <p className="text-text-secondary mb-4">
          {properCase(exercise.description)}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        {exercise.preparation_secs > 0 && (
          <div>
            <dt className="text-text-faint">Preparación</dt>
            <dd>{exercise.preparation_secs}s</dd>
          </div>
        )}
        <div>
          <dt className="text-text-faint">Seg. por rep</dt>
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
            <Badge
              key={tag}
              href={`/exercises?tags=${encodeURIComponent(tag)}`}
            >
              {properCase(tag)}
            </Badge>
          ))}
        </div>
      )}

      {exercise.images.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-6">
          {exercise.images.map((img, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Image
                src={img.url}
                alt={img.description || `${exercise.title} ${i + 1}`}
                width={128}
                height={128}
                unoptimized
                className="w-32 h-32 object-contain rounded-lg border bg-surface-alt"
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

      <div className="flex gap-3">
        {isOwner && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
