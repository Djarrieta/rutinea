import RoutineForm from "../RoutineForm";
import { createRoutine } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function NewRoutinePage({
  searchParams,
}: {
  searchParams: Promise<{ sets?: string }>;
}) {
  await requireAuth();
  const { sets } = await searchParams;
  const defaultSetEntries = sets
    ? sets
        .split(",")
        .filter(Boolean)
        .map((id) => ({ id, rounds: 1 }))
    : [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Rutinas", href: "/routines" },
          { label: "Nueva Rutina" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Nueva Rutina</h1>
      <RoutineForm
        action={createRoutine}
        submitLabel="Crear Rutina"
        defaultSetEntries={defaultSetEntries}
      />
    </div>
  );
}
