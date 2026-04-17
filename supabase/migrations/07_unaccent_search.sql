-- ─── Accent-insensitive search ───────────────────────────────────────────────
-- Enable the unaccent extension (strips diacritics: ú→u, é→e, ñ→n, etc.)
create extension if not exists "unaccent" schema extensions;

-- Immutable wrapper required for generated columns and indexes.
-- The built-in unaccent() is STABLE, not IMMUTABLE, so Postgres won't allow
-- it in generated columns directly.
create or replace function public.f_unaccent(text)
returns text language sql immutable parallel safe strict as $$
  select extensions.unaccent($1);
$$;

-- ─── exercises: generated search columns ─────────────────────────────────────
alter table public.exercises
  add column if not exists title_search text
    generated always as (lower(public.f_unaccent(title))) stored,
  add column if not exists description_search text
    generated always as (lower(public.f_unaccent(coalesce(description, '')))) stored;

-- ─── sets: generated search column ───────────────────────────────────────────
alter table public.sets
  add column if not exists name_search text
    generated always as (lower(public.f_unaccent(name))) stored;

-- ─── routines: generated search column ───────────────────────────────────────
alter table public.routines
  add column if not exists name_search text
    generated always as (lower(public.f_unaccent(name))) stored;

-- ─── plans: generated search column ─────────────────────────────────────────
alter table public.plans
  add column if not exists name_search text
    generated always as (lower(public.f_unaccent(name))) stored;
