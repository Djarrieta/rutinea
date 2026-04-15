import type { Exercise } from './exercise'
import type { Set } from './set'
import type { Routine, RoutineSet } from './routine'

/** Exercise within a set – if `id` is present it already exists, otherwise it will be created */
export type BundleExercise = Pick<
  Exercise,
  'title' | 'preparation_secs' | 'duration_secs' | 'repetitions'
> &
  Partial<Pick<Exercise, 'id' | 'description' | 'images' | 'tags'>>

export type BundleSet = Pick<Set, 'name'> &
  Partial<Pick<Set, 'description'>> &
  Pick<RoutineSet, 'rounds'> & {
    exercises: BundleExercise[]
  }

export interface RoutineBundle {
  routine: Pick<Routine, 'name' | 'description' | 'rest_secs'>
  sets: BundleSet[]
}
