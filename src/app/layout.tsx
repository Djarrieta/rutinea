import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { getUser } from "@/lib/auth";
import MoreMenu from "./components/MoreMenu";
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
                className="flex items-center gap-2 text-2xl font-bold tracking-tight font-display bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/icon-192.png"
                  alt="Rutinea Logo"
                  width={28}
                  height={28}
                  className="rounded-lg shadow-sm"
                />
              </Link>
              <DesktopNavLinks />
            </div>
            <div className="flex items-center gap-3">
              <MoreMenu user={userMenu} />
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-sans">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-6 inset-x-4 h-16 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl z-40 shadow-2xl overflow-hidden">
          <div className="flex justify-around items-center h-full">
            <MobileNavLinks />
            <MoreMenu user={userMenu} popoverDirection="up" />
          </div>
        </nav>
      </body>
    </html>
  );
}
