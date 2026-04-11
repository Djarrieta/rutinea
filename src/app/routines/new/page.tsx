import RoutineForm from "../RoutineForm";
import { createRoutine } from "../actions";
import { requireAuth } from "@/lib/auth";

export default async function NewRoutinePage() {
  await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Rutina</h1>
      <RoutineForm action={createRoutine} submitLabel="Crear Rutina" />
    </div>
  );
}
