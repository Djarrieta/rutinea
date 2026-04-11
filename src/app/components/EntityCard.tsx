"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface EntityCardProps {
  href: string;
  title: string;
  description?: string | null;
  tags?: string[];
  meta: ReactNode;
  action?: ReactNode;
}

export default function EntityCard({
  href,
  title,
  description,
  tags,
  meta,
  action,
}: EntityCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <Link href={href}>
        <h2 className="font-semibold text-base sm:text-lg">{title}</h2>
        {description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </Link>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-400 min-w-0 flex-wrap">
          {meta}
        </div>
        {action}
      </div>
    </div>
  );
}
