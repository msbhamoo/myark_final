-- Schema for Quiz Module
create table quiz_subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  colour text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references quiz_subjects(id),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null,
  explanation text,
  difficulty text default 'medium',
  class_level text,
  tags text[],
  times_shown integer default 0,
  times_correct integer default 0,
  is_active boolean default true,
  created_by text default 'admin',
  created_at timestamptz default now()
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subject_id uuid references quiz_subjects(id),
  description text,
  quiz_type text not null,
  cadence text,
  questions_per_attempt integer default 5,
  time_limit_seconds integer default 300,
  total_questions_in_bank integer default 0,
  start_time timestamptz,
  end_time timestamptz,
  is_active boolean default true,
  show_leaderboard_at timestamptz,
  leaderboard_revealed boolean default false,
  prize_description text,
  badge_name text,
  created_at timestamptz default now()
);

create table quiz_periods (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id),
  period_number integer not null,
  period_label text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  questions_used uuid[],
  leaderboard_revealed boolean default false,
  total_participants integer default 0,
  created_at timestamptz default now()
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id),
  period_id uuid references quiz_periods(id),
  session_id text not null,
  student_name text,
  student_class text,
  school text,
  city text,
  questions_shown uuid[] not null,
  answers jsonb not null,
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  wrong_answers integer not null,
  skipped_answers integer not null,
  time_taken_seconds integer not null,
  speed_bonus integer default 0,
  final_score integer not null,
  rank integer,
  percentile integer,
  completed_at timestamptz default now()
);

create table quiz_leaderboard (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id),
  period_id uuid references quiz_periods(id),
  attempt_id uuid references quiz_attempts(id),
  rank integer not null,
  student_name text,
  student_class text,
  school text,
  city text,
  score integer,
  correct_answers integer,
  time_taken_seconds integer,
  final_score integer,
  badge_earned text,
  created_at timestamptz default now()
);

create table quiz_badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  colour text,
  criteria text,
  quiz_id uuid references quizzes(id),
  created_at timestamptz default now()
);

-- Seed Data for Subjects
INSERT INTO quiz_subjects (name, slug, colour) VALUES
('Science', 'science', '#1b5e28'),
('Mathematics', 'mathematics', '#0d47a1'),
('Coding & AI', 'coding-ai', '#4a148c'),
('Robotics', 'robotics', '#bf360c'),
('General Knowledge', 'gk', '#e65100'),
('English', 'english', '#880e4f'),
('Space & Astronomy', 'astronomy', '#006064'),
('Environment', 'environment', '#33691e'),
('History & Civics', 'history', '#4e342e'),
('Current Affairs', 'current-affairs', '#37474f')
ON CONFLICT (slug) DO NOTHING;

-- Seed Data for Questions
DO $$
DECLARE
  sci_id uuid;
BEGIN
  -- Get the science subject ID
  SELECT id INTO sci_id FROM quiz_subjects WHERE slug = 'science' LIMIT 1;
  
  IF sci_id IS NOT NULL THEN
    INSERT INTO quiz_questions (subject_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, class_level)
    VALUES
    (sci_id, 'Which gas is most abundant in Earth''s atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon', 'C', 'Nitrogen makes up about 78% of Earth''s atmosphere. Oxygen is second at 21%. This is why we can''t breathe in space — it''s not just about oxygen but the right mix.', 'easy', 'Class 6-10'),
    (sci_id, 'What is CRISPR-Cas9 used for?', 'Space exploration', 'Gene editing', 'Quantum computing', 'Nuclear fusion', 'B', 'CRISPR-Cas9 is a revolutionary gene-editing tool that acts like molecular scissors, allowing scientists to cut and modify DNA at specific locations. It has potential applications in treating genetic diseases.', 'hard', 'Class 11-12'),
    (sci_id, 'What is the chemical symbol for Gold?', 'Au', 'Ag', 'Fe', 'Cu', 'A', 'The symbol Au comes from the Latin word "aurum", meaning "shining dawn" or "glow of sunrise". Silver is Ag.', 'easy', 'Class 6-10'),
    (sci_id, 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'Mars is often called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.', 'easy', 'Class 3-8'),
    (sci_id, 'What force keeps planets in orbit around the Sun?', 'Magnetism', 'Friction', 'Gravity', 'Centrifugal force', 'C', 'Gravity is the universal force of attraction acting between all matter. It''s what keeps planets orbiting the Sun.', 'easy', 'Class 6-10'),
    (sci_id, 'What is the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum', 'B', 'Mitochondria generate most of the chemical energy needed to power the cell''s biochemical reactions, stored in ATP.', 'medium', 'Class 8-12'),
    (sci_id, 'What is the hardest natural substance on Earth?', 'Diamond', 'Graphene', 'Tungsten', 'Titanium', 'A', 'Diamond is the hardest known natural material on both the Vickers scale and the Mohs scale, formed of pure carbon under extreme pressure.', 'medium', 'Class 6-10'),
    (sci_id, 'Who proposed the theory of relativity?', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla', 'Albert Einstein', 'D', 'Albert Einstein proposed the theory of relativity (special relativity in 1905, general relativity in 1915), transforming theoretical physics.', 'medium', 'Class 9-12'),
    (sci_id, 'What part of the plant conducts photosynthesis?', 'Root', 'Stem', 'Leaf', 'Flower', 'C', 'Leaves are the primary site of photosynthesis, containing chlorophyll which absorbs sunlight to make food for the plant.', 'easy', 'Class 4-8'),
    (sci_id, 'What is absolute zero in Celsius?', '-273.15°C', '-100°C', '-500°C', '0°C', 'A', 'Absolute zero is the lowest limit of the thermodynamic temperature scale, state at which enthalpy and entropy reach their minimum values.', 'hard', 'Class 11-12');
  END IF;
END $$;
