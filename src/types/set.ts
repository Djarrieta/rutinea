import { Exercise } from './exercise'

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
