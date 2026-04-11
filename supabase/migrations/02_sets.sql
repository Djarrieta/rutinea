-- ─── Sets (groups of exercises) ───────────────────────────────────────────────

drop table if exists public.sets cascade;

drop table if exists public.set_exercises cascade;

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