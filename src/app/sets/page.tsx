import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import type { SetWithExercises } from "@/types";
import SetCard from "./SetCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import SelectionProvider from "@/app/components/SelectionProvider";
import { deleteSets } from "./actions";
import { PAGE_SIZE } from "@/lib/constants";

export default async function SetsPage({
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
    .from("sets")
    .select(
      "*, set_exercises(*, exercise:exercises(*)), profile:profiles(display_name, avatar_url)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const term = q
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    query = query.ilike("name_search", `%${term}%`);
  }

  if (mine && user) {
    query = query.eq("user_id", user.id);
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
      isEmpty={total === 0 && !q && !mine}
    >
      <SelectionProvider
        actionLabel="Crear Rutina"
        createPath="/routines/new"
        paramName="sets"
        userId={user?.id}
        deleteAction={deleteSets}
      >
        <FilterableList
          placeholder="Buscar por nombre..."
          total={total}
          page={page}
          showMineFilter={!!user}
          mineActive={!!mine}
        >
          {(sets ?? []).map((set) => (
            <SetCard
              key={set.id}
              set={set}
              exerciseCount={set.set_exercises.length}
              selectable
              userId={user?.id}
            />
          ))}
        </FilterableList>
      </SelectionProvider>
    </PageHeader>
  );
}
