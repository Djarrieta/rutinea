"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
  pendingText?: string;
}

export default function SubmitButton({
  children,
  className = "bg-primary-500 text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  pendingText,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {pendingText || children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
