"use client";

import { useEffect, useState, useRef } from "react";
import type { SetWithExercises, Exercise } from "@/types";
import { usePreloadImages } from "@/lib/hooks/usePreloadImages";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";
import PlayerControls from "@/app/components/PlayerControls";
import {
  PlayerPhasePreparation,
  PlayerPhaseExercise,
  PlayerPhaseFinished,
  formatTime,
} from "@/app/components/player";
import { properCase } from "@/lib/format";

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
  const [phase, setPhase] = useState<"preparation" | "exercise" | "finished">(
    () => {
      if (totalExercises === 0) return "finished";
      const first = exercises[0];
      return first && first.preparation_secs > 0 ? "preparation" : "exercise";
    },
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const finished = phase === "finished";
  const { playRep, play } = useRepSounds();
  const prevRepRef = useRef(1);
  const prevTickSecRef = useRef(-1);

  const currentExercise: Exercise | null = exercises[exerciseIndex] ?? null;
  const images = currentExercise?.images ?? [];

  usePreloadImages(images.map((image) => image.url));

  const duration = currentExercise?.duration_secs ?? 0;
  const repetitions = currentExercise?.repetitions ?? 1;
  const preparationSecs = currentExercise?.preparation_secs ?? 0;
  const activeExerciseRef = useRef<HTMLDivElement | null>(null);
  const exerciseTotalDuration = duration * repetitions;
  const totalSlots = images.length * repetitions;
  const timePerSlot = totalSlots > 0 ? exerciseTotalDuration / totalSlots : 0;

  const currentSlot =
    phase === "exercise" && totalSlots > 0 && timePerSlot > 0
      ? Math.min(Math.floor(elapsed / timePerSlot), totalSlots - 1)
      : 0;
  const imageIndex = images.length > 0 ? currentSlot % images.length : 0;
  const currentRep =
    images.length > 0 ? Math.floor(currentSlot / images.length) + 1 : 1;

  // Play sound when rep changes
  useEffect(() => {
    if (phase !== "exercise") {
      prevRepRef.current = 1;
      return;
    }
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

  // Timer
  useEffect(() => {
    if (!isPlaying || finished || !currentExercise) return;

    if (phase === "preparation") {
      const interval = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 0.1;
          if (next >= preparationSecs) {
            setPhase("exercise");
            return 0;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= exerciseTotalDuration) {
          const nextIdx = exerciseIndex + 1;
          if (nextIdx >= totalExercises) {
            setPhase("finished");
          } else {
            setExerciseIndex(nextIdx);
            prevRepRef.current = 1;
            const nextEx = exercises[nextIdx];
            setPhase(
              nextEx && nextEx.preparation_secs > 0
                ? "preparation"
                : "exercise",
            );
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
    phase,
    preparationSecs,
    exerciseTotalDuration,
    exerciseIndex,
    totalExercises,
    currentExercise,
    exercises,
  ]);

  const restart = () => {
    setExerciseIndex(0);
    setElapsed(0);
    const first = exercises[0];
    setPhase(
      totalExercises === 0
        ? "finished"
        : first && first.preparation_secs > 0
          ? "preparation"
          : "exercise",
    );
    setIsPlaying(true);
    prevRepRef.current = 1;
    prevTickSecRef.current = -1;
  };

  // Overall progress
  const totalDuration = exercises.reduce(
    (s, e) => s + (e.preparation_secs ?? 0) + e.duration_secs * e.repetitions,
    0,
  );
  const completedDuration =
    exercises
      .slice(0, exerciseIndex)
      .reduce(
        (s, e) =>
          s + (e.preparation_secs ?? 0) + e.duration_secs * e.repetitions,
        0,
      ) + (phase === "preparation" ? elapsed : preparationSecs + elapsed);
  const overallProgress =
    totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  useEffect(() => {
    activeExerciseRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [exerciseIndex]);

  const headerContent = !finished ? (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scroll-thin">
      {exercises.map((ex, i) => {
        const isDone = i < exerciseIndex;
        const isCurrent = i === exerciseIndex;
        return (
          <div
            ref={isCurrent ? activeExerciseRef : null}
            key={i}
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
              {isDone ? "✓ " : isCurrent ? "▸ " : ""}
              {properCase(ex.title)}
            </div>
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <PlayerModalShell
      title={properCase(set.name)}
      onClose={onClose}
      progress={finished ? 100 : overallProgress}
      header={headerContent}
      controls={
        <PlayerControls
          statusContent={
            finished ? (
              <span className="text-xs text-success-400 font-medium">
                Completado
              </span>
            ) : (
              <span className="text-xs text-text-secondary font-medium tabular-nums">
                {exerciseIndex + 1}/{totalExercises} ejercicios
                <span className="text-text-faint">
                  {" "}
                  · {formatTime(completedDuration)} /{" "}
                  {formatTime(totalDuration)}
                </span>
              </span>
            )
          }
          finished={finished}
          isPlaying={isPlaying}
          onRestart={restart}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      }
    >
      {phase === "preparation" && currentExercise && (
        <PlayerPhasePreparation
          elapsed={elapsed}
          totalSecs={preparationSecs}
          exerciseTitle={properCase(currentExercise.title)}
        />
      )}

      {phase === "exercise" && currentExercise && (
        <PlayerPhaseExercise
          images={images}
          currentImageIndex={imageIndex}
          currentRep={currentRep}
          repetitions={repetitions}
          description={
            currentExercise.description ??
            (images.length > 0 ? images[imageIndex]?.description : undefined)
          }
          elapsed={elapsed}
          totalDuration={exerciseTotalDuration}
          isPlaying={isPlaying}
        />
      )}

      {finished && (
        <PlayerPhaseFinished
          message="¡Set completado!"
          stats={[
            { value: formatTime(totalDuration), label: "Tiempo" },
            { value: String(totalExercises), label: "Ejercicios" },
          ]}
        />
      )}
    </PlayerModalShell>
  );
}
