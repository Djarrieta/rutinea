import { createClient } from "@/lib/supabase/server";
import type { RoutineWithSets } from "@/types";
import RoutineCard from "./RoutineCard";
import PageHeader from "@/app/components/PageHeader";

export default async function RoutinesPage() {
  const supabase = await createClient();
  const { data: routines } = await supabase
    .from("routines")
    .select(
      "*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))",
    )
    .order("created_at", { ascending: false })
    .returns<RoutineWithSets[]>();

  return (
    <PageHeader
      title="Rutinas"
      emptyText="No hay rutinas aún."
      createHref="/routines/new"
      createLabel="Crear una"
      isEmpty={!routines?.length}
    >
      {routines?.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          setCount={routine.routine_sets.length}
        />
      ))}
    </PageHeader>
  );
}
