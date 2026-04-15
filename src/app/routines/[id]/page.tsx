import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteRoutine, cloneRoutine } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import RoutineDetailPlay from "../RoutineDetailPlay";
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
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{properCase(routine.name)}</h1>
        <RoutineDetailPlay routine={routine} />
        {user && (
          <form action={cloneRoutine.bind(null, id)}>
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
        <Link
          href={`/api/routines/${id}/export`}
          target="_blank"
          className="flex items-center gap-1.5 bg-surface-2 text-text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-3 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          Exportar
        </Link>
      </div>

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

      <div className="flex gap-3">
        {isOwner && (
          <>
            <Link
              href={`/routines/${id}/edit`}
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
