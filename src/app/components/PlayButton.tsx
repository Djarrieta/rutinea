"use client";

export default function PlayButton({ onClick }: { onClick: () => void }) {
  const handleClick = () => {
    const audio = new Audio("/sounds/start.wav");
    audio.play().catch(() => {});
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 bg-white/5 text-text-muted px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-black transition-all active:scale-95 border border-white/5 group/play"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3 h-3 transition-transform group-hover/play:scale-110"
      >
        <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
      </svg>
      Reproducir
    </button>
  );
}
