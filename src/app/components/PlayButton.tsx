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
      className="flex items-center gap-1.5 bg-primary-500 text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5"
      >
        <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
      </svg>
      Reproducir
    </button>
  );
}
