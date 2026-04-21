"use client";

import { useState, useEffect } from "react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { getAllOfflineRoutines } from "@/lib/offline-store";
import type { RoutineWithSets } from "@/types";
import RoutineCard from "./RoutineCard";
import RoutineDetailPlay from "./RoutineDetailPlay";

export default function OfflineRoutinesList() {
  const isOnline = useOnlineStatus();
  const [routines, setRoutines] = useState<RoutineWithSets[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllOfflineRoutines().then((r) => {
      setRoutines(r);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  // When online, show a subtle section if there are offline routines
  // When offline, show this as the primary content
  if (routines.length === 0 && isOnline) return null;

  return (
    <div className={`mb-6 ${!isOnline ? "" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-primary-400"
        >
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        <h2 className="text-sm font-medium text-text-muted">
          Rutinas offline ({routines.length})
        </h2>
      </div>

      {routines.length === 0 ? (
        <p className="text-text-faint text-sm">
          No tienes rutinas guardadas offline. Guarda algunas cuando tengas
          conexión.
        </p>
      ) : (
        <div className="grid gap-3">
          {routines.map((routine) => (
            <div key={routine.id} className="flex items-center gap-2">
              <div className="flex-1">
                <RoutineCard
                  routine={routine}
                  setCount={routine.routine_sets.length}
                />
              </div>
              <RoutineDetailPlay routine={routine} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
