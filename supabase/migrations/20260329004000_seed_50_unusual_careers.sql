-- Seed script for 50 Rare/Unusual Careers
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
        'Forensic Medicine Expert', 'forensic-medicine-expert', 'Medicine & Healthcare', 'Science PCB',
        'Break away from the crowd as a Forensic Medicine Expert, exploring an unconventional and highly specialized path in the Medicine & Healthcare ecosystem.', 'Forensic Medicine Expert is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Medicine Expert, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Crime Scene Analysis, Toxicology, Lab Techniques, Law Basics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on crime scene analysis.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "AIFSET", "CUET" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "National Forensic Sciences University (NFSU)", "Osmania University" }',
        '{ "CBI", "State Police Labs", "Private Detective Agencies", "Cyber Cells" }', '{ "Crime Scene Analysis", "Toxicology", "Lab Techniques", "Law Basics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Prosthetist & Orthotist, exploring an unconventional and highly specialized path in the Medicine & Healthcare ecosystem.', 'Prosthetist & Orthotist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Prosthetist & Orthotist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Aerospace Engineering, exploring an unconventional and highly specialized path in the Engineering ecosystem.', 'Aerospace Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Aerospace Engineering, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Mathematics, Astrophysics, Programming, Data Analysis to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced mathematics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "JEE Advanced (for IIST)" }',
        'BS-MS Dual Degree / B.Tech Aerospace', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIST Thiruvananthapuram", "IISc Bangalore", "IISER Pune" }',
        '{ "ISRO", "NASA", "TIFR", "SpaceX", "Academic Institutions" }', '{ "Advanced Mathematics", "Astrophysics", "Programming", "Data Analysis" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Naval Architecture & Marine Engineering, exploring an unconventional and highly specialized path in the Engineering ecosystem.', 'Naval Architecture & Marine Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Naval Architecture & Marine Engineering, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Marine Biology, Diving, Environmental Focus, Scientific Research to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on marine biology.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "CUSAT CAT" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "Cochin University (CUSAT)", "Goa University", "Andhra University" }',
        '{ "NIO (National Institute of Oceanography)", "Wildlife NGOs", "Fisheries Survey" }', '{ "Marine Biology", "Diving", "Environmental Focus", "Scientific Research" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Food Technology Engineering, exploring an unconventional and highly specialized path in the Engineering ecosystem.', 'Food Technology Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Food Technology Engineering, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Robotics Engineering, exploring an unconventional and highly specialized path in the Engineering ecosystem.', 'Robotics Engineering is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Robotics Engineering, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy C++/C#, Unreal Engine / Unity, 3D Modeling, Mechatronics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on c++/c#.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT (for design)", "JEE Main (for dev)" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "NID", "IIT Bombay (IDC)", "IIIT Hyderabad" }',
        '{ "Rockstar Games", "Ubisoft", "Boston Dynamics", "DJI" }', '{ "C++/C#", "Unreal Engine / Unity", "3D Modeling", "Mechatronics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Astrophysicist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Astrophysicist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Astrophysicist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Mathematics, Astrophysics, Programming, Data Analysis to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced mathematics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "JEE Advanced (for IIST)" }',
        'BS-MS Dual Degree / B.Tech Aerospace', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIST Thiruvananthapuram", "IISc Bangalore", "IISER Pune" }',
        '{ "ISRO", "NASA", "TIFR", "SpaceX", "Academic Institutions" }', '{ "Advanced Mathematics", "Astrophysics", "Programming", "Data Analysis" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Marine Biologist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Marine Biologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Marine Biologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Marine Biology, Diving, Environmental Focus, Scientific Research to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on marine biology.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "CUSAT CAT" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "Cochin University (CUSAT)", "Goa University", "Andhra University" }',
        '{ "NIO (National Institute of Oceanography)", "Wildlife NGOs", "Fisheries Survey" }', '{ "Marine Biology", "Diving", "Environmental Focus", "Scientific Research" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Volcanologist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Volcanologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Volcanologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Palaeontologist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Palaeontologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Palaeontologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Oceanographer, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Oceanographer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Oceanographer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Marine Biology, Diving, Environmental Focus, Scientific Research to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on marine biology.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "CUSAT CAT" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "Cochin University (CUSAT)", "Goa University", "Andhra University" }',
        '{ "NIO (National Institute of Oceanography)", "Wildlife NGOs", "Fisheries Survey" }', '{ "Marine Biology", "Diving", "Environmental Focus", "Scientific Research" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Astrobiologist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Astrobiologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Astrobiologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Mathematics, Astrophysics, Programming, Data Analysis to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced mathematics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "JEE Advanced (for IIST)" }',
        'BS-MS Dual Degree / B.Tech Aerospace', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIST Thiruvananthapuram", "IISc Bangalore", "IISER Pune" }',
        '{ "ISRO", "NASA", "TIFR", "SpaceX", "Academic Institutions" }', '{ "Advanced Mathematics", "Astrophysics", "Programming", "Data Analysis" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Forensic Scientist, exploring an unconventional and highly specialized path in the Science & Research ecosystem.', 'Forensic Scientist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Scientist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Crime Scene Analysis, Toxicology, Lab Techniques, Law Basics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on crime scene analysis.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "AIFSET", "CUET" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "National Forensic Sciences University (NFSU)", "Osmania University" }',
        '{ "CBI", "State Police Labs", "Private Detective Agencies", "Cyber Cells" }', '{ "Crime Scene Analysis", "Toxicology", "Lab Techniques", "Law Basics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Ethical Hacker, exploring an unconventional and highly specialized path in the Technology ecosystem.', 'Ethical Hacker is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Ethical Hacker, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Network Security, Penetration Testing, Cryptography, Linux to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on network security.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CEH Certification (Global)" }',
        'B.Tech CS / Cyber Security + CEH', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIIT Hyderabad", "IIT Kanpur", "BITS Pilani" }',
        '{ "PwC", "KPMG", "CBI Cyber Cell", "Tech Giants (Google, Meta)" }', '{ "Network Security", "Penetration Testing", "Cryptography", "Linux" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Game Designer, exploring an unconventional and highly specialized path in the Technology ecosystem.', 'Game Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Game Designer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy C++/C#, Unreal Engine / Unity, 3D Modeling, Mechatronics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on c++/c#.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT (for design)", "JEE Main (for dev)" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "NID", "IIT Bombay (IDC)", "IIIT Hyderabad" }',
        '{ "Rockstar Games", "Ubisoft", "Boston Dynamics", "DJI" }', '{ "C++/C#", "Unreal Engine / Unity", "3D Modeling", "Mechatronics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Cybersecurity Analyst, exploring an unconventional and highly specialized path in the Technology ecosystem.', 'Cybersecurity Analyst is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Cybersecurity Analyst, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Network Security, Penetration Testing, Cryptography, Linux to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on network security.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CEH Certification (Global)" }',
        'B.Tech CS / Cyber Security + CEH', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIIT Hyderabad", "IIT Kanpur", "BITS Pilani" }',
        '{ "PwC", "KPMG", "CBI Cyber Cell", "Tech Giants (Google, Meta)" }', '{ "Network Security", "Penetration Testing", "Cryptography", "Linux" }', 'Very Rare',
        'High', 'Low', '{}',
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
        'Break away from the crowd as a Digital Forensics Investigator, exploring an unconventional and highly specialized path in the Technology ecosystem.', 'Digital Forensics Investigator is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Digital Forensics Investigator, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Crime Scene Analysis, Toxicology, Lab Techniques, Law Basics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on crime scene analysis.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "AIFSET", "CUET" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "National Forensic Sciences University (NFSU)", "Osmania University" }',
        '{ "CBI", "State Police Labs", "Private Detective Agencies", "Cyber Cells" }', '{ "Crime Scene Analysis", "Toxicology", "Lab Techniques", "Law Basics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Space Technology Engineer, exploring an unconventional and highly specialized path in the Technology ecosystem.', 'Space Technology Engineer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Space Technology Engineer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Mathematics, Astrophysics, Programming, Data Analysis to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced mathematics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "JEE Advanced (for IIST)" }',
        'BS-MS Dual Degree / B.Tech Aerospace', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIST Thiruvananthapuram", "IISc Bangalore", "IISER Pune" }',
        '{ "ISRO", "NASA", "TIFR", "SpaceX", "Academic Institutions" }', '{ "Advanced Mathematics", "Astrophysics", "Programming", "Data Analysis" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Actuary, exploring an unconventional and highly specialized path in the Business & Finance ecosystem.', 'Actuary is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Actuary, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Statistics, Financial Modeling, Risk Assessment, Machine Learning to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced statistics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "ACET (Actuarial Common Entrance Test)" }',
        'B.Sc Mathematics / Statistics + IAI Fellowship', '3 yrs (B.Sc Math) + 15 Actuarial Exams', '{ "ISI Kolkata", "Delhi University", "Christ University" }',
        '{ "LIC", "Max Life", "Ernst & Young", "Milliman" }', '{ "Advanced Statistics", "Financial Modeling", "Risk Assessment", "Machine Learning" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Break away from the crowd as a Forensic Accountant, exploring an unconventional and highly specialized path in the Business & Finance ecosystem.', 'Forensic Accountant is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Forensic Accountant, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Crime Scene Analysis, Toxicology, Lab Techniques, Law Basics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on crime scene analysis.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "AIFSET", "CUET" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "National Forensic Sciences University (NFSU)", "Osmania University" }',
        '{ "CBI", "State Police Labs", "Private Detective Agencies", "Cyber Cells" }', '{ "Crime Scene Analysis", "Toxicology", "Lab Techniques", "Law Basics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Sound Designer', 'sound-designer', 'Media & Entertainment', 'Any Stream',
        'Break away from the crowd as a Sound Designer, exploring an unconventional and highly specialized path in the Media & Entertainment ecosystem.', 'Sound Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Sound Designer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Game Narrative Designer', 'game-narrative-designer', 'Media & Entertainment', 'Any Stream',
        'Break away from the crowd as a Game Narrative Designer, exploring an unconventional and highly specialized path in the Media & Entertainment ecosystem.', 'Game Narrative Designer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Game Narrative Designer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy C++/C#, Unreal Engine / Unity, 3D Modeling, Mechatronics to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on c++/c#.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "NID DAT (for design)", "JEE Main (for dev)" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "NID", "IIT Bombay (IDC)", "IIIT Hyderabad" }',
        '{ "Rockstar Games", "Ubisoft", "Boston Dynamics", "DJI" }', '{ "C++/C#", "Unreal Engine / Unity", "3D Modeling", "Mechatronics" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Wildlife Biologist', 'wildlife-biologist', 'Environment', 'Any Stream',
        'Break away from the crowd as a Wildlife Biologist, exploring an unconventional and highly specialized path in the Environment ecosystem.', 'Wildlife Biologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Wildlife Biologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Hydrogeologist', 'hydrogeologist', 'Environment', 'Any Stream',
        'Break away from the crowd as a Hydrogeologist, exploring an unconventional and highly specialized path in the Environment ecosystem.', 'Hydrogeologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Hydrogeologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Sommelier', 'sommelier', 'Hospitality & Food', 'Any Stream',
        'Break away from the crowd as a Sommelier, exploring an unconventional and highly specialized path in the Hospitality & Food ecosystem.', 'Sommelier is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Sommelier, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Olfactory Senses, Palate Memory, Chemistry, Quality Control to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on olfactory senses.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "Institute-specific tests" }',
        'Diploma in Tasting / Hospitality', '1-3 years Certification/Diploma', '{ "Tea Board of India Institutes", "Local Hospitality Schools" }',
        '{ "Tata Global Beverages", "Unilever", "Luxury Hotels (Taj, Oberoi)", "Wineries" }', '{ "Olfactory Senses", "Palate Memory", "Chemistry", "Quality Control" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Tea Sommelier', 'tea-sommelier', 'Hospitality & Food', 'Any Stream',
        'Break away from the crowd as a Tea Sommelier, exploring an unconventional and highly specialized path in the Hospitality & Food ecosystem.', 'Tea Sommelier is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Tea Sommelier, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Olfactory Senses, Palate Memory, Chemistry, Quality Control to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on olfactory senses.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "Institute-specific tests" }',
        'Diploma in Tasting / Hospitality', '1-3 years Certification/Diploma', '{ "Tea Board of India Institutes", "Local Hospitality Schools" }',
        '{ "Tata Global Beverages", "Unilever", "Luxury Hotels (Taj, Oberoi)", "Wineries" }', '{ "Olfactory Senses", "Palate Memory", "Chemistry", "Quality Control" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Perfumer', 'perfumer', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Perfumer, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Perfumer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Perfumer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Ethical AI Auditor', 'ethical-ai-auditor', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Ethical AI Auditor, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Ethical AI Auditor is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Ethical AI Auditor, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Network Security, Penetration Testing, Cryptography, Linux to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on network security.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CEH Certification (Global)" }',
        'B.Tech CS / Cyber Security + CEH', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIIT Hyderabad", "IIT Kanpur", "BITS Pilani" }',
        '{ "PwC", "KPMG", "CBI Cyber Cell", "Tech Giants (Google, Meta)" }', '{ "Network Security", "Penetration Testing", "Cryptography", "Linux" }', 'Very Rare',
        'High', 'Low', '{}',
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
        'Bioethicist', 'bioethicist', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Bioethicist, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Bioethicist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Bioethicist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Network Security, Penetration Testing, Cryptography, Linux to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on network security.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "JEE Main", "CEH Certification (Global)" }',
        'B.Tech CS / Cyber Security + CEH', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIIT Hyderabad", "IIT Kanpur", "BITS Pilani" }',
        '{ "PwC", "KPMG", "CBI Cyber Cell", "Tech Giants (Google, Meta)" }', '{ "Network Security", "Penetration Testing", "Cryptography", "Linux" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Cryptographer', 'cryptographer', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Cryptographer, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Cryptographer is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Cryptographer, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Archaeologist', 'archaeologist', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Archaeologist, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Archaeologist is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Archaeologist, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Analytical Thinking, Specialized Knowledge, Adaptability, Attention to Detail to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on analytical thinking.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "CUET", "University-specific Entrance" }',
        'Specialized Bachelor''s / Master''s', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IISc Bangalore", "JNU New Delhi", "Top Specialized Institutes", "Delhi University" }',
        '{ "Research Institutes", "Specialized Boutiques", "Startups", "Global Giants" }', '{ "Analytical Thinking", "Specialized Knowledge", "Adaptability", "Attention to Detail" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
        'Space Law Attorney', 'space-law-attorney', 'Unusual Careers', 'Any Stream',
        'Break away from the crowd as a Space Law Attorney, exploring an unconventional and highly specialized path in the Unusual Careers ecosystem.', 'Space Law Attorney is a comprehensive professional field that offers various opportunities for growth and specialization.', 'As a Space Law Attorney, your day looks completely different from a standard 9-to-5 desk job. You utilize highly specialized tools and deploy Advanced Mathematics, Astrophysics, Programming, Data Analysis to tackle unique challenges that very few people in the world are trained for. It''s a career driven by profound curiosity and expertise.',
        'Perfect for those who are immensely passionate about niche subjects, don''t mind taking the road less traveled, and thrive on advanced mathematics.', '1. Look beyond textbook curriculum; read specialized journals and watch documentaries.
2. Connect with the few experts in this field via LinkedIn or email.
3. Build a portfolio of niche projects or participate in hyper-focused hackathons/competitions.
4. Aim for the specific legacy institutes that cater to this rare field rather than general universities.', '₹5–12 LPA',
        '₹12–25 LPA', '₹25–80 LPA', '{ "IISER Aptitude Test", "NEST", "JEE Advanced (for IIST)" }',
        'BS-MS Dual Degree / B.Tech Aerospace', '3-5 years (B.Sc/B.A. + Master''s)', '{ "IIST Thiruvananthapuram", "IISc Bangalore", "IISER Pune" }',
        '{ "ISRO", "NASA", "TIFR", "SpaceX", "Academic Institutions" }', '{ "Advanced Mathematics", "Astrophysics", "Programming", "Data Analysis" }', 'Very Rare',
        'Moderate', 'Low', '{}',
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
