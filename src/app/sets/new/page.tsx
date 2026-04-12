import SetForm from "../SetForm";
import { createSet } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function NewSetPage() {
  await requireAuth();

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Sets", href: "/sets" }, { label: "Nuevo Set" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Nuevo Set</h1>
      <SetForm action={createSet} submitLabel="Crear Set" />
    </div>
  );
}
