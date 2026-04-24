import RoutineForm from "../RoutineForm";
import { createRoutine } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

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

  const defaultRoutine =
    name || description || rest_secs
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
