import { RING_RADIUS, RING_CIRCUMFERENCE } from "./constants";

interface Props {
  elapsed: number;
  totalSecs: number;
  nextSetName?: string;
  nextRoundLabel?: string | null;
}

export default function PlayerPhaseRest({
  elapsed,
  totalSecs,
  nextSetName,
  nextRoundLabel,
}: Props) {
  const progress = totalSecs > 0 ? 1 - elapsed / totalSecs : 0;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, Math.ceil(totalSecs - elapsed));

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 player-scale-in">
      <div className="relative w-36 h-36">
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
            className="text-accent-500 transition-[stroke-dashoffset] duration-100"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            key={remaining}
            className="text-4xl font-bold tabular-nums text-text-secondary player-tick-pulse"
          >
            {remaining}
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">
            Descanso
          </span>
        </div>
      </div>
      {nextSetName && (
        <div className="text-center space-y-1 player-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <p className="text-xs text-text-faint">Siguiente</p>
          <p className="text-sm font-medium text-text-secondary">
            {nextSetName}
            {nextRoundLabel && (
              <span className="ml-1 text-accent-500 text-xs">
                Ronda {nextRoundLabel}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
