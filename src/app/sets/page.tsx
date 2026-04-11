import { createClient } from "@/lib/supabase/server";
import type { SetWithExercises } from "@/types";
import SetCard from "./SetCard";
import PageHeader from "@/app/components/PageHeader";

export default async function SetsPage() {
  const supabase = await createClient();
  const { data: sets } = await supabase
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))")
    .order("created_at", { ascending: false })
    .returns<SetWithExercises[]>();

  return (
    <PageHeader
      title="Sets"
      emptyText="No hay sets aún."
      createHref="/sets/new"
      createLabel="Crear uno"
      isEmpty={!sets?.length}
    >
      {sets?.map((set) => (
        <SetCard
          key={set.id}
          set={set}
          exerciseCount={set.set_exercises.length}
        />
      ))}
    </PageHeader>
  );
}
