"use client";

import { ReactNode, useRef, useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PAGE_SIZE } from "@/lib/constants";
import { properCase } from "@/lib/format";

interface FilterableListProps {
  children: ReactNode;
  total: number;
  page: number;
  placeholder?: string;
  activeTags?: string[];
  availableTags?: string[];
}

export default function FilterableList({
  children,
  total,
  page,
  placeholder = "Buscar...",
  activeTags = [],
  availableTags = [],
}: FilterableListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [tagQuery, setTagQuery] = useState("");
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const query = searchParams.get("q") ?? "";

  const suggestedTags = tagQuery
    ? availableTags.filter(
        (t) => t.includes(tagQuery.toLowerCase()) && !activeTags.includes(t),
      )
    : availableTags.filter((t) => !activeTags.includes(t));

  const navigate = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(params)) {
        if (v) sp.set(k, v);
        else sp.delete(k);
      }
      router.push(`${pathname}?${sp.toString()}`);
    },
    [router, pathname, searchParams],
  );

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ q: value, page: "" });
    }, 300);
  }

  function addTag(tag: string) {
    const next = [...activeTags, tag];
    navigate({ tags: next.join(","), page: "" });
    setTagQuery("");
  }

  function removeTag(tag: string) {
    const remaining = activeTags.filter((t) => t !== tag);
    navigate({ tags: remaining.join(","), page: "" });
  }

  return (
    <>
      <input
        type="search"
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
      />
      {availableTags.length > 0 && (
        <div className="relative mb-4">
          <input
            ref={tagInputRef}
            type="text"
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
            onFocus={() => setTagInputFocused(true)}
            onBlur={() => setTimeout(() => setTagInputFocused(false), 150)}
            placeholder="Filtrar por etiqueta..."
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {tagInputFocused && suggestedTags.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
              {suggestedTags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-surface-hover transition-colors"
                  >
                    {properCase(tag)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="inline-flex items-center gap-1 bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 rounded-full text-xs font-medium hover:bg-tag-border transition-colors"
            >
              {properCase(tag)}
              <span aria-hidden="true">&times;</span>
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">{children}</div>
      {total === 0 && query && (
        <p className="text-text-muted text-sm mt-2">
          Sin resultados para &ldquo;{query}&rdquo;
        </p>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => navigate({ page: String(page - 1) })}
            disabled={page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-sm text-text-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => navigate({ page: String(page + 1) })}
            disabled={page >= totalPages}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  );
}
