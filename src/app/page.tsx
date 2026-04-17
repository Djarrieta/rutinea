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
    <div className="space-y-24 pb-12">
      {/* Hero */}
      <section className="relative pt-12 pb-8 px-4 sm:px-0">
        <div className="text-center space-y-10 relative">
          <div className="w-full max-w-3xl mx-auto animate-in" style={{ animationDelay: '0s' }}>
            <Image
              src="/images/hero-illustration.svg"
              alt="Ilustración de entrenamiento"
              width={1200}
              height={400}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 bg-clip-text text-transparent animate-in inline-block" style={{ animationDelay: '0.1s' }}>
              Rutinea
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-in font-medium" style={{ animationDelay: '0.2s' }}>
              Diseña tus propios entrenamientos con absoluta libertad o
              <span className="text-primary-400"> clona planes de otros y edítalos a tu medida.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/exercises/new"
              className="px-8 py-4 bg-primary-500 text-black rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 shadow-xl"
            >
              Empezar gratis
            </Link>
            <Link
              href="/routines"
              className="px-8 py-4 bg-surface-alt text-text-secondary rounded-2xl font-bold text-lg border border-white/5 hover:bg-surface-hover hover:text-white transition-all active:scale-95 shadow-lg"
            >
              Explorar rutinas
            </Link>
          </div>

          <p className="text-2xl font-bold max-w-2xl mx-auto bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent animate-in" style={{ animationDelay: '0.4s' }}>
            Comparte tu progreso y desafía a tus amigos.
          </p>
        </div>
      </section>

      {/* Workflow visual */}
      <section className="space-y-10 animate-in" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-3xl font-black text-center tracking-tight">
          Tu flujo de entrenamiento
        </h2>
        <div className="relative group p-8 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-3xl relative z-10">
            <Image
              src="/images/workflow-illustration.svg"
              alt="Flujo: Ejercicios → Sets → Rutinas → Planes"
              width={800}
              height={120}
              className="w-full h-auto drop-shadow-lg group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Module cards */}
      <section className="space-y-12 animate-in" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-3xl font-black text-center tracking-tight">Herramientas Pro</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {modules.map((mod, idx) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group relative block rounded-[2rem] border border-white/[0.08] bg-surface overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary-500/30 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
            >
              <div className="p-8 pb-4 flex justify-center bg-gradient-to-b from-primary-500/10 via-surface to-surface">
                <Image
                  src={mod.image}
                  alt={mod.title}
                  width={200}
                  height={200}
                  className="w-36 h-36 sm:w-44 sm:h-44 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
                />
              </div>
              <div className="p-8 pt-4">
                <h3 className="text-2xl font-black mb-3 group-hover:text-primary-400 transition-colors tracking-tight">
                  {mod.title}
                </h3>
                <p className="text-text-secondary leading-relaxed font-medium">
                  {mod.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <div className="p-2 rounded-full bg-primary-500 text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community / Clone Highlight */}
      <section className="relative py-12 px-8 rounded-[2.5rem] bg-surface border border-white/5 overflow-hidden group animate-in" style={{ animationDelay: '0.8s' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] -z-10 group-hover:bg-primary-500/20 transition-colors duration-700" />
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black tracking-tight">Comunidad & Clonación</h2>
            <p className="text-lg text-text-secondary leading-relaxed font-medium">
              ¿No sabes por dónde empezar? Explora la biblioteca de planes creados por otros atletas.
              <span className="text-white"> Con un solo clic puedes clonar cualquier plan</span>, adaptarlo a tu nivel y hacerlo tuyo. Tu entrenamiento, tus reglas.
            </p>
            <div className="flex gap-4">
              <Link href="/plans" className="text-primary-400 font-bold hover:underline inline-flex items-center gap-2">
                Explorar biblioteca
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-64 aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl border border-white/5 flex items-center justify-center relative">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-primary-400/80 drop-shadow-glow">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
              <div className="absolute inset-0 bg-primary-500/5 blur-xl -z-1" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative rounded-[3rem] overflow-hidden mx-auto max-w-4xl shadow-2xl group animate-in" style={{ animationDelay: '0.9s' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 via-primary-700 to-accent-600 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative text-center space-y-8 px-6 py-12 sm:px-12 sm:py-20">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">¿Listo para entrenar?</h2>
          <p className="text-primary-100 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Únete a otros atletas que ya están transformando su rutina. Sin complicaciones, sin distracciones, solo resultados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/exercises/new"
              className="inline-flex items-center justify-center gap-2 bg-black/90 text-primary-400 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-black transition-all hover:scale-105 shadow-xl"
            >
              Crear primer ejercicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
