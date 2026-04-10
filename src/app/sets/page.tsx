import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { SetWithExercises } from "@/types";
import SetCard from "./SetCard";

export default async function SetsPage() {
  const supabase = await createClient();
  const { data: sets } = await supabase
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))")
    .order("created_at", { ascending: false })
    .returns<SetWithExercises[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sets</h1>

      {!sets?.length ? (
        <p className="text-gray-500">
          No hay sets aún.{" "}
          <Link href="/sets/new" className="text-blue-600 underline">
            Crear uno
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              exerciseCount={set.set_exercises.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
