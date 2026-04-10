-- ─── Routines ─────────────────────────────────────────────────────────────────

create table public.routines (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    rest_secs integer not null default 60,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger routines_updated_at
  before update on public.routines
  for each row execute procedure public.set_updated_at();

-- Row Level Security (allow all for now — no auth)
alter table public.routines enable row level security;

create policy "routines: public read" on public.routines for
select using (true);

create policy "routines: public insert" on public.routines for insert
with
    check (true);

create policy "routines: public update" on public.routines
for update
    using (true);

create policy "routines: public delete" on public.routines for delete using (true);

-- ─── Routine ↔ Exercise join table ───────────────────────────────────────────

create table public.routine_exercises (
    id uuid primary key default gen_random_uuid (),
    routine_id uuid not null references public.routines (id) on delete cascade,
    exercise_id uuid not null references public.exercises (id) on delete cascade,
    position integer not null default 0,
    created_at timestamptz not null default now(),
    unique (routine_id, exercise_id)
);

create index routine_exercises_routine_pos on public.routine_exercises (routine_id, position);

alter table public.routine_exercises enable row level security;

create policy "routine_exercises: public read" on public.routine_exercises for
select using (true);

create policy "routine_exercises: public insert" on public.routine_exercises for insert
with
    check (true);

create policy "routine_exercises: public update" on public.routine_exercises
for update
    using (true);

create policy "routine_exercises: public delete" on public.routine_exercises for delete using (true);