"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UserMenu({
  user,
  popoverDirection = "down",
}: {
  user: { email?: string; avatar_url?: string; full_name?: string } | null;
  popoverDirection?: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
        {popoverDirection === "down" && (
          <span className="text-sm">Iniciar sesión</span>
        )}
        {popoverDirection === "up" && (
          <span className="text-[10px] font-medium">Entrar</span>
        )}
      </a>
    );
  }

  const initials = (user.full_name || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center overflow-hidden hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="w-7 h-7 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </button>
      {popoverDirection === "up" && (
        <span className="text-[10px] font-medium text-slate-500 mt-0.5">
          Cuenta
        </span>
      )}

      {open && (
        <div
          className={`absolute w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 ${
            popoverDirection === "up"
              ? "bottom-full mb-2 right-1/2 translate-x-1/2"
              : "right-0 mt-2"
          }`}
        >
          <div className="px-4 py-2 text-xs text-slate-500 truncate border-b border-slate-100">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
