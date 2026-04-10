import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rutinea",
  description: "App de ejercicios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/" className="text-xl font-bold">
                Rutinea
              </a>
              <div className="flex gap-4 text-sm">
                <a
                  href="/exercises"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Ejercicios
                </a>
                <a href="/sets" className="text-gray-600 hover:text-gray-900">
                  Sets
                </a>
                <a
                  href="/routines"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Rutinas
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/exercises/new"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
              >
                + Ejercicio
              </a>
              <a
                href="/sets/new"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
              >
                + Set
              </a>
              <a
                href="/routines/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                + Rutina
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
