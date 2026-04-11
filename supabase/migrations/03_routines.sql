-- ─── Routines ─────────────────────────────────────────────────────────────────

drop table if exists public.routines cascade;

drop table if exists public.routine_sets cascade;

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

-- ─── Routine ↔ Set join table ────────────────────────────────────────────────

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