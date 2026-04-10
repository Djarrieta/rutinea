import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { RoutineWithSets } from "@/types";
import RoutineCard from "./RoutineCard";

export default async function RoutinesPage() {
  const supabase = await createClient();
  const { data: routines } = await supabase
    .from("routines")
    .select(
      "*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))",
    )
    .order("created_at", { ascending: false })
    .returns<RoutineWithSets[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rutinas</h1>

      {!routines?.length ? (
        <p className="text-gray-500">
          No hay rutinas aún.{" "}
          <Link href="/routines/new" className="text-blue-600 underline">
            Crear una
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              setCount={routine.routine_sets.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
