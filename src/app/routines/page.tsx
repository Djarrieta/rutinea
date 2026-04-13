import { createClient } from "@/lib/supabase/server";
import type { RoutineWithSets } from "@/types";
import RoutineCard from "./RoutineCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function RoutinesPage({
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
    .from("routines")
    .select(
      "*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data: routines, count } = await query
    .range(from, to)
    .returns<RoutineWithSets[]>();

  const total = count ?? 0;

  return (
    <PageHeader
      title="Rutinas"
      emptyText="No hay rutinas a\u00fan."
      createHref="/routines/new"
      createLabel="Crear una"
      isEmpty={total === 0 && !q}
    >
      <FilterableList
        placeholder="Buscar por nombre..."
        total={total}
        page={page}
      >
        {(routines ?? []).map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            setCount={routine.routine_sets.length}
          />
        ))}
      </FilterableList>
    </PageHeader>
  );
}
