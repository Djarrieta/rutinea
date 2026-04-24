import PlanForm from "../PlanForm";
import { createPlan } from "../actions";
import { requireAuth } from "@/lib/auth";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function NewPlanPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    description?: string;
    day_entries?: string;
  }>;
}) {
  await requireAuth();
  const { name, description, day_entries } = await searchParams;

  let defaultDayEntries: { day_of_week: number; routine_id: string }[] = [];
  if (day_entries) {
    try {
      defaultDayEntries = JSON.parse(day_entries);
    } catch {
      /* ignore bad JSON */
    }
  }

  const defaultValues =
    name || description
      ? { name: name ?? "", description: description ?? null }
      : undefined;

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Planes", href: "/plans" }, { label: "Nuevo Plan" }]}
      />
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Nuevo Plan</h1>

      </div>
      <PlanForm
        action={createPlan}
        submitLabel="Crear Plan"
        defaultDayEntries={defaultDayEntries}
        defaultValues={defaultValues}
      />
    </div>
  );
}
