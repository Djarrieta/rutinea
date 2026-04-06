import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Rutinea", template: "%s | Rutinea" },
  description: "Crea, organiza y ejecuta tus rutinas de ejercicio.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#18181b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0c0c0f] text-zinc-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
