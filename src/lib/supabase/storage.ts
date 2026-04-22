import { createClient } from '@/lib/supabase/client'

export async function uploadExerciseImage(file: File): Promise<string> {
  const supabase = createClient()

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('exercise-images')
    .upload(path, file)

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('exercise-images')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function uploadProgressImage(file: File): Promise<string> {
  const supabase = createClient()

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('progress-images')
    .upload(path, file)

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('progress-images')
    .getPublicUrl(path)

  return data.publicUrl
}
