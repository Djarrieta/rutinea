import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoutineForm from "../../RoutineForm";
import { updateRoutine } from "../../actions";
import type { RoutineWithSets } from "@/types";

export default async function EditRoutinePage({
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

  const updateWithId = updateRoutine.bind(null, id);

  const setEntries = [...routine.routine_sets]
    .sort((a, b) => a.position - b.position)
    .map((rs) => ({ id: rs.set_id, rounds: rs.rounds }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Rutina</h1>
      <RoutineForm
        routine={routine}
        defaultSetEntries={setEntries}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
