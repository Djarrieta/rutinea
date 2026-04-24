import Image from "next/image";
import type { ExerciseImage } from "@/types";

interface Props {
  images: ExerciseImage[];
  currentImageIndex: number;
  currentRep: number;
  repetitions: number;
  /** Time elapsed in the current exercise (secs) */
  elapsed: number;
  /** Total duration of the current exercise including reps (secs) */
  totalDuration: number;
  description?: string | null;
  isPlaying: boolean;
}

export default function PlayerPhaseExercise({
  images,
  currentImageIndex,
  currentRep,
  repetitions,
  elapsed,
  totalDuration,
  description,
  isPlaying,
}: Props) {
  const remaining = Math.max(0, Math.ceil(totalDuration - elapsed));

  return (
    <>
      {images.length > 0 ? (
        <Image
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].description || "Exercise image"}
          fill
          unoptimized
          className="w-full h-full object-contain"
          loading="eager"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-text-faint">
          Sin imágenes
        </div>
      )}

      {/* Top overlay: rep badge (left) + timer pill (right) */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          {repetitions > 1 && (
            <span className="bg-primary-500/90 text-black text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
              Rep {currentRep}/{repetitions}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Image counter dots */}
          {images.length > 1 && (
            <div className="flex gap-1 items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-200 ${
                    i === currentImageIndex
                      ? "w-4 h-1.5 bg-primary-500"
                      : "w-1.5 h-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          {/* Timer pill */}
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold tabular-nums px-2.5 py-1 rounded-full">
            {remaining}s
          </span>
        </div>
      </div>

      {/* Bottom overlay: description */}
      {description && (
        <div className="absolute bottom-3 left-3 right-3 bg-black/50 backdrop-blur-md text-white text-sm px-3 py-2 rounded-xl text-center border border-white/5">
          {description}
        </div>
      )}

      {/* Paused overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 player-scale-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 text-white/80"
            >
              <path d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" />
            </svg>
            <span className="text-sm font-medium text-white/60">En pausa</span>
          </div>
        </div>
      )}
    </>
  );
}
