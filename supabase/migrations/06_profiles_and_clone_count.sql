-- ─── Profiles (public mirror of auth.users) ──────────────────────────────────

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text not null default '',
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles: public read" on public.profiles for
select using (true);

create policy "profiles: owner insert" on public.profiles for insert
with
    check (auth.uid () = id);

create policy "profiles: owner update" on public.profiles
for update
    using (auth.uid () = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- FK from entity tables to profiles so PostgREST can join them
alter table public.exercises
add constraint exercises_user_id_profiles_fk foreign key (user_id) references public.profiles (id);

alter table public.sets
add constraint sets_user_id_profiles_fk foreign key (user_id) references public.profiles (id);

alter table public.routines
add constraint routines_user_id_profiles_fk foreign key (user_id) references public.profiles (id);

alter table public.plans
add constraint plans_user_id_profiles_fk foreign key (user_id) references public.profiles (id);

-- ─── Clone count on all entity tables ────────────────────────────────────────

alter table public.exercises
add column if not exists clone_count integer not null default 0;

alter table public.sets
add column if not exists clone_count integer not null default 0;

alter table public.routines
add column if not exists clone_count integer not null default 0;

alter table public.plans
add column if not exists clone_count integer not null default 0;

-- Generic function to increment clone_count on any entity table
create or replace function public.increment_clone_count(table_name text, row_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if table_name = 'exercises' then
    update public.exercises set clone_count = clone_count + 1 where id = row_id;
  elsif table_name = 'sets' then
    update public.sets set clone_count = clone_count + 1 where id = row_id;
  elsif table_name = 'routines' then
    update public.routines set clone_count = clone_count + 1 where id = row_id;
  elsif table_name = 'plans' then
    update public.plans set clone_count = clone_count + 1 where id = row_id;
  end if;
end;
$$;