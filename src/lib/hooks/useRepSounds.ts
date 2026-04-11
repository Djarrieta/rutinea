import { useRef, useEffect, useCallback } from "react";

const SOUNDS = {
  rep: "/sounds/rep.wav",
  lastRep: "/sounds/last-rep.wav",
} as const;

type SoundKey = keyof typeof SOUNDS;

export function useRepSounds() {
  const audioCache = useRef<Map<SoundKey, HTMLAudioElement>>(new Map());

  useEffect(() => {
    for (const [key, src] of Object.entries(SOUNDS)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioCache.current.set(key as SoundKey, audio);
    }
  }, []);

  const play = useCallback((key: SoundKey) => {
    const audio = audioCache.current.get(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  const playRep = useCallback(
    (currentRep: number, totalReps: number) => {
      if (currentRep === totalReps) {
        play("lastRep");
      } else {
        play("rep");
      }
    },
    [play],
  );

  return { play, playRep };
}
