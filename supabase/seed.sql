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
        '{}',
        45
    ),
    (
        'Bench Press',
        'Lie on a flat bench, lower the barbell to your chest, then press it back up to full arm extension.',
        '{}',
        40
    ),
    (
        'Deadlift',
        'With feet hip-width apart, hinge at the hips to grip the barbell and lift it by extending hips and knees.',
        '{}',
        50
    ),
    (
        'Overhead Press',
        'Press a barbell from shoulder height to overhead while standing with a braced core.',
        '{}',
        35
    ),
    (
        'Barbell Row',
        'Hinge forward at the hips and pull the barbell toward your lower chest, squeezing your shoulder blades.',
        '{}',
        40
    ),
    (
        'Pull-Up',
        'Hang from a bar with palms facing away and pull yourself up until your chin clears the bar.',
        '{}',
        30
    ),
    (
        'Dumbbell Lunges',
        'Hold a dumbbell in each hand, step forward and lower your back knee toward the ground, then push back up.',
        '{}',
        40
    ),
    (
        'Plank',
        'Hold a push-up position on your forearms, keeping your body in a straight line from head to heels.',
        '{}',
        60
    ),
    (
        'Romanian Deadlift',
        'Hold a barbell with straight arms, hinge at the hips while keeping legs slightly bent, then return to standing.',
        '{}',
        45
    ),
    (
        'Dumbbell Lateral Raise',
        'Stand with dumbbells at your sides and raise them out to shoulder height with a slight bend in the elbows.',
        '{}',
        30
    );