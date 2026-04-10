'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CreateRoutineInput, UpdateRoutineInput } from '@/types'

export async function createRoutine(formData: FormData) {
  const supabase = await createClient()

  const input: CreateRoutineInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    rest_secs: Number(formData.get('rest_secs')) || 60,
  }

  const exerciseIds: string[] = JSON.parse(
    (formData.get('exercise_ids') as string) || '[]',
  )

  const { data: routine, error } = await supabase
    .from('routines')
    .insert(input)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (exerciseIds.length > 0) {
    const rows = exerciseIds.map((exercise_id, i) => ({
      routine_id: routine.id,
      exercise_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('routine_exercises')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/routines')
  redirect('/routines')
}

export async function updateRoutine(id: string, formData: FormData) {
  const supabase = await createClient()

  const input: UpdateRoutineInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    rest_secs: Number(formData.get('rest_secs')) || 60,
  }

  const exerciseIds: string[] = JSON.parse(
    (formData.get('exercise_ids') as string) || '[]',
  )

  const { error } = await supabase
    .from('routines')
    .update(input)
    .eq('id', id)

  if (error) throw new Error(error.message)

  // Replace all linked exercises: delete existing, insert new
  const { error: delError } = await supabase
    .from('routine_exercises')
    .delete()
    .eq('routine_id', id)

  if (delError) throw new Error(delError.message)

  if (exerciseIds.length > 0) {
    const rows = exerciseIds.map((exercise_id, i) => ({
      routine_id: id,
      exercise_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('routine_exercises')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/routines')
  redirect(`/routines/${id}`)
}

export async function deleteRoutine(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('routines').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/routines')
  redirect('/routines')
}
