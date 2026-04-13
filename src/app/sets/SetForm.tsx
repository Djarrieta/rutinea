"use client";

import { useState, useEffect } from "react";
import type { Set as ExSet, Exercise } from "@/types";
import { createClient } from "@/lib/supabase/client";
import SearchableSelect from "@/app/components/SearchableSelect";
import { properCase } from "@/lib/format";

function ExercisePicker({ defaultValue }: { defaultValue: string[] }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<string[]>(defaultValue);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("exercises")
      .select("*")
      .order("title")
      .then(({ data }) => {
        if (data) setExercises(data as Exercise[]);
      });
  }, []);

  const add = (id: string) => {
    setSelected((prev) => [...prev, id]);
  };

  const remove = (index: number) =>
    setSelected((prev) => prev.filter((_, i) => i !== index));

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === selected.length - 1) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const selectedExercises = selected
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean) as Exercise[];

  return (
    <div className="space-y-3">
      <input
        type="hidden"
        name="exercise_ids"
        value={JSON.stringify(selected)}
      />

      {selectedExercises.length > 0 && (
        <ul className="space-y-2">
          {selectedExercises.map((ex, i) => (
            <li
              key={`${ex.id}-${i}`}
              className="flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-text-faint font-mono text-xs w-5 text-center">
                {i + 1}
              </span>
              <span className="flex-1">{properCase(ex.title)}</span>
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="text-text-faint hover:text-text-secondary disabled:opacity-30 text-xs"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === selectedExercises.length - 1}
                className="text-text-faint hover:text-text-secondary disabled:opacity-30 text-xs"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-danger-400 hover:text-danger-600 text-lg leading-none"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <SearchableSelect
        options={exercises.map((e) => ({
          id: e.id,
          label: properCase(e.title),
        }))}
        onSelect={add}
        placeholder="+ Agregar ejercicio…"
        loading={exercises.length === 0}
      />
    </div>
  );
}

interface Props {
  set?: ExSet;
  defaultExerciseIds?: string[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function SetForm({
  set,
  defaultExerciseIds = [],
  action,
  submitLabel,
}: Props) {
  return (
    <form action={action} className="space-y-5 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={set?.name}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={set?.description ?? ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ejercicios</label>
        <ExercisePicker defaultValue={defaultExerciseIds} />
      </div>

      <button
        type="submit"
        className="bg-primary-500 text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}
