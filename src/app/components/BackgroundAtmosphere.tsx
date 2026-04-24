"use client";

import { useEffect, useState } from "react";

export default function BackgroundAtmosphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <div 
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px] animate-pulse"
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />
      <div 
        className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary-600/5 blur-[100px] animate-pulse"
        style={{ animationDuration: '10s', animationDelay: '1s' }}
      />
    </div>
  );
}
