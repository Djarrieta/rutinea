-- ─── Drop everything to start fresh ──────────────────────────────────────────

drop table if exists public.exercises cascade;

drop function if exists public.set_updated_at () cascade;

-- ─── Exercises ────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table public.exercises (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    description text,
    image_urls text [] not null default '{}',
    duration_secs integer not null default 0,
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

create policy "exercises: public insert" on public.exercises for insert
with
    check (true);

create policy "exercises: public update" on public.exercises
for update
    using (true);

create policy "exercises: public delete" on public.exercises for delete using (true);