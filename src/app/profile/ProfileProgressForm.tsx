"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MAX_DESCRIPTION_LENGTH } from "@/lib/constants";
import { uploadProgressImage } from "@/lib/supabase/storage";

interface ProgressImageItem {
  url: string;
  uploading?: boolean;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-primary-600 disabled:opacity-60"
    >
      {pending ? "Guardando..." : "Guardar progreso"}
    </button>
  );
}

export default function ProfileProgressForm({ action }: Props) {
  const [items, setItems] = useState<ProgressImageItem[]>([{ url: "" }]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const addImageSlot = () => {
    setItems((prev) => {
      if (prev.length >= 2) return prev;
      return [...prev, { url: "" }];
    });
  };

  const removeImageSlot = (index: number) => {
    setItems((prev) => {
      if (prev.length === 1) {
        return [{ url: "" }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleFileUpload = async (index: number, file: File) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, uploading: true } : item,
      ),
    );

    try {
      const url = await uploadProgressImage(file);
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, url, uploading: false } : item,
        ),
      );
    } catch (error) {
      alert(
        `Error al subir imagen: ${error instanceof Error ? error.message : error}`,
      );
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, uploading: false } : item,
        ),
      );
    }
  };

  const imageUrls = items
    .map((item) => item.url.trim())
    .filter((url) => url.length > 0)
    .slice(0, 2);

  return (
    <form action={action} className="space-y-4">
      <input
        type="hidden"
        name="image_urls"
        value={JSON.stringify(imageUrls)}
      />

      <div className="flex items-center justify-between rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm">
        <span className="text-text-secondary">Fecha</span>
        <span className="font-medium text-text">{todayLabel}</span>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-text-secondary"
        >
          Nota
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="Ej: 72.4 kg, hoy me senti mas fuerte y con mejor tecnica."
          className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">
          Imagenes (maximo 2)
        </p>
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-bg/50 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={(element) => {
                  fileInputRefs.current[index] = element;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleFileUpload(index, file);
                  }
                }}
              />
              <button
                type="button"
                disabled={item.uploading}
                onClick={() => fileInputRefs.current[index]?.click()}
                className="rounded-md border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface disabled:opacity-60"
              >
                {item.uploading
                  ? "Subiendo..."
                  : item.url
                    ? "Cambiar imagen"
                    : "Subir imagen"}
              </button>

              {(item.url || items.length > 1) && (
                <button
                  type="button"
                  onClick={() => removeImageSlot(index)}
                  className="rounded-md px-2 py-2 text-sm text-danger-400 hover:text-danger-600"
                >
                  Quitar
                </button>
              )}
            </div>

            {item.url && (
              <div className="mt-3">
                <Image
                  src={item.url}
                  alt={`Imagen de progreso ${index + 1}`}
                  width={420}
                  height={240}
                  unoptimized
                  className="h-36 w-full rounded-md object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {items.length < 2 && (
          <button
            type="button"
            onClick={addImageSlot}
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            + Agregar otra imagen
          </button>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
