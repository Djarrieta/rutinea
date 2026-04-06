-- Add is_public flag to exercises so they can be shared/discovered
alter table public.exercises
add column is_public boolean not null default false;

-- Allow anyone to read public exercises
create policy "exercises: public read" on public.exercises for
select using (is_public = true);

-- Index for filtering public exercises
create index exercises_is_public_idx on public.exercises (is_public)
where
    is_public = true;