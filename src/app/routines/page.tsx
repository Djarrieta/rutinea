import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Routine } from "@/types";
import RoutineCard from "./RoutineCard";

export default async function RoutinesPage() {
  const supabase = await createClient();
  const { data: routines } = await supabase
    .from("routines")
    .select("*, routine_exercises(count)")
    .order("created_at", { ascending: false })
    .returns<(Routine & { routine_exercises: [{ count: number }] })[]>();

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
              exerciseCount={routine.routine_exercises[0].count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
