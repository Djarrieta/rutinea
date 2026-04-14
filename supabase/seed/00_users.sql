-- ─── Seed Data ────────────────────────────────────────────────────────────────
-- User: 00000000-0000-0000-0000-000000000000 (seed user, owner of all demo data)

-- Create the seed user in auth.users if it doesn't exist (needed for local dev)
insert into
    auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin
    )
select
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'seed@rutinea.local',
    crypt (
        'password123',
        gen_salt ('bf')
    ),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Rutinea"}'::jsonb,
    false
where
    not exists (
        select 1
        from auth.users
        where
            id = '00000000-0000-0000-0000-000000000000'
    );

-- Create identity for the seed user (required by GoTrue for email/password login)
insert into
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
select '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '{"sub":"00000000-0000-0000-0000-000000000000","email":"seed@rutinea.local"}'::jsonb, 'email', now(), now(), now()
where
    not exists (
        select 1
        from auth.identities
        where
            user_id = '00000000-0000-0000-0000-000000000000'
    );

-- Create profile for seed user
insert into
    public.profiles (id, display_name, avatar_url)
values (
        '00000000-0000-0000-0000-000000000000',
        'Rutinea',
        null
    )
on conflict (id) do nothing;