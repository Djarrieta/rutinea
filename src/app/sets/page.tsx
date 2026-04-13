import { createClient } from "@/lib/supabase/server";
import type { SetWithExercises } from "@/types";
import SetCard from "./SetCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function SetsPage({
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
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data: sets, count } = await query
    .range(from, to)
    .returns<SetWithExercises[]>();

  const total = count ?? 0;

  return (
    <PageHeader
      title="Sets"
      emptyText="No hay sets a\u00fan."
      createHref="/sets/new"
      createLabel="Crear uno"
      isEmpty={total === 0 && !q}
    >
      <FilterableList
        placeholder="Buscar por nombre..."
        total={total}
        page={page}
      >
        {(sets ?? []).map((set) => (
          <SetCard
            key={set.id}
            set={set}
            exerciseCount={set.set_exercises.length}
          />
        ))}
      </FilterableList>
    </PageHeader>
  );
}
