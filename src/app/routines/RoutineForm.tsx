"use client";

import { useState, useEffect } from "react";
import type { Routine, Set as ExSet } from "@/types";
import { createClient } from "@/lib/supabase/client";
import SearchableSelect from "@/app/components/SearchableSelect";

interface SelectedSet {
  id: string;
  rounds: number;
}

function SetPicker({ defaultValue }: { defaultValue: SelectedSet[] }) {
  const [sets, setSets] = useState<ExSet[]>([]);
  const [selected, setSelected] = useState<SelectedSet[]>(defaultValue);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sets")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setSets(data as ExSet[]);
      });
  }, []);

  const add = (id: string) => {
    setSelected((prev) => [...prev, { id, rounds: 1 }]);
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

  const setRounds = (index: number, rounds: number) => {
    setSelected((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, rounds: Math.max(1, rounds) } : s,
      ),
    );
  };

  const selectedSets = selected
    .map((sel) => ({ ...sel, set: sets.find((s) => s.id === sel.id) }))
    .filter((s) => s.set) as (SelectedSet & { set: ExSet })[];

  return (
    <div className="space-y-3">
      <input
        type="hidden"
        name="set_entries"
        value={JSON.stringify(selected)}
      />

      {selectedSets.length > 0 && (
        <ul className="space-y-2">
          {selectedSets.map((s, i) => (
            <li
              key={`${s.id}-${i}`}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-gray-400 font-mono text-xs w-5 text-center">
                {i + 1}
              </span>
              <span className="flex-1">{s.set.name}</span>
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="number"
                  min={1}
                  value={s.rounds}
                  onChange={(e) => setRounds(i, Number(e.target.value))}
                  className="w-12 rounded border border-gray-300 px-1.5 py-0.5 text-center text-xs"
                />
                rondas
              </label>
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === selectedSets.length - 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <SearchableSelect
        options={sets.map((s) => ({ id: s.id, label: s.name }))}
        onSelect={add}
        placeholder="+ Agregar set…"
        loading={sets.length === 0}
      />
    </div>
  );
}

interface Props {
  routine?: Routine;
  defaultSetEntries?: SelectedSet[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function RoutineForm({
  routine,
  defaultSetEntries = [],
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
          defaultValue={routine?.name}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          defaultValue={routine?.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="rest_secs" className="block text-sm font-medium mb-1">
          Descanso entre sets (segundos)
        </label>
        <input
          id="rest_secs"
          name="rest_secs"
          type="number"
          min={0}
          defaultValue={routine?.rest_secs ?? 60}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sets</label>
        <SetPicker defaultValue={defaultSetEntries} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
