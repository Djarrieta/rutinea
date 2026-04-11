import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import SetForm from "../../SetForm";
import { updateSet } from "../../actions";
import type { SetWithExercises } from "@/types";

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();
  const { data: set } = await supabase
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))")
    .eq("id", id)
    .single<SetWithExercises>();

  if (!set) notFound();

  const updateWithId = updateSet.bind(null, id);

  const exerciseIds = [...set.set_exercises]
    .sort((a, b) => a.position - b.position)
    .map((se) => se.exercise_id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Set</h1>
      <SetForm
        set={set}
        defaultExerciseIds={exerciseIds}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
