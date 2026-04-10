import type { Exercise } from "@/types";

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
        <label htmlFor="image_urls" className="block text-sm font-medium mb-1">
          URLs de imágenes{" "}
          <span className="text-gray-400">(separadas por coma)</span>
        </label>
        <input
          id="image_urls"
          name="image_urls"
          type="text"
          defaultValue={exercise?.image_urls?.join(", ")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
        <label htmlFor="tips" className="block text-sm font-medium mb-1">
          Tips{" "}
          <span className="text-gray-400">
            (separados por coma, frases que se muestran sobre las imágenes)
          </span>
        </label>
        <input
          id="tips"
          name="tips"
          type="text"
          defaultValue={exercise?.tips?.join(", ")}
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
