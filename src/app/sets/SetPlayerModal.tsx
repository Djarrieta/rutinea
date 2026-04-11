"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { SetWithExercises, Exercise } from "@/types";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";

interface Props {
  set: SetWithExercises;
  onClose: () => void;
}

export default function SetPlayerModal({ set, onClose }: Props) {
  const exercises = [...set.set_exercises]
    .sort((a, b) => a.position - b.position)
    .map((se) => se.exercise);

  const totalExercises = exercises.length;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [finished, setFinished] = useState(totalExercises === 0);
  const { playRep } = useRepSounds();
  const prevRepRef = useRef(1);

  const currentExercise: Exercise | null = exercises[exerciseIndex] ?? null;
  const images = currentExercise?.images ?? [];
  const duration = currentExercise?.duration_secs ?? 0;
  const repetitions = currentExercise?.repetitions ?? 1;
  const totalSlots = images.length * repetitions;
  const timePerSlot = totalSlots > 0 ? duration / totalSlots : 0;

  const currentSlot =
    totalSlots > 0 && timePerSlot > 0
      ? Math.min(Math.floor(elapsed / timePerSlot), totalSlots - 1)
      : 0;
  const imageIndex = images.length > 0 ? currentSlot % images.length : 0;
  const currentRep =
    images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  // Play sound when rep changes
  useEffect(() => {
    if (currentRep !== prevRepRef.current && repetitions > 1) {
      playRep(currentRep, repetitions);
    }
    prevRepRef.current = currentRep;
  }, [currentRep, repetitions, playRep]);

  // Timer
  useEffect(() => {
    if (!isPlaying || finished || !currentExercise) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= duration) {
          const nextIdx = exerciseIndex + 1;
          if (nextIdx >= totalExercises) {
            setFinished(true);
          } else {
            setExerciseIndex(nextIdx);
            prevRepRef.current = 1;
          }
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    finished,
    duration,
    exerciseIndex,
    totalExercises,
    currentExercise,
  ]);

  const restart = useCallback(() => {
    setExerciseIndex(0);
    setElapsed(0);
    setIsPlaying(true);
    setFinished(false);
    prevRepRef.current = 1;
  }, []);

  // Overall progress
  const totalDuration = exercises.reduce((s, e) => s + e.duration_secs, 0);
  const completedDuration =
    exercises.slice(0, exerciseIndex).reduce((s, e) => s + e.duration_secs, 0) +
    elapsed;
  const overallProgress =
    totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  const headerContent = !finished ? (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {exercises.map((ex, i) => {
        const isDone = i < exerciseIndex;
        const isCurrent = i === exerciseIndex;
        return (
          <div
            key={i}
            className={`flex-shrink-0 rounded-lg border px-2 py-1.5 text-[11px] leading-tight transition-colors ${
              isCurrent
                ? "border-blue-400 bg-blue-50"
                : isDone
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-gray-50 opacity-50"
            }`}
          >
            <div
              className={`font-semibold truncate max-w-[7rem] ${isCurrent ? "text-blue-700" : isDone ? "text-green-600" : "text-gray-400"}`}
            >
              {isDone ? "✓ " : isCurrent ? "▸ " : ""}
              {ex.title}
            </div>
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <PlayerModalShell
      title={set.name}
      onClose={onClose}
      progress={finished ? 100 : overallProgress}
      header={headerContent}
      controls={
        <>
          <span className="text-xs text-gray-500">
            {finished
              ? "Finalizado"
              : `${Math.ceil(elapsed)}s / ${duration}s — ${exerciseIndex + 1}/${totalExercises}`}
          </span>
          <div className="flex gap-2">
            {finished ? (
              <button
                onClick={restart}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
              >
                Repetir
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="bg-gray-100 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200"
              >
                {isPlaying ? "Pausar" : "Reanudar"}
              </button>
            )}
          </div>
        </>
      }
    >
      {!finished && currentExercise && (
        <>
          {images.length > 0 ? (
            <img
              src={images[imageIndex].url}
              alt={`${currentExercise.title} step ${imageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sin imágenes
            </div>
          )}

          {images.length > 0 && images[imageIndex].description && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 text-white text-sm px-3 py-2 rounded-lg text-center">
              {images[imageIndex].description}
            </div>
          )}

          {images.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {imageIndex + 1}/{images.length}
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
            className="w-16 h-16 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            ¡Set completado!
          </p>
        </div>
      )}
    </PlayerModalShell>
  );
}
