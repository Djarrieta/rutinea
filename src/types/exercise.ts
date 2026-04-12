export interface ExerciseImage {
  url: string
  description: string
}

export interface Exercise {
  id: string
  title: string
  description: string | null
  images: ExerciseImage[]
  tags: string[]
  duration_secs: number
  repetitions: number
  created_at: string
  updated_at: string
}

export type CreateExerciseInput = Pick<
  Exercise,
  'title' | 'description' | 'images' | 'tags' | 'duration_secs' | 'repetitions'
>

export type UpdateExerciseInput = Partial<CreateExerciseInput>
