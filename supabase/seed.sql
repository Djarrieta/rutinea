-- ─── Seed Data ────────────────────────────────────────────────────────────────
-- User: ec507c0b-6185-4c54-9cc5-2aa357e4bb6d (real user, owner of all data)

-- ─── EXERCISES ───────────────────────────────────────────────────────────────

-- Pecho (mancuernas)
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
        'Press Plano Mancuernas',
        'Acuéstate en banco plano con una mancuerna en cada mano. Baja controladamente hasta la altura del pecho y empuja hacia arriba hasta extender los brazos.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif","description":"Controla la bajada, no rebotes"}]'::jsonb,
        '{"Pecho","Mancuernas","Banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Press Inclinado Mancuernas',
        'En banco inclinado a 30-45°, empuja las mancuernas desde el pecho hacia arriba. Enfatiza la parte superior del pecho.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif","description":"Inclina el banco a 30-45 grados"}]'::jsonb,
        '{"Pecho","Hombros","Mancuernas","Banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Aperturas con Mancuernas',
        'Acostado en banco plano, abre los brazos en arco con codos ligeramente flexionados. Siente el estiramiento en el pecho y vuelve a cerrar.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif","description":"Codos ligeramente flexionados, movimiento en arco"}]'::jsonb,
        '{"Pecho","Mancuernas","Banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Pullover con Mancuerna',
        'Acostado en banco, sujeta una mancuerna con ambas manos sobre el pecho. Baja detrás de la cabeza manteniendo los codos semiflexionados.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif","description":"Estira bien los dorsales en la bajada"}]'::jsonb,
        '{"Pecho","Espalda","Mancuernas","Banco"}',
        30,
        12
    ),

-- Hombros (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Press Militar Mancuernas',
    'Sentado o de pie, empuja las mancuernas desde los hombros hacia arriba hasta extender completamente los brazos.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif","description":"No arquees la espalda, aprieta el core"}]'::jsonb,
    '{"Hombros","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Elevaciones Laterales',
    'De pie con mancuernas a los lados. Sube los brazos lateralmente hasta la altura de los hombros con codos ligeramente flexionados.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif","description":"No subas por encima del hombro, controla la bajada"}]'::jsonb,
    '{"Hombros","Mancuernas"}',
    25,
    15
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Elevaciones Frontales',
    'De pie, sube las mancuernas al frente alternando brazos hasta la altura de los hombros.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif","description":"Movimiento controlado, sin balanceo"}]'::jsonb,
    '{"Hombros","Mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Pájaros con Mancuernas',
    'Inclinado hacia adelante, abre los brazos lateralmente apretando los omóplatos. Trabaja el deltoides posterior.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Rear-Delt-Fly.gif","description":"Inclínate a 45°, aprieta omóplatos arriba"}]'::jsonb,
    '{"Hombros","Espalda","Mancuernas"}',
    25,
    12
),

-- Bíceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Curl de Bíceps Mancuernas',
    'De pie con mancuernas a los lados, flexiona los codos alternando brazos. Mantén los codos pegados al cuerpo.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif","description":"Codos fijos al costado, sin balanceo"}]'::jsonb,
    '{"Bíceps","Mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Curl Martillo',
    'Igual que el curl de bíceps pero con agarre neutro (palmas enfrentadas). Trabaja bíceps y braquiorradial.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif","description":"Palmas enfrentadas durante todo el movimiento"}]'::jsonb,
    '{"Bíceps","Antebrazo","Mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Curl Concentrado',
    'Sentado, apoya el codo en la cara interna del muslo. Flexiona el brazo concentrando la contracción del bíceps.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif","description":"Aprieta arriba, baja lento"}]'::jsonb,
    '{"Bíceps","Mancuernas"}',
    25,
    10
),

-- Tríceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Extensión de Tríceps sobre Cabeza',
    'De pie o sentado, sujeta una mancuerna con ambas manos detrás de la cabeza. Extiende los brazos hacia arriba.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Triceps-Extension.gif","description":"Codos apuntando al techo, no los abras"}]'::jsonb,
    '{"Tríceps","Mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Patada de Tríceps',
    'Inclinado, con el codo a 90°, extiende el antebrazo hacia atrás apretando el tríceps al final.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Kickback.gif","description":"Brazo paralelo al suelo, solo mueve el antebrazo"}]'::jsonb,
    '{"Tríceps","Mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Extensión Tríceps Acostado',
    'Acostado en banco, baja la mancuerna hacia la frente flexionando solo el codo. Extiende de vuelta sin mover el brazo.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/04/One-Arm-Lying-Triceps-Extension.gif","description":"Solo se mueve el antebrazo, codo fijo"}]'::jsonb,
    '{"Tríceps","Mancuernas","Banco"}',
    25,
    10
),

-- Espalda (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Remo con Mancuerna',
    'Apoyado en banco con una mano y rodilla, tira la mancuerna hacia la cadera apretando el dorsal. Baja controlado.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif","description":"Tira hacia la cadera, aprieta el omóplato"}]'::jsonb,
    '{"Espalda","Mancuernas","Banco"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Remo Inclinado con Mancuernas',
    'Inclinado a 45° con una mancuerna en cada mano, tira ambas hacia el abdomen apretando la espalda.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bent-Over-Row.gif","description":"Espalda recta, no redondees la lumbar"}]'::jsonb,
    '{"Espalda","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Encogimientos con Mancuernas',
    'De pie con mancuernas a los lados, sube los hombros hacia las orejas apretando los trapecios. Baja lento.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shrug.gif","description":"Solo sube los hombros, no dobles los codos"}]'::jsonb,
    '{"Espalda","Trapecios","Mancuernas"}',
    20,
    15
),

-- Piernas (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Sentadilla con Mancuernas',
    'De pie con mancuernas a los lados, baja en sentadilla manteniendo las rodillas alineadas con los pies. Empuja desde los talones.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2023/09/Dumbbell-Squat.gif","description":"Rodillas en línea con los pies, pecho arriba"}]'::jsonb,
    '{"Piernas","Glúteos","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Zancadas con Mancuernas',
    'Da un paso largo al frente bajando la rodilla trasera casi al suelo. Alterna piernas. Mantén el torso erguido.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif","description":"Rodilla delantera no pasa la punta del pie"}]'::jsonb,
    '{"Piernas","Glúteos","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Peso Muerto Rumano Mancuernas',
    'De pie con mancuernas al frente, empuja la cadera hacia atrás bajando el torso. Siente el estiramiento en isquiotibiales.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Romanian-Deadlift.gif","description":"Espalda recta, empuja cadera atrás"}]'::jsonb,
    '{"Piernas","Glúteos","Espalda Baja","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Sentadilla Sumo Mancuerna',
    'Piernas abiertas más que los hombros, puntas afuera. Sujeta una mancuerna entre las piernas y baja en sentadilla.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Sumo-Squat.gif","description":"Rodillas siguen la dirección de los pies"}]'::jsonb,
    '{"Piernas","Glúteos","Aductores","Mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'Sentadilla Búlgara Mancuernas',
    'Con el pie trasero elevado en un banco, baja en sentadilla con una pierna. Excelente para cuádriceps y glúteos.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bulgarian-Split-Squat.gif","description":"Torso erguido, rodilla alineada"}]'::jsonb,
    '{"Piernas","Glúteos","Mancuernas","Banco"}',
    30,
    10
);

-- ─── SETS ────────────────────────────────────────────────────────────────────

insert into
    public.sets (user_id, name, description)
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Pecho Mancuernas',
        'Ejercicios de pecho con mancuernas: press plano, inclinado, aperturas y pullover.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Hombros Mancuernas',
        'Trabajo completo de hombros: press militar, elevaciones laterales, frontales y pájaros.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Brazos Mancuernas',
        'Bíceps y tríceps con mancuernas: curls, martillo, concentrado, extensiones y patadas.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Espalda Mancuernas',
        'Espalda con mancuernas: remo unilateral, remo inclinado, encogimientos y pullover.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Piernas Mancuernas',
        'Tren inferior con mancuernas: sentadilla, zancadas, peso muerto rumano, sumo y búlgara.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Tren Superior Mancuernas',
        'Combinación de pecho, hombros, espalda y brazos con mancuernas.'
    );

-- Link exercises → sets

-- Pecho Mancuernas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Pecho Mancuernas'
    and e.title in (
        'Press Plano Mancuernas',
        'Press Inclinado Mancuernas',
        'Aperturas con Mancuernas',
        'Pullover con Mancuerna'
    );

-- Hombros Mancuernas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Hombros Mancuernas'
    and e.title in (
        'Press Militar Mancuernas',
        'Elevaciones Laterales',
        'Elevaciones Frontales',
        'Pájaros con Mancuernas'
    );

-- Brazos Mancuernas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Brazos Mancuernas'
    and e.title in (
        'Curl de Bíceps Mancuernas',
        'Curl Martillo',
        'Curl Concentrado',
        'Extensión de Tríceps sobre Cabeza',
        'Patada de Tríceps',
        'Extensión Tríceps Acostado'
    );

-- Espalda Mancuernas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Espalda Mancuernas'
    and e.title in (
        'Remo con Mancuerna',
        'Remo Inclinado con Mancuernas',
        'Encogimientos con Mancuernas',
        'Pullover con Mancuerna'
    );

-- Piernas Mancuernas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Piernas Mancuernas'
    and e.title in (
        'Sentadilla con Mancuernas',
        'Zancadas con Mancuernas',
        'Peso Muerto Rumano Mancuernas',
        'Sentadilla Sumo Mancuerna',
        'Sentadilla Búlgara Mancuernas'
    );

-- Tren Superior Mancuernas (mix de pecho, hombros, espalda y brazos)
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'Tren Superior Mancuernas'
    and e.title in (
        'Press Plano Mancuernas',
        'Press Militar Mancuernas',
        'Remo con Mancuerna',
        'Curl de Bíceps Mancuernas',
        'Patada de Tríceps',
        'Elevaciones Laterales'
    );

-- ─── ROUTINES ────────────────────────────────────────────────────────────────

insert into
    public.routines (
        user_id,
        name,
        description,
        rest_secs
    )
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Tren Superior Completo',
        'Rutina completa de tren superior con mancuernas: pecho, hombros, espalda y brazos.',
        10
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Pecho y Tríceps',
        'Push day: pecho y tríceps con mancuernas.',
        8
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Espalda y Bíceps',
        'Pull day: espalda y bíceps con mancuernas.',
        8
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Piernas Mancuernas',
        'Día de piernas completo con mancuernas: sentadillas, zancadas y peso muerto rumano.',
        10
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Full Body Mancuernas',
        'Rutina de cuerpo completo combinando tren superior e inferior con mancuernas.',
        10
    );

-- Tren Superior Completo: Pecho (x3) → Hombros (x3) → Espalda (x3) → Brazos (x2)
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
    r.name = 'Tren Superior Completo'
    and s.name = 'Pecho Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 3
from public.routines r, public.sets s
where
    r.name = 'Tren Superior Completo'
    and s.name = 'Hombros Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 2, 3
from public.routines r, public.sets s
where
    r.name = 'Tren Superior Completo'
    and s.name = 'Espalda Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 3, 2
from public.routines r, public.sets s
where
    r.name = 'Tren Superior Completo'
    and s.name = 'Brazos Mancuernas';

-- Pecho y Tríceps: Pecho (x4) → Brazos (tríceps subset, x3)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 4
from public.routines r, public.sets s
where
    r.name = 'Pecho y Tríceps'
    and s.name = 'Pecho Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 3
from public.routines r, public.sets s
where
    r.name = 'Pecho y Tríceps'
    and s.name = 'Brazos Mancuernas';

-- Espalda y Bíceps: Espalda (x4) → Brazos (bíceps subset, x3)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 4
from public.routines r, public.sets s
where
    r.name = 'Espalda y Bíceps'
    and s.name = 'Espalda Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 3
from public.routines r, public.sets s
where
    r.name = 'Espalda y Bíceps'
    and s.name = 'Brazos Mancuernas';

-- Piernas Mancuernas: Piernas (x4)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 4
from public.routines r, public.sets s
where
    r.name = 'Piernas Mancuernas'
    and s.name = 'Piernas Mancuernas';

-- Full Body Mancuernas: Tren Superior (x3) → Piernas (x3)
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
    r.name = 'Full Body Mancuernas'
    and s.name = 'Tren Superior Mancuernas';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 3
from public.routines r, public.sets s
where
    r.name = 'Full Body Mancuernas'
    and s.name = 'Piernas Mancuernas';

-- ─── PLANS ───────────────────────────────────────────────────────────────────

insert into
    public.plans (user_id, name, description)
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Push Pull Legs Mancuernas',
        'Plan semanal Push/Pull/Legs con mancuernas. 6 días de entrenamiento.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'Full Body 3 Días',
        'Plan de 3 días por semana con rutinas de cuerpo completo. Ideal para principiantes.'
    );

-- Push Pull Legs: Lun(0)=Push, Mar(1)=Pull, Mié(2)=Legs, Jue(3)=Push, Vie(4)=Pull, Sáb(5)=Legs
insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 0
from public.plans p, public.routines r
where
    p.name = 'Push Pull Legs Mancuernas'
    and r.name = 'Pecho y Tríceps';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 1
from public.plans p, public.routines r
where
    p.name = 'Push Pull Legs Mancuernas'
    and r.name = 'Espalda y Bíceps';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 2
from public.plans p, public.routines r
where
    p.name = 'Push Pull Legs Mancuernas'
    and r.name = 'Piernas Mancuernas';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 3
from public.plans p, public.routines r
where
    p.name = 'Push Pull Legs Mancuernas'
    and r.name = 'Tren Superior Completo';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'Push Pull Legs Mancuernas'
    and r.name = 'Full Body Mancuernas';

-- Full Body 3 Días: Lun(0), Mié(2), Vie(4)
insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 0
from public.plans p, public.routines r
where
    p.name = 'Full Body 3 Días'
    and r.name = 'Full Body Mancuernas';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 2
from public.plans p, public.routines r
where
    p.name = 'Full Body 3 Días'
    and r.name = 'Tren Superior Completo';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'Full Body 3 Días'
    and r.name = 'Full Body Mancuernas';