"use client";

import { useState } from "react";
import type { Exercise, ExerciseImage } from "@/types";

function ImageListInput({ defaultValue }: { defaultValue: ExerciseImage[] }) {
  const [items, setItems] = useState<ExerciseImage[]>(
    defaultValue.length > 0 ? defaultValue : [{ url: "", description: "" }],
  );

  const update = (index: number, field: keyof ExerciseImage, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    );
  };

  const add = () => setItems((prev) => [...prev, { url: "", description: "" }]);

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const serialised = items.filter((it) => it.url.trim() !== "");

  return (
    <div className="space-y-3">
      <input type="hidden" name="images" value={JSON.stringify(serialised)} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <input
              type="url"
              placeholder="URL de imagen"
              value={item.url}
              onChange={(e) => update(i, "url", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Descripción / tip"
              value={item.description}
              onChange={(e) => update(i, "description", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 text-lg leading-none mt-2"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-blue-600 hover:underline"
      >
        + Agregar imagen
      </button>
    </div>
  );
}

interface Props {
  exercise?: Exercise;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function ExerciseForm({ exercise, action, submitLabel }: Props) {
  return (
    <form action={action} className="space-y-5 max-w-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={exercise?.title}
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
          defaultValue={exercise?.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Imágenes{" "}
          <span className="text-gray-400">(URL y descripción por imagen)</span>
        </label>
        <ImageListInput defaultValue={exercise?.images ?? []} />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Etiquetas{" "}
          <span className="text-gray-400">
            (separadas por coma, ej. banco, barra, colchoneta)
          </span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={exercise?.tags?.join(", ")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="duration_secs"
          className="block text-sm font-medium mb-1"
        >
          Duración (segundos)
        </label>
        <input
          id="duration_secs"
          name="duration_secs"
          type="number"
          min={0}
          defaultValue={exercise?.duration_secs ?? 0}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="repetitions" className="block text-sm font-medium mb-1">
          Repeticiones
        </label>
        <input
          id="repetitions"
          name="repetitions"
          type="number"
          min={1}
          defaultValue={exercise?.repetitions ?? 1}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
