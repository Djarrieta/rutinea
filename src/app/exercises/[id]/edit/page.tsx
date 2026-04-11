import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import ExerciseForm from "../../ExerciseForm";
import { updateExercise } from "../../actions";
import type { Exercise } from "@/types";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();
  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single<Exercise>();

  if (!exercise) notFound();

  const updateWithId = updateExercise.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Ejercicio</h1>
      <ExerciseForm
        exercise={exercise}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
