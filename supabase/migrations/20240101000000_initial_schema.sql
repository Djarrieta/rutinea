-- ─────────────────────────────────────────────────────────────────────────────
-- Rutinea — Schema completo (desarrollo)
-- Para resetear la BD, descomenta el bloque DROP y ejecuta todo el archivo.
-- ─────────────────────────────────────────────────────────────────────────────

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ ⚠️  DESCOMENTAR PARA DESTRUIR Y RECREAR TODO (pierde datos)               │
-- └─────────────────────────────────────────────────────────────────────────────┘
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user ();

drop trigger if exists exercises_updated_at on public.exercises;

drop trigger if exists routines_updated_at on public.routines;

drop function if exists public.set_updated_at ();

drop table if exists public.sets cascade;

drop table if exists public.routines cascade;

drop table if exists public.exercises cascade;

drop table if exists public.profiles cascade;

-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null,
    full_name text,
    avatar_url text,
    created_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Exercises ───────────────────────────────────────────────────────────────
create table public.exercises (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    name text not null,
    image_url text,
    tips text,
    default_duration_seconds integer,
    is_public boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ─── Routines ─────────────────────────────────────────────────────────────────
create table public.routines (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    title text not null,
    description text,
    slug text not null unique default encode(gen_random_bytes (6), 'hex'),
    is_public boolean not null default false,
    forked_from_id uuid references public.routines (id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ─── Sets ─────────────────────────────────────────────────────────────────────
create table public.sets (
    id uuid primary key default gen_random_uuid (),
    routine_id uuid not null references public.routines (id) on delete cascade,
    exercise_id uuid not null references public.exercises (id) on delete restrict,
    position integer not null default 0,
    reps integer,
    duration_seconds integer,
    rest_seconds integer not null default 60,
    notes text,
    created_at timestamptz not null default now(),
    constraint chk_set_type check (
        (
            reps is not null
            and duration_seconds is null
        )
        or (
            reps is null
            and duration_seconds is not null
        )
    )
);

-- ─── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger exercises_updated_at before update on public.exercises
  for each row execute procedure public.set_updated_at();

create trigger routines_updated_at before update on public.routines
  for each row execute procedure public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;

alter table public.exercises enable row level security;

alter table public.routines enable row level security;

alter table public.sets enable row level security;

-- profiles: users can read/update only their own profile
create policy "profiles: own read" on public.profiles for
select using (auth.uid () = id);

create policy "profiles: own update" on public.profiles
for update
    using (auth.uid () = id);

-- exercises: owned by user + public exercises readable by everyone
create policy "exercises: own all" on public.exercises for all using (auth.uid () = user_id);

create policy "exercises: public read" on public.exercises for
select using (is_public = true);

-- routines: owner has full access; public routines are readable by everyone
create policy "routines: own all" on public.routines for all using (auth.uid () = user_id);

create policy "routines: public read" on public.routines for
select using (is_public = true);

-- sets: accessible if the user owns the parent routine OR the routine is public
create policy "sets: own all" on public.sets for all using (
    exists (
        select 1
        from public.routines r
        where
            r.id = routine_id
            and r.user_id = auth.uid ()
    )
);

create policy "sets: public read" on public.sets for
select using (
        exists (
            select 1
            from public.routines r
            where
                r.id = routine_id
                and r.is_public = true
        )
    );

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index exercises_user_id_idx on public.exercises (user_id);

create index exercises_is_public_idx on public.exercises (is_public)
where
    is_public = true;

create index routines_user_id_idx on public.routines (user_id);

create index routines_slug_idx on public.routines (slug);

create index sets_routine_id_idx on public.sets (routine_id, position);