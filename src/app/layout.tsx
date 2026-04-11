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
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16 sm:pb-0">
        {/* Desktop top nav */}
        <nav className="hidden sm:block bg-white border-b border-gray-200 px-6 py-4">
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

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around items-center h-14">
            <a
              href="/exercises"
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 px-3 py-1"
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
            </a>
            <a
              href="/sets"
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 px-3 py-1"
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
            </a>
            <a
              href="/routines"
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-900 px-3 py-1"
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
            </a>
            <a
              href="/routines/new"
              className="flex flex-col items-center gap-0.5 text-blue-600 hover:text-blue-700 px-3 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span className="text-[10px] font-medium">Crear</span>
            </a>
          </div>
        </nav>
      </body>
    </html>
  );
}
