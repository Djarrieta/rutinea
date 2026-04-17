import { RING_RADIUS, RING_CIRCUMFERENCE, formatTime } from "./constants";

interface Props {
  elapsed: number;
  totalDuration: number;
  currentRep?: number;
  repetitions?: number;
  /** Extra line below the time (e.g. "2/8 ejercicios") */
  subtitle?: string;
}

export default function PlayerMiniTimer({
  elapsed,
  totalDuration,
  currentRep,
  repetitions,
  subtitle,
}: Props) {
  const progress = totalDuration > 0 ? Math.min(elapsed / totalDuration, 1) : 0;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(0, Math.ceil(totalDuration - elapsed));

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-surface-hover"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-primary-500 transition-[stroke-dashoffset] duration-100"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-text-secondary">
          {remaining}
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-medium tabular-nums text-text-secondary">
          {formatTime(elapsed)}{" "}
          <span className="text-text-faint">/ {formatTime(totalDuration)}</span>
        </span>
        {repetitions && repetitions > 1 && currentRep && (
          <span className="text-[10px] text-text-muted tabular-nums">
            Rep {currentRep} de {repetitions}
          </span>
        )}
        {subtitle && !repetitions && (
          <span className="text-[10px] text-text-muted">{subtitle}</span>
        )}
        {subtitle && repetitions && repetitions > 1 && (
          <span className="text-[10px] text-text-muted">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
