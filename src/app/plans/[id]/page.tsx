import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { deletePlan } from "../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import type { PlanWithRoutines } from "@/types";
import { DAY_LABELS } from "@/types";

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

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[{ label: "Planes", href: "/plans" }, { label: plan.name }]}
      />
      <h1 className="text-2xl font-bold mb-2">{plan.name}</h1>

      {plan.description && (
        <p className="text-slate-600 mb-4">{plan.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-slate-400">Días activos</dt>
          <dd>{sortedDays.length}</dd>
        </div>
      </dl>

      {sortedDays.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-sm font-medium text-slate-500">Rutinas por día</h2>
          {sortedDays.map((pr) => (
            <div
              key={pr.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-semibold w-24">
                {DAY_LABELS[pr.day_of_week]}
              </span>
              <Link
                href={`/routines/${pr.routine.id}`}
                className="font-medium text-indigo-600 hover:underline flex-1"
              >
                {pr.routine.name}
              </Link>
              <span className="text-xs text-slate-400">
                {pr.routine.routine_sets.length} set
                {pr.routine.routine_sets.length !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/plans/${id}/edit`}
            className="bg-slate-100 px-4 py-2 rounded-lg text-sm hover:bg-slate-200"
          >
            Editar
          </Link>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
