import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Rutinea" };

export default async function HomePage() {
  const supabase = await createClient();

  const { data: routines } = await supabase
    .from("routines")
    .select(
      "id, title, description, slug, is_public, created_at, profiles(full_name, avatar_url)",
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold">Rutinas</h1>

      {routines && routines.length > 0 ? (
        <div className="space-y-3">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              className="block bg-zinc-900/50 border border-zinc-700/60 rounded-xl p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{routine.title}</h3>
                <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full">
                  Pública
                </span>
              </div>
              {routine.description && (
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                  {routine.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                {routine.profiles && (
                  <p className="text-xs text-zinc-500">
                    por{" "}
                    {(routine.profiles as { full_name: string | null })
                      .full_name ?? "Anónimo"}
                  </p>
                )}
                <p className="text-xs text-zinc-500">
                  {new Date(routine.created_at).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 text-sm py-16">
          Aún no hay rutinas públicas.
        </p>
      )}
    </main>
  );
}
