'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { CreateExerciseInput, UpdateExerciseInput } from '@/types'

export async function createExercise(formData: FormData) {
  const supabase = await createClient()

  const input: CreateExerciseInput = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    image_urls: (formData.get('image_urls') as string)
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean),
    duration_secs: Number(formData.get('duration_secs')) || 0,
  }

  const { error } = await supabase.from('exercises').insert(input)

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect('/exercises')
}

export async function updateExercise(id: string, formData: FormData) {
  const supabase = await createClient()

  const input: UpdateExerciseInput = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    image_urls: (formData.get('image_urls') as string)
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean),
    duration_secs: Number(formData.get('duration_secs')) || 0,
  }

  const { error } = await supabase
    .from('exercises')
    .update(input)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect(`/exercises/${id}`)
}

export async function deleteExercise(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('exercises').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/exercises')
  redirect('/exercises')
}
