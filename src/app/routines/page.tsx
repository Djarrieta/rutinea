import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import type { RoutineWithSets } from "@/types";
import RoutineCard from "./RoutineCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function RoutinesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; mine?: string }>;
}) {
  const { q, page: pageStr, mine } = await searchParams;
  const user = await getUser();
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("routines")
    .select(
      "*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*)))), profile:profiles(display_name, avatar_url)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const term = q.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    query = query.ilike("name_search", `%${term}%`);
  }

  if (mine && user) {
    query = query.eq("user_id", user.id);
  }

  const { data: routines, count } = await query
    .range(from, to)
    .returns<RoutineWithSets[]>();

  const total = count ?? 0;

  return (
    <PageHeader
      title="Rutinas"
      emptyText="No hay rutinas aún."
      createHref="/routines/new"
      createLabel="Crear una"
      isEmpty={total === 0 && !q && !mine}
    >
      <FilterableList
        placeholder="Buscar por nombre..."
        total={total}
        page={page}
        showMineFilter={!!user}
        mineActive={!!mine}
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
