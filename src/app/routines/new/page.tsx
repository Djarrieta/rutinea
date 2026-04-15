import RoutineForm from "../RoutineForm";
import { createRoutine } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

export default async function NewRoutinePage({
  searchParams,
}: {
  searchParams: Promise<{
    sets?: string;
    set_entries?: string;
    name?: string;
    description?: string;
    rest_secs?: string;
  }>;
}) {
  await requireAuth();
  const { sets, set_entries, name, description, rest_secs } =
    await searchParams;

  let defaultSetEntries: { id: string; rounds: number }[] = [];
  if (set_entries) {
    try {
      defaultSetEntries = JSON.parse(set_entries);
    } catch {
      /* ignore bad JSON */
    }
  } else if (sets) {
    defaultSetEntries = sets
      .split(",")
      .filter(Boolean)
      .map((id) => ({ id, rounds: 1 }));
  }

  const defaultRoutine = (name || description || rest_secs)
    ? {
        name: name ?? "",
        description: description ?? null,
        rest_secs: rest_secs ? Number(rest_secs) : 60,
      }
    : undefined;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Rutinas", href: "/routines" },
          { label: "Nueva Rutina" },
        ]}
      />
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Nueva Rutina</h1>
        <Link
          href="/routines/import"
          className="flex items-center gap-1.5 bg-surface-2 text-text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-3 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          Importar JSON
        </Link>
      </div>
      <RoutineForm
        action={createRoutine}
        submitLabel="Crear Rutina"
        defaultSetEntries={defaultSetEntries}
        defaultValues={defaultRoutine}
      />
    </div>
  );
}
