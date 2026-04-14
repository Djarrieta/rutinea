-- ─── ROUTINES ────────────────────────────────────────────────────────────────

insert into
    public.routines (
        user_id,
        name,
        description,
        rest_secs
    )
values (
        '00000000-0000-0000-0000-000000000000',
        'tren superior completo',
        'rutina completa de tren superior con mancuernas: pecho, hombros, espalda y brazos.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'pecho y tríceps',
        'push day: pecho y tríceps con mancuernas.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'espalda y bíceps',
        'pull day: espalda y bíceps con mancuernas.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'piernas mancuernas',
        'día de piernas completo con mancuernas: sentadillas, zancadas y peso muerto rumano.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'full body mancuernas',
        'rutina de cuerpo completo combinando tren superior e inferior con mancuernas.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'glúteos y piernas',
        'enfocada en glúteos y tren inferior con calentamiento de movilidad de cadera.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'HIIT cuerpo completo',
        'circuito de alta intensidad con ejercicios compuestos y cardio. quema máxima.',
        5
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'tren superior variaciones',
        'hombros y espalda con variaciones avanzadas más trabajo de core.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'piernas y core',
        'piernas pesadas con mancuernas combinado con trabajo de core y abdominales.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'push con core',
        'pecho y hombros (empuje) con trabajo de core al final.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'pull con core',
        'espalda y brazos (tirón) con trabajo de core al final.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'rutina barras paralelas',
        'rutina completa en barras paralelas para ganar fuerza y masa muscular.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia push focus',
        'rutina especializada en empuje (pecho/tríceps) usando barras paralelas.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia pull focus',
        'rutina especializada en tirón (espalda/bíceps) usando remos y negativos.',
        8
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia legs potency',
        'rutina de piernas bodyweight explosiva para ganar fuerza y resistencia.',
        10
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'calistenia full body mastery',
        'circuito completo de calistenia integrando todos los grupos musculares.',
        12
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

-- Glúteos y Piernas: Calentamiento (x1) → Glúteos (x3) → Piernas Funcional (x3)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'glúteos y piernas'
    and s.name = 'calentamiento y movilidad';

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
    r.name = 'glúteos y piernas'
    and s.name = 'glúteos y cadera';

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
    r.name = 'glúteos y piernas'
    and s.name = 'piernas funcional';

-- HIIT Cuerpo Completo: Calentamiento (x1) → Compuestos (x3) → Cardio HIIT (x3)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'HIIT cuerpo completo'
    and s.name = 'calentamiento y movilidad';

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
    r.name = 'HIIT cuerpo completo'
    and s.name = 'compuestos cuerpo completo';

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
    r.name = 'HIIT cuerpo completo'
    and s.name = 'cardio HIIT';

-- Tren Superior Variaciones: Calentamiento (x1) → Hombros Variaciones (x3) → Espalda Variaciones (x3) → Core (x2)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'tren superior variaciones'
    and s.name = 'calentamiento y movilidad';

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
    r.name = 'tren superior variaciones'
    and s.name = 'hombros variaciones';

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
    r.name = 'tren superior variaciones'
    and s.name = 'espalda variaciones';

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
    r.name = 'tren superior variaciones'
    and s.name = 'core y abdominales';

-- Piernas y Core: Calentamiento (x1) → Piernas Mancuernas (x4) → Glúteos (x2) → Core (x2)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'piernas y core'
    and s.name = 'calentamiento y movilidad';

insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 1, 4
from public.routines r, public.sets s
where
    r.name = 'piernas y core'
    and s.name = 'piernas mancuernas';

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
    r.name = 'piernas y core'
    and s.name = 'glúteos y cadera';

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
    r.name = 'piernas y core'
    and s.name = 'core y abdominales';

-- Push con Core: Calentamiento (x1) → Pecho (x3) → Hombros (x3) → Core (x2)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'push con core'
    and s.name = 'calentamiento y movilidad';

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
    r.name = 'push con core'
    and s.name = 'pecho mancuernas';

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
    r.name = 'push con core'
    and s.name = 'hombros mancuernas';

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
    r.name = 'push con core'
    and s.name = 'core y abdominales';

-- Pull con Core: Calentamiento (x1) → Espalda (x3) → Brazos (x3) → Core (x2)
insert into
    public.routine_sets (
        routine_id,
        set_id,
        position,
        rounds
    )
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where
    r.name = 'pull con core'
    and s.name = 'calentamiento y movilidad';

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
    r.name = 'pull con core'
    and s.name = 'espalda mancuernas';

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
    r.name = 'pull con core'
    and s.name = 'brazos mancuernas';

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
    r.name = 'pull con core'
    and s.name = 'core y abdominales';

-- Rutina Barras Paralelas: Barras Paralelas (x4)
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
    r.name = 'rutina barras paralelas'
    and s.name = 'barras paralelas';

-- Calistenia Push Focus: Calentamiento (x1) → Empuje Focalizado (x4) → Core (x2)
insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where r.name = 'calistenia push focus' and s.name = 'calentamiento y movilidad';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 1, 4
from public.routines r, public.sets s
where r.name = 'calistenia push focus' and s.name = 'calistenia empuje focalizado';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 2, 2
from public.routines r, public.sets s
where r.name = 'calistenia push focus' and s.name = 'calistenia core y estabilidad';

-- Calistenia Pull Focus: Calentamiento (x1) → Tirón Focalizado (x4) → Core (x2)
insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where r.name = 'calistenia pull focus' and s.name = 'calentamiento y movilidad';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 1, 4
from public.routines r, public.sets s
where r.name = 'calistenia pull focus' and s.name = 'calistenia tirón focalizado';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 2, 2
from public.routines r, public.sets s
where r.name = 'calistenia pull focus' and s.name = 'calistenia core y estabilidad';

-- Calistenia Legs Potency: Calentamiento (x1) → Pierna y Potencia (x4) → Core (x2)
insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where r.name = 'calistenia legs potency' and s.name = 'calentamiento y movilidad';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 1, 4
from public.routines r, public.sets s
where r.name = 'calistenia legs potency' and s.name = 'calistenia pierna y potencia';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 2, 2
from public.routines r, public.sets s
where r.name = 'calistenia legs potency' and s.name = 'calistenia core y estabilidad';

-- Calistenia Full Body Mastery: Calentamiento (x1) → Empuje (x2) → Tirón (x2) → Piernas (x2) → Core (x1)
insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 0, 1
from public.routines r, public.sets s
where r.name = 'calistenia full body mastery' and s.name = 'calentamiento y movilidad';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 1, 2
from public.routines r, public.sets s
where r.name = 'calistenia full body mastery' and s.name = 'calistenia empuje focalizado';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 2, 2
from public.routines r, public.sets s
where r.name = 'calistenia full body mastery' and s.name = 'calistenia tirón focalizado';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 3, 2
from public.routines r, public.sets s
where r.name = 'calistenia full body mastery' and s.name = 'calistenia pierna y potencia';

insert into
    public.routine_sets (routine_id, set_id, position, rounds)
select r.id, s.id, 4, 1
from public.routines r, public.sets s
where r.name = 'calistenia full body mastery' and s.name = 'calistenia core y estabilidad';
