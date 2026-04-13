"use client";

import { useEffect, useState, useRef } from "react";
import type { Exercise } from "@/types";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";
import PlayerControls from "@/app/components/PlayerControls";
import { properCase } from "@/lib/format";

interface Props {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExercisePlayerModal({ exercise, onClose }: Props) {
  const { images, duration_secs, repetitions } = exercise;
  const totalSlots = images.length * repetitions;
  const timePerSlot = totalSlots > 0 ? duration_secs / totalSlots : 0;

  const [currentSlot, setCurrentSlot] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { playRep } = useRepSounds();
  const prevRepRef = useRef(1);

  const currentImageIndex = images.length > 0 ? currentSlot % images.length : 0;
  const currentRep =
    images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  useEffect(() => {
    if (currentRep !== prevRepRef.current && repetitions > 1) {
      playRep(currentRep, repetitions);
    }
    prevRepRef.current = currentRep;
  }, [currentRep, repetitions, playRep]);

  useEffect(() => {
    if (!isPlaying || totalSlots === 0) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        const nextSlot = Math.min(
          Math.floor(next / timePerSlot),
          totalSlots - 1,
        );
        setCurrentSlot(nextSlot);

        if (next >= duration_secs) {
          setIsPlaying(false);
          return duration_secs;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, timePerSlot, duration_secs, totalSlots]);

  const restart = () => {
    setCurrentSlot(0);
    setElapsed(0);
    setIsPlaying(true);
  };

  const progress = duration_secs > 0 ? (elapsed / duration_secs) * 100 : 0;
  const finished = elapsed >= duration_secs;

  return (
    <PlayerModalShell
      title={properCase(exercise.title)}
      onClose={onClose}
      progress={progress}
      controls={
        <PlayerControls
          statusText={`${repetitions > 1 ? `Rep ${currentRep}/${repetitions} · ` : ""}${Math.ceil(elapsed)}s / ${duration_secs}s`}
          finished={finished}
          isPlaying={isPlaying}
          onRestart={restart}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      }
    >
      {images.length > 0 ? (
        <img
          src={images[currentImageIndex].url}
          alt={`${exercise.title} step ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-text-faint">
          Sin imágenes
        </div>
      )}

      {images.length > 0 && images[currentImageIndex].description && (
        <div className="absolute bottom-3 left-3 right-3 bg-black/60 text-white text-sm px-3 py-2 rounded-lg text-center">
          {images[currentImageIndex].description}
        </div>
      )}

      {images.length > 0 && (
        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{images.length}
          {repetitions > 1 ? ` · rep ${currentRep}/${repetitions}` : ""}
        </span>
      )}
    </PlayerModalShell>
  );
}
