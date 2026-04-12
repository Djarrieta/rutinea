import { SetWithExercises } from './set'

export interface Routine {
  id: string
  user_id: string
  name: string
  description: string | null
  rest_secs: number
  created_at: string
  updated_at: string
}

export interface RoutineSet {
  id: string
  routine_id: string
  set_id: string
  position: number
  rounds: number
  created_at: string
  set: SetWithExercises
}

export interface RoutineWithSets extends Routine {
  routine_sets: RoutineSet[]
}

export type CreateRoutineInput = Pick<Routine, 'name' | 'description' | 'rest_secs'>

export type UpdateRoutineInput = Partial<CreateRoutineInput>
