import ExerciseForm from "../ExerciseForm";
import { createExercise } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function NewExercisePage() {
  await requireAuth();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Ejercicios", href: "/exercises" },
          { label: "Nuevo Ejercicio" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Nuevo Ejercicio</h1>
      <ExerciseForm action={createExercise} submitLabel="Crear Ejercicio" />
    </div>
  );
}
