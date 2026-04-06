export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Exercise {
  id: string
  user_id: string
  name: string
  image_url: string | null
  tips: string | null
  default_duration_seconds: number | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Routine {
  id: string
  user_id: string
  title: string
  description: string | null
  slug: string
  is_public: boolean
  forked_from_id: string | null
  created_at: string
  updated_at: string
  // joined fields
  sets?: Set[]
  profile?: Pick<Profile, 'full_name' | 'avatar_url'>
}

export interface Set {
  id: string
  routine_id: string
  exercise_id: string
  position: number
  reps: number | null
  duration_seconds: number | null
  rest_seconds: number
  notes: string | null
  created_at: string
  // joined fields
  exercise?: Exercise
}

// ─── API / Form helpers ───────────────────────────────────────────────────────

export type CreateExerciseInput = Pick<
  Exercise,
  'name' | 'image_url' | 'tips' | 'default_duration_seconds'
>

export type CreateRoutineInput = Pick<
  Routine,
  'title' | 'description' | 'is_public'
> & { sets: CreateSetInput[] }

export type CreateSetInput = Pick<
  Set,
  'exercise_id' | 'position' | 'reps' | 'duration_seconds' | 'rest_seconds' | 'notes'
>
