import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import type { PlanWithRoutines } from "@/types";
import PlanCard from "./PlanCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import { PAGE_SIZE } from "@/lib/constants";

export default async function PlansPage({
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
    .from("plans")
    .select(
      "*, plan_routines(*, routine:routines(*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*)))))), profile:profiles(display_name, avatar_url)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  if (mine && user) {
    query = query.eq("user_id", user.id);
  }

  const { data: plans, count } = await query
    .range(from, to)
    .returns<PlanWithRoutines[]>();

  const total = count ?? 0;

  return (
    <PageHeader
      title="Planes"
      emptyText="No hay planes a\u00fan."
      createHref="/plans/new"
      createLabel="Crear uno"
      isEmpty={total === 0 && !q && !mine}
    >
      <FilterableList
        placeholder="Buscar por nombre..."
        total={total}
        page={page}
        showMineFilter={!!user}
        mineActive={!!mine}
      >
        {(plans ?? []).map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            dayCount={plan.plan_routines.length}
          />
        ))}
      </FilterableList>
    </PageHeader>
  );
}
