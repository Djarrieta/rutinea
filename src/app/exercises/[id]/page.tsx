import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteExercise, cloneExercise } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import {
  ActionBar,
  ActionForm,
  ActionLink,
} from "@/app/components/DetailActions";
import Badge from "@/app/components/Badge";
import ExerciseDetailPlay from "../ExerciseDetailPlay";
import { properCase } from "@/lib/format";
import type { Exercise } from "@/types";
import { PendingIndicator, RepetitionsIndicator, CloneIndicator } from "@/app/components/StatusIndicators";

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
  
  if (!exercise.is_approved && !isOwner) {
    notFound();
  }

  const deleteWithId = deleteExercise.bind(null, id);

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Ejercicios", href: "/exercises" },
          { label: properCase(exercise.title) },
        ]}
      />
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        {properCase(exercise.title)}
        {!exercise.is_approved && <PendingIndicator />}
      </h1>
      <ActionBar>
        <ExerciseDetailPlay exercise={exercise} />
        {user && (
          <ActionForm action={cloneExercise.bind(null, id)} icon="clone">
            Clonar
          </ActionForm>
        )}
        {isOwner && (
          <>
            <ActionLink href={`/exercises/${id}/edit`} icon="edit">
              Editar
            </ActionLink>
            <ActionForm action={deleteWithId} variant="danger" icon="delete">
              Eliminar
            </ActionForm>
          </>
        )}
      </ActionBar>

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
          <dd>
            <RepetitionsIndicator count={exercise.repetitions} className="!text-sm" />
          </dd>
        </div>
        <div>
          <dt className="text-text-faint">Clonado</dt>
          <dd>
            <CloneIndicator count={exercise.clone_count} className="!text-sm" />
          </dd>
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
    </div>
  );
}
