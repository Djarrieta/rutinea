import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deletePlan, clonePlan } from "../actions";
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
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{properCase(plan.name)}</h1>
        {user && (
          <form action={clonePlan.bind(null, id)}>
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
          href={`/api/plans/${id}/export`}
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
                  className={`text-sm font-semibold w-16 sm:w-24 shrink-0 ${isToday ? "text-primary-400" : ""}`}
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

      <div className="flex gap-3">
        {isOwner && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
