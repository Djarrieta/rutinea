-- ─── Exercises ────────────────────────────────────────────────────────────────

drop table if exists public.exercises cascade;

drop function if exists public.set_updated_at () cascade;

create extension if not exists "pgcrypto";

create table public.exercises (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
    title text not null,
    description text,
    images jsonb not null default '[]'::jsonb,
    tags text [] not null default '{}',
    duration_secs integer not null default 0,
    repetitions integer not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger exercises_updated_at
  before update on public.exercises
  for each row execute procedure public.set_updated_at();

-- Row Level Security (allow all for now — no auth)
alter table public.exercises enable row level security;

create policy "exercises: public read" on public.exercises for
select using (true);

create policy "exercises: owner insert" on public.exercises for insert
with
    check (auth.uid () = user_id);

create policy "exercises: owner update" on public.exercises
for update
    using (auth.uid () = user_id);

create policy "exercises: owner delete" on public.exercises for delete using (auth.uid () = user_id);