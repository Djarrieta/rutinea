import ExerciseForm from "../ExerciseForm";
import { createExercise } from "../actions";

export default function NewExercisePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Ejercicio</h1>
      <ExerciseForm action={createExercise} submitLabel="Crear Ejercicio" />
    </div>
  );
}
