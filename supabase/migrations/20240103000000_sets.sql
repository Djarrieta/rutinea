-- ─── Sets (groups of exercises) ───────────────────────────────────────────────

create table public.sets (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger sets_updated_at
  before update on public.sets
  for each row execute procedure public.set_updated_at();

alter table public.sets enable row level security;

create policy "sets: public read" on public.sets for
select using (true);

create policy "sets: public insert" on public.sets for insert
with
    check (true);

create policy "sets: public update" on public.sets
for update
    using (true);

create policy "sets: public delete" on public.sets for delete using (true);

-- ─── Set ↔ Exercise join table ───────────────────────────────────────────────

create table public.set_exercises (
    id uuid primary key default gen_random_uuid (),
    set_id uuid not null references public.sets (id) on delete cascade,
    exercise_id uuid not null references public.exercises (id) on delete cascade,
    position integer not null default 0,
    created_at timestamptz not null default now(),
    unique (set_id, exercise_id)
);

create index set_exercises_set_pos on public.set_exercises (set_id, position);

alter table public.set_exercises enable row level security;

create policy "set_exercises: public read" on public.set_exercises for
select using (true);

create policy "set_exercises: public insert" on public.set_exercises for insert
with
    check (true);

create policy "set_exercises: public update" on public.set_exercises
for update
    using (true);

create policy "set_exercises: public delete" on public.set_exercises for delete using (true);

-- ─── Routine ↔ Set join table (replaces routine_exercises) ───────────────────

drop table if exists public.routine_exercises cascade;

create table public.routine_sets (
    id uuid primary key default gen_random_uuid (),
    routine_id uuid not null references public.routines (id) on delete cascade,
    set_id uuid not null references public.sets (id) on delete cascade,
    position integer not null default 0,
    rounds integer not null default 1,
    created_at timestamptz not null default now(),
    unique (routine_id, set_id)
);

create index routine_sets_routine_pos on public.routine_sets (routine_id, position);

alter table public.routine_sets enable row level security;

create policy "routine_sets: public read" on public.routine_sets for
select using (true);

create policy "routine_sets: public insert" on public.routine_sets for insert
with
    check (true);

create policy "routine_sets: public update" on public.routine_sets
for update
    using (true);

create policy "routine_sets: public delete" on public.routine_sets for delete using (true);