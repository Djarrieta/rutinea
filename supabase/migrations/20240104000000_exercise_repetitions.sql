-- Add repetitions column to exercises (default 1 = current behaviour)
alter table public.exercises
add column repetitions integer not null default 1;