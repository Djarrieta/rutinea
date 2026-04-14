"use client";

import { ReactNode } from "react";
import Image from "next/image";
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
      className={`bg-surface rounded-lg border p-4 transition-shadow ${
        selected
          ? "border-primary-500 ring-1 ring-primary-500/40"
          : "border-border hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        {thumbnail && (
          <div className="shrink-0">
            <Image
              src={thumbnail}
              alt={title}
              width={56}
              height={56}
              className="w-14 h-14 rounded-md object-cover bg-surface-alt"
            />
          </div>
        )}
        {creatorName && (
          <div className="shrink-0 mt-0.5" title={creatorName}>
            {creatorAvatar ? (
              <Image
                src={creatorAvatar}
                alt={creatorName}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold uppercase">
                {creatorName[0]}
              </div>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-base sm:text-lg">
            {properCase(title)}
          </h2>
          {description && (
            <p className="text-text-muted text-sm mt-1 line-clamp-2">
              {properCase(description)}
            </p>
          )}
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              href={`/exercises?tags=${encodeURIComponent(tag)}`}
            >
              {properCase(tag)}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-text-faint min-w-0 flex-wrap">
          {meta}
          {typeof cloneCount === "number" && cloneCount > 0 && (
            <span
              className="inline-flex items-center gap-1"
              title={`Clonado ${cloneCount} vez${cloneCount !== 1 ? "es" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path d="M11.986 3.012A1.75 1.75 0 0 1 14 4.75v5.5A1.75 1.75 0 0 1 12.25 12H11v-2.379a2.5 2.5 0 0 0-.732-1.768L8.354 5.94a2.5 2.5 0 0 0-1.168-.66A1.752 1.752 0 0 1 8.75 4h1.5c.87 0 1.59.634 1.736 1.512ZM9 4.75A.75.75 0 0 0 8.25 4h-1.5a.75.75 0 0 0 0 1.5h2.25v-.75Z" />
                <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h5a1.5 1.5 0 0 0 1.5-1.5V9.621a1.5 1.5 0 0 0-.44-1.06l-1.94-1.94A1.5 1.5 0 0 0 6.56 6.18H3.5Z" />
              </svg>
              {cloneCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <Link
            href={href}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-text-muted hover:bg-surface-hover transition-colors"
          >
            Detalles
          </Link>
          {selectable && onSelect && (
            <button
              type="button"
              onClick={onSelect}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                selected
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-border text-text-muted hover:bg-surface-hover"
              }`}
            >
              {selected ? "Seleccionado" : "Seleccionar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
