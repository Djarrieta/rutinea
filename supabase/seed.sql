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
        'press plano mancuernas',
        'acuéstate en banco plano con una mancuerna en cada mano. baja controladamente hasta la altura del pecho y empuja hacia arriba hasta extender los brazos.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif", "description":"controla la bajada, no rebotes"}]'::jsonb,
        '{"pecho", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'press inclinado mancuernas',
        'en banco inclinado a 30-45°, empuja las mancuernas desde el pecho hacia arriba. enfatiza la parte superior del pecho.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif", "description":"inclina el banco a 30-45 grados"}]'::jsonb,
        '{"pecho", "hombros", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'aperturas con mancuernas',
        'acostado en banco plano, abre los brazos en arco con codos ligeramente flexionados. siente el estiramiento en el pecho y vuelve a cerrar.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif", "description":"codos ligeramente flexionados, movimiento en arco"}]'::jsonb,
        '{"pecho", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'pullover con mancuerna',
        'acostado en banco, sujeta una mancuerna con ambas manos sobre el pecho. baja detrás de la cabeza manteniendo los codos semiflexionados.',
        '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif", "description":"estira bien los dorsales en la bajada"}]'::jsonb,
        '{"pecho", "espalda", "mancuernas", "banco"}',
        30,
        12
    ),

-- Hombros (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'press militar mancuernas',
    'sentado o de pie, empuja las mancuernas desde los hombros hacia arriba hasta extender completamente los brazos.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif", "description":"no arquees la espalda, aprieta el core"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'elevaciones laterales',
    'de pie con mancuernas a los lados. sube los brazos lateralmente hasta la altura de los hombros con codos ligeramente flexionados.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif", "description":"no subas por encima del hombro, controla la bajada"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    25,
    15
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'elevaciones frontales',
    'de pie, sube las mancuernas al frente alternando brazos hasta la altura de los hombros.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif", "description":"movimiento controlado, sin balanceo"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'pájaros con mancuernas',
    'inclinado hacia adelante, abre los brazos lateralmente apretando los omóplatos. trabaja el deltoides posterior.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Rear-Delt-Fly.gif", "description":"inclínate a 45°, aprieta omóplatos arriba"}]'::jsonb,
    '{"hombros", "espalda", "mancuernas"}',
    25,
    12
),

-- Bíceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl de bíceps mancuernas',
    'de pie con mancuernas a los lados, flexiona los codos alternando brazos. mantén los codos pegados al cuerpo.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif", "description":"codos fijos al costado, sin balanceo"}]'::jsonb,
    '{"bíceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl martillo',
    'igual que el curl de bíceps pero con agarre neutro (palmas enfrentadas). trabaja bíceps y braquiorradial.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif", "description":"palmas enfrentadas durante todo el movimiento"}]'::jsonb,
    '{"bíceps", "antebrazo", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl concentrado',
    'sentado, apoya el codo en la cara interna del muslo. flexiona el brazo concentrando la contracción del bíceps.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif", "description":"aprieta arriba, baja lento"}]'::jsonb,
    '{"bíceps", "mancuernas"}',
    25,
    10
),

-- Tríceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'extensión de tríceps sobre cabeza',
    'de pie o sentado, sujeta una mancuerna con ambas manos detrás de la cabeza. extiende los brazos hacia arriba.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Triceps-Extension.gif", "description":"codos apuntando al techo, no los abras"}]'::jsonb,
    '{"tríceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'patada de tríceps',
    'inclinado, con el codo a 90°, extiende el antebrazo hacia atrás apretando el tríceps al final.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Kickback.gif", "description":"brazo paralelo al suelo, solo mueve el antebrazo"}]'::jsonb,
    '{"tríceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'extensión tríceps acostado',
    'acostado en banco, baja la mancuerna hacia la frente flexionando solo el codo. extiende de vuelta sin mover el brazo.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/04/One-Arm-Lying-Triceps-Extension.gif", "description":"solo se mueve el antebrazo, codo fijo"}]'::jsonb,
    '{"tríceps", "mancuernas", "banco"}',
    25,
    10
),

-- Espalda (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'remo con mancuerna',
    'apoyado en banco con una mano y rodilla, tira la mancuerna hacia la cadera apretando el dorsal. baja controlado.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif", "description":"tira hacia la cadera, aprieta el omóplato"}]'::jsonb,
    '{"espalda", "mancuernas", "banco"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'remo inclinado con mancuernas',
    'inclinado a 45° con una mancuerna en cada mano, tira ambas hacia el abdomen apretando la espalda.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bent-Over-Row.gif", "description":"espalda recta, no redondees la lumbar"}]'::jsonb,
    '{"espalda", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'encogimientos con mancuernas',
    'de pie con mancuernas a los lados, sube los hombros hacia las orejas apretando los trapecios. baja lento.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shrug.gif", "description":"solo sube los hombros, no dobles los codos"}]'::jsonb,
    '{"espalda", "trapecios", "mancuernas"}',
    20,
    15
),

-- Piernas (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla con mancuernas',
    'de pie con mancuernas a los lados, baja en sentadilla manteniendo las rodillas alineadas con los pies. empuja desde los talones.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2023/09/Dumbbell-Squat.gif", "description":"rodillas en línea con los pies, pecho arriba"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'zancadas con mancuernas',
    'da un paso largo al frente bajando la rodilla trasera casi al suelo. alterna piernas. mantén el torso erguido.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif", "description":"rodilla delantera no pasa la punta del pie"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'peso muerto rumano mancuernas',
    'de pie con mancuernas al frente, empuja la cadera hacia atrás bajando el torso. siente el estiramiento en isquiotibiales.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Romanian-Deadlift.gif", "description":"espalda recta, empuja cadera atrás"}]'::jsonb,
    '{"piernas", "glúteos", "espalda baja", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla sumo mancuerna',
    'piernas abiertas más que los hombros, puntas afuera. sujeta una mancuerna entre las piernas y baja en sentadilla.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Sumo-Squat.gif", "description":"rodillas siguen la dirección de los pies"}]'::jsonb,
    '{"piernas", "glúteos", "aductores", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla búlgara mancuernas',
    'con el pie trasero elevado en un banco, baja en sentadilla con una pierna. excelente para cuádriceps y glúteos.',
    '[{"url":"https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bulgarian-Split-Squat.gif", "description":"torso erguido, rodilla alineada"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas", "banco"}',
    30,
    10
);

-- ─── SETS ────────────────────────────────────────────────────────────────────

insert into
    public.sets (user_id, name, description)
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'pecho mancuernas',
        'ejercicios de pecho con mancuernas: press plano, inclinado, aperturas y pullover.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'hombros mancuernas',
        'trabajo completo de hombros: press militar, elevaciones laterales, frontales y pájaros.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'brazos mancuernas',
        'bíceps y tríceps con mancuernas: curls, martillo, concentrado, extensiones y patadas.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'espalda mancuernas',
        'espalda con mancuernas: remo unilateral, remo inclinado, encogimientos y pullover.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'piernas mancuernas',
        'tren inferior con mancuernas: sentadilla, zancadas, peso muerto rumano, sumo y búlgara.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'tren superior mancuernas',
        'combinación de pecho, hombros, espalda y brazos con mancuernas.'
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
    s.name = 'pecho mancuernas'
    and e.title in (
        'press plano mancuernas',
        'press inclinado mancuernas',
        'aperturas con mancuernas',
        'pullover con mancuerna'
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
    s.name = 'hombros mancuernas'
    and e.title in (
        'press militar mancuernas',
        'elevaciones laterales',
        'elevaciones frontales',
        'pájaros con mancuernas'
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
    s.name = 'brazos mancuernas'
    and e.title in (
        'curl de bíceps mancuernas',
        'curl martillo',
        'curl concentrado',
        'extensión de tríceps sobre cabeza',
        'patada de tríceps',
        'extensión tríceps acostado'
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
    s.name = 'espalda mancuernas'
    and e.title in (
        'remo con mancuerna',
        'remo inclinado con mancuernas',
        'encogimientos con mancuernas',
        'pullover con mancuerna'
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
    s.name = 'piernas mancuernas'
    and e.title in (
        'sentadilla con mancuernas',
        'zancadas con mancuernas',
        'peso muerto rumano mancuernas',
        'sentadilla sumo mancuerna',
        'sentadilla búlgara mancuernas'
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
    s.name = 'tren superior mancuernas'
    and e.title in (
        'press plano mancuernas',
        'press militar mancuernas',
        'remo con mancuerna',
        'curl de bíceps mancuernas',
        'patada de tríceps',
        'elevaciones laterales'
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
        'tren superior completo',
        'rutina completa de tren superior con mancuernas: pecho, hombros, espalda y brazos.',
        10
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'pecho y tríceps',
        'push day: pecho y tríceps con mancuernas.',
        8
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'espalda y bíceps',
        'pull day: espalda y bíceps con mancuernas.',
        8
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'piernas mancuernas',
        'día de piernas completo con mancuernas: sentadillas, zancadas y peso muerto rumano.',
        10
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'full body mancuernas',
        'rutina de cuerpo completo combinando tren superior e inferior con mancuernas.',
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
    r.name = 'tren superior completo'
    and s.name = 'pecho mancuernas';

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
    r.name = 'tren superior completo'
    and s.name = 'hombros mancuernas';

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
    r.name = 'tren superior completo'
    and s.name = 'espalda mancuernas';

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
    r.name = 'tren superior completo'
    and s.name = 'brazos mancuernas';

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
    r.name = 'pecho y tríceps'
    and s.name = 'pecho mancuernas';

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
    r.name = 'pecho y tríceps'
    and s.name = 'brazos mancuernas';

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
    r.name = 'espalda y bíceps'
    and s.name = 'espalda mancuernas';

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
    r.name = 'espalda y bíceps'
    and s.name = 'brazos mancuernas';

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
    r.name = 'piernas mancuernas'
    and s.name = 'piernas mancuernas';

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
    r.name = 'full body mancuernas'
    and s.name = 'tren superior mancuernas';

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
    r.name = 'full body mancuernas'
    and s.name = 'piernas mancuernas';

-- ─── PLANS ───────────────────────────────────────────────────────────────────

insert into
    public.plans (user_id, name, description)
values (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'push pull legs mancuernas',
        'plan semanal push/pull/legs con mancuernas. 6 días de entrenamiento.'
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'full body 3 días',
        'plan de 3 días por semana con rutinas de cuerpo completo. ideal para principiantes.'
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
    p.name = 'push pull legs mancuernas'
    and r.name = 'pecho y tríceps';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 1
from public.plans p, public.routines r
where
    p.name = 'push pull legs mancuernas'
    and r.name = 'espalda y bíceps';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 2
from public.plans p, public.routines r
where
    p.name = 'push pull legs mancuernas'
    and r.name = 'piernas mancuernas';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 3
from public.plans p, public.routines r
where
    p.name = 'push pull legs mancuernas'
    and r.name = 'tren superior completo';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'push pull legs mancuernas'
    and r.name = 'full body mancuernas';

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
    p.name = 'full body 3 días'
    and r.name = 'full body mancuernas';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 2
from public.plans p, public.routines r
where
    p.name = 'full body 3 días'
    and r.name = 'tren superior completo';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'full body 3 días'
    and r.name = 'full body mancuernas';