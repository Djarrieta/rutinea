import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types";
import ExerciseCard from "./ExerciseCard";
import PageHeader from "@/app/components/PageHeader";

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Exercise[]>();

  return (
    <PageHeader
      title="Ejercicios"
      emptyText="No hay ejercicios aún."
      createHref="/exercises/new"
      createLabel="Crear uno"
      isEmpty={!exercises?.length}
    >
      {exercises?.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </PageHeader>
  );
}
