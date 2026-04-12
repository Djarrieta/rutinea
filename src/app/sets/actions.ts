'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { CreateSetInput, UpdateSetInput } from '@/types'

export async function createSet(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: CreateSetInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
  }

  const exerciseIds: string[] = JSON.parse(
    (formData.get('exercise_ids') as string) || '[]',
  )

  const { data: set, error } = await supabase
    .from('sets')
    .insert({ ...input, user_id: user.id })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (exerciseIds.length > 0) {
    const rows = exerciseIds.map((exercise_id, i) => ({
      set_id: set.id,
      exercise_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('set_exercises')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/sets')
  redirect('/sets')
}

export async function updateSet(id: string, formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: UpdateSetInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
  }

  const exerciseIds: string[] = JSON.parse(
    (formData.get('exercise_ids') as string) || '[]',
  )

  const { error } = await supabase
    .from('sets')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  const { error: delError } = await supabase
    .from('set_exercises')
    .delete()
    .eq('set_id', id)

  if (delError) throw new Error(delError.message)

  if (exerciseIds.length > 0) {
    const rows = exerciseIds.map((exercise_id, i) => ({
      set_id: id,
      exercise_id,
      position: i,
    }))
    const { error: linkError } = await supabase
      .from('set_exercises')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/sets')
  redirect(`/sets/${id}`)
}

export async function deleteSet(id: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('sets').delete().eq('id', id).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/sets')
  redirect('/sets')
}
