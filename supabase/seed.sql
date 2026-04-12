-- Create a test user for seed data
-- Disable triggers temporarily to avoid profile trigger dependency
SET session_replication_role = 'replica';

INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        'a0000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'seed@test.com',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        ''
    )
ON CONFLICT (id) DO NOTHING;

SET session_replication_role = 'origin';

-- Seed exercises with example data

insert into
    public.exercises (
        user_id,
        title,
        description,
        images,
        tags,
        duration_secs,
        repetitions
    )
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Pecho Plano Banco',
        'Acuéstate en un banco plano con una barra sobre tu pecho. Agarra la barra con un agarre ligeramente más ancho que el ancho de tus hombros. Baja la barra controladamente hasta que esté a la altura del pecho, luego empuja hacia arriba hasta extender completamente los brazos.',
        '[{"url":"https://fitcron.com/wp-content/uploads/2021/03/00251301-Barbell-Bench-Press_Chest-FIX_720.gif","description":"Mantén la espalda recta"}]'::jsonb,
        '{"Brazos", "Pecho","Barras, Banco"}',
        20,
        10
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Full Body Mancuernas',
        'Biseps curl, mancuernas arriba, mancuernas atras, mancuernas arriba, mancuernas abajo, sentadilla con mancuernas, peso muerto con mancuernas.',
        '[{"url":"https://images.unsplash.com/photo-1513352098199-8ccf457b35a8?w=800&fit=crop","description":"Mantén la espalda recta"},{"url":"https://images.unsplash.com/photo-1517964706594-8bf49837d8dc?w=800&fit=crop","description":"No dejes que las rodillas pasen los pies"},{"url":"https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&fit=crop","description":"Empuja con los talones"}]'::jsonb,
        '{"Brazos", "Mancuernas","piernas"}',
        90,
        10
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Bench Press',
        'Lie on a flat bench, lower the barbell to your chest, then press it back up to full arm extension.',
        '[{"url":"https://atopedegym.com/wp-content/uploads/2025/02/press-banca-como-hacer-768x515.png","description":"Baja la barra controladamente"}]'::jsonb,
        '{"banco","barra","pecho"}',
        12,
        10
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Pecho Plano Mancuernas',
        'Acuéstate en un banco plano con una mancuerna en cada mano. Baja las mancuernas controladamente hasta que estén a la altura del pecho, luego empuja hacia arriba hasta extender completamente los brazos.',
        '[{"url":"{{STORAGE_URL}}/storage/v1/object/public/exercise-images/seed/pecho_plano.jpg","description":"Mira tus brazos, controla simetría"}]'::jsonb,
        '{"banco","Mancuernas","Pecho"}',
        12,
        10
    );

-- Seed sets (groups of exercises)

insert into
    public.sets (user_id, name, description)
values (
        'a0000000-0000-0000-0000-000000000001',
        'Compuestos Full Body',
        'Sentadilla, press de banca y peso muerto.'
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Tren Superior',
        'Press de banca y peso muerto para pecho y espalda.'
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Fuerza Piernas',
        'Sentadilla y peso muerto para tren inferior.'
    );

-- Link exercises to sets

-- Compuestos Full Body: all 3
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Compuestos Full Body';

-- Tren Superior: Bench Press + Deadlift
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Tren Superior'
    and e.title in ('Bench Press', 'Deadlift');

-- Fuerza Piernas: Squat + Deadlift
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Fuerza Piernas'
    and e.title in (
        'Barbell Back Squat',
        'Deadlift'
    );

-- Seed routines

insert into
    public.routines (
        user_id,
        name,
        description,
        rest_secs
    )
values (
        'a0000000-0000-0000-0000-000000000001',
        'Rutina Full Body',
        'Rutina completa de cuerpo entero con los 3 movimientos básicos.',
        7
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Rutina Tren Superior',
        'Enfocada en pecho y espalda con press de banca y peso muerto.',
        10
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Rutina Fuerza Piernas',
        'Sentadilla y peso muerto para desarrollar fuerza en tren inferior.',
        5
    );

-- Link sets to routines (3 sets per routine, with rounds)

-- Rutina Full Body: Compuestos Full Body (x3) → Tren Superior (x2) → Fuerza Piernas (x1)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 3
from public.routines r, public.sets s
where
    r.name = 'Rutina Full Body'
    and s.name = 'Compuestos Full Body';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 2
from public.routines r, public.sets s
where
    r.name = 'Rutina Full Body'
    and s.name = 'Tren Superior';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 2, 1
from public.routines r, public.sets s
where
    r.name = 'Rutina Full Body'
    and s.name = 'Fuerza Piernas';

-- Rutina Tren Superior: Tren Superior (x3) → Compuestos Full Body (x1) → Fuerza Piernas (x2)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 3
from public.routines r, public.sets s
where
    r.name = 'Rutina Tren Superior'
    and s.name = 'Tren Superior';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 1
from public.routines r, public.sets s
where
    r.name = 'Rutina Tren Superior'
    and s.name = 'Compuestos Full Body';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 2, 2
from public.routines r, public.sets s
where
    r.name = 'Rutina Tren Superior'
    and s.name = 'Fuerza Piernas';

-- Rutina Fuerza Piernas: Fuerza Piernas (x3) → Compuestos Full Body (x2) → Tren Superior (x1)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 3
from public.routines r, public.sets s
where
    r.name = 'Rutina Fuerza Piernas'
    and s.name = 'Fuerza Piernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 2
from public.routines r, public.sets s
where
    r.name = 'Rutina Fuerza Piernas'
    and s.name = 'Compuestos Full Body';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 2, 1
from public.routines r, public.sets s
where
    r.name = 'Rutina Fuerza Piernas'
    and s.name = 'Tren Superior';