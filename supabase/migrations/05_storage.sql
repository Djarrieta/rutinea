-- ─── Storage: exercise images bucket ────────────────────────────────────────

INSERT INTO
    storage.buckets (id, name, public)
VALUES (
        'exercise-images',
        'exercise-images',
        true
    )
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to make migration re-runnable
DROP POLICY IF EXISTS "public_read_exercise_images" ON storage.objects;

DROP POLICY IF EXISTS "allow_upload_exercise_images" ON storage.objects;

DROP POLICY IF EXISTS "allow_delete_exercise_images" ON storage.objects;

-- Anyone can read (public bucket)
CREATE POLICY "public_read_exercise_images" ON storage.objects FOR
SELECT USING (bucket_id = 'exercise-images');

-- Authenticated users can upload
CREATE POLICY "allow_upload_exercise_images" ON storage.objects FOR INSERT
WITH
    CHECK (
        bucket_id = 'exercise-images'
        AND auth.uid () IS NOT NULL
    );

-- Authenticated users can delete
CREATE POLICY "allow_delete_exercise_images" ON storage.objects FOR DELETE USING (
    bucket_id = 'exercise-images'
    AND auth.uid () IS NOT NULL
);