-- Seed exercises with example data

insert into
    public.exercises (
        title,
        description,
        images,
        tags,
        duration_secs
    )
values (
        'Barbell Back Squat',
        'Stand with a barbell on your upper back, squat down until thighs are parallel, then drive back up.',
        '[{"url":"https://images.unsplash.com/photo-1513352098199-8ccf457b35a8?w=800&fit=crop","description":"Mantén la espalda recta"},{"url":"https://images.unsplash.com/photo-1517964706594-8bf49837d8dc?w=800&fit=crop","description":"No dejes que las rodillas pasen los pies"},{"url":"https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&fit=crop","description":"Empuja con los talones"}]'::jsonb,
        '{"barra","piernas"}',
        9
    ),
    (
        'Bench Press',
        'Lie on a flat bench, lower the barbell to your chest, then press it back up to full arm extension.',
        '[{"url":"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop","description":"Baja la barra controladamente"},{"url":"https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&fit=crop","description":"Aprieta los omóplatos"}]'::jsonb,
        '{"banco","barra","pecho"}',
        12
    ),
    (
        'Deadlift',
        'With feet hip-width apart, hinge at the hips to grip the barbell and lift it by extending hips and knees.',
        '[{"url":"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&fit=crop","description":"Empuja el suelo con los pies"},{"url":"https://images.unsplash.com/photo-1517964706594-8bf49837d8dc?w=800&fit=crop","description":"Mantén la barra cerca del cuerpo"},{"url":"https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&fit=crop","description":"Activa el core"},{"url":"https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&fit=crop","description":"Extiende caderas y rodillas"}]'::jsonb,
        '{"barra","espalda","piernas"}',
        20
    );