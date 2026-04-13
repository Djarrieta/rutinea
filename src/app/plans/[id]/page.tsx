import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deletePlan } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import { properCase, formatDuration, getRoutineDuration } from "@/lib/format";
import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS, getTodayDayIndex } from "@/types";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("plans")
    .select(
      "*, plan_routines(*, routine:routines(*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))))",
    )
    .eq("id", id)
    .single<PlanWithRoutines>();

  if (!plan) notFound();

  const user = await getUser();
  const isOwner = user?.id === plan.user_id;

  const deleteWithId = deletePlan.bind(null, id);

  const sortedDays = [...plan.plan_routines].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  const today = getTodayDayIndex();

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Planes", href: "/plans" },
          { label: properCase(plan.name) },
        ]}
      />
      <h1 className="text-2xl font-bold mb-2">{properCase(plan.name)}</h1>

      {plan.description && (
        <p className="text-text-secondary mb-4">
          {properCase(plan.description)}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-text-faint">Días activos</dt>
          <dd>{sortedDays.length}</dd>
        </div>
      </dl>

      {sortedDays.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-sm font-medium text-text-muted">
            Rutinas por día
          </h2>
          {sortedDays.map((pr) => {
            const isToday = pr.day_of_week === today;
            return (
              <div
                key={pr.id}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                  isToday
                    ? "bg-primary-500/10 border-2 border-primary-500/40 ring-1 ring-primary-500/20"
                    : "bg-surface border border-border"
                }`}
              >
                <span
                  className={`text-sm font-semibold w-24 ${isToday ? "text-primary-400" : ""}`}
                >
                  {isToday && "▶ "}
                  {DAY_LABELS[pr.day_of_week]}
                </span>
                <Link
                  href={`/routines/${pr.routine.id}`}
                  className={`font-medium hover:underline flex-1 ${
                    isToday ? "text-primary-400" : "text-primary-600"
                  }`}
                >
                  {properCase(pr.routine.name)}
                </Link>
                <span className="text-xs text-text-faint">
                  {formatDuration(getRoutineDuration(pr.routine))}
                </span>
                <span className="text-xs text-text-faint">
                  {pr.routine.routine_sets.length} set
                  {pr.routine.routine_sets.length !== 1 ? "s" : ""}
                </span>
                {isToday && (
                  <span className="text-xs bg-primary-500 text-black px-2 py-0.5 rounded-full font-medium">
                    Hoy
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/plans/${id}/edit`}
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
