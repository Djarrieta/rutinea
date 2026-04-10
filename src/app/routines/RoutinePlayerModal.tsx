"use client";

import { useEffect, useState, useCallback } from "react";
import type { RoutineWithSets, Exercise } from "@/types";

type Phase = "exercise" | "rest" | "finished";

type ExerciseStep = {
  type: "exercise";
  exercise: Exercise;
  setName: string;
  globalIndex: number;
  totalExercises: number;
};
type RestStep = { type: "rest" };
type Step = ExerciseStep | RestStep;

interface Props {
  routine: RoutineWithSets;
  onClose: () => void;
}

export default function RoutinePlayerModal({ routine, onClose }: Props) {
  const sortedSets = [...routine.routine_sets].sort(
    (a, b) => a.position - b.position,
  );

  const steps: Step[] = [];
  let globalIdx = 0;
  const totalExercises = sortedSets.reduce(
    (sum, rs) => sum + rs.set.set_exercises.length,
    0,
  );

  sortedSets.forEach((rs, blockIdx) => {
    const exercises = [...rs.set.set_exercises]
      .sort((a, b) => a.position - b.position)
      .map((se) => se.exercise);

    exercises.forEach((ex) => {
      steps.push({
        type: "exercise",
        exercise: ex,
        setName: rs.set.name,
        globalIndex: globalIdx,
        totalExercises,
      });
      globalIdx++;
    });
    if (blockIdx < sortedSets.length - 1) {
      steps.push({ type: "rest" });
    }
  });

  const totalSteps = steps.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(
    totalSteps > 0
      ? steps[0].type === "exercise"
        ? "exercise"
        : "rest"
      : "finished",
  );
  const [elapsed, setElapsed] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStep = steps[stepIndex] ?? null;
  const currentExercise =
    currentStep?.type === "exercise" ? currentStep.exercise : null;
  const images = currentExercise?.images ?? [];
  const exerciseDuration = currentExercise?.duration_secs ?? 0;
  const timePerImage = images.length > 0 ? exerciseDuration / images.length : 0;
  const phaseDuration =
    phase === "exercise" ? exerciseDuration : routine.rest_secs;

  useEffect(() => {
    if (!isPlaying || phase === "finished") return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;

        if (phase === "exercise" && images.length > 0 && timePerImage > 0) {
          const nextImg = Math.min(
            Math.floor(next / timePerImage),
            images.length - 1,
          );
          setImageIndex(nextImg);
        }

        if (next >= phaseDuration) {
          const nextStepIdx = stepIndex + 1;
          if (nextStepIdx >= totalSteps) {
            setPhase("finished");
          } else {
            const nextStep = steps[nextStepIdx];
            setStepIndex(nextStepIdx);
            setPhase(nextStep.type === "exercise" ? "exercise" : "rest");
            setImageIndex(0);
          }
          return 0;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    phase,
    phaseDuration,
    stepIndex,
    totalSteps,
    images.length,
    timePerImage,
    steps,
  ]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const restart = useCallback(() => {
    setStepIndex(0);
    setPhase(
      totalSteps > 0
        ? steps[0].type === "exercise"
          ? "exercise"
          : "rest"
        : "finished",
    );
    setElapsed(0);
    setImageIndex(0);
    setIsPlaying(true);
  }, [totalSteps, steps]);

  const totalDuration = steps.reduce(
    (sum, s) =>
      sum +
      (s.type === "exercise" ? s.exercise.duration_secs : routine.rest_secs),
    0,
  );
  const completedDuration =
    steps
      .slice(0, stepIndex)
      .reduce(
        (sum, s) =>
          sum +
          (s.type === "exercise"
            ? s.exercise.duration_secs
            : routine.rest_secs),
        0,
      ) + elapsed;
  const overallProgress =
    totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  const nextExerciseAfterRest =
    phase === "rest" && stepIndex + 1 < totalSteps
      ? steps[stepIndex + 1]
      : null;

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
          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">{routine.name}</h2>
            {phase === "exercise" && currentStep?.type === "exercise" && (
              <p className="text-xs text-gray-400 truncate">
                {currentStep.setName} — Ejercicio {currentStep.globalIndex + 1}/
                {currentStep.totalExercises} — {currentStep.exercise.title}
              </p>
            )}
            {phase === "rest" && (
              <p className="text-xs text-gray-400">Descanso entre sets</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2"
          >
            &times;
          </button>
        </div>

        {/* Content area */}
        <div className="relative aspect-square bg-gray-100">
          {phase === "exercise" && currentExercise && (
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
                  {imageIndex + 1} / {images.length}
                </span>
              )}
            </>
          )}

          {phase === "rest" && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              {/* Clock icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="text-3xl font-bold tabular-nums text-gray-700">
                {Math.max(0, Math.ceil(routine.rest_secs - elapsed))}s
              </p>
              {nextExerciseAfterRest?.type === "exercise" && (
                <p className="text-sm text-gray-400">
                  Siguiente: {nextExerciseAfterRest.exercise.title}
                </p>
              )}
            </div>
          )}

          {phase === "finished" && (
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
                ¡Rutina completada!
              </p>
            </div>
          )}
        </div>

        {/* Overall progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-100"
            style={{
              width: `${phase === "finished" ? 100 : Math.min(overallProgress, 100)}%`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-gray-500">
            {phase === "exercise" &&
              `${Math.ceil(elapsed)}s / ${exerciseDuration}s`}
            {phase === "rest" &&
              `Descanso ${Math.ceil(elapsed)}s / ${routine.rest_secs}s`}
            {phase === "finished" && "Finalizada"}
          </span>
          <div className="flex gap-2">
            {phase === "finished" ? (
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
