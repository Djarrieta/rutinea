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
            <MobileNavLinks />
          </div>
        </nav>
      </body>
    </html>
  );
}
