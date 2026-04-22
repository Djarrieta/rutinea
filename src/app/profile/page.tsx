import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const [profile, exerciseCount, setCount, routineCount, planCount] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_url, created_at")
        .eq("id", user.id)
        .single(),
      supabase
        .from("exercises")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("sets")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("routines")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("plans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const displayName =
    profile.data?.display_name || user.email?.split("@")[0] || "Usuario";
  const avatarUrl = profile.data?.avatar_url || null;
  const email = user.email || "";
  const memberSince = profile.data?.created_at
    ? new Date(profile.data.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : null;
  const provider = user.app_metadata?.provider || "email";

  const stats = [
    {
      label: "Ejercicios",
      count: exerciseCount.count ?? 0,
      href: "/exercises?mine=true",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75C2 3.784 2.784 3 3.75 3h4.836c.464 0 .909.184 1.237.513l1.414 1.414a.25.25 0 00.177.073h4.836c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0116.25 17H3.75A1.75 1.75 0 012 15.25V4.75z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "Sets",
      count: setCount.count ?? 0,
      href: "/sets?mine=true",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
        </svg>
      ),
    },
    {
      label: "Rutinas",
      count: routineCount.count ?? 0,
      href: "/routines?mine=true",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "Planes",
      count: planCount.count ?? 0,
      href: "/plans?mine=true",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full bg-surface border-2 border-primary-500 flex items-center justify-center overflow-hidden shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={80}
              height={80}
              unoptimized
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-primary-500">
              {displayName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-text truncate">
            {displayName}
          </h1>
          <p className="text-sm text-text-muted truncate">{email}</p>
          {memberSince && (
            <p className="text-xs text-text-muted mt-1">
              Miembro desde {memberSince}
            </p>
          )}
        </div>
      </div>

      {/* Provider info */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          Cuenta
        </h2>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          {provider === "google" && (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Conectado con Google</span>
            </>
          )}
          {provider === "github" && (
            <>
              <svg
                className="w-5 h-5 shrink-0 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Conectado con GitHub</span>
            </>
          )}
          {provider === "email" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 shrink-0"
              >
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <span>Acceso con email</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          Tu contenido
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-surface rounded-xl border border-border p-4 hover:border-primary-500/40 transition-colors group"
            >
              <div className="flex items-center gap-2 text-text-muted group-hover:text-primary-500 transition-colors mb-2">
                {s.icon}
                <span className="text-sm">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-text">{s.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
