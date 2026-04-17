"use client";

import { useEffect, useState, useRef } from "react";
import type { RoutineWithSets, Exercise } from "@/types";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";
import PlayerControls from "@/app/components/PlayerControls";
import {
  PlayerPhasePreparation,
  PlayerPhaseExercise,
  PlayerPhaseFinished,
  PlayerPhaseRest,
  formatTime,
} from "@/app/components/player";
import { properCase } from "@/lib/format";

type Phase = "preparation" | "exercise" | "rest" | "finished";

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

  function initialPhase(): Phase {
    if (totalSteps === 0) return "finished";
    const first = steps[0];
    if (first.type === "exercise" && first.exercise.preparation_secs > 0)
      return "preparation";
    return first.type === "exercise" ? "exercise" : "rest";
  }

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(initialPhase);
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
  const exerciseTotalDuration = exerciseDuration * exerciseRepetitions;
  const exercisePreparationSecs = currentExercise?.preparation_secs ?? 0;
  const totalSlots = images.length * exerciseRepetitions;
  const timePerSlot = totalSlots > 0 ? exerciseTotalDuration / totalSlots : 0;
  const phaseDuration =
    phase === "preparation"
      ? exercisePreparationSecs
      : phase === "exercise"
        ? exerciseTotalDuration
        : routine.rest_secs;

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

  // Play tick every second during rest or preparation
  const tickPhase = phase === "rest" || phase === "preparation";
  const tickSecond = tickPhase ? Math.floor(elapsed) : -1;
  useEffect(() => {
    if (!tickPhase || !isPlaying) {
      prevTickSecRef.current = -1;
      return;
    }
    if (tickSecond !== prevTickSecRef.current && tickSecond >= 0) {
      play("tick");
    }
    prevTickSecRef.current = tickSecond;
  }, [tickSecond, tickPhase, isPlaying, play]);

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

        if (phase === "preparation" && next >= phaseDuration) {
          setPhase("exercise");
          return 0;
        }

        if (
          (phase === "exercise" || phase === "rest") &&
          next >= phaseDuration
        ) {
          const nextStepIdx = stepIndex + 1;
          if (nextStepIdx >= totalSteps) {
            setPhase("finished");
          } else {
            const nextStep = steps[nextStepIdx];
            setStepIndex(nextStepIdx);
            if (
              nextStep.type === "exercise" &&
              nextStep.exercise.preparation_secs > 0
            ) {
              setPhase("preparation");
            } else {
              setPhase(nextStep.type === "exercise" ? "exercise" : "rest");
            }
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

  const restart = () => {
    setStepIndex(0);
    setPhase(initialPhase());
    setElapsed(0);
    setImageIndex(0);
    setIsPlaying(true);
  };

  const totalDuration = steps.reduce(
    (sum, s) =>
      sum +
      (s.type === "exercise"
        ? (s.exercise.preparation_secs ?? 0) +
          s.exercise.duration_secs * s.exercise.repetitions
        : routine.rest_secs),
    0,
  );
  const stepDurationFn = (s: Step) =>
    s.type === "exercise"
      ? (s.exercise.preparation_secs ?? 0) +
        s.exercise.duration_secs * s.exercise.repetitions
      : routine.rest_secs;
  const completedDuration =
    steps.slice(0, stepIndex).reduce((sum, s) => sum + stepDurationFn(s), 0) +
    (phase === "preparation" ? elapsed : exercisePreparationSecs + elapsed);
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
        <div className="flex gap-1.5 overflow-x-auto pb-1 scroll-thin">
          {setTree.map((node, si) => {
            const isDone =
              si < activeSetIndex ||
              (si === activeSetIndex && phase === "rest");
            const isCurrent = si === activeSetIndex && phase === "exercise";

            return (
              <div
                key={si}
                className={`flex-shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] leading-tight transition-colors ${
                  isCurrent
                    ? "border-primary-500 bg-primary-500/10"
                    : isDone
                      ? "border-success-500/40 bg-success-50"
                      : "border-border bg-surface-alt/60 opacity-60"
                }`}
              >
                <div
                  className={`font-semibold truncate max-w-[8rem] ${isCurrent ? "text-primary-400" : isDone ? "text-success-400" : "text-text-faint"}`}
                >
                  {isDone ? "✓ " : ""}
                  {properCase(node.name)}
                </div>
                {node.roundLabel && (
                  <div
                    className={`text-[10px] ${isCurrent ? "text-primary-500/80" : isDone ? "text-success-400/70" : "text-text-faint"}`}
                  >
                    Ronda {node.roundLabel}
                  </div>
                )}
                {isCurrent && (
                  <div className="mt-1 space-y-0.5 border-t border-primary-500/20 pt-1">
                    {node.exercises.map((ex, ei) => {
                      const exDone = ei < activeExerciseInSet;
                      const exActive = ei === activeExerciseInSet;
                      return (
                        <div
                          key={ei}
                          className={`truncate max-w-[8rem] ${
                            exActive
                              ? "text-primary-400 font-semibold"
                              : exDone
                                ? "text-success-400 line-through opacity-70"
                                : "text-text-faint"
                          }`}
                        >
                          {exDone ? "✓ " : exActive ? "▸ " : "  "}
                          {properCase(ex.title)}
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

      {(phase === "exercise" || phase === "preparation") &&
        currentStep?.type === "exercise" && (
          <div>
            <p className="text-sm font-medium truncate">
              {phase === "preparation" ? "Preparación: " : ""}
              {properCase(currentStep.exercise.title)}
            </p>
          </div>
        )}

      {phase === "rest" && (
        <div>
          <p className="text-xs text-text-faint">Descanso entre sets</p>
        </div>
      )}
    </>
  );

  return (
    <PlayerModalShell
      title={properCase(routine.name)}
      onClose={onClose}
      progress={phase === "finished" ? 100 : overallProgress}
      header={headerContent}
      controls={
        <PlayerControls
          statusContent={
            phase === "finished" ? (
              <span className="text-xs text-success-400 font-medium">
                Completada
              </span>
            ) : phase === "rest" ? (
              <span className="text-xs text-accent-500 font-medium tabular-nums">
                Descanso · {Math.max(0, Math.ceil(routine.rest_secs - elapsed))}
                s
              </span>
            ) : (
              <span className="text-xs text-text-secondary font-medium tabular-nums">
                {currentStep?.type === "exercise"
                  ? `${currentStep.globalIndex + 1}/${totalExercises}`
                  : ""}
                <span className="text-text-faint">
                  {" "}
                  · {formatTime(completedDuration)} /{" "}
                  {formatTime(totalDuration)}
                </span>
              </span>
            )
          }
          finished={phase === "finished"}
          isPlaying={isPlaying}
          onRestart={restart}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      }
    >
      {phase === "preparation" && currentExercise && (
        <PlayerPhasePreparation
          elapsed={elapsed}
          totalSecs={exercisePreparationSecs}
          exerciseTitle={properCase(currentExercise.title)}
        />
      )}

      {phase === "exercise" && currentExercise && (
        <PlayerPhaseExercise
          images={images}
          currentImageIndex={images.length > 0 ? imageIndex % images.length : 0}
          imageKey={imageIndex}
          currentRep={currentRep}
          repetitions={exerciseRepetitions}
          description={
            images.length > 0
              ? images[imageIndex % images.length]?.description
              : undefined
          }
          elapsed={elapsed}
          totalDuration={exerciseTotalDuration}
          isPlaying={isPlaying}
        />
      )}

      {phase === "rest" && (
        <PlayerPhaseRest
          elapsed={elapsed}
          totalSecs={routine.rest_secs}
          nextSetName={
            currentStep?.type === "rest" ? currentStep.nextSetName : undefined
          }
          nextRoundLabel={
            currentStep?.type === "rest"
              ? currentStep.nextRoundLabel
              : undefined
          }
        />
      )}

      {phase === "finished" && (
        <PlayerPhaseFinished
          message="¡Rutina completada!"
          stats={[
            { value: formatTime(totalDuration), label: "Tiempo" },
            { value: String(totalExercises), label: "Ejercicios" },
            { value: String(sortedSets.length), label: "Sets" },
          ]}
        />
      )}
    </PlayerModalShell>
  );
}
