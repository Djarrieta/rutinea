import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import type { RoutineBundle, BundleExercise } from '@/types'
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '@/lib/constants'

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let bundle: RoutineBundle
  try {
    bundle = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!bundle.routine?.name || !Array.isArray(bundle.sets)) {
    return NextResponse.json(
      { error: 'Missing routine.name or sets array' },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  // 1. Resolve exercises – reuse existing by id, create missing ones
  const exerciseIdMap = new Map<string, string>() // key: "setIdx-exIdx" → exercise_id

  for (let si = 0; si < bundle.sets.length; si++) {
    for (let ei = 0; ei < bundle.sets[si].exercises.length; ei++) {
      const ex = bundle.sets[si].exercises[ei]
      const key = `${si}-${ei}`

      if (ex.id) {
        // Verify the exercise exists
        const { data } = await supabase
          .from('exercises')
          .select('id')
          .eq('id', ex.id)
          .single()

        if (data) {
          exerciseIdMap.set(key, data.id)
          continue
        }
        // If not found, fall through to create
      }

      const newExercise = await createExercise(supabase, user.id, ex)
      if (!newExercise) {
        return NextResponse.json(
          { error: `Failed to create exercise: ${ex.title}` },
          { status: 500 },
        )
      }
      exerciseIdMap.set(key, newExercise.id)
    }
  }

  // 2. Create sets and link exercises
  const setEntries: { id: string; rounds: number }[] = []

  for (let si = 0; si < bundle.sets.length; si++) {
    const bs = bundle.sets[si]

    const { data: newSet, error: setError } = await supabase
      .from('sets')
      .insert({
        name: bs.name.toLowerCase().slice(0, MAX_TITLE_LENGTH),
        description: bs.description?.toLowerCase().slice(0, MAX_DESCRIPTION_LENGTH) ?? null,
        preparation_secs: bs.preparation_secs ?? 0,
        user_id: user.id,
      })
      .select('id')
      .single()

    if (setError || !newSet) {
      return NextResponse.json(
        { error: `Failed to create set: ${bs.name}` },
        { status: 500 },
      )
    }

    // Link exercises to set
    const exerciseRows = bs.exercises.map((_, ei) => ({
      set_id: newSet.id,
      exercise_id: exerciseIdMap.get(`${si}-${ei}`)!,
      position: ei,
    }))

    if (exerciseRows.length > 0) {
      const { error: linkError } = await supabase
        .from('set_exercises')
        .insert(exerciseRows)
      if (linkError) {
        return NextResponse.json(
          { error: `Failed to link exercises to set: ${bs.name}` },
          { status: 500 },
        )
      }
    }

    setEntries.push({ id: newSet.id, rounds: bs.rounds })
  }

  // 3. Create routine and link sets
  const { data: routine, error: routineError } = await supabase
    .from('routines')
    .insert({
      name: bundle.routine.name.toLowerCase().slice(0, MAX_TITLE_LENGTH),
      description: bundle.routine.description?.toLowerCase().slice(0, MAX_DESCRIPTION_LENGTH) ?? null,
      rest_secs: bundle.routine.rest_secs,
      user_id: user.id,
    })
    .select('id')
    .single()

  if (routineError || !routine) {
    return NextResponse.json(
      { error: 'Failed to create routine' },
      { status: 500 },
    )
  }

  if (setEntries.length > 0) {
    const routineSetRows = setEntries.map((entry, i) => ({
      routine_id: routine.id,
      set_id: entry.id,
      position: i,
      rounds: entry.rounds,
    }))

    const { error: linkError } = await supabase
      .from('routine_sets')
      .insert(routineSetRows)
    if (linkError) {
      return NextResponse.json(
        { error: 'Failed to link sets to routine' },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ id: routine.id }, { status: 201 })
}

async function createExercise(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  ex: BundleExercise,
) {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      user_id: userId,
      title: ex.title.toLowerCase().slice(0, MAX_TITLE_LENGTH),
      description: ex.description?.toLowerCase().slice(0, MAX_DESCRIPTION_LENGTH) ?? null,
      images: ex.images ?? [],
      tags: ex.tags ?? [],
      preparation_secs: ex.preparation_secs,
      duration_secs: ex.duration_secs,
      repetitions: ex.repetitions,
    })
    .select('id')
    .single()

  if (error) return null
  return data
}
