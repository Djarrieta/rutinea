import { ReactNode } from "react";

interface PlayerControlsProps {
  /** Left side content — typically timer info */
  statusContent: ReactNode;
  finished: boolean;
  isPlaying: boolean;
  onRestart: () => void;
  onTogglePlay: () => void;
}

export default function PlayerControls({
  statusContent,
  finished,
  isPlaying,
  onRestart,
  onTogglePlay,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">{statusContent}</div>
      <div className="flex items-center gap-2">
        {finished ? (
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 bg-primary-500 text-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.312.311a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm-1.768-7.322a.75.75 0 0 0-.53-.22H9.38a.75.75 0 0 0 0 1.5h2.433l-.312.311a5.5 5.5 0 0 0-9.201 2.466.75.75 0 0 1-1.449-.39A7 7 0 0 1 12.613 4.63l.312-.311V2.285a.75.75 0 0 0 .22-.53Z"
                clipRule="evenodd"
              />
            </svg>
            Repetir
          </button>
        ) : (
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 bg-surface-alt px-4 py-1.5 rounded-lg text-sm hover:bg-surface-hover transition-colors"
          >
            {isPlaying ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                </svg>
                Reanudar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
