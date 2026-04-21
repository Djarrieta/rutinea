"use client";

import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-accent-500/10 border border-accent-500/30 text-accent-500 text-xs font-medium text-center py-1.5 px-3">
      Sin conexión — Solo rutinas guardadas offline disponibles
    </div>
  );
}
