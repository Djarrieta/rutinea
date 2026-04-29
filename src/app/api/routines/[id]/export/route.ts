import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { RoutineWithSets, RoutineBundle, BundleSet, BundleExercise } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: routine, error } = await supabase
    .from('routines')
    .select(
      '*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))',
    )
    .eq('id', id)
    .single<RoutineWithSets>()

  if (error || !routine) {
    return NextResponse.json({ error: 'Routine not found' }, { status: 404 })
  }

  const sortedSets = [...routine.routine_sets].sort(
    (a, b) => a.position - b.position,
  )

  const bundle: RoutineBundle = {
    routine: {
      name: routine.name,
      description: routine.description,
      rest_secs: routine.rest_secs,
    },
    sets: sortedSets.map((rs): BundleSet => {
      const sortedExercises = [...rs.set.set_exercises].sort(
        (a, b) => a.position - b.position,
      )
      return {
        name: rs.set.name,
        description: rs.set.description,
        preparation_secs: rs.set.preparation_secs,
        rounds: rs.rounds,
        exercises: sortedExercises.map((se): BundleExercise => ({
          id: se.exercise.id,
          title: se.exercise.title,
          description: se.exercise.description,
          images: se.exercise.images,
          tags: se.exercise.tags,
          preparation_secs: se.exercise.preparation_secs,
          duration_secs: se.exercise.duration_secs,
          repetitions: se.exercise.repetitions,
        })),
      }
    }),
  }

  return NextResponse.json(bundle)
}
