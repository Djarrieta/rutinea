export interface ExerciseImage {
  url: string
  description: string
}

export interface Exercise {
  id: string
  title: string
  description: string | null
  images: ExerciseImage[]
  tags: string[]
  duration_secs: number
  created_at: string
  updated_at: string
}

export type CreateExerciseInput = Pick<
  Exercise,
  'title' | 'description' | 'images' | 'tags' | 'duration_secs'
>

export type UpdateExerciseInput = Partial<CreateExerciseInput>

// ─── Routines ──────────────────────────────────────────────────────────────────

export interface Routine {
  id: string
  name: string
  description: string | null
  rest_secs: number
  created_at: string
  updated_at: string
}

// ─── Sets ──────────────────────────────────────────────────────────────────────

export interface Set {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface SetExercise {
  id: string
  set_id: string
  exercise_id: string
  position: number
  created_at: string
  exercise: Exercise
}

export interface SetWithExercises extends Set {
  set_exercises: SetExercise[]
}

export type CreateSetInput = Pick<Set, 'name' | 'description'>

export type UpdateSetInput = Partial<CreateSetInput>

// ─── Routine ↔ Sets ────────────────────────────────────────────────────────────

export interface RoutineSet {
  id: string
  routine_id: string
  set_id: string
  position: number
  created_at: string
  set: SetWithExercises
}

export interface RoutineWithSets extends Routine {
  routine_sets: RoutineSet[]
}

export type CreateRoutineInput = Pick<Routine, 'name' | 'description' | 'rest_secs'>

export type UpdateRoutineInput = Partial<CreateRoutineInput>
