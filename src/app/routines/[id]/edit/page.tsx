import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoutineForm from "../../RoutineForm";
import { updateRoutine } from "../../actions";
import type { RoutineWithExercises } from "@/types";

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: routine } = await supabase
    .from("routines")
    .select("*, routine_exercises(*, exercise:exercises(*))")
    .eq("id", id)
    .single<RoutineWithExercises>();

  if (!routine) notFound();

  const updateWithId = updateRoutine.bind(null, id);

  const exerciseIds = [...routine.routine_exercises]
    .sort((a, b) => a.position - b.position)
    .map((re) => re.exercise_id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Rutina</h1>
      <RoutineForm
        routine={routine}
        defaultExerciseIds={exerciseIds}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
