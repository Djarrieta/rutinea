import { formatTime } from "./constants";

interface Stat {
  value: string;
  label: string;
}

interface Props {
  message: string;
  stats?: Stat[];
}

export default function PlayerPhaseFinished({ message, stats }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="player-scale-in">
        <div className="w-20 h-20 rounded-full bg-success-500/10 border-2 border-success-500/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-success-400"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div
        className="text-center player-slide-up"
        style={{ animationDelay: "0.1s", opacity: 0 }}
      >
        <p className="text-lg font-semibold text-text-secondary">{message}</p>
      </div>
      {stats && stats.length > 0 && (
        <div
          className="flex gap-4 text-center player-slide-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-2xl font-bold tabular-nums text-primary-500">
                {s.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { formatTime };
