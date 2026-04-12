import Link from "next/link";

const modules = [
  {
    title: "Planes",
    href: "/plans",
    description:
      "Organiza tus rutinas en un plan semanal. Asigna rutinas a cada día de la semana y sigue un programa de entrenamiento estructurado.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path
          fillRule="evenodd"
          d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Rutinas",
    href: "/routines",
    description:
      "Combina múltiples sets en una rutina completa. Las rutinas son tu plan de entrenamiento de principio a fin: solo dale play y sigue las instrucciones.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Sets",
    href: "/sets",
    description:
      "Agrupa ejercicios en sets para crear circuitos o bloques de trabajo. Configura cuántas rondas repetir y organiza la secuencia de ejercicios dentro de cada set.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zM4.5 4a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11z" />
        <path d="M6 7.5A.5.5 0 016.5 7h7a.5.5 0 010 1h-7A.5.5 0 016 7.5zM6 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zM6.5 13a.5.5 0 000 1h4a.5.5 0 000-1h-4z" />
      </svg>
    ),
  },
  {
    title: "Ejercicios",
    href: "/exercises",
    description:
      "Crea y organiza tus ejercicios individuales. Define nombre, descripción, duración o repeticiones, y tiempos de descanso. Son los bloques fundamentales de tu entrenamiento.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path
          fillRule="evenodd"
          d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75zm-2-3.5a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75zm-1-3.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Rutinea
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Diseña tus ejercicios, agrúpalos en sets, arma rutinas y organízalas
          en planes semanales. Luego solo dale play y entrena con un
          temporizador guiado que te lleva paso a paso.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">¿Cómo funciona?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              <div className="text-indigo-600 mb-3">{mod.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {mod.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="text-center space-y-4 pb-8">
        <h2 className="text-2xl font-semibold">Empieza ahora</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Crea tu primer ejercicio, agrúpalo en un set, arma tu rutina y
          organízala en un plan semanal. En minutos estarás entrenando.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/exercises/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            + Crear ejercicio
          </Link>
          <Link
            href="/routines"
            className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
          >
            Ver rutinas
          </Link>
        </div>
      </section>
    </div>
  );
}
