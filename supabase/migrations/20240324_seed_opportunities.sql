-- Migration to seed confirmed opportunities and organisers for 2025-2026
-- This assumes categories 'scholarships' and 'olympiads' already exist.

DO $$
DECLARE
    scholarship_id UUID;
    olympiad_id UUID;
    hdfc_id UUID := gen_random_uuid();
    sbi_id UUID := gen_random_uuid();
    mta_id UUID := gen_random_uuid();
    ito_id UUID := gen_random_uuid();
    sof_id UUID := gen_random_uuid();
BEGIN
    -- Get Category IDs
    SELECT id INTO scholarship_id FROM categories WHERE slug = 'scholarships' LIMIT 1;
    SELECT id INTO olympiad_id FROM categories WHERE slug = 'olympiads' LIMIT 1;

    -- 1. Insert Organisers
    INSERT INTO organisers (id, name, slug, website_url, logo_url, description)
    VALUES 
        (hdfc_id, 'HDFC Bank', 'hdfc-bank', 'https://www.hdfcbank.com', 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/56230f2c-e5a9-4b68-8097-393c5d8a666e', 'HDFC Bank Parivartan is committed to empowering students through its educational support programmes.'),
        (sbi_id, 'SBI Foundation', 'sbi-foundation', 'https://sbifoundation.in', 'https://sbifoundation.in/images/logo.png', 'The CSR arm of the State Bank of India, focusing on primary education and social development.'),
        (mta_id, 'MTA India', 'mta-india', 'https://www.mtai.org.in/', NULL, 'Mathematics Teachers'' Association of India is the national body for promoting mathematics education.'),
        (ito_id, 'Indian Talent Olympiad', 'indian-talent', 'https://www.indiantalent.org', 'https://www.indiantalent.org/img/logo.png', 'One of the leading Olympiad exam providers in India for school students from Class 1 to 10.'),
        (sof_id, 'Science Olympiad Foundation', 'sof', 'https://sofworld.org', 'https://sofworld.org/sites/default/files/sof_logo_0.png', 'SOF organizes India''s most prestigious science, math, and English Olympiads.')
    ON CONFLICT (slug) DO NOTHING;

    -- Re-fetch IDs if they already existed (to avoid foreign key errors in subsequent inserts)
    SELECT id INTO hdfc_id FROM organisers WHERE slug = 'hdfc-bank';
    SELECT id INTO sbi_id FROM organisers WHERE slug = 'sbi-foundation';
    SELECT id INTO mta_id FROM organisers WHERE slug = 'mta-india';
    SELECT id INTO ito_id FROM organisers WHERE slug = 'indian-talent';
    SELECT id INTO sof_id FROM organisers WHERE slug = 'sof';

    -- 2. Insert Opportunities
    
    -- HDFC Parivartan ECSS
    INSERT INTO opportunities (
        title, slug, category_id, organiser_id, description, 
        eligibility_classes, eligibility_text, registration_url, 
        deadline, registration_opens, is_ongoing, fee_text, prize_text, 
        how_to_apply, faqs, is_featured, is_verified, is_published
    ) VALUES (
        'HDFC Bank Parivartan ECSS 2025-26', 
        'hdfc-parivartan-ecss-2025', 
        scholarship_id, hdfc_id, 
        'Financial assistance for students from Class 1 to 12 who are facing a personal or financial crisis and have a high chance of dropping out.',
        ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 
        'Indian students from Class 1 to 12 with annual family income less than INR 2.5 Lakh.',
        'https://www.buddy4study.com/page/hdfc-bank-parivartan-ecss-scholarship',
        '2025-12-31', '2025-06-01', false, 'Free', 'Up to INR 35,000 per year',
        'Apply online through Buddy4Study with required documents (income proof, academic record, bank details).',
        '[{"question": "Who can apply?", "answer": "Students from Class 1 to 12 facing financial crisis."}]'::jsonb,
        true, true, true
    ) ON CONFLICT (slug) DO NOTHING;

    -- SBI Asha Scholarship
    INSERT INTO opportunities (
        title, slug, category_id, organiser_id, description, 
        eligibility_classes, eligibility_text, registration_url, 
        deadline, registration_opens, is_ongoing, fee_text, prize_text, 
        how_to_apply, faqs, is_featured, is_verified, is_published
    ) VALUES (
        'SBI Foundation Asha Scholarship 2025', 
        'sbi-asha-scholarship-2025', 
        scholarship_id, sbi_id, 
        'One of India''s largest scholarships for students from low-income families to help them pursue their education from Class 6 to 12.',
        ARRAY[6,7,8,9,10,11,12], 
        'Indian students in Classes 6-12 with 75% or above in previous class and family income under 3 LPA.',
        'https://www.buddy4study.com/page/sbi-asha-scholarship-program',
        '2025-11-30', '2025-07-01', false, 'Free', 'INR 15,000 to INR 20,000',
        'Apply online with marksheets, identity proof, and income certificate.',
        '[{"question": "What is the award amount?", "answer": "INR 15,000 to 20,000 depending on the class level."}]'::jsonb,
        true, true, true
    ) ON CONFLICT (slug) DO NOTHING;

    -- IOQM 2025-26
    INSERT INTO opportunities (
        title, slug, category_id, organiser_id, description, 
        eligibility_classes, eligibility_text, registration_url, 
        deadline, registration_opens, is_ongoing, fee_text, prize_text, 
        how_to_apply, faqs, is_featured, is_verified, is_published
    ) VALUES (
        'IOQM (Indian Olympiad Qualifier in Mathematics) 2025-26', 
        'ioqm-2025-26', 
        olympiad_id, mta_id, 
        'The first step towards representing India in the International Mathematical Olympiad (IMO).',
        ARRAY[8,9,10,11,12], 
        'Students in Class 8, 9, 10, 11, or 12 born after August 1, 2005.',
        'https://www.mtai.org.in/',
        '2025-07-25', '2025-06-30', false, 'INR 250 - 300', 'Certificates & Pathway to IMO',
        'Register through a recognized test center or online through the official MTA website.',
        '[{"question": "When is the exam?", "answer": "Usually conducted in September."}]'::jsonb,
        true, true, true
    ) ON CONFLICT (slug) DO NOTHING;

    -- Indian Talent Olympiad
    INSERT INTO opportunities (
        title, slug, category_id, organiser_id, description, 
        eligibility_classes, eligibility_text, registration_url, 
        deadline, registration_opens, is_ongoing, fee_text, prize_text, 
        how_to_apply, faqs, is_featured, is_verified, is_published
    ) VALUES (
        'Indian Talent Olympiad (Round 1) 2025-26', 
        'indian-talent-olympiad-2025', 
        olympiad_id, ito_id, 
        'National level exams for Math, Science, English, GK, and Drawing to identify and nurture young talent.',
        ARRAY[1,2,3,4,5,6,7,8,9,10], 
        'All students from Class 1 to Class 10.',
        'https://www.indiantalent.org/olympiad-exam-registration-student',
        '2025-10-25', '2025-05-01', false, 'INR 150 - 200 per subject', 'Laptops, Tablets & Scholarships',
        'Register online individually or through your school.',
        '[{"question": "How many rounds are there?", "answer": "There are generally two rounds for top performers."}]'::jsonb,
        false, true, true
    ) ON CONFLICT (slug) DO NOTHING;

    -- SOF National Science Olympiad
    INSERT INTO opportunities (
        title, slug, category_id, organiser_id, description, 
        eligibility_classes, eligibility_text, registration_url, 
        deadline, registration_opens, is_ongoing, fee_text, prize_text, 
        how_to_apply, faqs, is_featured, is_verified, is_published
    ) VALUES (
        'SOF National Science Olympiad (NSO) 2025', 
        'sof-nso-2025', 
        olympiad_id, sof_id, 
        'India''s most popular science Olympiad aimed at cultivating scientific temperament and competitive spirit.',
        ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 
        'All students from Class 1 to Class 12.',
        'https://sofworld.org/nso',
        '2025-09-30', '2025-04-01', false, 'INR 125 - 150', 'Cash Prizes, Medals & merit certificates',
        'Registration is primarily through schools. Independent registration may vary by region.',
        '[{"question": "Is it online?", "answer": "Exams are typically conducted offline in schools."}]'::jsonb,
        true, true, true
    ) ON CONFLICT (slug) DO NOTHING;

END $$;
