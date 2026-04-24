-- 1. Add is_admin column to profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 2. Add is_approved column to main tables
alter table public.exercises add column if not exists is_approved boolean not null default false;
alter table public.sets add column if not exists is_approved boolean not null default false;
alter table public.routines add column if not exists is_approved boolean not null default false;
alter table public.plans add column if not exists is_approved boolean not null default false;

-- 3. Update RLS policies for SELECT (Moderation visibility)
-- Exercises
drop policy if exists "exercises: public read" on public.exercises;
create policy "exercises: public read" on public.exercises for select
    using (auth.uid() = user_id or is_approved = true or (select is_admin from public.profiles where id = auth.uid()));

-- Sets
drop policy if exists "sets: public read" on public.sets;
create policy "sets: public read" on public.sets for select
    using (auth.uid() = user_id or is_approved = true or (select is_admin from public.profiles where id = auth.uid()));

-- Routines
drop policy if exists "routines: public read" on public.routines;
create policy "routines: public read" on public.routines for select
    using (auth.uid() = user_id or is_approved = true or (select is_admin from public.profiles where id = auth.uid()));

-- Plans
drop policy if exists "plans: public read" on public.plans;
create policy "plans: public read" on public.plans for select
    using (auth.uid() = user_id or is_approved = true or (select is_admin from public.profiles where id = auth.uid()));

-- 4. Update RLS policies for UPDATE (Allow admins to approve)
-- Exercises
drop policy if exists "exercises: owner update" on public.exercises;
create policy "exercises: owner or admin update" on public.exercises for update
    using (auth.uid() = user_id or (select is_admin from public.profiles where id = auth.uid()));

-- Sets
drop policy if exists "sets: owner update" on public.sets;
create policy "sets: owner or admin update" on public.sets for update
    using (auth.uid() = user_id or (select is_admin from public.profiles where id = auth.uid()));

-- Routines
drop policy if exists "routines: owner update" on public.routines;
create policy "routines: owner or admin update" on public.routines for update
    using (auth.uid() = user_id or (select is_admin from public.profiles where id = auth.uid()));

-- Plans
drop policy if exists "plans: owner update" on public.plans;
create policy "plans: owner or admin update" on public.plans for update
    using (auth.uid() = user_id or (select is_admin from public.profiles where id = auth.uid()));
