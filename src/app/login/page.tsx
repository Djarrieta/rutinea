import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GoogleButton from "./GoogleButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / brand */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🏋️</div>
          <h1 className="text-3xl font-bold tracking-tight">Rutinea</h1>
          <p className="text-zinc-400 text-sm">
            Crea y ejecuta tus rutinas de ejercicio.
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-8 space-y-4 shadow-xl backdrop-blur">
          <p className="text-center text-zinc-300 text-sm font-medium">
            Accede con tu cuenta
          </p>
          <GoogleButton />
        </div>

        <p className="text-center text-zinc-600 text-xs">
          Al continuar aceptas nuestros términos de servicio.
        </p>
      </div>
    </main>
  );
}
