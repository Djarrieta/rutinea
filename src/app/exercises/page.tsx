import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import type { Exercise } from "@/types";
import ExerciseCard from "./ExerciseCard";
import PageHeader from "@/app/components/PageHeader";
import FilterableList from "@/app/components/FilterableList";
import SelectionProvider from "@/app/components/SelectionProvider";
import { deleteExercises } from "./actions";
import { PAGE_SIZE } from "@/lib/constants";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tags?: string;
    page?: string;
    mine?: string;
  }>;
}) {
  const { q, tags: tagsParam, page: pageStr, mine } = await searchParams;
  const user = await getUser();
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
    const term = `%${q
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}%`;
    query = query.or(
      `title_search.ilike.${term},description_search.ilike.${term}`,
    );
  }

  if (activeTags.length > 0) {
    query = query.contains("tags", activeTags);
  }

  if (mine && user) {
    query = query.eq("user_id", user.id);
  } else if (user) {
    query = query.or(`is_approved.eq.true,user_id.eq.${user.id}`);
  } else {
    query = query.eq("is_approved", true);
  }

  let tagsQuery = supabase.from("exercises").select("tags");
  if (mine && user) {
    tagsQuery = tagsQuery.eq("user_id", user.id);
  }

  const [{ data: exercises, count }, { data: tagRows }] = await Promise.all([
    query.range(from, to).returns<Exercise[]>(),
    tagsQuery,
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
      isEmpty={total === 0 && !q && activeTags.length === 0 && !mine}
    >
      <SelectionProvider
        actionLabel="Crear Set"
        createPath="/sets/new"
        paramName="exercises"
        userId={user?.id}
        deleteAction={deleteExercises}
      >
        <FilterableList
          placeholder="Buscar por nombre o descripción..."
          total={total}
          page={page}
          activeTags={activeTags}
          availableTags={allTags}
          showMineFilter={!!user}
          mineActive={!!mine}
        >
          {(exercises ?? []).map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              selectable
            />
          ))}
        </FilterableList>
      </SelectionProvider>
    </PageHeader>
  );
}
