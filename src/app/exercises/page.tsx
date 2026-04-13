import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types";
import ExerciseCard from "./ExerciseCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("exercises")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const term = `%${q.trim().toLowerCase()}%`;
    query = query.or(`title.ilike.${term},tags.cs.{${q.trim().toLowerCase()}}`);
  }

  const { data: exercises, count } = await query
    .range(from, to)
    .returns<Exercise[]>();

  const total = count ?? 0;

  return (
    <PageHeader
      title="Ejercicios"
      emptyText="No hay ejercicios aún."
      createHref="/exercises/new"
      createLabel="Crear uno"
      isEmpty={total === 0 && !q}
    >
      <FilterableList
        placeholder="Buscar por nombre o tag..."
        total={total}
        page={page}
      >
        {(exercises ?? []).map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </FilterableList>
    </PageHeader>
  );
}
