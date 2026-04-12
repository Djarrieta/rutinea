"use client";

import { useState, useEffect } from "react";
import type { Plan, Routine } from "@/types";
import { DAY_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";
import SearchableSelect from "@/app/components/SearchableSelect";

interface DayEntry {
  day_of_week: number;
  routine_id: string;
}

function DayRoutinePicker({ defaultValue }: { defaultValue: DayEntry[] }) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [entries, setEntries] = useState<DayEntry[]>(defaultValue);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("routines")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setRoutines(data as Routine[]);
      });
  }, []);

  const usedDays = new Set(entries.map((e) => e.day_of_week));

  const addEntry = (routineId: string) => {
    if (selectedDay === null) return;
    setEntries((prev) => [
      ...prev,
      { day_of_week: selectedDay, routine_id: routineId },
    ]);
    setSelectedDay(null);
  };

  const remove = (day: number) =>
    setEntries((prev) => prev.filter((e) => e.day_of_week !== day));

  const sortedEntries = [...entries].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  );

  const entryWithRoutine = sortedEntries
    .map((e) => ({
      ...e,
      routine: routines.find((r) => r.id === e.routine_id),
    }))
    .filter((e) => e.routine) as (DayEntry & { routine: Routine })[];

  const availableDays = DAY_LABELS.map((label, i) => ({
    value: i,
    label,
  })).filter((d) => !usedDays.has(d.value));

  return (
    <div className="space-y-3">
      <input type="hidden" name="day_entries" value={JSON.stringify(entries)} />

      {entryWithRoutine.length > 0 && (
        <ul className="space-y-2">
          {entryWithRoutine.map((e) => (
            <li
              key={e.day_of_week}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <span className="font-semibold w-24">
                {DAY_LABELS[e.day_of_week]}
              </span>
              <span className="flex-1">{e.routine.name}</span>
              <button
                type="button"
                onClick={() => remove(e.day_of_week)}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      {availableDays.length > 0 && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Día</label>
            <select
              value={selectedDay ?? ""}
              onChange={(e) =>
                setSelectedDay(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar día…</option>
              {availableDays.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Rutina</label>
            <SearchableSelect
              options={routines.map((r) => ({ id: r.id, label: r.name }))}
              onSelect={addEntry}
              placeholder="+ Agregar rutina…"
              loading={routines.length === 0}
              disabled={selectedDay === null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  plan?: Plan;
  defaultDayEntries?: DayEntry[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function PlanForm({
  plan,
  defaultDayEntries = [],
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
          defaultValue={plan?.name}
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
          defaultValue={plan?.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Rutinas por día
        </label>
        <DayRoutinePicker defaultValue={defaultDayEntries} />
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
