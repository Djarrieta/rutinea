"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Breadcrumb from "@/app/components/Breadcrumb";
import type { RoutineBundle } from "@/types";

function validateBundle(
  data: unknown,
): { ok: true; bundle: RoutineBundle } | { ok: false; error: string } {
  if (!data || typeof data !== "object") {
    return { ok: false, error: "El JSON debe ser un objeto" };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.routine || typeof obj.routine !== "object") {
    return { ok: false, error: 'Falta el campo "routine"' };
  }

  const routine = obj.routine as Record<string, unknown>;
  if (typeof routine.name !== "string" || !routine.name) {
    return { ok: false, error: "routine.name es requerido" };
  }
  if (typeof routine.rest_secs !== "number") {
    return { ok: false, error: "routine.rest_secs debe ser un número" };
  }

  if (!Array.isArray(obj.sets) || obj.sets.length === 0) {
    return { ok: false, error: "Debe tener al menos un set" };
  }

  for (let si = 0; si < obj.sets.length; si++) {
    const set = obj.sets[si] as Record<string, unknown>;
    if (typeof set.name !== "string" || !set.name) {
      return { ok: false, error: `sets[${si}].name es requerido` };
    }
    if (typeof set.rounds !== "number" || set.rounds < 1) {
      return { ok: false, error: `sets[${si}].rounds debe ser >= 1` };
    }
    if (!Array.isArray(set.exercises) || set.exercises.length === 0) {
      return {
        ok: false,
        error: `sets[${si}] debe tener al menos un ejercicio`,
      };
    }

    for (let ei = 0; ei < set.exercises.length; ei++) {
      const ex = set.exercises[ei] as Record<string, unknown>;
      if (typeof ex.title !== "string" || !ex.title) {
        return {
          ok: false,
          error: `sets[${si}].exercises[${ei}].title es requerido`,
        };
      }
      if (typeof ex.preparation_secs !== "number") {
        return {
          ok: false,
          error: `sets[${si}].exercises[${ei}].preparation_secs debe ser un número`,
        };
      }
      if (typeof ex.duration_secs !== "number") {
        return {
          ok: false,
          error: `sets[${si}].exercises[${ei}].duration_secs debe ser un número`,
        };
      }
      if (typeof ex.repetitions !== "number") {
        return {
          ok: false,
          error: `sets[${si}].exercises[${ei}].repetitions debe ser un número`,
        };
      }
    }
  }

  return { ok: true, bundle: data as RoutineBundle };
}

export default function ImportRoutinePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setError(null);

    // 1. Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("JSON inválido — revisa la sintaxis");
      return;
    }

    // 2. Validate structure
    const result = validateBundle(parsed);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const { bundle } = result;
    setLoading(true);

    try {
      const supabase = createClient();

      // 3. Resolve exercises — verify existing IDs, create missing ones
      // Map "setIdx-exIdx" → resolved exercise_id
      const exerciseIdMap = new Map<string, string>();

      const idsToVerify = [
        ...new Set(
          bundle.sets.flatMap((s) =>
            s.exercises.filter((e) => e.id).map((e) => e.id!),
          ),
        ),
      ];

      if (idsToVerify.length > 0) {
        const { data: existing, error: fetchError } = await supabase
          .from("exercises")
          .select("id")
          .in("id", idsToVerify);

        if (fetchError) {
          setError("Error verificando ejercicios: " + fetchError.message);
          return;
        }

        const existingIds = new Set(existing?.map((e) => e.id));
        const missing = idsToVerify.filter((id) => !existingIds.has(id));
        if (missing.length > 0) {
          setError(`Ejercicios no encontrados: ${missing.join(", ")}`);
          return;
        }
      }

      // Create exercises that don't have an id
      for (let si = 0; si < bundle.sets.length; si++) {
        for (let ei = 0; ei < bundle.sets[si].exercises.length; ei++) {
          const ex = bundle.sets[si].exercises[ei];
          const key = `${si}-${ei}`;

          if (ex.id) {
            exerciseIdMap.set(key, ex.id);
          } else {
            const { data: created, error: createError } = await supabase
              .from("exercises")
              .insert({
                title: ex.title.toLowerCase(),
                description: ex.description?.toLowerCase() ?? null,
                images: ex.images ?? [],
                tags: ex.tags ?? [],
                preparation_secs: ex.preparation_secs,
                duration_secs: ex.duration_secs,
                repetitions: ex.repetitions,
              })
              .select("id")
              .single();

            if (createError || !created) {
              setError(
                `Error creando ejercicio "${ex.title}": ${createError?.message}`,
              );
              return;
            }
            exerciseIdMap.set(key, created.id);
          }
        }
      }

      // 4. Create sets and collect IDs
      const setEntries: { id: string; rounds: number }[] = [];

      for (let si = 0; si < bundle.sets.length; si++) {
        const bs = bundle.sets[si];

        const { data: newSet, error: setError } = await supabase
          .from("sets")
          .insert({
            name: bs.name.toLowerCase(),
            description: bs.description?.toLowerCase() ?? null,
          })
          .select("id")
          .single();

        if (setError || !newSet) {
          setError(`Error creando set "${bs.name}": ${setError?.message}`);
          return;
        }

        const exerciseRows = bs.exercises.map((_, ei) => ({
          set_id: newSet.id,
          exercise_id: exerciseIdMap.get(`${si}-${ei}`)!,
          position: ei,
        }));

        const { error: linkError } = await supabase
          .from("set_exercises")
          .insert(exerciseRows);

        if (linkError) {
          setError(
            `Error vinculando ejercicios al set "${bs.name}": ${linkError.message}`,
          );
          return;
        }

        setEntries.push({ id: newSet.id, rounds: bs.rounds });
      }

      // 5. Redirect to /routines/new with prefilled data
      const params = new URLSearchParams();
      params.set("name", bundle.routine.name);
      if (bundle.routine.description) {
        params.set("description", bundle.routine.description);
      }
      params.set("rest_secs", String(bundle.routine.rest_secs));
      params.set("set_entries", JSON.stringify(setEntries));

      router.push(`/routines/new?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: "Rutinas", href: "/routines" },
          { label: "Nueva Rutina", href: "/routines/new" },
          { label: "Importar" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Importar Rutina</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="json" className="block text-sm font-medium mb-1">
            Pega el JSON de la rutina
          </label>
          <textarea
            id="json"
            rows={16}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='{"routine": {"name": "...", ...}, "sets": [...]}'
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {error && (
          <div className="bg-danger-400/10 border border-danger-400/30 text-danger-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={loading || !text.trim()}
          className="bg-primary-500 text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? "Importando…" : "Validar e importar"}
        </button>
      </div>
    </div>
  );
}
