"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Link from "next/link";

interface SelectionContextValue {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function useSelection(id: string) {
  const ctx = useContext(SelectionContext);
  if (!ctx) return null;
  return {
    selected: ctx.selectedIds.has(id),
    toggle: () => ctx.toggle(id),
  };
}

interface SelectionProviderProps {
  children: ReactNode;
  actionLabel: string;
  createPath: string;
  paramName: string;
}

export default function SelectionProvider({
  children,
  actionLabel,
  createPath,
  paramName,
}: SelectionProviderProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const count = selectedIds.size;

  return (
    <SelectionContext.Provider value={{ selectedIds, toggle, clear }}>
      {count > 0 && (
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 rounded-lg border border-primary-500/40 bg-primary-500/10 px-4 py-2.5 mb-4 backdrop-blur">
          <span className="text-sm font-medium">
            {count} seleccionado{count !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-hover transition-colors"
            >
              Cancelar
            </button>
            <Link
              href={`${createPath}?${paramName}=${[...selectedIds].join(",")}`}
              className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
            >
              {actionLabel} ({count})
            </Link>
          </div>
        </div>
      )}
      {children}
    </SelectionContext.Provider>
  );
}
