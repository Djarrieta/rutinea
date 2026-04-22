-- ─── User progress entries ───────────────────────────────────────────────────

create table if not exists public.progress_entries (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    note text,
    image_urls text [] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint progress_entries_note_or_image_check check (
        coalesce(length(trim(note)), 0) > 0
        or cardinality(image_urls) > 0
    ),
    constraint progress_entries_max_images_check check (cardinality(image_urls) <= 2)
);

create index if not exists progress_entries_user_id_created_at_idx on public.progress_entries (user_id, created_at desc);

drop trigger if exists progress_entries_updated_at on public.progress_entries;

create trigger progress_entries_updated_at before
update on public.progress_entries for each row execute procedure public.set_updated_at();

alter table public.progress_entries enable row level security;

drop policy if exists "progress_entries: owner read" on public.progress_entries;

drop policy if exists "progress_entries: owner insert" on public.progress_entries;

drop policy if exists "progress_entries: owner update" on public.progress_entries;

drop policy if exists "progress_entries: owner delete" on public.progress_entries;

create policy "progress_entries: owner read" on public.progress_entries for
select using (auth.uid () = user_id);

create policy "progress_entries: owner insert" on public.progress_entries for insert
with
    check (auth.uid () = user_id);

create policy "progress_entries: owner update" on public.progress_entries
for update
    using (auth.uid () = user_id);

create policy "progress_entries: owner delete" on public.progress_entries for delete using (auth.uid () = user_id);

-- ─── Storage: progress images bucket ─────────────────────────────────────────

insert into
    storage.buckets (id, name, public)
values (
        'progress-images',
        'progress-images',
        true
    )
on conflict (id) do nothing;

drop policy if exists "public_read_progress_images" on storage.objects;

drop policy if exists "allow_upload_progress_images" on storage.objects;

drop policy if exists "allow_update_progress_images" on storage.objects;

drop policy if exists "allow_delete_progress_images" on storage.objects;

create policy "public_read_progress_images" on storage.objects for
select using (bucket_id = 'progress-images');

create policy "allow_upload_progress_images" on storage.objects for insert
with
    check (
        bucket_id = 'progress-images'
        and auth.uid () is not null
    );

create policy "allow_update_progress_images" on storage.objects
for update
    using (
        bucket_id = 'progress-images'
        and auth.uid () is not null
    );

create policy "allow_delete_progress_images" on storage.objects for delete using (
    bucket_id = 'progress-images'
    and auth.uid () is not null
);