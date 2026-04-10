import ExerciseForm from "../ExerciseForm";
import { createExercise } from "../actions";

export default function NewExercisePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Exercise</h1>
      <ExerciseForm action={createExercise} submitLabel="Create Exercise" />
    </div>
  );
}
