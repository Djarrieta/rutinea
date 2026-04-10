"use client";

import { useEffect, useState, useCallback } from "react";
import type { Exercise } from "@/types";

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

  const currentImageIndex = images.length > 0 ? currentSlot % images.length : 0;
  const currentRep = images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  // Advance images based on elapsed time
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

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const restart = useCallback(() => {
    setCurrentSlot(0);
    setElapsed(0);
    setIsPlaying(true);
  }, []);

  const progress = duration_secs > 0 ? (elapsed / duration_secs) * 100 : 0;
  const finished = elapsed >= duration_secs;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-sm truncate">{exercise.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Image area */}
        <div className="relative aspect-square bg-gray-100">
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex].url}
              alt={`${exercise.title} step ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sin imágenes
            </div>
          )}

          {/* Tip overlay */}
          {images.length > 0 && images[currentImageIndex].description && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 text-white text-sm px-3 py-2 rounded-lg text-center">
              {images[currentImageIndex].description}
            </div>
          )}

          {/* Image counter + repetition */}
          {images.length > 0 && (
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{images.length}{repetitions > 1 ? ` · rep ${currentRep}/${repetitions}` : ''}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-gray-500">
            {Math.ceil(elapsed)}s / {duration_secs}s
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
        </div>
      </div>
    </div>
  );
}
