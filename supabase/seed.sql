-- Seed exercises with example data

insert into
    public.exercises (
        title,
        description,
        image_urls,
        duration_secs
    )
values (
        'Barbell Back Squat',
        'Stand with a barbell on your upper back, squat down until thighs are parallel, then drive back up.',
        '{"https://images.unsplash.com/photo-1513352098199-8ccf457b35a8?w=800&fit=crop","https://images.unsplash.com/photo-1517964706594-8bf49837d8dc?w=800&fit=crop","https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&fit=crop"}',
        9
    ),
    (
        'Bench Press',
        'Lie on a flat bench, lower the barbell to your chest, then press it back up to full arm extension.',
        '{"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop","https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&fit=crop"}',
        12
    ),
    (
        'Deadlift',
        'With feet hip-width apart, hinge at the hips to grip the barbell and lift it by extending hips and knees.',
        '{"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&fit=crop","https://images.unsplash.com/photo-1517964706594-8bf49837d8dc?w=800&fit=crop","https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&fit=crop","https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&fit=crop"}',
        20
    );