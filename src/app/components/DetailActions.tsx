"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/* ── Shared button style tokens ── */
const base =
  "inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition-colors px-3 py-1.5";

const variants = {
  primary: `${base} bg-primary-500 text-black hover:bg-primary-600 active:scale-95 active:bg-primary-700`,
  secondary: `${base} border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 active:scale-95`,
  ghost: `${base} border border-border text-text-secondary hover:bg-surface-alt hover:text-text active:scale-95`,
  danger: `${base} border border-danger-400/20 text-danger-400 hover:bg-danger-50 active:scale-95`,
} as const;

type Variant = keyof typeof variants;

/* ── SVG Icons (20×20 heroicons/mini) ── */
const icons = {
  play: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
    </svg>
  ),
  clone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        fillRule="evenodd"
        d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v.25h3v-.25z"
        clipRule="evenodd"
      />
      <path d="M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.379a1.5 1.5 0 00-.44-1.06l-3.12-3.122A1.5 1.5 0 007.378 7.5H3.5z" />
    </svg>
  ),
  export: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  ),
  edit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
  ),
  delete: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.78.72l.5 6a.75.75 0 01-1.49.12l-.5-6a.75.75 0 01.71-.84zm2.84 0a.75.75 0 01.71.84l-.5 6a.75.75 0 11-1.49-.12l.5-6a.75.75 0 01.78-.72z"
        clipRule="evenodd"
      />
    </svg>
  ),
} as const;

export type IconName = keyof typeof icons;

/* ── Public API ── */

export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">{children}</div>
  );
}

export function ActionButton({
  variant = "ghost",
  icon,
  children,
  ...props
}: {
  variant?: Variant;
  icon?: IconName;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={variants[variant]} {...props}>
      {icon && icons[icon]}
      {children}
    </button>
  );
}

export function ActionLink({
  variant = "ghost",
  icon,
  href,
  target,
  children,
}: {
  variant?: Variant;
  icon?: IconName;
  href: string;
  target?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} target={target} className={variants[variant]}>
      {icon && icons[icon]}
      {children}
    </Link>
  );
}

function ActionFormButton({
  variant,
  icon,
  children,
}: {
  variant: Variant;
  icon?: IconName;
  children: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending ? (
        <svg
          className="animate-spin h-3.5 w-3.5"
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
      ) : (
        icon && icons[icon]
      )}
      {children}
    </button>
  );
}

export function ActionForm({
  action,
  variant = "ghost",
  icon,
  children,
}: {
  action: (formData: FormData) => void;
  variant?: Variant;
  icon?: IconName;
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <ActionFormButton variant={variant} icon={icon}>
        {children}
      </ActionFormButton>
    </form>
  );
}

export { variants as actionVariants, icons as actionIcons };
