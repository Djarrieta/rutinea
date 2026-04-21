"use client";

import { useState, useEffect } from "react";
import type { RoutineWithSets } from "@/types";
import {
  saveRoutineOffline,
  removeRoutineOffline,
  isRoutineSavedOffline,
} from "@/lib/offline-store";

export default function SaveOfflineButton({
  routine,
}: {
  routine: RoutineWithSets;
}) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isRoutineSavedOffline(routine.id)
      .then(setSaved)
      .catch(() => {});
  }, [routine.id]);

  const handleToggle = async () => {
    setBusy(true);
    try {
      if (saved) {
        await removeRoutineOffline(routine.id);
        setSaved(false);
      } else {
        await saveRoutineOffline(routine);
        setSaved(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        saved
          ? "bg-success-50 text-success-400 hover:bg-success-50/80"
          : "bg-surface-2 text-text-primary hover:bg-surface-3"
      } ${busy ? "opacity-50 cursor-wait" : ""}`}
    >
      {saved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      )}
      {busy ? "…" : saved ? "Offline ✓" : "Guardar offline"}
    </button>
  );
}
