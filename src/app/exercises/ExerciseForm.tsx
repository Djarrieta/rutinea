"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Exercise, ExerciseImage } from "@/types";
import { uploadExerciseImage } from "@/lib/supabase/storage";

interface ImageItem extends ExerciseImage {
  uploading?: boolean;
}

function ImageListInput({ defaultValue }: { defaultValue: ExerciseImage[] }) {
  const [items, setItems] = useState<ImageItem[]>(
    defaultValue.length > 0 ? defaultValue : [{ url: "", description: "" }],
  );
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (index: number, field: keyof ExerciseImage, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    );
  };

  const add = () => setItems((prev) => [...prev, { url: "", description: "" }]);

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleFileUpload = async (index: number, file: File) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, uploading: true } : it)),
    );
    try {
      const url = await uploadExerciseImage(file);
      setItems((prev) =>
        prev.map((it, i) =>
          i === index ? { ...it, url, uploading: false } : it,
        ),
      );
    } catch (err) {
      alert(
        `Error al subir imagen: ${err instanceof Error ? err.message : err}`,
      );
      setItems((prev) =>
        prev.map((it, i) => (i === index ? { ...it, uploading: false } : it)),
      );
    }
  };

  const serialised = items
    .filter((it) => it.url.trim() !== "")
    .map(({ url, description }) => ({ url, description }));

  return (
    <div className="space-y-3">
      <input type="hidden" name="images" value={JSON.stringify(serialised)} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="URL de imagen"
                value={item.url}
                onChange={(e) => update(i, "url", e.target.value)}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                ref={(el) => {
                  fileInputRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(i, file);
                }}
              />
              <button
                type="button"
                disabled={item.uploading}
                onClick={() => fileInputRefs.current[i]?.click()}
                className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-bg disabled:opacity-50"
              >
                {item.uploading ? "Subiendo…" : "📁"}
              </button>
            </div>
            {item.url && (
              <Image
                src={item.url}
                alt={item.description || "preview"}
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 object-contain rounded-lg border border-border bg-surface-alt"
              />
            )}
            <input
              type="text"
              placeholder="Descripción / tip"
              value={item.description}
              onChange={(e) => update(i, "description", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-danger-400 hover:text-danger-600 text-lg leading-none mt-2"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-primary-600 hover:underline"
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
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Imágenes{" "}
          <span className="text-text-faint">
            (sube un archivo o pega una URL)
          </span>
        </label>
        <ImageListInput defaultValue={exercise?.images ?? []} />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Etiquetas{" "}
          <span className="text-text-faint">
            (separadas por coma, ej. banco, barra, colchoneta)
          </span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={exercise?.tags?.join(", ")}
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label
          htmlFor="preparation_secs"
          className="block text-sm font-medium mb-1"
        >
          Segundos de preparación
        </label>
        <input
          id="preparation_secs"
          name="preparation_secs"
          type="number"
          min={0}
          defaultValue={exercise?.preparation_secs ?? 0}
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label
          htmlFor="duration_secs"
          className="block text-sm font-medium mb-1"
        >
          Segundos por repetición
        </label>
        <input
          id="duration_secs"
          name="duration_secs"
          type="number"
          min={0}
          defaultValue={exercise?.duration_secs ?? 0}
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
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
