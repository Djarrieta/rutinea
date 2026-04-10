import RoutineForm from "../RoutineForm";
import { createRoutine } from "../actions";

export default function NewRoutinePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Rutina</h1>
      <RoutineForm action={createRoutine} submitLabel="Crear Rutina" />
    </div>
  );
}
