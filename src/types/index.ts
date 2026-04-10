export interface Exercise {
  id: string
  title: string
  description: string | null
  image_urls: string[]
  tags: string[]
  duration_secs: number
  created_at: string
  updated_at: string
}

export type CreateExerciseInput = Pick<
  Exercise,
  'title' | 'description' | 'image_urls' | 'tags' | 'duration_secs'
>

export type UpdateExerciseInput = Partial<CreateExerciseInput>
