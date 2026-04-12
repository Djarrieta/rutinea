import PlanForm from "../PlanForm";
import { createPlan } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function NewPlanPage() {
  await requireAuth();

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Planes", href: "/plans" }, { label: "Nuevo Plan" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Nuevo Plan</h1>
      <PlanForm action={createPlan} submitLabel="Crear Plan" />
    </div>
  );
}
