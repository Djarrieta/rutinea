import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUser } from "@/lib/auth";
import UserMenu from "./components/UserMenu";
import { DesktopNavLinks, MobileNavLinks } from "./components/NavLinks";

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
              <DesktopNavLinks />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/plans/new"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700"
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
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[10px] font-medium">Inicio</span>
            </Link>
            <UserMenu user={userMenu} popoverDirection="up" />
            <MobileNavLinks />
          </div>
        </nav>
      </body>
    </html>
  );
}
