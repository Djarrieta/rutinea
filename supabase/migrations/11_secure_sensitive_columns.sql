-- Protect sensitive columns from being updated by unauthorized users via the API

create or replace function public.protect_sensitive_columns()
returns trigger language plpgsql security definer as $$
declare
  is_user_admin boolean := false;
begin
  -- 1. Prevent privilege escalation on profiles
  if TG_TABLE_NAME = 'profiles' then
    if new.is_admin is distinct from old.is_admin then
      -- Only allow changes if it's the service_role (e.g., from the Supabase dashboard)
      if current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated' then
        new.is_admin = old.is_admin;
      end if;
    end if;
  end if;

  -- 2. Prevent self-approval of content
  if TG_TABLE_NAME in ('exercises', 'sets', 'routines', 'plans') then
    if new.is_approved is distinct from old.is_approved then
      -- Check if the current user is an admin
      select is_admin into is_user_admin from public.profiles where id = auth.uid();
      
      if not coalesce(is_user_admin, false) then
        -- If not an admin, revert the is_approved change
        new.is_approved = old.is_approved;
      end if;
    end if;
  end if;

  return new;
end;
$$;

-- Apply trigger to profiles
drop trigger if exists protect_profiles_admin on public.profiles;
create trigger protect_profiles_admin
  before update on public.profiles
  for each row execute procedure public.protect_sensitive_columns();

-- Apply trigger to exercises
drop trigger if exists protect_exercises_approval on public.exercises;
create trigger protect_exercises_approval
  before update on public.exercises
  for each row execute procedure public.protect_sensitive_columns();

-- Apply trigger to sets
drop trigger if exists protect_sets_approval on public.sets;
create trigger protect_sets_approval
  before update on public.sets
  for each row execute procedure public.protect_sensitive_columns();

-- Apply trigger to routines
drop trigger if exists protect_routines_approval on public.routines;
create trigger protect_routines_approval
  before update on public.routines
  for each row execute procedure public.protect_sensitive_columns();

-- Apply trigger to plans
drop trigger if exists protect_plans_approval on public.plans;
create trigger protect_plans_approval
  before update on public.plans
  for each row execute procedure public.protect_sensitive_columns();
