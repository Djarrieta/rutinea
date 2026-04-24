export interface ExerciseImage {
  url: string
  description: string
}

export interface Exercise {
  id: string
  user_id: string
  title: string
  description: string | null
  images: ExerciseImage[]
  tags: string[]
  preparation_secs: number
  duration_secs: number
  repetitions: number
  clone_count: number
  created_at: string
  updated_at: string
  profile?: { display_name: string; avatar_url: string | null }
  is_approved: boolean
}

export type CreateExerciseInput = Omit<
  Exercise,
  'id' | 'user_id' | 'clone_count' | 'created_at' | 'updated_at' | 'profile' | 'is_approved'
>

export type UpdateExerciseInput = Partial<CreateExerciseInput>
