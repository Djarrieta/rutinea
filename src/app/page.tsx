import Image from "next/image";
import Link from "next/link";

const modules = [
  {
    title: "Planes",
    href: "/plans",
    description:
      "Organiza tus rutinas en un plan semanal. Asigna rutinas a cada día de la semana y sigue un programa de entrenamiento estructurado.",
    image: "/images/plans-illustration.svg",
  },
  {
    title: "Rutinas",
    href: "/routines",
    description:
      "Combina múltiples sets en una rutina completa. Las rutinas son tu plan de entrenamiento de principio a fin: solo dale play y sigue las instrucciones.",
    image: "/images/routines-illustration.svg",
  },
  {
    title: "Sets",
    href: "/sets",
    description:
      "Agrupa ejercicios en sets para crear circuitos o bloques de trabajo. Configura cuántas rondas repetir y organiza la secuencia de ejercicios dentro de cada set.",
    image: "/images/sets-illustration.svg",
  },
  {
    title: "Ejercicios",
    href: "/exercises",
    description:
      "Crea y organiza tus ejercicios individuales. Define nombre, descripción, duración o repeticiones, y tiempos de descanso. Son los bloques fundamentales de tu entrenamiento.",
    image: "/images/exercises-illustration.svg",
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-bg to-accent-500/10 -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />

        <div className="text-center space-y-6 relative">
          <div className="w-full">
            <Image
              src="/images/hero-illustration.svg"
              alt="Ilustración de entrenamiento"
              width={1200}
              height={400}
              priority
              className="w-full h-auto"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
            Rutinea
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Diseña tus ejercicios, agrúpalos en sets, arma rutinas y organízalas
            en planes semanales. Luego solo dale play y entrena con un
            temporizador guiado que te lleva paso a paso.
          </p>
          <p className="text-2xl sm:text-3xl font-bold max-w-2xl mx-auto bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent drop-shadow-lg">
            Comparte tus rutinas con amigos y entrenen juntos.
          </p>
        </div>
      </section>

      {/* Workflow visual */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          De ejercicio a plan en 4 pasos
        </h2>
        <div className="overflow-x-auto pb-2">
          <div className="mx-auto max-w-3xl">
            <Image
              src="/images/workflow-illustration.svg"
              alt="Flujo: Ejercicios → Sets → Rutinas → Planes"
              width={800}
              height={120}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Module cards */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">¿Cómo funciona?</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group block rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/40 transition-all duration-300"
            >
              <div className="p-4 flex justify-center bg-gradient-to-b from-primary-500/10 to-surface">
                <Image
                  src={mod.image}
                  alt={mod.title}
                  width={200}
                  height={200}
                  className="w-32 h-32 sm:w-40 sm:h-40 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 pt-2">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {mod.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative rounded-2xl overflow-hidden mx-auto max-w-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />
        <div className="relative text-center space-y-4 px-4 py-8 sm:px-8 sm:py-12">
          <h2 className="text-2xl font-semibold text-white">Empieza ahora</h2>
          <p className="text-primary-100 max-w-xl mx-auto">
            Crea tu primer ejercicio, agrúpalo en un set, arma tu rutina y
            organízala en un plan semanal. En minutos estarás entrenando.
          </p>
          <div className="flex justify-center gap-3 flex-wrap pt-2">
            <Link
              href="/exercises/new"
              className="inline-flex items-center gap-2 bg-black text-primary-400 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-bg transition shadow-md"
            >
              + Crear ejercicio
            </Link>
            <Link
              href="/routines"
              className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-400 transition border border-primary-400"
            >
              Ver rutinas
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer for bottom nav */}
      <div className="h-4" />
    </div>
  );
}
