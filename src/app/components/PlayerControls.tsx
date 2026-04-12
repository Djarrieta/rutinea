interface PlayerControlsProps {
  statusText: string;
  finished: boolean;
  isPlaying: boolean;
  onRestart: () => void;
  onTogglePlay: () => void;
}

export default function PlayerControls({
  statusText,
  finished,
  isPlaying,
  onRestart,
  onTogglePlay,
}: PlayerControlsProps) {
  return (
    <>
      <span className="text-xs text-text-muted">{statusText}</span>
      <div className="flex gap-2">
        {finished ? (
          <button
            onClick={onRestart}
            className="bg-primary-500 text-black px-4 py-1.5 rounded-lg text-sm hover:bg-primary-600"
          >
            Repetir
          </button>
        ) : (
          <button
            onClick={onTogglePlay}
            className="bg-surface-alt px-4 py-1.5 rounded-lg text-sm hover:bg-surface-hover"
          >
            {isPlaying ? "Pausar" : "Reanudar"}
          </button>
        )}
      </div>
    </>
  );
}
