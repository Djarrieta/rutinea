import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: routines } = await supabase
    .from("routines")
    .select("id, title, description, slug, is_public, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-zinc-700"
            />
          )}
          <div>
            <p className="text-xs text-zinc-400">Bienvenido,</p>
            <p className="font-semibold">{profile?.full_name ?? user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Mis Rutinas</h2>
        <Link
          href="/routines/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all text-white font-semibold rounded-xl px-5 py-4 text-base w-full shadow-lg shadow-emerald-900/20"
        >
          <span className="text-xl">+</span> Nueva Rutina
        </Link>

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
                  {routine.is_public && (
                    <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full">
                      Pública
                    </span>
                  )}
                </div>
                {routine.description && (
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {routine.description}
                  </p>
                )}
                <p className="text-xs text-zinc-500 mt-2">
                  {new Date(routine.created_at).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500 text-sm py-8">
            Aún no tienes rutinas. ¡Crea tu primera!
          </p>
        )}
      </section>
    </main>
  );
}
