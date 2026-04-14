-- ─── PLANS ───────────────────────────────────────────────────────────────────

insert into
    public.plans (user_id, name, description)
values (
        '00000000-0000-0000-0000-000000000000',
        'push pull legs mancuernas',
        'plan semanal push/pull/legs con mancuernas. 6 días de entrenamiento.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'full body 3 días',
        'plan de 3 días por semana con rutinas de cuerpo completo. ideal para principiantes.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'upper lower 4 días',
        'plan de 4 días alternando tren superior e inferior con core. lun/jue upper, mar/vie lower.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'HIIT y fuerza 5 días',
        'plan de 5 días combinando sesiones de fuerza con días HIIT para maximizar quema y músculo.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'glúteos focus 4 días',
        'plan de 4 días enfocado en glúteos y piernas, con tren superior como complemento.'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'plan calistenia elite',
        'plan integral de calistenia para dominar el peso corporal. 4 días de entrenamiento intenso.'
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

-- Upper Lower 4 Días: Lun(0)=Push, Mar(1)=Piernas+Core, Jue(3)=Pull, Vie(4)=Glúteos+Piernas
insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 0
from public.plans p, public.routines r
where
    p.name = 'upper lower 4 días'
    and r.name = 'push con core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 1
from public.plans p, public.routines r
where
    p.name = 'upper lower 4 días'
    and r.name = 'piernas y core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 3
from public.plans p, public.routines r
where
    p.name = 'upper lower 4 días'
    and r.name = 'pull con core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'upper lower 4 días'
    and r.name = 'glúteos y piernas';

-- HIIT y Fuerza 5 Días: Lun(0)=Push, Mar(1)=HIIT, Mié(2)=Piernas, Jue(3)=Pull, Vie(4)=HIIT
insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 0
from public.plans p, public.routines r
where
    p.name = 'HIIT y fuerza 5 días'
    and r.name = 'push con core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 1
from public.plans p, public.routines r
where
    p.name = 'HIIT y fuerza 5 días'
    and r.name = 'HIIT cuerpo completo';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 2
from public.plans p, public.routines r
where
    p.name = 'HIIT y fuerza 5 días'
    and r.name = 'piernas y core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 3
from public.plans p, public.routines r
where
    p.name = 'HIIT y fuerza 5 días'
    and r.name = 'pull con core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'HIIT y fuerza 5 días'
    and r.name = 'HIIT cuerpo completo';

-- Glúteos Focus 4 Días: Lun(0)=Glúteos, Mar(1)=Upper Variaciones, Jue(3)=Piernas+Core, Vie(4)=Glúteos
insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 0
from public.plans p, public.routines r
where
    p.name = 'glúteos focus 4 días'
    and r.name = 'glúteos y piernas';

-- Plan Calistenia Elite: Lun(0)=Push, Mar(1)=Pull, Jue(3)=Legs, Vie(4)=FullBody
insert into
    public.plan_routines (plan_id, routine_id, day_of_week)
select p.id, r.id, 0
from public.plans p, public.routines r
where p.name = 'plan calistenia elite' and r.name = 'calistenia push focus';

insert into
    public.plan_routines (plan_id, routine_id, day_of_week)
select p.id, r.id, 1
from public.plans p, public.routines r
where p.name = 'plan calistenia elite' and r.name = 'calistenia pull focus';

insert into
    public.plan_routines (plan_id, routine_id, day_of_week)
select p.id, r.id, 3
from public.plans p, public.routines r
where p.name = 'plan calistenia elite' and r.name = 'calistenia legs potency';

insert into
    public.plan_routines (plan_id, routine_id, day_of_week)
select p.id, r.id, 4
from public.plans p, public.routines r
where p.name = 'plan calistenia elite' and r.name = 'calistenia full body mastery';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 1
from public.plans p, public.routines r
where
    p.name = 'glúteos focus 4 días'
    and r.name = 'tren superior variaciones';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 3
from public.plans p, public.routines r
where
    p.name = 'glúteos focus 4 días'
    and r.name = 'piernas y core';

insert into
    public.plan_routines (
        plan_id,
        routine_id,
        day_of_week
    )
select p.id, r.id, 4
from public.plans p, public.routines r
where
    p.name = 'glúteos focus 4 días'
    and r.name = 'glúteos y piernas';