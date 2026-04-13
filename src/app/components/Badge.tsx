import { ReactNode } from "react";
import Link from "next/link";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export default function Badge({ children, className = "", href }: BadgeProps) {
  const classes = `bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${href ? "hover:bg-tag-border cursor-pointer" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
