"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "./Badge";
import { properCase } from "@/lib/format";
import { PendingIndicator, CloneIndicator } from "./StatusIndicators";

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
  isApproved?: boolean;
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
  isApproved,
}: EntityCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 backdrop-blur-sm ${
        selected
          ? "border-primary-500/50 bg-primary-500/10 ring-1 ring-primary-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]"
          : "border-white/10 bg-surface/80 hover:border-primary-500/40 hover:bg-surface-alt hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2"
      }`}
    >
      {/* Glossy overlay effect for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 blur-2xl group-hover:bg-primary-500/10 transition-colors duration-700" />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-text-muted mb-2 font-sans group-hover:text-primary-400/80 transition-colors">
              {meta}
            </div>
              <Link href={href} className="block group/title">
                <h2 className="font-display font-black text-xl sm:text-2xl leading-tight group-hover/title:text-primary-400 transition-colors flex items-center gap-2">
                  {properCase(title)}
                  {isApproved === false && (
                    <PendingIndicator />
                  )}
                </h2>
              </Link>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            {thumbnail && (
              <div className="relative group/thumb">
                <div className="absolute inset-0 bg-primary-500/20 blur-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-full scale-110" />
                <Image
                  src={thumbnail}
                  alt={title}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-14 h-14 rounded-2xl object-cover bg-surface/80 border border-white/10 shadow-lg relative z-10 transition-transform group-hover/thumb:scale-105 duration-500"
                />
              </div>
            )}
          </div>
        </div>

        {description && (
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed font-sans font-medium mb-5">
            {properCase(description)}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                href={`/exercises?tags=${encodeURIComponent(tag)}`}
                className="bg-white/[0.03] hover:bg-primary-500/10 text-text-muted hover:text-primary-300 border-white/[0.05] hover:border-primary-500/20 transition-all text-[9px] px-2 py-0.5"
              >
                {properCase(tag)}
              </Badge>
            ))}
            {tags.length > 3 && (
              <span className="text-[9px] text-text-faint font-bold self-center ml-1">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            {creatorName && (
              <div
                className="flex items-center pr-3 border-r border-white/10 shrink-0"
                title={`Creado por ${creatorName}`}
              >
                {creatorAvatar ? (
                  <Image
                    src={creatorAvatar}
                    alt={creatorName}
                    width={20}
                    height={20}
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-text-muted">
                    {creatorName[0]}
                  </div>
                )}
              </div>
            )}

            <CloneIndicator count={cloneCount ?? 0} />
            {action}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectable && onSelect && (
              <button
                type="button"
                onClick={onSelect}
                className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 duration-300 ${
                  selected
                    ? "bg-primary-500 text-black shadow-lg shadow-primary-500/20"
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text border border-white/5"
                }`}
              >
                {selected ? "Listo" : "Elegir"}
              </button>
            )}
            <Link
              href={href}
              className="p-2 rounded-xl bg-white/5 text-text-muted hover:bg-primary-500 hover:text-black transition-all group/arrow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 transition-transform group-hover/arrow:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
