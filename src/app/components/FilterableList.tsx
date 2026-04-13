"use client";

import { ReactNode, useRef, useCallback, useState, useEffect } from "react";
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
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const query = searchParams.get("q") ?? "";

  // Sync input with URL query on mount / navigation
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const hasTags = availableTags.length > 0;

  const suggestedTags = hasTags
    ? availableTags.filter(
        (t) =>
          !activeTags.includes(t) &&
          (!inputValue || t.includes(inputValue.toLowerCase())),
      )
    : [];

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

  function handleInputChange(value: string) {
    setInputValue(value);
    if (hasTags) setDropdownOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ q: value, page: "" });
    }, 300);
  }

  function addTag(tag: string) {
    const next = [...activeTags, tag];
    setInputValue("");
    navigate({ tags: next.join(","), q: "", page: "" });
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    const remaining = activeTags.filter((t) => t !== tag);
    navigate({ tags: remaining.join(","), page: "" });
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && inputValue === "" && activeTags.length > 0) {
      removeTag(activeTags[activeTags.length - 1]);
    }
    if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  }

  return (
    <>
      {/* Unified search bar */}
      <div className="relative mb-4" ref={containerRef}>
        <div
          className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary-500 transition-shadow"
          onClick={() => inputRef.current?.focus()}
        >
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="inline-flex items-center gap-1 bg-tag-bg text-tag-text border border-tag-border px-2 py-0.5 rounded-full text-xs font-medium hover:bg-tag-border transition-colors shrink-0"
            >
              {properCase(tag)}
              <span aria-hidden="true">&times;</span>
            </button>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => hasTags && setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeTags.length > 0 ? "Agregar filtro..." : placeholder
            }
            className="flex-1 min-w-[120px] bg-transparent py-0.5 text-sm focus:outline-none placeholder:text-text-muted"
          />
        </div>

        {/* Tag suggestions dropdown */}
        {dropdownOpen && suggestedTags.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
            <li className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted select-none">
              Etiquetas
            </li>
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

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">{children}</div>
      {total === 0 && (query || activeTags.length > 0) && (
        <p className="text-text-muted text-sm mt-2">
          Sin resultados{query ? <> para &ldquo;{query}&rdquo;</> : null}
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
