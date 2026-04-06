import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarUser from "./NavbarUser";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name: string | null; avatar_url: string | null } | null =
    null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0c0c0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        {/* Left: logo + main links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">🏋️</span>
            <span>Rutinea</span>
          </Link>

          <div className="hidden sm:flex items-center gap-4 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Rutinas
            </Link>
            <Link
              href="/exercises"
              className="hover:text-white transition-colors"
            >
              Ejercicios
            </Link>
          </div>
        </div>

        {/* Right: auth-dependent */}
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-4 text-zinc-400">
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Mis Rutinas
                </Link>
                <Link
                  href="/my-exercises"
                  className="hover:text-white transition-colors"
                >
                  Mis Ejercicios
                </Link>
              </div>
              <NavbarUser
                avatarUrl={profile?.avatar_url ?? null}
                initial={(
                  profile?.full_name?.[0] ??
                  user.email?.[0] ??
                  "U"
                ).toUpperCase()}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold rounded-lg px-4 py-2"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* Mobile links */}
      <div className="flex sm:hidden items-center justify-center gap-6 border-t border-zinc-800/50 py-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">
          Rutinas
        </Link>
        <Link href="/exercises" className="hover:text-white transition-colors">
          Ejercicios
        </Link>
        {user && (
          <>
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Mis Rutinas
            </Link>
            <Link
              href="/my-exercises"
              className="hover:text-white transition-colors"
            >
              Mis Ejercicios
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
