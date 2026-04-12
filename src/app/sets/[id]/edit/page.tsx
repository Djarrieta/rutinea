import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import SetForm from "../../SetForm";
import { updateSet } from "../../actions";
import Breadcrumb from "@/app/components/Breadcrumb";
import type { SetWithExercises } from "@/types";

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const supabase = await createClient();
  const { data: set } = await supabase
    .from("sets")
    .select("*, set_exercises(*, exercise:exercises(*))")
    .eq("id", id)
    .single<SetWithExercises>();

  if (!set || set.user_id !== user.id) notFound();

  const updateWithId = updateSet.bind(null, id);

  const exerciseIds = [...set.set_exercises]
    .sort((a, b) => a.position - b.position)
    .map((se) => se.exercise_id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Sets", href: "/sets" },
          { label: set.name, href: `/sets/${id}` },
          { label: "Editar" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Editar Set</h1>
      <SetForm
        set={set}
        defaultExerciseIds={exerciseIds}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
