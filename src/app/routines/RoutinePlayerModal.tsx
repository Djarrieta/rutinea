"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { RoutineWithSets, Exercise } from "@/types";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";

type Phase = "exercise" | "rest" | "finished";

type ExerciseStep = {
  type: "exercise";
  exercise: Exercise;
  setName: string;
  setIndex: number;
  roundLabel: string | null;
  exerciseInSetIndex: number;
  exerciseInSetTotal: number;
  globalIndex: number;
  totalExercises: number;
};
type RestStep = {
  type: "rest";
  afterSetIndex: number;
  nextSetName?: string;
  nextRoundLabel?: string | null;
};
type Step = ExerciseStep | RestStep;

interface SetNode {
  name: string;
  roundLabel: string | null;
  exercises: Exercise[];
}

interface Props {
  routine: RoutineWithSets;
  onClose: () => void;
}

export default function RoutinePlayerModal({ routine, onClose }: Props) {
  const sortedSets = [...routine.routine_sets].sort(
    (a, b) => a.position - b.position,
  );

  const steps: Step[] = [];
  const setTree: SetNode[] = [];
  let globalIdx = 0;
  let setExpandedIdx = 0;
  const totalExercises = sortedSets.reduce(
    (sum, rs) => sum + rs.set.set_exercises.length * rs.rounds,
    0,
  );

  sortedSets.forEach((rs, blockIdx) => {
    const exercises = [...rs.set.set_exercises]
      .sort((a, b) => a.position - b.position)
      .map((se) => se.exercise);

    for (let round = 0; round < rs.rounds; round++) {
      const roundLabel = rs.rounds > 1 ? `${round + 1}/${rs.rounds}` : null;

      setTree.push({ name: rs.set.name, roundLabel, exercises });

      exercises.forEach((ex, exIdx) => {
        steps.push({
          type: "exercise",
          exercise: ex,
          setName: rs.set.name,
          setIndex: setExpandedIdx,
          roundLabel,
          exerciseInSetIndex: exIdx,
          exerciseInSetTotal: exercises.length,
          globalIndex: globalIdx,
          totalExercises,
        });
        globalIdx++;
      });
      const isLastRound = round === rs.rounds - 1;
      const isLastBlock = blockIdx === sortedSets.length - 1;
      if (!(isLastRound && isLastBlock)) {
        const nextBlockIdx = isLastRound ? blockIdx + 1 : blockIdx;
        const nextRound = isLastRound ? 0 : round + 1;
        const nextRs = sortedSets[nextBlockIdx];
        const nextRoundLabel =
          nextRs && nextRs.rounds > 1
            ? `${nextRound + 1}/${nextRs.rounds}`
            : null;
        steps.push({
          type: "rest",
          afterSetIndex: setExpandedIdx,
          nextSetName: nextRs?.set.name,
          nextRoundLabel,
        });
      }
      setExpandedIdx++;
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
  const { playRep, play } = useRepSounds();
  const prevRepRef = useRef(1);
  const prevTickSecRef = useRef(-1);

  const currentStep = steps[stepIndex] ?? null;
  const currentExercise =
    currentStep?.type === "exercise" ? currentStep.exercise : null;
  const images = currentExercise?.images ?? [];
  const exerciseDuration = currentExercise?.duration_secs ?? 0;
  const exerciseRepetitions = currentExercise?.repetitions ?? 1;
  const totalSlots = images.length * exerciseRepetitions;
  const timePerSlot = totalSlots > 0 ? exerciseDuration / totalSlots : 0;
  const phaseDuration =
    phase === "exercise" ? exerciseDuration : routine.rest_secs;

  // Derive current rep from elapsed time
  const currentSlot =
    phase === "exercise" && totalSlots > 0 && timePerSlot > 0
      ? Math.min(Math.floor(elapsed / timePerSlot), totalSlots - 1)
      : 0;
  const currentRep =
    images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  // Play sound when rep changes
  useEffect(() => {
    if (phase !== "exercise") {
      prevRepRef.current = 1;
      return;
    }
    if (currentRep !== prevRepRef.current && exerciseRepetitions > 1) {
      playRep(currentRep, exerciseRepetitions);
    }
    prevRepRef.current = currentRep;
  }, [currentRep, exerciseRepetitions, phase, playRep]);

  // Play tick every second during rest
  const restSecond = phase === "rest" ? Math.floor(elapsed) : -1;
  useEffect(() => {
    if (phase !== "rest" || !isPlaying) {
      prevTickSecRef.current = -1;
      return;
    }
    if (restSecond !== prevTickSecRef.current && restSecond >= 0) {
      play("tick");
    }
    prevTickSecRef.current = restSecond;
  }, [restSecond, phase, isPlaying, play]);

  useEffect(() => {
    if (!isPlaying || phase === "finished") return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;

        if (phase === "exercise" && totalSlots > 0 && timePerSlot > 0) {
          const nextSlot = Math.min(
            Math.floor(next / timePerSlot),
            totalSlots - 1,
          );
          setImageIndex(nextSlot % images.length);
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
    timePerSlot,
    totalSlots,
    steps,
  ]);

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

  // Current active set index for the tree highlight
  const activeSetIndex =
    currentStep?.type === "exercise"
      ? currentStep.setIndex
      : currentStep?.type === "rest"
        ? currentStep.afterSetIndex
        : -1;
  const activeExerciseInSet =
    currentStep?.type === "exercise" ? currentStep.exerciseInSetIndex : -1;

  const headerContent = (
    <>
      {phase !== "finished" && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {setTree.map((node, si) => {
            const isDone =
              si < activeSetIndex ||
              (si === activeSetIndex && phase === "rest");
            const isCurrent = si === activeSetIndex && phase === "exercise";

            return (
              <div
                key={si}
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
                  {isDone ? "✓ " : ""}
                  {node.name}
                </div>
                {node.roundLabel && (
                  <div
                    className={`${isCurrent ? "text-blue-500" : isDone ? "text-green-400" : "text-gray-400"}`}
                  >
                    Ronda {node.roundLabel}
                  </div>
                )}
                {isCurrent && (
                  <div className="mt-1 space-y-0.5">
                    {node.exercises.map((ex, ei) => {
                      const exDone = ei < activeExerciseInSet;
                      const exActive = ei === activeExerciseInSet;
                      return (
                        <div
                          key={ei}
                          className={`truncate max-w-[7rem] ${
                            exActive
                              ? "text-blue-700 font-semibold"
                              : exDone
                                ? "text-green-500 line-through"
                                : "text-gray-400"
                          }`}
                        >
                          {exDone ? "✓ " : exActive ? "▸ " : "  "}
                          {ex.title}
                          {ex.repetitions > 1 && (
                            <span className="opacity-60 font-normal">
                              {" "}
                              ×{ex.repetitions}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {phase === "exercise" && currentStep?.type === "exercise" && (
        <div>
          <p className="text-sm font-medium truncate">
            {currentStep.exercise.title}
          </p>
        </div>
      )}

      {phase === "rest" && (
        <div>
          <p className="text-xs text-gray-400">Descanso entre sets</p>
        </div>
      )}
    </>
  );

  return (
    <PlayerModalShell
      title={routine.name}
      onClose={onClose}
      progress={phase === "finished" ? 100 : overallProgress}
      header={headerContent}
      controls={
        <>
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
        </>
      }
    >
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
          {currentStep?.type === "rest" && currentStep.nextSetName && (
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-400">Siguiente set</p>
              <p className="text-sm font-medium text-gray-600">
                {currentStep.nextSetName}
                {currentStep.nextRoundLabel && (
                  <span className="ml-1 text-purple-500 text-xs">
                    Ronda {currentStep.nextRoundLabel}
                  </span>
                )}
              </p>
            </div>
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
    </PlayerModalShell>
  );
}
