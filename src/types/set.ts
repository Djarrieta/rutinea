import { Exercise } from './exercise'

export interface Set {
  id: string
  user_id: string
  name: string
  description: string | null
  clone_count: number
  created_at: string
  updated_at: string
  profile?: { display_name: string; avatar_url: string | null }
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

export type CreateSetInput = Omit<Set, 'id' | 'user_id' | 'clone_count' | 'created_at' | 'updated_at' | 'profile'>

export type UpdateSetInput = Partial<CreateSetInput>
