"use client";

import { useState, useRef, useEffect } from "react";

export interface SearchableOption {
  id: string;
  label: string;
}

interface Props {
  options: SearchableOption[];
  onSelect: (id: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  onSelect,
  placeholder = "Buscar…",
  loading = false,
  disabled = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (id: string) => {
    onSelect(id);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIndex]) {
          select(filtered[highlightIndex].id);
        }
        break;
      case "Escape":
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlightIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface shadow-lg">
          {loading && (
            <li className="px-3 py-2 text-sm text-text-faint">Cargando…</li>
          )}

          {!loading && filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-text-faint">
              Sin resultados
            </li>
          )}

          {!loading &&
            filtered.map((option, i) => (
              <li
                key={option.id}
                onMouseDown={() => select(option.id)}
                onMouseEnter={() => setHighlightIndex(i)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === highlightIndex
                    ? "bg-primary-50 text-primary-700"
                    : "text-text-secondary hover:bg-bg"
                }`}
              >
                {option.label}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
