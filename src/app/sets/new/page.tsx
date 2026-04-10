import SetForm from "../SetForm";
import { createSet } from "../actions";

export default function NewSetPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Set</h1>
      <SetForm action={createSet} submitLabel="Crear Set" />
    </div>
  );
}
