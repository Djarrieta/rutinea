import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${className}`}
    >
      {children}
    </span>
  );
}
