-- ─── Seed Data ────────────────────────────────────────────────────────────────
-- User: ec507c0b-6185-4c54-9cc5-2aa357e4bb6d (real user, owner of all data)

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
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
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
    '{}'::jsonb,
    false
where
    not exists (
        select 1
        from auth.users
        where
            id = 'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d'
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
select 'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d', 'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d', 'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d', '{"sub":"ec507c0b-6185-4c54-9cc5-2aa357e4bb6d","email":"seed@rutinea.local"}'::jsonb, 'email', now(), now(), now()
where
    not exists (
        select 1
        from auth.identities
        where
            user_id = 'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d'
    );

