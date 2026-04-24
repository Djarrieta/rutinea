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

/** Convert JS Date.getDay() (0=Sun) to day_of_week index (0=Mon) */
export function getTodayDayIndex(): number {
  return (new Date().getDay() + 6) % 7
}

export interface Plan {
  id: string
  user_id: string
  name: string
  description: string | null
  clone_count: number
  created_at: string
  updated_at: string
  profile?: { display_name: string; avatar_url: string | null }
  is_approved: boolean
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

export type CreatePlanInput = Omit<Plan, 'id' | 'user_id' | 'clone_count' | 'created_at' | 'updated_at' | 'profile' | 'is_approved'>

export type UpdatePlanInput = Partial<CreatePlanInput>
