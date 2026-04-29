-- Add preparation_secs to sets (countdown before the first exercise starts)

alter table public.sets
  add column preparation_secs integer not null default 0;
