import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteRoutine, cloneRoutine } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import { ActionBar, ActionForm, ActionLink } from "@/app/components/DetailActions";
import RoutineDetailPlay from "../RoutineDetailPlay";
import SaveOfflineButton from "../SaveOfflineButton";
import { properCase, formatDuration, getRoutineDuration } from "@/lib/format";
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

  const totalDuration = getRoutineDuration(routine);

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Rutinas", href: "/routines" },
          { label: properCase(routine.name) },
        ]}
      />
      <h1 className="text-2xl font-bold mb-1">{properCase(routine.name)}</h1>
      <ActionBar>
        <RoutineDetailPlay routine={routine} />
        {user && (
          <>
            <ActionForm action={cloneRoutine.bind(null, id)} icon="clone">
              Clonar
            </ActionForm>
            <SaveOfflineButton routine={routine} />
          </>
        )}
        {/* <ActionLink href={`/api/routines/${id}/export`} target="_blank" icon="export">
          Exportar
        </ActionLink> */}
        {isOwner && (
          <>
            <ActionLink href={`/routines/${id}/edit`} icon="edit">
              Editar
            </ActionLink>
            <ActionForm action={deleteWithId} variant="danger" icon="delete">
              Eliminar
            </ActionForm>
          </>
        )}
      </ActionBar>

      {routine.description && (
        <p className="text-text-secondary mb-4">
          {properCase(routine.description)}
        </p>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-6">
        <div>
          <dt className="text-text-faint">Descanso entre sets</dt>
          <dd>{routine.rest_secs}s</dd>
        </div>
        <div>
          <dt className="text-text-faint">Sets</dt>
          <dd>{sortedSets.length}</dd>
        </div>
        <div>
          <dt className="text-text-faint">Duración total</dt>
          <dd>{formatDuration(totalDuration)}</dd>
        </div>
      </dl>

      {sortedSets.length > 0 && (
        <div className="mb-6 space-y-5">
          <h2 className="text-sm font-medium text-text-muted">Orden de sets</h2>
          {sortedSets.map((rs, si) => {
            const sortedExercises = [...rs.set.set_exercises].sort(
              (a, b) => a.position - b.position,
            );
            return (
              <div key={rs.id} className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {si + 1}. {properCase(rs.set.name)}
                  {rs.rounds > 1 && (
                    <span className="ml-1 text-text-faint font-normal">
                      ×{rs.rounds}
                    </span>
                  )}
                </h3>
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
            );
          })}
        </div>
      )}

    </div>
  );
}
