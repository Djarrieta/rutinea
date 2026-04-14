'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { CreateExerciseInput, UpdateExerciseInput, ExerciseImage } from '@/types'

function parseImages(formData: FormData): ExerciseImage[] {
  const raw = formData.get('images') as string || '[]'
  try {
    return JSON.parse(raw) as ExerciseImage[]
  } catch {
    return []
  }
}

export async function createExercise(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: CreateExerciseInput = {
    title: (formData.get('title') as string).toLowerCase(),
    description: (formData.get('description') as string)?.toLowerCase() || null,
    images: parseImages(formData),
    tags: (formData.get('tags') as string || '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    duration_secs: Number(formData.get('duration_secs')) || 0,
    repetitions: Number(formData.get('repetitions')) || 1,
  }

  const { error } = await supabase.from('exercises').insert({ ...input, user_id: user.id })

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect('/exercises')
}

export async function updateExercise(id: string, formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: UpdateExerciseInput = {
    title: (formData.get('title') as string).toLowerCase(),
    description: (formData.get('description') as string)?.toLowerCase() || null,
    images: parseImages(formData),
    tags: (formData.get('tags') as string || '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    duration_secs: Number(formData.get('duration_secs')) || 0,
    repetitions: Number(formData.get('repetitions')) || 1,
  }

  const { error } = await supabase
    .from('exercises')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect(`/exercises/${id}`)
}

export async function cloneExercise(id: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: source, error: fetchError } = await supabase
    .from('exercises')
    .select('title, description, images, tags, duration_secs, repetitions')
    .eq('id', id)
    .single()

  if (fetchError || !source) throw new Error(fetchError?.message ?? 'Exercise not found')

  const { data: clone, error } = await supabase
    .from('exercises')
    .insert({ ...source, title: `${source.title} [clon]`, user_id: user.id })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await supabase.rpc('increment_clone_count', { table_name: 'exercises', row_id: id })

  revalidatePath('/exercises')
  redirect(`/exercises/${clone.id}/edit`)
}

export async function deleteExercise(id: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('exercises').delete().eq('id', id).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect('/exercises')
}
