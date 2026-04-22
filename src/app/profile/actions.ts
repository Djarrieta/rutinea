'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { MAX_DESCRIPTION_LENGTH } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

function parseImageUrls(formData: FormData): string[] {
  const raw = ((formData.get('image_urls') as string) || '[]').trim()

  let imageUrls: unknown = []
  try {
    imageUrls = JSON.parse(raw)
  } catch {
    throw new Error('Formato de imagenes invalido')
  }

  if (!Array.isArray(imageUrls)) {
    throw new Error('Formato de imagenes invalido')
  }

  const cleanUrls = imageUrls
    .filter((value): value is string => typeof value === 'string')
    .map((url) => url.trim())
    .filter(Boolean)

  if (cleanUrls.length > 2) {
    throw new Error('Solo puedes subir hasta 2 imagenes por progreso')
  }

  for (const url of cleanUrls) {
    try {
      const candidate = new URL(url)
      if (!['http:', 'https:'].includes(candidate.protocol)) {
        throw new Error('invalid protocol')
      }
    } catch {
      throw new Error('Se encontro una URL de imagen invalida')
    }
  }

  return cleanUrls
}

export async function createProgressEntry(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const note = ((formData.get('note') as string) || '').trim().slice(0, MAX_DESCRIPTION_LENGTH)
  const imageUrls = parseImageUrls(formData)

  if (!note && imageUrls.length === 0) {
    throw new Error('Agrega una nota o al menos una imagen para guardar tu progreso')
  }

  const { error } = await supabase.from('progress_entries').insert({
    user_id: user.id,
    note: note || null,
    image_urls: imageUrls,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile')
  redirect('/profile')
}
