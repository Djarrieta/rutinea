"use client";

import { useEffect, ReactNode } from "react";

interface PlayerModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  progress: number;
  controls: ReactNode;
  header?: ReactNode;
}

export default function PlayerModalShell({
  title,
  onClose,
  children,
  progress,
  controls,
  header,
}: PlayerModalShellProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black sm:bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white overflow-hidden shadow-2xl w-full h-full sm:h-auto sm:max-w-lg sm:mx-4 sm:rounded-2xl sm:max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm truncate">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2 p-1"
            >
              &times;
            </button>
          </div>
          {header}
        </div>

        {/* Content area */}
        <div className="relative flex-1 sm:flex-none sm:aspect-square bg-gray-100 min-h-0">
          {children}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 flex-shrink-0">
          <div
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          {controls}
        </div>
      </div>
    </div>
  );
}
