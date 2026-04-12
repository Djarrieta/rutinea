import { createClient } from "@/lib/supabase/server";
import type { PlanWithRoutines } from "@/types";
import PlanCard from "./PlanCard";
import PageHeader from "@/app/components/PageHeader";

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select(
      "*, plan_routines(*, routine:routines(*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))))",
    )
    .order("created_at", { ascending: false })
    .returns<PlanWithRoutines[]>();

  return (
    <PageHeader
      title="Planes"
      emptyText="No hay planes aún."
      createHref="/plans/new"
      createLabel="Crear uno"
      isEmpty={!plans?.length}
    >
      {plans?.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          dayCount={plan.plan_routines.length}
        />
      ))}
    </PageHeader>
  );
}
