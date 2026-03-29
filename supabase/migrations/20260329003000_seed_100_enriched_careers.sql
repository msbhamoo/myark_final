-- Seed script for 100 Enriched Careers
-- Generated to include realistic Indian education context

DO $$
BEGIN

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'MBBS — General Physician', 'mbbs-general-physician', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a MBBS — General Physician, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'MBBS — General Physician is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a MBBS — General Physician, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'BDS — Dentist', 'bds-dentist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a BDS — Dentist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'BDS — Dentist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a BDS — Dentist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'MD Surgeon', 'md-surgeon', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a MD Surgeon, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'MD Surgeon is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a MD Surgeon, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'BAMS — Ayurvedic Doctor', 'bams-ayurvedic-doctor', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a BAMS — Ayurvedic Doctor, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'BAMS — Ayurvedic Doctor is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a BAMS — Ayurvedic Doctor, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'BHMS — Homoeopathy', 'bhms-homoeopathy', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a BHMS — Homoeopathy, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'BHMS — Homoeopathy is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a BHMS — Homoeopathy, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'BUMS — Unani Medicine', 'bums-unani-medicine', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a BUMS — Unani Medicine, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'BUMS — Unani Medicine is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a BUMS — Unani Medicine, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Neurosurgeon', 'neurosurgeon', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Neurosurgeon, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Neurosurgeon is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Neurosurgeon, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Interventional Cardiologist', 'interventional-cardiologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Interventional Cardiologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Interventional Cardiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Interventional Cardiologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Radiologist', 'radiologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Radiologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Radiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Radiologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Dermatologist', 'dermatologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Dermatologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Dermatologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Dermatologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Psychiatrist', 'psychiatrist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Psychiatrist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Psychiatrist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Psychiatrist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Paediatric Surgeon', 'paediatric-surgeon', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Paediatric Surgeon, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Paediatric Surgeon is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Paediatric Surgeon, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Sports Medicine Physician', 'sports-medicine-physician', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Sports Medicine Physician, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Sports Medicine Physician is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Sports Medicine Physician, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Forensic Medicine Expert', 'forensic-medicine-expert', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Forensic Medicine Expert, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Forensic Medicine Expert is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Medicine Expert, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Ophthalmologist', 'ophthalmologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Ophthalmologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Ophthalmologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Ophthalmologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Orthopaedic Surgeon', 'orthopaedic-surgeon', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Orthopaedic Surgeon, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Orthopaedic Surgeon is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Orthopaedic Surgeon, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Plastic & Reconstructive Surgeon', 'plastic-and-reconstructive-surgeon', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Plastic & Reconstructive Surgeon, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Plastic & Reconstructive Surgeon is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Plastic & Reconstructive Surgeon, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '10+ years (MBBS + MD/MS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Anaesthesiologist', 'anaesthesiologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Anaesthesiologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Anaesthesiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Anaesthesiologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Pathologist', 'pathologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Pathologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Pathologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Pathologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Genetic Counsellor', 'genetic-counsellor', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Genetic Counsellor, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Genetic Counsellor is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Genetic Counsellor, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Very Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Nuclear Medicine Physician', 'nuclear-medicine-physician', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Nuclear Medicine Physician, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Nuclear Medicine Physician is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Nuclear Medicine Physician, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Very Rare',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Palliative Care Specialist', 'palliative-care-specialist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Palliative Care Specialist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Palliative Care Specialist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Palliative Care Specialist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Physiotherapist', 'physiotherapist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Physiotherapist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Physiotherapist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Physiotherapist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Occupational Therapist', 'occupational-therapist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Occupational Therapist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Occupational Therapist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Occupational Therapist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Speech-Language Pathologist', 'speech-language-pathologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Speech-Language Pathologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Speech-Language Pathologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Speech-Language Pathologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Audiologist', 'audiologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Audiologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Audiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Audiologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Dietitian/Nutritionist', 'dietitian-nutritionist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Dietitian/Nutritionist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Dietitian/Nutritionist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Dietitian/Nutritionist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Radiographer', 'radiographer', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Radiographer, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Radiographer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Radiographer, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Medical Lab Technologist', 'medical-lab-technologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Medical Lab Technologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Medical Lab Technologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Medical Lab Technologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Prosthetist & Orthotist', 'prosthetist-and-orthotist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Prosthetist & Orthotist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Prosthetist & Orthotist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Prosthetist & Orthotist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Perfusionist', 'perfusionist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Perfusionist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Perfusionist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Perfusionist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Clinical Psychologist', 'clinical-psychologist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Clinical Psychologist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Clinical Psychologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Clinical Psychologist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Art Therapist', 'art-therapist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Art Therapist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Art Therapist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Art Therapist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Music Therapist', 'music-therapist', 'Medicine & Healthcare', 'Science PCB',
        'Embark on a dynamic journey as a Music Therapist, mastering Empathy and Critical Thinking to excel in the Medicine & Healthcare sector.', 'Music Therapist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Music Therapist, you will apply your skills in Empathy, Critical Thinking, Stamina, Attention to Detail, Scientific Acumen to solve complex problems in the Medicine & Healthcare industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCB and enjoy empathy.', '1. Focus heavily on your Science PCB subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NEET UG early.
4. Develop empathy outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NEET UG", "INICET", "NEET PG" }',
        'Related Degree', '5.5 years (MBBS/BDS)', '{ "AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "AFMC Pune", "KGMU Lucknow" }',
        '{ "Apollo Hospitals", "Max Healthcare", "Fortis", "AIIMS", "Government Hospitals" }', '{ "Empathy", "Critical Thinking", "Stamina", "Attention to Detail", "Scientific Acumen" }', 'Common',
        'High', 'Medium', '{ "mbbs-general-physician", "bds-dentist" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Computer Science (CSE) Engineering', 'computer-science-cse-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Computer Science (CSE) Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Computer Science (CSE) Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Computer Science (CSE) Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Electrical Engineering', 'electrical-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Electrical Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Electrical Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Electrical Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Mechanical Engineering', 'mechanical-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Mechanical Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Mechanical Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Mechanical Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Civil Engineering', 'civil-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Civil Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Civil Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Civil Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Chemical Engineering', 'chemical-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Chemical Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Chemical Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Chemical Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Electronics & Communication Engineering', 'electronics-and-communication-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Electronics & Communication Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Electronics & Communication Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Electronics & Communication Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Aerospace Engineering', 'aerospace-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Aerospace Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Aerospace Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Aerospace Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Naval Architecture & Marine Engineering', 'naval-architecture-and-marine-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Naval Architecture & Marine Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Naval Architecture & Marine Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Naval Architecture & Marine Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Biomedical Engineering', 'biomedical-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Biomedical Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Biomedical Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Biomedical Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Environmental Engineering', 'environmental-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Environmental Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Environmental Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Environmental Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Agricultural Engineering', 'agricultural-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Agricultural Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Agricultural Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Agricultural Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Mining Engineering', 'mining-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Mining Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Mining Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Mining Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Textile Engineering', 'textile-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Textile Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Textile Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Textile Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Petroleum Engineering', 'petroleum-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Petroleum Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Petroleum Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Petroleum Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Instrumentation Engineering', 'instrumentation-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Instrumentation Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Instrumentation Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Instrumentation Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Mechatronics Engineering', 'mechatronics-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Mechatronics Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Mechatronics Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Mechatronics Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Nuclear Engineering', 'nuclear-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Nuclear Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Nuclear Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Nuclear Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Very Rare',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Food Technology Engineering', 'food-technology-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Food Technology Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Food Technology Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Food Technology Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Geotechnical Engineering', 'geotechnical-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Geotechnical Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Geotechnical Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Geotechnical Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Fire & Safety Engineering', 'fire-and-safety-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Fire & Safety Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Fire & Safety Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Fire & Safety Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Robotics Engineering', 'robotics-engineering', 'Engineering', 'Science PCM',
        'Embark on a dynamic journey as a Robotics Engineering, mastering Problem Solving and Mathematics to excel in the Engineering sector.', 'Robotics Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Robotics Engineering, you will apply your skills in Problem Solving, Mathematics, Analytical Thinking, Programming, Physics to solve complex problems in the Engineering industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy problem solving.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop problem solving outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "MHT CET" }',
        'B.Tech or B.E.', '4 years (B.Tech/B.E.)', '{ "IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "IIIT Hyderabad" }',
        '{ "Google", "Microsoft", "TCS", "Infosys", "Larsen & Toubro" }', '{ "Problem Solving", "Mathematics", "Analytical Thinking", "Programming", "Physics" }', 'Common',
        'High', 'Medium', '{ "computer-science-cse-engineering", "mechanical-engineering" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Astrophysicist', 'astrophysicist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Astrophysicist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Astrophysicist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Astrophysicist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Marine Biologist', 'marine-biologist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Marine Biologist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Marine Biologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Marine Biologist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Geneticist', 'geneticist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Geneticist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Geneticist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Geneticist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Very Rare',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Neuroscientist', 'neuroscientist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Neuroscientist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Neuroscientist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Neuroscientist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Climate Scientist', 'climate-scientist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Climate Scientist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Climate Scientist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Climate Scientist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Volcanologist', 'volcanologist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Volcanologist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Volcanologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Volcanologist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Palaeontologist', 'palaeontologist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Palaeontologist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Palaeontologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Palaeontologist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Oceanographer', 'oceanographer', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Oceanographer, mastering Research Output and Patience to excel in the Science & Research sector.', 'Oceanographer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Oceanographer, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Glaciologist', 'glaciologist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Glaciologist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Glaciologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Glaciologist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Astrobiologist', 'astrobiologist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Astrobiologist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Astrobiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Astrobiologist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Forensic Scientist', 'forensic-scientist', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Forensic Scientist, mastering Research Output and Patience to excel in the Science & Research sector.', 'Forensic Scientist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Scientist, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Bioinformatician', 'bioinformatician', 'Science & Research', 'Science PCM',
        'Embark on a dynamic journey as a Bioinformatician, mastering Research Output and Patience to excel in the Science & Research sector.', 'Bioinformatician is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Bioinformatician, you will apply your skills in Research Output, Patience, Data Collection, Laboratory Skills to solve complex problems in the Science & Research industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy research output.', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for IISER Aptitude Test early.
4. Develop research output outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "CUET", "KVPY" }',
        'B.Sc / BS-MS Dual', '3-5 years (B.Sc/M.Sc)', '{ "IISc Bangalore", "IISER Pune", "St. Stephen''s College", "Hindu College" }',
        '{ "ISRO", "DRDO", "BARC", "Top Universities", "CSIR Labs" }', '{ "Research Output", "Patience", "Data Collection", "Laboratory Skills" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Ethical Hacker', 'ethical-hacker', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Ethical Hacker, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Ethical Hacker is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Ethical Hacker, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'AI/ML Engineer', 'ai-ml-engineer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a AI/ML Engineer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'AI/ML Engineer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a AI/ML Engineer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Blockchain Developer', 'blockchain-developer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Blockchain Developer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Blockchain Developer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Blockchain Developer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'AR/VR Developer', 'ar-vr-developer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a AR/VR Developer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'AR/VR Developer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a AR/VR Developer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Game Designer', 'game-designer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Game Designer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Game Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Game Designer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'UX/UI Designer', 'ux-ui-designer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a UX/UI Designer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'UX/UI Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a UX/UI Designer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Data Scientist', 'data-scientist', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Data Scientist, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Data Scientist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Data Scientist, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Cybersecurity Analyst', 'cybersecurity-analyst', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Cybersecurity Analyst, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Cybersecurity Analyst is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Cybersecurity Analyst, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Cloud Architect', 'cloud-architect', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Cloud Architect, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Cloud Architect is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Cloud Architect, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Digital Forensics Investigator', 'digital-forensics-investigator', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Digital Forensics Investigator, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Digital Forensics Investigator is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Digital Forensics Investigator, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Quantum Computing Researcher', 'quantum-computing-researcher', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Quantum Computing Researcher, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Quantum Computing Researcher is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Quantum Computing Researcher, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Space Technology Engineer', 'space-technology-engineer', 'Technology', 'Science PCM',
        'Embark on a dynamic journey as a Space Technology Engineer, mastering Coding (Python, Java) and System Design to excel in the Technology sector.', 'Space Technology Engineer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Space Technology Engineer, you will apply your skills in Coding (Python, Java), System Design, Algorithms, Cloud Computing to solve complex problems in the Technology industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Science PCM and enjoy coding (python, java).', '1. Focus heavily on your Science PCM subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for JEE Main early.
4. Develop coding (python, java) outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CUET", "State CETs" }',
        'B.Tech IT / BCA / B.Sc CS', '4 years', '{ "IIT Madras", "IIT Kanpur", "BITS Pilani", "Delhi Technological University" }',
        '{ "Amazon", "Meta", "Wipro", "HCL", "Startups" }', '{ "Coding (Python, Java)", "System Design", "Algorithms", "Cloud Computing" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Actuary', 'actuary', 'Business & Finance', 'Any (Mathematics mandatory)',
        'Embark on a dynamic journey as a Actuary, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Actuary is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Actuary, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any (Mathematics mandatory) and enjoy financial modeling.', '1. Focus heavily on your Any (Mathematics mandatory) subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'BBA / B.Com / CA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Chartered Accountant (CA)', 'chartered-accountant-ca', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Chartered Accountant (CA), mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Chartered Accountant (CA) is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Chartered Accountant (CA), you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Investment Banker', 'investment-banker', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Investment Banker, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Investment Banker is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Investment Banker, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Venture Capitalist', 'venture-capitalist', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Venture Capitalist, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Venture Capitalist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Venture Capitalist, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Patent Attorney', 'patent-attorney', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Patent Attorney, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Patent Attorney is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Patent Attorney, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Environmental Lawyer', 'environmental-lawyer', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Environmental Lawyer, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Environmental Lawyer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Environmental Lawyer, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'International Trade Lawyer', 'international-trade-lawyer', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a International Trade Lawyer, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'International Trade Lawyer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a International Trade Lawyer, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Forensic Accountant', 'forensic-accountant', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Forensic Accountant, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Forensic Accountant is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Accountant, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Statistician', 'statistician', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Statistician, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Statistician is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Statistician, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Behavioural Economist', 'behavioural-economist', 'Business & Finance', 'Commerce',
        'Embark on a dynamic journey as a Behavioural Economist, mastering Financial Modeling and Communication to excel in the Business & Finance sector.', 'Behavioural Economist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Behavioural Economist, you will apply your skills in Financial Modeling, Communication, Leadership, Data Analysis to solve complex problems in the Business & Finance industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Commerce and enjoy financial modeling.', '1. Focus heavily on your Commerce subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for CAT early.
4. Develop financial modeling outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CAT", "XAT", "IPMAT", "CUET" }',
        'B.Com (Hons.) or BBA', '3-5 years (BBA/MBA)', '{ "IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "Shaheed Sukhdev (SSCBS)" }',
        '{ "Deloitte", "KPMG", "McKinsey", "Goldman Sachs", "HDFC Bank" }', '{ "Financial Modeling", "Communication", "Leadership", "Data Analysis" }', 'Common',
        'High', 'Medium', '{ "chartered-accountant", "investment-banker" }',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Industrial/Product Designer', 'industrial-product-designer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Industrial/Product Designer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Industrial/Product Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Industrial/Product Designer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'UI/UX Designer', 'ui-ux-designer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a UI/UX Designer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'UI/UX Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a UI/UX Designer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Animation Filmmaker', 'animation-filmmaker', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Animation Filmmaker, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Animation Filmmaker is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Animation Filmmaker, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Concept Artist', 'concept-artist', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Concept Artist, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Concept Artist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Concept Artist, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Typographer', 'typographer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Typographer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Typographer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Typographer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Textile Designer', 'textile-designer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Textile Designer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Textile Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Textile Designer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Jewellery Designer', 'jewellery-designer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Jewellery Designer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Jewellery Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Jewellery Designer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Art Director', 'art-director', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Art Director, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Art Director is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Art Director, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Illustrator', 'illustrator', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Illustrator, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Illustrator is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Illustrator, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Muralist', 'muralist', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Muralist, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Muralist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Muralist, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

    INSERT INTO career_directory (
        name, slug, category, stream_required, short_description, full_description,
        what_you_do, is_this_for_you, how_to_prepare_in_school, salary_entry, salary_mid,
        salary_senior, entrance_exams, degree_required, duration, colleges_india,
        top_employers, skills_needed, rarity_level, demand_level, competition_level,
        related_careers, is_published
    ) VALUES (
        'Set Designer', 'set-designer', 'Creative Arts', 'Any Stream',
        'Embark on a dynamic journey as a Set Designer, mastering Creativity and Communication to excel in the Creative Arts sector.', 'Set Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Set Designer, you will apply your skills in Creativity, Communication, Visual Design, Adaptability to solve complex problems in the Creative Arts industry. Your daily tasks involve collaboration, analysis, and strategic execution to drive impactful outcomes for your organization or clients.',
        'Perfect for students who score well in Any Stream and enjoy creativity.', '1. Focus heavily on your Any Stream subjects, aiming for top-tier grades.
2. Participate in relevant extra-curricular clubs or olympiads.
3. Begin foundational preparation for NID DAT early.
4. Develop creativity outside of the classroom through projects or self-study.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT", "NIFT", "UCEED", "CUET" }',
        'B.Des / BFA / B.A.', '3-4 years (B.Des/B.A.)', '{ "NID Ahmedabad", "NIFT Delhi", "Srishti Institute", "JJ School of Art" }',
        '{ "Ogilvy", "Leo Burnett", "Freelance / Own Studio", "Media Houses" }', '{ "Creativity", "Communication", "Visual Design", "Adaptability" }', 'Common',
        'High', 'Medium', '{}',
        true
    ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        stream_required = EXCLUDED.stream_required,
        short_description = EXCLUDED.short_description,
        what_you_do = EXCLUDED.what_you_do,
        is_this_for_you = EXCLUDED.is_this_for_you,
        how_to_prepare_in_school = EXCLUDED.how_to_prepare_in_school,
        salary_entry = EXCLUDED.salary_entry,
        salary_mid = EXCLUDED.salary_mid,
        salary_senior = EXCLUDED.salary_senior,
        entrance_exams = EXCLUDED.entrance_exams,
        degree_required = EXCLUDED.degree_required,
        duration = EXCLUDED.duration,
        colleges_india = EXCLUDED.colleges_india,
        top_employers = EXCLUDED.top_employers,
        skills_needed = EXCLUDED.skills_needed,
        rarity_level = EXCLUDED.rarity_level,
        demand_level = EXCLUDED.demand_level,
        competition_level = EXCLUDED.competition_level,
        related_careers = EXCLUDED.related_careers,
        is_published = EXCLUDED.is_published;

END $$;
