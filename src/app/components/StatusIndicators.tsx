"use client";

import { ReactNode } from "react";

interface IndicatorProps {
  icon: ReactNode;
  label?: string | number;
  title?: string;
  className?: string;
  opacity?: string;
}

export function Indicator({
  icon,
  label,
  title,
  className = "",
  opacity = "opacity-50",
}: IndicatorProps) {
  return (
    <div className="group flex items-center transition-all duration-500">
      <span
        className={`flex items-center gap-1.5 ${className} cursor-default`}
      >
        <span className={`${opacity} shrink-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110`}>
          {icon}
        </span>
        
        <div className="flex flex-col justify-center overflow-hidden">
          {label !== undefined && (
            <span className="text-[10px] font-bold tracking-tight leading-none">
              {label}
            </span>
          )}
          {title && (
            <span className="max-w-0 opacity-0 whitespace-nowrap text-[7px] font-black uppercase tracking-[0.2em] text-text-faint transition-all duration-500 ease-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:mt-0.5">
              {title}
            </span>
          )}
        </div>
      </span>
    </div>
  );
}

export function PendingIndicator({ className = "" }: { className?: string }) {
  return (
    <Indicator
      title="Por aprobar"
      className={`text-amber-500 ${className}`}
      opacity="opacity-100"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
            clipRule="evenodd"
          />
        </svg>
      }
    />
  );
}

export function CloneIndicator({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  
  return (
    <Indicator
      title="Veces clonado"
      label={count}
      className={`text-text-faint hover:text-text-muted transition-colors cursor-default ${className}`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M11.986 3.012A1.75 1.75 0 0 1 14 4.75v5.5A1.75 1.75 0 0 1 12.25 12H11v-2.379a2.5 2.5 0 0 0-.732-1.768L8.354 5.94a2.5 2.5 0 0 0-1.168-.66A1.752 1.752 0 0 1 8.75 4h1.5c.87 0 1.59.634 1.736 1.512ZM9 4.75A.75.75 0 0 0 8.25 4h-1.5a.75.75 0 0 0 0 1.5h2.25v-.75Z" />
          <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h5a1.5 1.5 0 0 0 1.5-1.5V9.621a1.5 1.5 0 0 0-.44-1.06l-1.94-1.94A1.5 1.5 0 0 0 6.56 6.18H3.5Z" />
        </svg>
      }
    />
  );
}

export function RepetitionsIndicator({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count <= 1) return null;

  return (
    <Indicator
      title="Repeticiones"
      label={`${count} reps`}
      className={`text-text-muted ${className}`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm12.5 0A5.5 5.5 0 1 1 2.5 8 5.5 5.5 0 0 1 13.5 8Z"
            clipRule="evenodd"
          />
        </svg>
      }
    />
  );
}

export function OfflineIndicator({ className = "" }: { className?: string }) {
  return (
    <Indicator
      title="Disponible offline"
      className={`text-primary-400 ${className}`}
      opacity="opacity-100"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      }
    />
  );
}

export function SetsIndicator({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;

  return (
    <Indicator
      title="Sets"
      label={`${count} set${count !== 1 ? "s" : ""}`}
      className={`text-text-muted ${className}`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3 h-3"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11Zm3.5 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
        </svg>
      }
    />
  );
}

export function DurationIndicator({
  label,
  className = "",
}: {
  label: string | number;
  className?: string;
}) {
  return (
    <Indicator
      title="Duración"
      label={label}
      className={`text-text-muted ${className}`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3 h-3"
        >
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5h-2.25V3.75Z"
            clipRule="evenodd"
          />
        </svg>
      }
    />
  );
}
