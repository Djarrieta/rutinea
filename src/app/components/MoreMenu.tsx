"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MoreMenu({
  user,
  popoverDirection = "down",
}: {
  user: { email?: string; avatar_url?: string; full_name?: string } | null;
  popoverDirection?: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function getPopoverStyle(): React.CSSProperties {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    if (popoverDirection === "up") {
      return {
        position: "fixed",
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      };
    }
    return {
      position: "fixed",
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  }

  useLayoutEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStyle(getPopoverStyle());
    }
  }, [open, popoverDirection]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }


  return (
    <div className="flex flex-col items-center">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center gap-0.5 text-text-muted hover:text-text transition-colors"
        aria-label="Más opciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
        {popoverDirection === "up" && (
          <span className="text-[10px] font-medium">Más</span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={style}
            className="w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-[9999]"
          >
            <Link
              href="/"
              className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg"
            >
              Inicio
            </Link>
            {user ? (
              <>
                <div className="px-4 py-2 text-xs text-text-muted truncate border-y border-border-light">
                  {user.email}
                </div>
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg"
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg"
              >
                Iniciar sesión
              </Link>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
