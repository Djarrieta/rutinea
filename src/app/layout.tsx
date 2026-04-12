import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUser } from "@/lib/auth";
import UserMenu from "./components/UserMenu";

export const metadata: Metadata = {
  title: "Rutinea",
  description: "App de ejercicios",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const userMenu = user
    ? {
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url,
        full_name: user.user_metadata?.full_name,
      }
    : null;

  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 min-h-screen pb-16 sm:pb-0">
        {/* Desktop top nav */}
        <nav className="hidden sm:block bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                Rutinea
              </Link>
              <div className="flex gap-4 text-sm">
                <Link
                  href="/plans"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Planes
                </Link>
                <Link
                  href="/routines"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Rutinas
                </Link>
                <Link
                  href="/sets"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Sets
                </Link>
                <Link
                  href="/exercises"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Ejercicios
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/plans/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                + Plan
              </Link>
              <Link
                href="/routines/new"
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-200"
              >
                + Rutina
              </Link>
              <Link
                href="/sets/new"
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-200"
              >
                + Set
              </Link>
              <Link
                href="/exercises/new"
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-200"
              >
                + Ejercicio
              </Link>
              <UserMenu user={userMenu} />
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40">
          <div className="flex justify-around items-center h-14">
            <UserMenu user={userMenu} popoverDirection="up" />
            <Link
              href="/plans"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 px-3 py-1"
            >
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
              <span className="text-[10px] font-medium">Planes</span>
            </Link>
            <Link
              href="/routines"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 px-3 py-1"
            >
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
              <span className="text-[10px] font-medium">Rutinas</span>
            </Link>
            <Link
              href="/sets"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 px-3 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zM4.5 4a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11z" />
                <path d="M6 7.5A.5.5 0 016.5 7h7a.5.5 0 010 1h-7A.5.5 0 016 7.5zM6 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zM6.5 13a.5.5 0 000 1h4a.5.5 0 000-1h-4z" />
              </svg>
              <span className="text-[10px] font-medium">Sets</span>
            </Link>
            <Link
              href="/exercises"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 px-3 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75zm-2-3.5a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75zm-1-3.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[10px] font-medium">Ejercicios</span>
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}
