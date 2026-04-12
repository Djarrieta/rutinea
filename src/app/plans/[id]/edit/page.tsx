import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import PlanForm from "../../PlanForm";
import { updatePlan } from "../../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import type { PlanWithRoutines } from "@/types";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("plans")
    .select(
      "*, plan_routines(*, routine:routines(*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))))",
    )
    .eq("id", id)
    .single<PlanWithRoutines>();

  if (!plan || plan.user_id !== user.id) notFound();

  const updateWithId = updatePlan.bind(null, id);

  const dayEntries = [...plan.plan_routines]
    .sort((a, b) => a.day_of_week - b.day_of_week)
    .map((pr) => ({ day_of_week: pr.day_of_week, routine_id: pr.routine_id }));

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Planes", href: "/plans" },
          { label: plan.name, href: `/plans/${id}` },
          { label: "Editar" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Editar Plan</h1>
      <PlanForm
        plan={plan}
        defaultDayEntries={dayEntries}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
