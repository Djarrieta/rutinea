import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExerciseForm from "../../ExerciseForm";
import { updateExercise } from "../../actions";
import type { Exercise } from "@/types";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      <h1 className="text-2xl font-bold mb-6">Edit Exercise</h1>
      <ExerciseForm
        exercise={exercise}
        action={updateWithId}
        submitLabel="Save Changes"
      />
    </div>
  );
}
