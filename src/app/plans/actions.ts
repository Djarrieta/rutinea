'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { CreatePlanInput, UpdatePlanInput } from '@/types'

export async function createPlan(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: CreatePlanInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
  }

  const dayEntries: { day_of_week: number; routine_id: string }[] = JSON.parse(
    (formData.get('day_entries') as string) || '[]',
  )

  const { data: plan, error } = await supabase
    .from('plans')
    .insert({ ...input, user_id: user.id })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (dayEntries.length > 0) {
    const rows = dayEntries.map((entry) => ({
      plan_id: plan.id,
      routine_id: entry.routine_id,
      day_of_week: entry.day_of_week,
    }))
    const { error: linkError } = await supabase
      .from('plan_routines')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/plans')
  redirect('/plans')
}

export async function updatePlan(id: string, formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const input: UpdatePlanInput = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
  }

  const dayEntries: { day_of_week: number; routine_id: string }[] = JSON.parse(
    (formData.get('day_entries') as string) || '[]',
  )

  const { error } = await supabase
    .from('plans')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  const { error: delError } = await supabase
    .from('plan_routines')
    .delete()
    .eq('plan_id', id)

  if (delError) throw new Error(delError.message)

  if (dayEntries.length > 0) {
    const rows = dayEntries.map((entry) => ({
      plan_id: id,
      routine_id: entry.routine_id,
      day_of_week: entry.day_of_week,
    }))
    const { error: linkError } = await supabase
      .from('plan_routines')
      .insert(rows)
    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/plans')
  redirect(`/plans/${id}`)
}

export async function deletePlan(id: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('plans').delete().eq('id', id).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/plans')
  redirect('/plans')
}
