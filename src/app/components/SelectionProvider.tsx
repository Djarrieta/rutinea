"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import Link from "next/link";

interface SelectionContextValue {
  selectedIds: Set<string>;
  toggle: (id: string, ownerId?: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function useSelection(id: string, ownerId?: string) {
  const ctx = useContext(SelectionContext);
  if (!ctx) return null;
  return {
    selected: ctx.selectedIds.has(id),
    toggle: () => ctx.toggle(id, ownerId),
  };
}

interface SelectionProviderProps {
  children: ReactNode;
  actionLabel: string;
  createPath: string;
  paramName: string;
  userId?: string;
  deleteAction?: (ids: string[]) => Promise<void>;
}

export default function SelectionProvider({
  children,
  actionLabel,
  createPath,
  paramName,
  userId,
  deleteAction,
}: SelectionProviderProps) {
  const [selectionMap, setSelectionMap] = useState<
    Map<string, string | undefined>
  >(new Map());
  const [isPending, startTransition] = useTransition();

  const selectedIds = new Set(selectionMap.keys());

  const toggle = useCallback((id: string, ownerId?: string) => {
    setSelectionMap((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, ownerId);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectionMap(new Map()), []);

  const count = selectionMap.size;

  const allOwned =
    userId &&
    deleteAction &&
    count > 0 &&
    [...selectionMap.values()].every((ownerId) => ownerId === userId);

  function handleDelete() {
    if (!deleteAction || !allOwned) return;
    const ids = [...selectionMap.keys()];
    startTransition(async () => {
      await deleteAction(ids);
      clear();
    });
  }

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
            {allOwned && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {isPending ? "Eliminando…" : `Eliminar (${count})`}
              </button>
            )}
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
