import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { getUser } from "@/lib/auth";
import UserMenu from "./components/UserMenu";
import { DesktopNavLinks, MobileNavLinks } from "./components/NavLinks";
import BackgroundAtmosphere from "./components/BackgroundAtmosphere";
import OfflineBanner from "./components/OfflineBanner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rutinea",
  description: "App de ejercicios",
  applicationName: "Rutinea",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rutinea",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
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
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-bg text-text min-h-screen pb-20 sm:pb-0 overflow-x-hidden font-sans selection:bg-primary-500/30">
        <BackgroundAtmosphere />
        <OfflineBanner />

        {/* Desktop top nav */}
        <nav className="hidden sm:block sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight font-display bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent"
              >
                Rutinea
              </Link>
              <DesktopNavLinks />
            </div>
            <div className="flex items-center gap-3">
              <UserMenu user={userMenu} />
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-sans">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-6 inset-x-4 h-16 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl z-40 shadow-2xl overflow-hidden">
          <div className="flex justify-around items-center h-full">
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-text-muted hover:text-text transition-colors"
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
              <span className="text-[10px] font-medium font-sans">Inicio</span>
            </Link>
            <UserMenu user={userMenu} popoverDirection="up" />
            <MobileNavLinks />
          </div>
        </nav>
      </body>
    </html>
  );
}
