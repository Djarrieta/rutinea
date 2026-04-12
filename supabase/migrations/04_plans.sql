-- ─── Plans (weekly schedule of routines) ──────────────────────────────────────

drop table if exists public.plans cascade;

drop table if exists public.plan_routines cascade;

create table public.plans (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger plans_updated_at
  before update on public.plans
  for each row execute procedure public.set_updated_at();

alter table public.plans enable row level security;

create policy "plans: public read" on public.plans for
select using (true);

create policy "plans: owner insert" on public.plans for insert
with
    check (auth.uid () = user_id);

create policy "plans: owner update" on public.plans
for update
    using (auth.uid () = user_id);

create policy "plans: owner delete" on public.plans for delete using (auth.uid () = user_id);

-- ─── Plan ↔ Routine join table (day_of_week: 0=lunes … 6=domingo) ───────────

create table public.plan_routines (
    id uuid primary key default gen_random_uuid (),
    plan_id uuid not null references public.plans (id) on delete cascade,
    routine_id uuid not null references public.routines (id) on delete cascade,
    day_of_week integer not null check (day_of_week between 0 and 6),
    created_at timestamptz not null default now(),
    unique (plan_id, day_of_week)
);

create index plan_routines_plan_day on public.plan_routines (plan_id, day_of_week);

alter table public.plan_routines enable row level security;

create policy "plan_routines: public read" on public.plan_routines for
select using (true);

create policy "plan_routines: owner insert" on public.plan_routines for insert
with
    check (
        exists (
            select 1
            from public.plans
            where
                id = plan_id
                and user_id = auth.uid ()
        )
    );

create policy "plan_routines: owner update" on public.plan_routines
for update
    using (
        exists (
            select 1
            from public.plans
            where
                id = plan_id
                and user_id = auth.uid ()
        )
    );

create policy "plan_routines: owner delete" on public.plan_routines for delete using (
    exists (
        select 1
        from public.plans
        where
            id = plan_id
            and user_id = auth.uid ()
    )
);