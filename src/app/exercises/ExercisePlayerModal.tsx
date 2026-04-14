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
  const { images, duration_secs, repetitions, preparation_secs } = exercise;
  const totalDuration = duration_secs * repetitions;
  const totalSlots = images.length * repetitions;
  const timePerSlot = totalSlots > 0 ? totalDuration / totalSlots : 0;

  const [phase, setPhase] = useState<"preparation" | "exercise" | "finished">(
    preparation_secs > 0 ? "preparation" : "exercise",
  );
  const [currentSlot, setCurrentSlot] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { playRep, play } = useRepSounds();
  const prevRepRef = useRef(1);
  const prevTickSecRef = useRef(-1);

  const currentImageIndex = images.length > 0 ? currentSlot % images.length : 0;
  const currentRep =
    images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  useEffect(() => {
    if (phase !== "exercise") return;
    if (currentRep !== prevRepRef.current && repetitions > 1) {
      playRep(currentRep, repetitions);
    }
    prevRepRef.current = currentRep;
  }, [currentRep, repetitions, playRep, phase]);

  // Tick sound during preparation
  const prepSecond = phase === "preparation" ? Math.floor(elapsed) : -1;
  useEffect(() => {
    if (phase !== "preparation" || !isPlaying) {
      prevTickSecRef.current = -1;
      return;
    }
    if (prepSecond !== prevTickSecRef.current && prepSecond >= 0) {
      play("tick");
    }
    prevTickSecRef.current = prepSecond;
  }, [prepSecond, phase, isPlaying, play]);

  useEffect(() => {
    if (!isPlaying || phase === "finished") return;

    if (phase === "preparation") {
      const interval = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 0.1;
          if (next >= preparation_secs) {
            setPhase("exercise");
            return 0;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }

    if (totalSlots === 0) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        const nextSlot = Math.min(
          Math.floor(next / timePerSlot),
          totalSlots - 1,
        );
        setCurrentSlot(nextSlot);

        if (next >= totalDuration) {
          setPhase("finished");
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    phase,
    preparation_secs,
    timePerSlot,
    totalDuration,
    totalSlots,
  ]);

  const restart = () => {
    setCurrentSlot(0);
    setElapsed(0);
    setPhase(preparation_secs > 0 ? "preparation" : "exercise");
    setIsPlaying(true);
    prevRepRef.current = 1;
    prevTickSecRef.current = -1;
  };

  const overallTotal = preparation_secs + totalDuration;
  const overallElapsed =
    phase === "preparation"
      ? elapsed
      : phase === "exercise"
        ? preparation_secs + elapsed
        : overallTotal;
  const progress = overallTotal > 0 ? (overallElapsed / overallTotal) * 100 : 0;
  const finished = phase === "finished";

  return (
    <PlayerModalShell
      title={properCase(exercise.title)}
      onClose={onClose}
      progress={progress}
      controls={
        <PlayerControls
          statusText={
            phase === "preparation"
              ? `Preparación ${Math.max(0, Math.ceil(preparation_secs - elapsed))}s`
              : `${repetitions > 1 ? `Rep ${currentRep}/${repetitions} \u00b7 ` : ""}${Math.ceil(elapsed)}s / ${totalDuration}s`
          }
          finished={finished}
          isPlaying={isPlaying}
          onRestart={restart}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      }
    >
      {phase === "preparation" && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20 text-primary-500 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-lg font-semibold text-text-secondary">
            ¡Prepárate!
          </p>
          <p className="text-4xl font-bold tabular-nums text-primary-500">
            {Math.max(0, Math.ceil(preparation_secs - elapsed))}s
          </p>
        </div>
      )}

      {phase === "exercise" && (
        <>
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex].url}
              alt={`${exercise.title} step ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
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
        </>
      )}

      {finished && (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-success-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-lg font-semibold text-text-secondary">
            ¡Ejercicio completado!
          </p>
        </div>
      )}
    </PlayerModalShell>
  );
}
