import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteSet, cloneSet } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import {
  ActionBar,
  ActionForm,
  ActionLink,
} from "@/app/components/DetailActions";
import SetDetailPlay from "../SetDetailPlay";
import { properCase } from "@/lib/format";
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

  const user = await getUser();
  const isOwner = user?.id === set.user_id;

  if (!set.is_approved && !isOwner) {
    notFound();
  }

  const deleteWithId = deleteSet.bind(null, id);

  const sortedExercises = [...set.set_exercises].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Sets", href: "/sets" },
          { label: properCase(set.name) },
        ]}
      />
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        {properCase(set.name)}
        {!set.is_approved && (
          <span
            title="Pendiente de revisión"
            className="text-amber-500 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </h1>
      <ActionBar>
        <SetDetailPlay set={set} />
        {user && (
          <ActionForm action={cloneSet.bind(null, id)} icon="clone">
            Clonar
          </ActionForm>
        )}
        {isOwner && (
          <>
            <ActionLink href={`/sets/${id}/edit`} icon="edit">
              Editar
            </ActionLink>
            <ActionForm action={deleteWithId} variant="danger" icon="delete">
              Eliminar
            </ActionForm>
          </>
        )}
      </ActionBar>

      {set.description && (
        <p className="text-text-secondary mb-4">
          {properCase(set.description)}
        </p>
      )}

      <dl className="text-sm mb-6">
        <dt className="text-text-faint">Ejercicios</dt>
        <dd>{sortedExercises.length}</dd>
        {set.preparation_secs > 0 && (
          <>
            <dt className="text-text-faint mt-2">Tiempo de preparación</dt>
            <dd>{set.preparation_secs}s</dd>
          </>
        )}
      </dl>

      {sortedExercises.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-medium text-text-muted">
            Orden de ejercicios
          </h2>
          <ol className="space-y-2">
            {sortedExercises.map((se, i) => (
              <li
                key={se.id}
                className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3"
              >
                <span className="text-text-faint font-mono text-sm w-5 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <Link
                    href={`/exercises/${se.exercise.id}`}
                    className="font-medium text-primary-600 hover:underline"
                  >
                    {properCase(se.exercise.title)}
                  </Link>
                  {se.exercise.description && (
                    <p className="text-text-muted text-xs mt-0.5 line-clamp-1">
                      {properCase(se.exercise.description)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-text-faint">
                  {se.exercise.duration_secs}s/rep
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
