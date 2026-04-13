"use client";

import { ReactNode, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PAGE_SIZE } from "@/lib/constants";

interface FilterableListProps {
  children: ReactNode;
  total: number;
  page: number;
  placeholder?: string;
}

export default function FilterableList({
  children,
  total,
  page,
  placeholder = "Buscar...",
}: FilterableListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const query = searchParams.get("q") ?? "";

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

  return (
    <>
      <input
        type="search"
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
      />
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
