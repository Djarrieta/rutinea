import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PlanWithRoutines, PlanBundle, PlanBundleDay, BundleSet, BundleExercise } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: plan, error } = await supabase
    .from('plans')
    .select(
      '*, plan_routines(*, routine:routines(*, routine_sets(*, set:sets(*, set_exercises(*, exercise:exercises(*))))))',
    )
    .eq('id', id)
    .single<PlanWithRoutines>()

  if (error || !plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  }

  const sortedDays = [...plan.plan_routines].sort(
    (a, b) => a.day_of_week - b.day_of_week,
  )

  const bundle: PlanBundle = {
    plan: {
      name: plan.name,
      description: plan.description,
    },
    days: sortedDays.map((pr): PlanBundleDay => {
      const routine = pr.routine
      const sortedSets = [...routine.routine_sets].sort(
        (a, b) => a.position - b.position,
      )

      return {
        day_of_week: pr.day_of_week,
        routine: {
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
        },
      }
    }),
  }

  return NextResponse.json(bundle)
}
