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
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg","description":"press plano con mancuernas en banco"}]'::jsonb,
        '{"pecho", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'press inclinado mancuernas',
        'en banco inclinado a 30-45°, empuja las mancuernas desde el pecho hacia arriba. enfatiza la parte superior del pecho.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg","description":"inclina el banco a 30-45 grados"}]'::jsonb,
        '{"pecho", "hombros", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'aperturas con mancuernas',
        'acostado en banco plano, abre los brazos en arco con codos ligeramente flexionados. siente el estiramiento en el pecho y vuelve a cerrar.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg","description":"codos ligeramente flexionados, movimiento en arco"}]'::jsonb,
        '{"pecho", "mancuernas", "banco"}',
        30,
        12
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'pullover con mancuerna',
        'acostado en banco, sujeta una mancuerna con ambas manos sobre el pecho. baja detrás de la cabeza manteniendo los codos semiflexionados.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/0.jpg","description":"estira bien los dorsales en la bajada"}]'::jsonb,
        '{"pecho", "espalda", "mancuernas", "banco"}',
        30,
        12
    ),

-- Hombros (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'press militar mancuernas',
    'sentado o de pie, empuja las mancuernas desde los hombros hacia arriba hasta extender completamente los brazos.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg","description":"no arquees la espalda, aprieta el core"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'elevaciones laterales',
    'de pie con mancuernas a los lados. sube los brazos lateralmente hasta la altura de los hombros con codos ligeramente flexionados.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg","description":"no subas por encima del hombro, controla la bajada"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    25,
    15
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'elevaciones frontales',
    'de pie, sube las mancuernas al frente alternando brazos hasta la altura de los hombros.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg","description":"movimiento controlado, sin balanceo"}]'::jsonb,
    '{"hombros", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'pájaros con mancuernas',
    'inclinado hacia adelante, abre los brazos lateralmente apretando los omóplatos. trabaja el deltoides posterior.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Flyes/0.jpg","description":"abre los brazos apretando omóplatos"}]'::jsonb,
    '{"hombros", "espalda", "mancuernas"}',
    25,
    12
),

-- Bíceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl de bíceps mancuernas',
    'de pie con mancuernas a los lados, flexiona los codos alternando brazos. mantén los codos pegados al cuerpo.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg","description":"codos fijos al costado, sin balanceo"}]'::jsonb,
    '{"bíceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl martillo',
    'igual que el curl de bíceps pero con agarre neutro (palmas enfrentadas). trabaja bíceps y braquiorradial.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Hammer_Curl/0.jpg","description":"palmas enfrentadas durante todo el movimiento"}]'::jsonb,
    '{"bíceps", "antebrazo", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'curl concentrado',
    'sentado, apoya el codo en la cara interna del muslo. flexiona el brazo concentrando la contracción del bíceps.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/0.jpg","description":"aprieta arriba, baja lento"}]'::jsonb,
    '{"bíceps", "mancuernas"}',
    25,
    10
),

-- Tríceps (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'extensión de tríceps sobre cabeza',
    'de pie o sentado, sujeta una mancuerna con ambas manos detrás de la cabeza. extiende los brazos hacia arriba.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Triceps_Extension/0.jpg","description":"codos apuntando al techo, no los abras"}]'::jsonb,
    '{"tríceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'patada de tríceps',
    'inclinado, con el codo a 90°, extiende el antebrazo hacia atrás apretando el tríceps al final.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/0.jpg","description":"brazo paralelo al suelo, solo mueve el antebrazo"}]'::jsonb,
    '{"tríceps", "mancuernas"}',
    25,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'extensión tríceps acostado',
    'acostado en banco, baja la mancuerna hacia la frente flexionando solo el codo. extiende de vuelta sin mover el brazo.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/0.jpg","description":"solo se mueve el antebrazo, codo fijo"}]'::jsonb,
    '{"tríceps", "mancuernas", "banco"}',
    25,
    10
),

-- Espalda (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'remo con mancuerna',
    'apoyado en banco con una mano y rodilla, tira la mancuerna hacia la cadera apretando el dorsal. baja controlado.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg","description":"tira hacia la cadera, aprieta el omóplato"}]'::jsonb,
    '{"espalda", "mancuernas", "banco"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'remo inclinado con mancuernas',
    'inclinado a 45° con una mancuerna en cada mano, tira ambas hacia el abdomen apretando la espalda.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row/0.jpg","description":"inclinado a 45 grados, tira hacia el abdomen"}]'::jsonb,
    '{"espalda", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'encogimientos con mancuernas',
    'de pie con mancuernas a los lados, sube los hombros hacia las orejas apretando los trapecios. baja lento.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shrug/0.jpg","description":"sube los hombros hacia las orejas"}]'::jsonb,
    '{"espalda", "trapecios", "mancuernas"}',
    20,
    15
),

-- Piernas (mancuernas)
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla con mancuernas',
    'de pie con mancuernas a los lados, baja en sentadilla manteniendo las rodillas alineadas con los pies. empuja desde los talones.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Squat/0.jpg","description":"rodillas en línea con los pies, pecho arriba"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'zancadas con mancuernas',
    'da un paso largo al frente bajando la rodilla trasera casi al suelo. alterna piernas. mantén el torso erguido.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg","description":"rodilla delantera no pasa la punta del pie"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'peso muerto rumano mancuernas',
    'de pie con mancuernas al frente, empuja la cadera hacia atrás bajando el torso. siente el estiramiento en isquiotibiales.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/0.jpg","description":"espalda recta, empuja cadera atrás"}]'::jsonb,
    '{"piernas", "glúteos", "espalda baja", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla sumo mancuerna',
    'piernas abiertas más que los hombros, puntas afuera. sujeta una mancuerna entre las piernas y baja en sentadilla.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plie_Dumbbell_Squat/0.jpg","description":"piernas abiertas, puntas afuera"}]'::jsonb,
    '{"piernas", "glúteos", "aductores", "mancuernas"}',
    30,
    12
),
(
    'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
    'sentadilla búlgara mancuernas',
    'con el pie trasero elevado en un banco, baja en sentadilla con una pierna. excelente para cuádriceps y glúteos.',
    '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Squat_with_Dumbbells/0.jpg","description":"pie trasero elevado en banco"}]'::jsonb,
    '{"piernas", "glúteos", "mancuernas", "banco"}',
    30,
    10
);

-- ─── NEW EXERCISES (from workout plans) ───────────────────────────────────────

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
        'squat to stretch',
        'de pie, baja en sentadilla profunda y estira los brazos arriba. trabaja movilidad de cadera y tobillos.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Squat/0.jpg","description":"squat to stretch"}]'::jsonb,
        '{"calentamiento", "movilidad", "piernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'inchworm',
        'desde de pie, inclínate y camina con las manos al suelo hasta plancha, luego regresa caminando las manos hacia los pies.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Inchworm/0.jpg","description":"inchworm"}]'::jsonb,
        '{"calentamiento", "movilidad", "core", "cuerpo completo"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'deep squat side to side',
        'en sentadilla profunda, balancea el peso de lado a lado manteniendo los talones en el suelo.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "piernas", "cadera"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'shoulder dislocation',
        'con un palo o banda, pasa los brazos extendidos por encima de la cabeza y detrás de la espalda en un arco completo.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Stretch/0.jpg","description":"shoulder dislocation"}]'::jsonb,
        '{"calentamiento", "movilidad", "hombros"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'glute bridge',
        'acostado boca arriba con rodillas flexionadas, eleva la cadera apretando los glúteos arriba.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butt_Lift_Bridge/0.jpg","description":"glute bridge"}]'::jsonb,
        '{"glúteos", "piernas", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'low lateral lunge',
        'da un paso lateral amplio y baja la cadera hacia ese lado manteniendo la otra pierna extendida.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "piernas", "aductores"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'cat-cow',
        'en cuatro puntos, alterna entre arquear la espalda hacia arriba (gato) y hacia abajo (vaca).',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/0.jpg","description":"cat-cow"}]'::jsonb,
        '{"calentamiento", "movilidad", "espalda", "core"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'arm circles',
        'de pie, extiende los brazos a los lados y haz círculos pequeños que van creciendo progresivamente.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arm_Circles/0.jpg","description":"arm circles"}]'::jsonb,
        '{"calentamiento", "movilidad", "hombros"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'fire hydrant hip circles',
        'en cuatro puntos, eleva la rodilla lateralmente y haz círculos con la cadera. trabaja movilidad de cadera.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "cadera", "glúteos"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'chest openers',
        'de pie o arrodillado, abre los brazos hacia atrás estirando el pecho y juntando los omóplatos.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "pecho", "hombros"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'forward leg swing',
        'de pie apoyado en algo, balancea una pierna hacia adelante y atrás de forma controlada.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "piernas", "cadera"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'plank to downward dog',
        'desde plancha, empuja la cadera hacia arriba formando una v invertida, luego regresa a plancha.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg","description":"plank to downward dog"}]'::jsonb,
        '{"calentamiento", "movilidad", "core", "hombros"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        '90/90 hip hinges',
        'sentado con ambas piernas a 90 grados, rota las caderas llevando las rodillas de un lado al otro.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/90_90_Hamstring/0.jpg","description":"90/90 hip hinges"}]'::jsonb,
        '{"calentamiento", "movilidad", "cadera"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'child''s pose to cobra',
        'alterna entre posición de niño (caderas hacia talones) y cobra (extensión de espalda boca abajo).',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Childs_Pose/0.jpg","description":"childs pose to cobra"}]'::jsonb,
        '{"calentamiento", "movilidad", "espalda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'frog pumps',
        'acostado con plantas de los pies juntas y rodillas abiertas, eleva la cadera apretando glúteos.',
        '[]'::jsonb,
        '{"glúteos", "cadera", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'thread the needle',
        'en cuatro puntos, pasa un brazo por debajo del torso rotando la columna. estira espalda y hombros.',
        '[]'::jsonb,
        '{"calentamiento", "movilidad", "espalda", "hombros"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'hip thrust',
        'sentado con la espalda apoyada en un banco, eleva la cadera con peso hasta extensión completa de cadera.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg","description":"hip thrust"}]'::jsonb,
        '{"glúteos", "piernas", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'arnold press',
        'sentado con mancuernas al frente, rota los brazos hacia afuera mientras empujas hacia arriba.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg","description":"arnold press"}]'::jsonb,
        '{"hombros", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'single arm clean and press',
        'con una mancuerna, haz un tirón desde el suelo hasta el hombro y luego empuja hacia arriba en un movimiento fluido.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_and_Press/0.jpg","description":"single arm clean and press"}]'::jsonb,
        '{"hombros", "cuerpo completo", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'single arm row',
        'inclinado con una mano apoyada, tira la mancuerna hacia la cadera con un brazo. trabaja dorsal.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg","description":"single arm row"}]'::jsonb,
        '{"espalda", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'side to side squat',
        'en posición de sentadilla, desplázate lateralmente de un lado a otro sin levantarte.',
        '[]'::jsonb,
        '{"piernas", "glúteos", "banda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'dumbbell narrow row',
        'inclinado con mancuernas juntas, tira hacia el abdomen con agarre cerrado enfatizando la espalda media.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row/0.jpg","description":"dumbbell narrow row"}]'::jsonb,
        '{"espalda", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'banded hip thrust with abduction',
        'hip thrust con banda en las rodillas, al subir abre las rodillas hacia afuera activando glúteo medio.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg","description":"banded hip thrust with abduction"}]'::jsonb,
        '{"glúteos", "piernas", "banda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'renegade row to squat thrust biceps curl',
        'desde plancha haz un remo alterno, salta a sentadilla y haz curl de bíceps. movimiento compuesto.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Renegade_Row/0.jpg","description":"renegade row to squat thrust biceps curl"}]'::jsonb,
        '{"cuerpo completo", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'walking lunges',
        'da pasos largos alternos bajando la rodilla trasera casi al suelo. avanza con cada repetición.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Walking_Lunge/0.jpg","description":"walking lunges"}]'::jsonb,
        '{"piernas", "glúteos", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'mountain climbers',
        'en posición de plancha, lleva las rodillas al pecho alternando rápidamente.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/0.jpg","description":"mountain climbers"}]'::jsonb,
        '{"cardio", "core", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'deficit reverse lunge',
        'sobre una elevación, da un paso hacia atrás y baja más profundo de lo normal. enfatiza glúteos.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg","description":"deficit reverse lunge"}]'::jsonb,
        '{"piernas", "glúteos", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'upright row',
        'de pie con mancuernas al frente, tira hacia arriba pegado al cuerpo hasta la altura de la barbilla.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/0.jpg","description":"upright row"}]'::jsonb,
        '{"hombros", "trapecios", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'step-up glute focus',
        'sube a un banco con una pierna enfocándote en empujar con el glúteo. mantén el torso erguido.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Step_Ups/0.jpg","description":"step-up glute focus"}]'::jsonb,
        '{"glúteos", "piernas", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'chest press',
        'acostado en banco o en el suelo, empuja las mancuernas hacia arriba desde el pecho.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg","description":"chest press"}]'::jsonb,
        '{"pecho", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'narrow squat heels elevated',
        'sentadilla con pies juntos y talones elevados sobre un disco. enfatiza cuádriceps.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Squat/0.jpg","description":"narrow squat heels elevated"}]'::jsonb,
        '{"piernas", "cuádriceps", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'incline triceps push-up',
        'push-up con las manos en una superficie elevada, codos pegados al cuerpo para enfatizar tríceps.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg","description":"incline triceps push-up"}]'::jsonb,
        '{"tríceps", "pecho", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'underhand row',
        'remo inclinado con agarre supino (palmas hacia arriba). enfatiza bíceps y espalda baja.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row_With_Palms_In/0.jpg","description":"underhand row"}]'::jsonb,
        '{"espalda", "bíceps", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'calf raises',
        'de pie, elévate sobre las puntas de los pies apretando las pantorrillas. baja lento.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raise_On_A_Dumbbell/0.jpg","description":"calf raises"}]'::jsonb,
        '{"piernas", "pantorrillas", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'goblet squat',
        'sujeta una mancuerna vertical contra el pecho y baja en sentadilla profunda con el torso erguido.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg","description":"goblet squat"}]'::jsonb,
        '{"piernas", "glúteos", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'sit-up with weight',
        'abdominales sujetando una mancuerna contra el pecho. sube el torso completo.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit-Up/0.jpg","description":"sit-up with weight"}]'::jsonb,
        '{"core", "abdominales", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'lying leg curl',
        'acostado boca abajo, flexiona las rodillas llevando los talones hacia los glúteos contra resistencia.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg","description":"lying leg curl"}]'::jsonb,
        '{"piernas", "isquiotibiales", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'wall sit',
        'apóyate contra la pared con las rodillas a 90 grados y mantén la posición estática.',
        '[]'::jsonb,
        '{"piernas", "cuádriceps", "isométrico"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'lateral raise and front raise',
        'combina elevación lateral y frontal con mancuernas en un solo movimiento alterno.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg","description":"lateral raise and front raise"}]'::jsonb,
        '{"hombros", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'fire hydrant and donkey kick',
        'en cuatro puntos, alterna entre abrir la rodilla lateral y patada hacia atrás. trabaja glúteos.',
        '[]'::jsonb,
        '{"glúteos", "cadera", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'renegade row',
        'en posición de plancha con mancuernas, tira una mancuerna hacia la cadera alternando lados.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Renegade_Row/0.jpg","description":"renegade row"}]'::jsonb,
        '{"espalda", "core", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'b-stance deadlift',
        'peso muerto con un pie ligeramente atrás como apoyo. trabaja unilateralmente glúteos y posterior.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/0.jpg","description":"b-stance deadlift"}]'::jsonb,
        '{"piernas", "glúteos", "espalda baja", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'glute bridge and chest press',
        'en posición de puente de glúteo, realiza un press de pecho simultáneamente.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butt_Lift_Bridge/0.jpg","description":"glute bridge and chest press"}]'::jsonb,
        '{"glúteos", "pecho", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'toe tap and leg raise',
        'acostado boca arriba, alterna entre tocar la punta del pie y elevar las piernas. trabaja abdominales.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Lying_Leg_Raise/0.jpg","description":"toe tap and leg raise"}]'::jsonb,
        '{"core", "abdominales", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'triceps dip',
        'apoyado en un banco detrás, baja el cuerpo flexionando los codos y empuja de vuelta. trabaja tríceps.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg","description":"triceps dip"}]'::jsonb,
        '{"tríceps", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'lat pulldown with loop band',
        'de rodillas o de pie, tira de una banda elástica desde arriba hacia el pecho. trabaja dorsales.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg","description":"lat pulldown with loop band"}]'::jsonb,
        '{"espalda", "banda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'banded frog pumps',
        'frog pumps con banda de resistencia en las rodillas para mayor activación de glúteo medio.',
        '[]'::jsonb,
        '{"glúteos", "banda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'plank shoulder taps',
        'en posición de plancha alta, toca el hombro opuesto alternando manos sin rotar la cadera.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg","description":"plank shoulder taps"}]'::jsonb,
        '{"core", "hombros", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'shoulder taps and plank jacks',
        'combina toques de hombro con saltos abriendo y cerrando piernas en plancha.',
        '[]'::jsonb,
        '{"core", "cardio", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'alternating lunges with lateral raise',
        'haz zancada y al subir realiza una elevación lateral con mancuernas. trabaja piernas y hombros.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg","description":"alternating lunges with lateral raise"}]'::jsonb,
        '{"piernas", "hombros", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'romanian deadlift and row',
        'realiza un peso muerto rumano y al estar inclinado haz un remo. movimiento compuesto.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg","description":"romanian deadlift and row"}]'::jsonb,
        '{"espalda", "piernas", "glúteos", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'reverse crunch',
        'acostado boca arriba, lleva las rodillas al pecho elevando la cadera del suelo. trabaja abdomen inferior.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Crunch/0.jpg","description":"reverse crunch"}]'::jsonb,
        '{"core", "abdominales", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'burpees',
        'desde de pie, baja a plancha, haz push-up, salta los pies hacia las manos y salta arriba.',
        '[]'::jsonb,
        '{"cardio", "cuerpo completo", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'sit-up and pullover',
        'abdominales sujetando mancuerna, al subir extiende los brazos con pullover. trabaja core y dorsal.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit-Up/0.jpg","description":"sit-up and pullover"}]'::jsonb,
        '{"core", "abdominales", "mancuernas"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'alternating jumping lunges',
        'desde zancada, salta y cambia de pierna en el aire. ejercicio pliométrico de piernas.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Jump/0.jpg","description":"alternating jumping lunges"}]'::jsonb,
        '{"piernas", "cardio", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'banded squat jump in and out',
        'con banda en las rodillas, salta abriendo y cerrando las piernas en sentadilla.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Freehand_Jump_Squat/0.jpg","description":"banded squat jump in and out"}]'::jsonb,
        '{"piernas", "cardio", "banda"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'triceps dip and toe touch',
        'alterna entre dips de tríceps y toques de punta del pie. trabaja tríceps y core.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg","description":"triceps dip and toe touch"}]'::jsonb,
        '{"tríceps", "core", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'low plank hold',
        'mantén la posición de plancha baja sobre los antebrazos. contrae abdomen y glúteos.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg","description":"low plank hold"}]'::jsonb,
        '{"core", "isométrico", "cuerpo libre"}',
        30,
        5
    ),
    (
        'ec507c0b-6185-4c54-9cc5-2aa357e4bb6d',
        'high plank to low plank',
        'alterna entre plancha alta (manos) y baja (antebrazos) subiendo y bajando un brazo a la vez.',
        '[{"url":"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg","description":"high plank to low plank"}]'::jsonb,
        '{"core", "hombros", "cuerpo libre"}',
        30,
        5
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