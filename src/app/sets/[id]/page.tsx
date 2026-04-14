import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteSet, cloneSet } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
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
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{properCase(set.name)}</h1>
        <SetDetailPlay set={set} />
        {user && (
          <form action={cloneSet.bind(null, id)}>
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

      {set.description && (
        <p className="text-text-secondary mb-4">
          {properCase(set.description)}
        </p>
      )}

      <dl className="text-sm mb-6">
        <dt className="text-text-faint">Ejercicios</dt>
        <dd>{sortedExercises.length}</dd>
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

      <div className="flex gap-3">
        {isOwner && (
          <>
            <Link
              href={`/sets/${id}/edit`}
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
