"use client";

import { useEffect, useState, useRef } from "react";
import type { Exercise } from "@/types";
import { useRepSounds } from "@/lib/hooks/useRepSounds";
import PlayerModalShell from "@/app/components/PlayerModalShell";
import PlayerControls from "@/app/components/PlayerControls";
import {
  PlayerPhasePreparation,
  PlayerPhaseExercise,
  PlayerPhaseFinished,
  PlayerMiniTimer,
  formatTime,
} from "@/app/components/player";
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

  const currentImageIndex =
    images.length > 0 ? currentSlot % images.length : 0;
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
  const progress =
    overallTotal > 0 ? (overallElapsed / overallTotal) * 100 : 0;
  const finished = phase === "finished";

  const statusContent = phase === "preparation" ? (
    <span className="text-xs text-primary-500 font-medium tabular-nums">
      Preparación
    </span>
  ) : phase === "exercise" ? (
    <PlayerMiniTimer
      elapsed={elapsed}
      totalDuration={totalDuration}
      currentRep={currentRep}
      repetitions={repetitions}
    />
  ) : (
    <span className="text-xs text-success-400 font-medium">Completado</span>
  );

  return (
    <PlayerModalShell
      title={properCase(exercise.title)}
      onClose={onClose}
      progress={progress}
      controls={
        <PlayerControls
          statusContent={statusContent}
          finished={finished}
          isPlaying={isPlaying}
          onRestart={restart}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      }
    >
      {phase === "preparation" && (
        <PlayerPhasePreparation
          elapsed={elapsed}
          totalSecs={preparation_secs}
        />
      )}

      {phase === "exercise" && (
        <PlayerPhaseExercise
          images={images}
          currentImageIndex={currentImageIndex}
          imageKey={currentSlot}
          currentRep={currentRep}
          repetitions={repetitions}
          description={exercise.description}
          isPlaying={isPlaying}
        />
      )}

      {finished && (
        <PlayerPhaseFinished
          message="¡Ejercicio completado!"
          stats={[
            { value: formatTime(totalDuration), label: "Tiempo" },
            ...(repetitions > 1
              ? [{ value: String(repetitions), label: "Reps" }]
              : []),
            ...(images.length > 1
              ? [{ value: String(images.length), label: "Poses" }]
              : []),
          ]}
        />
      )}
    </PlayerModalShell>
  );
}
