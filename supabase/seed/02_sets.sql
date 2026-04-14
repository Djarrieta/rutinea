-- ─── SETS ────────────────────────────────────────────────────────────────────

insert into
    public.sets (user_id, name, description)
values (
        '00000000-0000-0000-0000-000000000000',
        'pecho mancuernas',
        'ejercicios de pecho con mancuernas: press plano, inclinado, aperturas y pullover.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'hombros mancuernas',
        'trabajo completo de hombros: press militar, elevaciones laterales, frontales y pájaros.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'brazos mancuernas',
        'bíceps y tríceps con mancuernas: curls, martillo, concentrado, extensiones y patadas.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'espalda mancuernas',
        'espalda con mancuernas: remo unilateral, remo inclinado, encogimientos y pullover.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'piernas mancuernas',
        'tren inferior con mancuernas: sentadilla, zancadas, peso muerto rumano, sumo y búlgara.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'tren superior mancuernas',
        'combinación de pecho, hombros, espalda y brazos con mancuernas.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calentamiento y movilidad',
        'ejercicios de calentamiento y movilidad articular para preparar el cuerpo antes de entrenar.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'glúteos y cadera',
        'trabajo enfocado en glúteos y movilidad de cadera con peso corporal, mancuernas y banda.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'core y abdominales',
        'ejercicios de core: planchas, abdominales con peso y movimientos antirotación.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'piernas funcional',
        'variaciones funcionales de piernas: goblet squat, lunges, calf raises y más.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'hombros variaciones',
        'variaciones de hombros: arnold press, upright row y movimientos compuestos.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'espalda variaciones',
        'variaciones de espalda: remos con diferentes agarres, renegade row y pulldown con banda.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'cardio HIIT',
        'circuito de alta intensidad: mountain climbers, burpees, jumping lunges y más.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'compuestos cuerpo completo',
        'movimientos compuestos multiarticulares que trabajan todo el cuerpo en cada repetición.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'barras paralelas',
        'ejercicios de calistenia en barras paralelas: fondos, remos y abdominales.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia empuje focalizado',
        'rutina de empuje en paralelas centrada en pecho, tríceps y hombros.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia tirón focalizado',
        'rutina de tirón en paralelas para fortalecer espalda y bíceps.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia core y estabilidad',
        'ejercicios de core en paralelas y suelo para máxima estabilidad.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia pierna y potencia',
        'entrenamiento de tren inferior usando peso corporal y movimientos explosivos.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'pecho plano mancuernas y barra',
        'press plano y aperturas con mancuernas para trabajo de pecho en banco plano.'
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

-- Calentamiento y Movilidad
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'calentamiento y movilidad'
    and e.title in (
        'squat to stretch',
        'inchworm',
        'deep squat side to side',
        'shoulder dislocation',
        'cat-cow',
        'arm circles',
        'fire hydrant hip circles',
        'chest openers',
        'forward leg swing',
        'plank to downward dog',
        '90/90 hip hinges',
        'child''s pose to cobra',
        'thread the needle',
        'low lateral lunge'
    );

-- Glúteos y Cadera
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'glúteos y cadera'
    and e.title in (
        'glute bridge',
        'hip thrust',
        'frog pumps',
        'fire hydrant and donkey kick',
        'step-up glute focus',
        'b-stance deadlift',
        'banded hip thrust with abduction',
        'banded frog pumps'
    );

-- Core y Abdominales
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'core y abdominales'
    and e.title in (
        'sit-up with weight',
        'toe tap and leg raise',
        'reverse crunch',
        'sit-up and pullover',
        'plank shoulder taps',
        'low plank hold',
        'high plank to low plank',
        'renegade row'
    );

-- Piernas Funcional
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'piernas funcional'
    and e.title in (
        'goblet squat',
        'walking lunges',
        'deficit reverse lunge',
        'narrow squat heels elevated',
        'lying leg curl',
        'calf raises',
        'wall sit',
        'side to side squat'
    );

-- Hombros Variaciones
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'hombros variaciones'
    and e.title in (
        'arnold press',
        'upright row',
        'lateral raise and front raise',
        'single arm clean and press'
    );

-- Espalda Variaciones
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'espalda variaciones'
    and e.title in (
        'single arm row',
        'dumbbell narrow row',
        'underhand row',
        'renegade row',
        'lat pulldown with loop band',
        'romanian deadlift and row'
    );

-- Cardio HIIT
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'cardio HIIT'
    and e.title in (
        'mountain climbers',
        'alternating jumping lunges',
        'banded squat jump in and out',
        'shoulder taps and plank jacks',
        'burpees'
    );

-- Compuestos Cuerpo Completo
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'compuestos cuerpo completo'
    and e.title in (
        'single arm clean and press',
        'renegade row to squat thrust biceps curl',
        'alternating lunges with lateral raise',
        'romanian deadlift and row',
        'glute bridge and chest press',
        'triceps dip'
    );

-- Barras Paralelas
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'barras paralelas'
    and e.title in (
        'flexiones en barras paralelas',
        'remo agarre supino en paralelas',
        'remo agarre prono en paralelas',
        'encogimiento de trapecio en paralelas',
        'fondos para pecho en paralelas',
        'fondos para tríceps en paralelas',
        'press francés en paralelas',
        'dominadas negativas en paralelas',
        'remo prono suspendido en paralelas',
        'elevación de rodillas en paralelas'
    );

-- Calistenia Empuje Focalizado
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'calistenia empuje focalizado'
    and e.title in (
        'flexiones en barras paralelas',
        'fondos para pecho en paralelas',
        'fondos para tríceps en paralelas',
        'press francés en paralelas',
        'incline triceps push-up'
    );

-- Calistenia Tirón Focalizado
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'calistenia tirón focalizado'
    and e.title in (
        'remo agarre supino en paralelas',
        'remo agarre prono en paralelas',
        'remo prono suspendido en paralelas',
        'dominadas negativas en paralelas',
        'encogimiento de trapecio en paralelas'
    );

-- Calistenia Core y Estabilidad
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'calistenia core y estabilidad'
    and e.title in (
        'elevación de rodillas en paralelas',
        'plank shoulder taps',
        'low plank hold',
        'reverse crunch',
        'toe tap and leg raise'
    );

-- Calistenia Pierna y Potencia
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'calistenia pierna y potencia'
    and e.title in (
        'walking lunges',
        'alternating jumping lunges',
        'wall sit',
        'calf raises',
        'burpees'
    );

-- Pecho Plano Mancuernas y Barra
insert into
    public.set_exercises (set_id, exercise_id, position)
select s.id, e.id, row_number() over (
        order by e.created_at
    ) - 1
from public.sets s
    cross join public.exercises e
where
    s.name = 'pecho plano mancuernas y barra'
    and e.title in (
        'press plano mancuernas',
        'aperturas con mancuernas'
    );