import { RoutineWithSets } from './routine'

export const DAY_LABELS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const

export interface Plan {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface PlanRoutine {
  id: string
  plan_id: string
  routine_id: string
  day_of_week: number
  created_at: string
  routine: RoutineWithSets
}

export interface PlanWithRoutines extends Plan {
  plan_routines: PlanRoutine[]
}

export type CreatePlanInput = Pick<Plan, 'name' | 'description'>

export type UpdatePlanInput = Partial<CreatePlanInput>
