import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NewRoutineForm from "./NewRoutineForm";

export const metadata: Metadata = { title: "Nueva Rutina" };

export default async function NewRoutinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Nueva Rutina</h1>
        <p className="text-zinc-400 text-sm">
          Dale un nombre y agrega ejercicios.
        </p>
      </header>
      <NewRoutineForm />
    </main>
  );
}
