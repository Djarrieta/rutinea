import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types";
import ExerciseCard from "./ExerciseCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tags?: string; page?: string }>;
}) {
  const { q, tags: tagsParam, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const activeTags = (tagsParam ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const supabase = await createClient();

  let query = supabase
    .from("exercises")
    .select("*, profile:profiles(display_name, avatar_url)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const term = `%${q.trim().toLowerCase()}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }

  if (activeTags.length > 0) {
    query = query.contains("tags", activeTags);
  }

  const [{ data: exercises, count }, { data: tagRows }] = await Promise.all([
    query.range(from, to).returns<Exercise[]>(),
    supabase.from("exercises").select("tags"),
  ]);

  const total = count ?? 0;
  const allTags = [
    ...new Set((tagRows ?? []).flatMap((r) => r.tags as string[])),
  ].sort();

  return (
    <PageHeader
      title="Ejercicios"
      emptyText="No hay ejercicios aún."
      createHref="/exercises/new"
      createLabel="Crear uno"
      isEmpty={total === 0 && !q && activeTags.length === 0}
    >
      <FilterableList
        placeholder="Buscar por nombre o descripción..."
        total={total}
        page={page}
        activeTags={activeTags}
        availableTags={allTags}
      >
        {(exercises ?? []).map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </FilterableList>
    </PageHeader>
  );
}
