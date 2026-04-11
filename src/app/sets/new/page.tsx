import SetForm from "../SetForm";
import { createSet } from "../actions";
import { requireAuth } from "@/lib/auth";

export default async function NewSetPage() {
  await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Set</h1>
      <SetForm action={createSet} submitLabel="Crear Set" />
    </div>
  );
}
