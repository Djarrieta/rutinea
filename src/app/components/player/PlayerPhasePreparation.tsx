import Image from "next/image";
import type { ExerciseImage } from "@/types";
import { RING_RADIUS, RING_CIRCUMFERENCE } from "./constants";

interface Props {
  elapsed: number;
  totalSecs: number;
  /** Optional exercise title to show below countdown (used in set/routine modals) */
  exerciseTitle?: string;
  images?: ExerciseImage[];
  currentImageIndex?: number;
}

export default function PlayerPhasePreparation({
  elapsed,
  totalSecs,
  exerciseTitle,
  images = [],
  currentImageIndex = 0,
}: Props) {
  const progress = totalSecs > 0 ? 1 - elapsed / totalSecs : 0;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, Math.ceil(totalSecs - elapsed));

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 player-scale-in">
      <div className="relative w-40 h-40 player-pulse-glow rounded-full">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-surface-hover"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-primary-500 transition-[stroke-dashoffset] duration-100"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            key={remaining}
            className="text-5xl font-bold tabular-nums text-primary-500 player-tick-pulse"
          >
            {remaining}
          </span>
        </div>
      </div>
      <p className="text-base font-semibold text-text-secondary tracking-wide">
        ¡Prepárate!
      </p>
      {exerciseTitle && (
        <p className="text-sm text-text-muted">{exerciseTitle}</p>
      )}
      {images.length > 0 && (
        <div className="w-full max-w-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin">
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className={`flex-shrink-0 rounded-2xl overflow-hidden border transition-all ${
                  index === currentImageIndex
                    ? "border-primary-500 ring-2 ring-primary-500/20"
                    : "border-border"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.description ?? `Imagen ${index + 1}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
