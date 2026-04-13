import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deleteSet } from "../actions";
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

      {isOwner && (
        <div className="flex gap-3">
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
        </div>
      )}
    </div>
  );
}
