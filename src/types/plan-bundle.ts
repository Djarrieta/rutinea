import type { RoutineBundle } from './routine-bundle'
import type { Plan } from './plan'

export interface PlanBundleDay {
  day_of_week: number
  routine: RoutineBundle
}

export interface PlanBundle {
  plan: Pick<Plan, 'name' | 'description'>
  days: PlanBundleDay[]
}
