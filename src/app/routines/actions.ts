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

  const setIds: string[] = JSON.parse(
    (formData.get('set_ids') as string) || '[]',
  )

  const { data: routine, error } = await supabase
    .from('routines')
    .insert(input)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (setIds.length > 0) {
    const rows = setIds.map((set_id, i) => ({
      routine_id: routine.id,
      set_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('routine_sets')
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

  const setIds: string[] = JSON.parse(
    (formData.get('set_ids') as string) || '[]',
  )

  const { error } = await supabase
    .from('routines')
    .update(input)
    .eq('id', id)

  if (error) throw new Error(error.message)

  const { error: delError } = await supabase
    .from('routine_sets')
    .delete()
    .eq('routine_id', id)

  if (delError) throw new Error(delError.message)

  if (setIds.length > 0) {
    const rows = setIds.map((set_id, i) => ({
      routine_id: id,
      set_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('routine_sets')
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
