-- Allow adding the same exercise multiple times to a set.
alter table public.set_exercises
drop constraint if exists set_exercises_set_id_exercise_id_key;