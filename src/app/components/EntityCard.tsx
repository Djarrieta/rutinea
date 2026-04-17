"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Badge from "./Badge";
import { properCase } from "@/lib/format";

interface EntityCardProps {
  href: string;
  title: string;
  description?: string | null;
  tags?: string[];
  meta: ReactNode;
  action?: ReactNode;
  thumbnail?: string;
  creatorName?: string;
  creatorAvatar?: string | null;
  cloneCount?: number;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export default function EntityCard({
  href,
  title,
  description,
  tags,
  meta,
  action,
  thumbnail,
  creatorName,
  creatorAvatar,
  cloneCount,
  selectable,
  selected,
  onSelect,
}: EntityCardProps) {
  return (
    <div
      className={`group bg-surface rounded-2xl border transition-all duration-300 ${
        selected
          ? "border-primary-500 ring-2 ring-primary-500/20 shadow-lg glow-primary"
          : "border-border/60 hover:border-primary-500/50 hover:shadow-xl hover:-translate-y-1 hover:bg-surface-alt"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {thumbnail && (
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={title}
                className="w-16 h-16 rounded-xl object-cover bg-surface/50 border border-white/5 shadow-inner"
              />
            </div>
          )}
          {creatorName && (
            <div className="shrink-0 mt-0.5" title={creatorName}>
              {creatorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={creatorAvatar}
                  alt={creatorName}
                  className="w-8 h-8 rounded-full border border-white/10 ring-2 ring-black/20 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/20 flex items-center justify-center text-xs font-bold uppercase">
                  {creatorName[0]}
                </div>
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display font-bold text-lg sm:text-xl group-hover:text-primary-400 transition-colors">
              {properCase(title)}
            </h2>
            {description && (
              <p className="text-text-muted text-sm mt-1.5 line-clamp-2 leading-relaxed font-sans font-medium">
                {properCase(description)}
              </p>
            )}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                href={`/exercises?tags=${encodeURIComponent(tag)}`}
                className="font-sans font-semibold uppercase tracking-wider text-[10px]"
              >
                {properCase(tag)}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border/30">
          <div className="flex items-center gap-4 text-xs font-medium text-text-faint min-w-0 flex-wrap font-sans">
            {meta}
            {typeof cloneCount === "number" && cloneCount > 0 && (
              <span
                className="inline-flex items-center gap-1.5 text-text-muted/60"
                title={`Clonado ${cloneCount} vez${cloneCount !== 1 ? "es" : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M11.986 3.012A1.75 1.75 0 0 1 14 4.75v5.5A1.75 1.75 0 0 1 12.25 12H11v-2.379a2.5 2.5 0 0 0-.732-1.768L8.354 5.94a2.5 2.5 0 0 0-1.168-.66A1.752 1.752 0 0 1 8.75 4h1.5c.87 0 1.59.634 1.736 1.512ZM9 4.75A.75.75 0 0 0 8.25 4h-1.5a.75.75 0 0 0 0 1.5h2.25v-.75Z" />
                  <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h5a1.5 1.5 0 0 0 1.5-1.5V9.621a1.5 1.5 0 0 0-.44-1.06l-1.94-1.94A1.5 1.5 0 0 0 6.56 6.18H3.5Z" />
                </svg>
                {cloneCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {action}
            <Link
              href={href}
              className="rounded-xl border border-border/60 bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text hover:border-primary-500/30 transition-all active:scale-95"
            >
              Ver más
            </Link>
            {selectable && onSelect && (
              <button
                type="button"
                onClick={onSelect}
                className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  selected
                    ? "border-primary-500 bg-primary-500 text-black shadow-lg glow-primary"
                    : "border-border/60 bg-surface-alt text-text-muted hover:border-primary-500/40 hover:text-text"
                }`}
              >
                {selected ? "Listo" : "Elegir"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
