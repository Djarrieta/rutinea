import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types";
import ExerciseCard from "./ExerciseCard";

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Exercise[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exercises</h1>

      {!exercises?.length ? (
        <p className="text-gray-500">
          No exercises yet.{" "}
          <Link href="/exercises/new" className="text-blue-600 underline">
            Create one
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
