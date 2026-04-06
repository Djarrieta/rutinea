"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SetRow {
  exerciseName: string;
  setType: "reps" | "duration";
  reps: string;
  durationSeconds: string;
  restSeconds: string;
}

const emptySet: SetRow = {
  exerciseName: "",
  setType: "reps",
  reps: "",
  durationSeconds: "",
  restSeconds: "60",
};

export default function NewRoutineForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sets, setSets] = useState<SetRow[]>([{ ...emptySet }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addSet() {
    setSets((prev) => [...prev, { ...emptySet }]);
  }

  function removeSet(index: number) {
    setSets((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSet(index: number, field: keyof SetRow, value: string) {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (sets.length === 0) {
      setError("Agrega al menos un ejercicio.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 1. Upsert exercises by name (create if not exist)
    const exerciseIds: string[] = [];
    for (const set of sets) {
      if (!set.exerciseName.trim()) {
        setError("Todos los ejercicios deben tener un nombre.");
        setSaving(false);
        return;
      }

      // Check if exercise already exists for this user
      const { data: existing } = await supabase
        .from("exercises")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", set.exerciseName.trim())
        .single();

      if (existing) {
        exerciseIds.push(existing.id);
      } else {
        const { data: created, error: exErr } = await supabase
          .from("exercises")
          .insert({ user_id: user.id, name: set.exerciseName.trim() })
          .select("id")
          .single();
        if (exErr || !created) {
          setError(
            "Error al crear ejercicio: " + (exErr?.message ?? "desconocido"),
          );
          setSaving(false);
          return;
        }
        exerciseIds.push(created.id);
      }
    }

    // 2. Create routine
    const { data: routine, error: routineErr } = await supabase
      .from("routines")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        is_public: isPublic,
      })
      .select("id")
      .single();

    if (routineErr || !routine) {
      setError(
        "Error al crear rutina: " + (routineErr?.message ?? "desconocido"),
      );
      setSaving(false);
      return;
    }

    // 3. Create sets
    const setsToInsert = sets.map((s, i) => ({
      routine_id: routine.id,
      exercise_id: exerciseIds[i],
      position: i,
      reps: s.setType === "reps" ? parseInt(s.reps, 10) || null : null,
      duration_seconds:
        s.setType === "duration"
          ? parseInt(s.durationSeconds, 10) || null
          : null,
      rest_seconds: parseInt(s.restSeconds, 10) || 60,
    }));

    const { error: setsErr } = await supabase.from("sets").insert(setsToInsert);
    if (setsErr) {
      setError("Error al crear sets: " + setsErr.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Routine info */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nombre de la rutina"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-base text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        />
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-emerald-600 w-4 h-4"
          />
          Rutina pública
        </label>
      </div>

      {/* Sets */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Ejercicios</h2>
        {sets.map((set, i) => (
          <div
            key={i}
            className="bg-zinc-900/50 border border-zinc-700/60 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">
                #{i + 1}
              </span>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Eliminar
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Nombre del ejercicio"
              value={set.exerciseName}
              onChange={(e) => updateSet(i, "exerciseName", e.target.value)}
              required
              className="w-full bg-zinc-800/60 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 flex gap-1 rounded-lg bg-zinc-800/60 p-1">
                <button
                  type="button"
                  onClick={() => updateSet(i, "setType", "reps")}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
                    set.setType === "reps"
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Repeticiones
                </button>
                <button
                  type="button"
                  onClick={() => updateSet(i, "setType", "duration")}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
                    set.setType === "duration"
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Duración
                </button>
              </div>
              <div>
                <label className="text-xs text-zinc-400">
                  {set.setType === "reps" ? "Reps" : "Segundos"}
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="–"
                  value={
                    set.setType === "reps" ? set.reps : set.durationSeconds
                  }
                  onChange={(e) =>
                    updateSet(
                      i,
                      set.setType === "reps" ? "reps" : "durationSeconds",
                      e.target.value,
                    )
                  }
                  required
                  className="w-full bg-zinc-800/60 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Descanso (s)</label>
                <input
                  type="number"
                  min="0"
                  value={set.restSeconds}
                  onChange={(e) => updateSet(i, "restSeconds", e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSet}
          className="w-full border border-dashed border-zinc-600 text-zinc-300 rounded-xl py-3 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
        >
          + Agregar ejercicio
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold rounded-xl px-5 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Guardando…" : "Crear Rutina"}
      </button>
    </form>
  );
}
