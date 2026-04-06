import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rutinea" };

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl">🏋️</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Rutinea</h1>
        <p className="text-zinc-400 max-w-xs mx-auto">
          Crea, organiza y ejecuta tus rutinas de ejercicio con timers e
          imágenes.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/login"
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold rounded-xl px-5 py-4 text-base"
        >
          Empezar gratis
        </Link>
        <Link
          href="/login"
          className="border border-zinc-600 hover:border-zinc-400 text-zinc-200 hover:text-white transition-all rounded-xl px-5 py-4 text-base"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
