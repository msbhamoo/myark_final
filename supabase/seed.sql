-- ================================================================
-- MYARK SEED DATA
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ================================================================

-- ── Categories ─────────────────────────────────────────────
INSERT INTO categories (slug, label, icon_name, bg_color, text_color, sort_order) VALUES
('olympiad', 'Olympiad', '🏅', '#eaf3de', '#27500a', 1),
('scholarship', 'Scholarship', '🎓', '#e0eaf6', '#0c447c', 2),
('coding', 'Coding & AI', '💻', '#ede0f8', '#3c3489', 3),
('robotics', 'Robotics', '🤖', '#faece7', '#712b13', 4),
('exchange', 'Exchange Programs', '✈️', '#faeeda', '#633806', 5),
('writing', 'Writing & Essay', '✍️', '#fbeaf0', '#72243e', 6),
('quiz', 'Quiz & GK', '🧠', '#e1f5ee', '#085041', 7),
('innovation', 'Innovation', '💡', '#f1efe8', '#444441', 8),
('art', 'Art & Creative', '🎨', '#fdf3e0', '#7a4800', 9),
('sports', 'Sports', '⚽', '#e6f1fb', '#1a3c6e', 10);

-- ── Organisers ─────────────────────────────────────────────
INSERT INTO organisers (name, slug, website_url, description) VALUES
('Science Olympiad Foundation', 'sof', 'https://sofworld.org', 'India''s largest Olympiad organiser conducting NSO, IMO, IEO, and NCO for students from Class 1 to 12.'),
('CBSE', 'cbse', 'https://cbse.gov.in', 'Central Board of Secondary Education — conducts national-level academic programs and competitions.'),
('Ministry of Education, Government of India', 'moe-india', 'https://www.education.gov.in', 'The Government of India ministry responsible for education policy and national programs.'),
('Department of Science and Technology', 'dst', 'https://dst.gov.in', 'Government body promoting science research and innovation among students and researchers.'),
('Indian Institute of Science', 'iisc', 'https://iisc.ac.in', 'India''s premier research university in Bangalore.'),
('NCERT', 'ncert', 'https://ncert.nic.in', 'National Council of Educational Research and Training.'),
('Atal Innovation Mission', 'aim-niti', 'https://aim.gov.in', 'NITI Aayog initiative to promote innovation and entrepreneurship in schools.'),
('AFS Intercultural Programs', 'afs', 'https://afs.org', 'International exchange program organisation operating in over 60 countries.');

-- ── Opportunities ──────────────────────────────────────────

-- 1. SOF National Science Olympiad
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'SOF National Science Olympiad (NSO)',
  'sof-national-science-olympiad-2026',
  (SELECT id FROM categories WHERE slug = 'olympiad'),
  (SELECT id FROM organisers WHERE slug = 'sof'),
  'The SOF National Science Olympiad (NSO) is India''s most recognised school-level science competition. It tests students on their understanding of science concepts from their current class syllabus along with higher-order thinking. Over 50,000 schools participate annually with millions of students appearing for this prestigious exam.',
  ARRAY[1,2,3,4,5,6,7,8,9,10,11,12],
  'Students from Class 1 to Class 12 studying in any recognised school in India',
  'https://sofworld.org/register',
  '2026-06-01',
  '2026-09-15',
  FALSE,
  '₹125 per student (includes exam fee and study material)',
  'Gold, Silver, Bronze medals + cash prizes up to ₹50,000. School toppers receive trophies and certificates. International rank holders get scholarships.',
  'Step 1: Ask your school coordinator to register on the SOF website. Step 2: If your school is not registered, request your principal to contact SOF. Step 3: Individual students can also register through the SOF website if their school has not enrolled. Step 4: Prepare using the SOF study material and previous year papers. Step 5: Appear for Level 1 exam at your school. Top performers qualify for Level 2.',
  '[
    {"question": "What is the last date to apply for SOF National Science Olympiad (NSO) 2026?", "answer": "The last date to register for SOF NSO 2026 is 15 September 2026. Schools must complete registration before this date."},
    {"question": "Who is eligible for SOF National Science Olympiad (NSO)?", "answer": "All students from Class 1 to Class 12 studying in any recognised school in India are eligible to participate in SOF NSO 2026."},
    {"question": "Is there a registration fee for SOF NSO 2026?", "answer": "Yes, the registration fee for SOF NSO 2026 is ₹125 per student, which includes the exam fee and study material provided by SOF."},
    {"question": "How do I apply for SOF National Science Olympiad 2026?", "answer": "You can apply through your school. Ask your school coordinator to register on sofworld.org. Individual registrations are also accepted if your school has not enrolled."},
    {"question": "What is the prize for SOF NSO 2026?", "answer": "SOF NSO 2026 offers gold, silver, and bronze medals, cash prizes up to ₹50,000, trophies for school toppers, certificates for all participants, and scholarships for international rank holders."},
    {"question": "Is SOF NSO conducted online or offline?", "answer": "SOF NSO is conducted offline at the student''s own school. The exam is pen-and-paper based with OMR answer sheets."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);

-- 2. NTSE (National Talent Search Examination)
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'National Talent Search Examination (NTSE)',
  'ntse-2026',
  (SELECT id FROM categories WHERE slug = 'scholarship'),
  (SELECT id FROM organisers WHERE slug = 'ncert'),
  'The National Talent Search Examination (NTSE) is one of India''s most prestigious scholarship programs for school students. Conducted by NCERT, it identifies and nurtures talented students by providing them with financial assistance in the form of scholarships. NTSE scholars receive monthly scholarships throughout their academic career from Class 11 through PhD.',
  ARRAY[10],
  'Students studying in Class 10 in any recognised school in India',
  'https://ncert.nic.in/ntse.php',
  '2026-07-01',
  '2026-08-31',
  FALSE,
  'Free — no registration fee',
  '₹1,250/month for Class 11-12, ₹2,000/month for UG & PG, amount as per UGC norms for PhD. Approximately 2,000 scholarships awarded annually.',
  'Step 1: Check your state liaison officer for NTSE registration in your state. Step 2: Fill the application form available on the NCERT website or through your school. Step 3: Submit the form before the state-level deadline. Step 4: Clear the Stage 1 state-level exam. Step 5: Qualify for the Stage 2 national-level exam conducted by NCERT.',
  '[
    {"question": "What is the last date to apply for NTSE 2026?", "answer": "The last date to apply for NTSE 2026 is 31 August 2026. Note that some states have earlier deadlines, so check with your state liaison officer."},
    {"question": "Who is eligible for NTSE 2026?", "answer": "Students studying in Class 10 in any recognised school in India are eligible for NTSE 2026. There is no minimum marks requirement to apply."},
    {"question": "Is there a registration fee for NTSE?", "answer": "No, NTSE 2026 is completely free. There is no registration fee for appearing in the examination."},
    {"question": "How do I apply for NTSE 2026?", "answer": "Apply through the NCERT website or contact your state liaison officer. The application form must be submitted before the state-level deadline."},
    {"question": "What is the prize for NTSE 2026?", "answer": "NTSE 2026 offers monthly scholarships: ₹1,250/month for Class 11-12, ₹2,000/month for UG and PG, and as per UGC norms for PhD students. About 2,000 scholarships are awarded nationally."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);

-- 3. Aryabhatta Ganit Challenge
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'CBSE Aryabhatta Ganit Challenge',
  'cbse-aryabhatta-ganit-challenge-2026',
  (SELECT id FROM categories WHERE slug = 'olympiad'),
  (SELECT id FROM organisers WHERE slug = 'cbse'),
  'The CBSE Aryabhatta Ganit Challenge is a mathematics competition designed to promote mathematical thinking and problem-solving abilities among school students. It encourages students to go beyond textbook learning and apply mathematical concepts to real-world scenarios.',
  ARRAY[8, 9, 10],
  'Students of Class 8, 9, and 10 from CBSE-affiliated schools',
  'https://cbse.gov.in',
  '2026-08-01',
  '2026-10-15',
  FALSE,
  'Free — no registration fee',
  'Certificates of Merit, trophies for school and regional toppers, recognition at CBSE national ceremony',
  'Step 1: Your school must be affiliated with CBSE. Step 2: Schools register students through the CBSE portal. Step 3: The exam is conducted at the school level. Step 4: Top performers are selected for regional and national rounds.',
  '[
    {"question": "What is the last date to apply for Aryabhatta Ganit Challenge 2026?", "answer": "The last date to register for the CBSE Aryabhatta Ganit Challenge 2026 is 15 October 2026. Schools must register students through the CBSE portal."},
    {"question": "Who is eligible for the Aryabhatta Ganit Challenge?", "answer": "Students of Class 8, 9, and 10 studying in CBSE-affiliated schools across India are eligible."},
    {"question": "Is there a registration fee for Aryabhatta Ganit Challenge?", "answer": "No, the CBSE Aryabhatta Ganit Challenge is completely free for students of CBSE-affiliated schools."},
    {"question": "How do I apply for Aryabhatta Ganit Challenge 2026?", "answer": "Your school registers you through the CBSE portal. Speak to your mathematics teacher or principal about participation."},
    {"question": "What is the prize for Aryabhatta Ganit Challenge?", "answer": "Winners receive Certificates of Merit, trophies for school and regional toppers, and recognition at the CBSE national ceremony."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 4. INSPIRE Awards — MANAK
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'INSPIRE Awards — MANAK (Million Minds Augmenting National Aspirations and Knowledge)',
  'inspire-awards-manak-2026',
  (SELECT id FROM categories WHERE slug = 'innovation'),
  (SELECT id FROM organisers WHERE slug = 'dst'),
  'INSPIRE Awards — MANAK is a flagship programme of the Department of Science and Technology, Government of India. It aims to motivate students in the age group of 10-15 years to pursue science by spotting, recognising, and rewarding innovative ideas. Each year, 1 million ideas are invited from students across India.',
  ARRAY[6, 7, 8, 9, 10],
  'Students of Class 6 to 10 from any recognised school in India',
  'https://www.inspireawards-dst.gov.in',
  '2026-07-15',
  '2026-10-31',
  FALSE,
  'Free — no registration fee',
  '₹10,000 award for each selected idea (up to 1,00,000 selections nationally). Top ideas exhibited at national-level INSPIRE exhibition. Winners may get further research funding.',
  'Step 1: Think of an original idea or innovation that solves a real-world problem. Step 2: Register on the INSPIRE Awards portal (inspireawards-dst.gov.in). Step 3: Submit your idea with a description and photographs/diagrams. Step 4: Ideas are shortlisted at the district and state level. Step 5: Selected ideas are exhibited at national exhibitions.',
  '[
    {"question": "What is the last date to apply for INSPIRE Awards MANAK 2026?", "answer": "The last date to submit nominations for INSPIRE Awards MANAK 2026 is 31 October 2026."},
    {"question": "Who is eligible for INSPIRE Awards MANAK?", "answer": "Students of Class 6 to 10 from any recognised school in India, in the age group of 10-15 years, are eligible for INSPIRE Awards MANAK."},
    {"question": "Is there a registration fee for INSPIRE Awards?", "answer": "No, INSPIRE Awards MANAK is completely free. It is funded by the Department of Science and Technology, Government of India."},
    {"question": "How do I apply for INSPIRE Awards MANAK 2026?", "answer": "Register on the official INSPIRE Awards portal at inspireawards-dst.gov.in and submit your original science/innovation idea with supporting documentation."},
    {"question": "What is the prize for INSPIRE Awards MANAK?", "answer": "Each selected idea receives ₹10,000. Up to 1,00,000 ideas are selected nationally. Top ideas are exhibited at national-level exhibitions and may receive further research funding."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);

-- 5. KVPY (Kishore Vaigyanik Protsahan Yojana)
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'Kishore Vaigyanik Protsahan Yojana (KVPY)',
  'kvpy-2026',
  (SELECT id FROM categories WHERE slug = 'scholarship'),
  (SELECT id FROM organisers WHERE slug = 'iisc'),
  'KVPY is a national fellowship programme funded by the Department of Science and Technology, Government of India. It is administered by IISc Bangalore. The programme aims to attract exceptionally motivated students to pursue basic science courses and research careers. It offers generous monthly fellowships and annual contingency grants.',
  ARRAY[11, 12],
  'Students in Class 11 (SA stream) or Class 12 / 1st year UG in Basic Sciences (SX stream)',
  'https://kvpy.iisc.ac.in',
  '2026-07-01',
  '2026-09-30',
  FALSE,
  '₹100 (General), Free for SC/ST/PwD',
  'Monthly fellowship of ₹5,000 during Class 11-12 and ₹7,000 during UG/PG + annual contingency grant of ₹20,000-₹28,000',
  'Step 1: Visit the KVPY website (kvpy.iisc.ac.in). Step 2: Register and fill the online application form. Step 3: Upload required documents and photograph. Step 4: Pay the application fee online. Step 5: Appear for the KVPY aptitude test. Step 6: Shortlisted candidates are called for an interview.',
  '[
    {"question": "What is the last date to apply for KVPY 2026?", "answer": "The last date to apply for KVPY 2026 is 30 September 2026."},
    {"question": "Who is eligible for KVPY 2026?", "answer": "For SA stream: students in Class 11 with 75% marks (65% for SC/ST/PwD) in Mathematics and Science in Class 10. For SX stream: students in Class 12 or 1st year UG in Basic Sciences."},
    {"question": "Is there a registration fee for KVPY?", "answer": "Yes, the application fee for KVPY 2026 is ₹100 for General/OBC candidates. SC/ST/PwD candidates are exempt from the fee."},
    {"question": "How do I apply for KVPY 2026?", "answer": "Apply online at kvpy.iisc.ac.in. Fill the form, upload documents, pay the fee, and download your admit card when available."},
    {"question": "What is the prize for KVPY?", "answer": "KVPY fellows receive a monthly fellowship of ₹5,000 during Class 11-12 and ₹7,000 during UG/PG, plus an annual contingency grant of ₹20,000-₹28,000."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);

-- 6. ATL Tinkering Lab Marathon
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'ATL Marathon — Atal Tinkering Labs Innovation Challenge',
  'atl-marathon-2026',
  (SELECT id FROM categories WHERE slug = 'innovation'),
  (SELECT id FROM organisers WHERE slug = 'aim-niti'),
  'The ATL Marathon is a nationwide innovation challenge for school students by Atal Innovation Mission (AIM), NITI Aayog. Students working in Atal Tinkering Labs showcase innovative solutions to real-world problems. The challenge covers themes like clean energy, waste management, healthcare, smart mobility, and more.',
  ARRAY[6, 7, 8, 9, 10, 11, 12],
  'Students from Class 6 to 12 in schools with ATL labs or partner schools',
  'https://aim.gov.in/atl-marathon.php',
  '2026-08-01',
  '2026-11-30',
  FALSE,
  'Free — no registration fee',
  'Top teams receive ₹20,000 grant, mentorship from industry experts, and chance to present at national innovation festivals',
  'Step 1: Form a team of 2-5 students from your school. Step 2: Choose a problem theme from the ATL Marathon categories. Step 3: Build a working prototype using your school ATL lab. Step 4: Register and submit your project on the ATL Marathon portal. Step 5: Selected teams present at regional and then national levels.',
  '[
    {"question": "What is the last date to apply for ATL Marathon 2026?", "answer": "The last date to submit projects for ATL Marathon 2026 is 30 November 2026."},
    {"question": "Who is eligible for ATL Marathon?", "answer": "Students from Class 6 to 12 in schools with Atal Tinkering Labs, or partner schools, can participate in teams of 2-5 members."},
    {"question": "Is there a registration fee for ATL Marathon?", "answer": "No, ATL Marathon is completely free. It is funded by NITI Aayog under the Atal Innovation Mission."},
    {"question": "How do I apply for ATL Marathon 2026?", "answer": "Form a team, build a prototype in your school ATL lab, and register on the ATL Marathon portal at aim.gov.in."},
    {"question": "What is the prize for ATL Marathon?", "answer": "Top teams receive ₹20,000 grants, mentorship from industry experts, and the opportunity to present at national innovation festivals."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 7. SOF International Mathematics Olympiad
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'SOF International Mathematics Olympiad (IMO)',
  'sof-international-mathematics-olympiad-2026',
  (SELECT id FROM categories WHERE slug = 'olympiad'),
  (SELECT id FROM organisers WHERE slug = 'sof'),
  'The SOF International Mathematics Olympiad (IMO) is a prestigious mathematics competition conducted by the Science Olympiad Foundation. It tests mathematical reasoning, logical thinking, and problem-solving abilities. The exam is conducted in two levels — Level 1 at the school and Level 2 for top performers.',
  ARRAY[1,2,3,4,5,6,7,8,9,10,11,12],
  'Students from Class 1 to Class 12 in any recognised school in India',
  'https://sofworld.org/imo',
  '2026-06-01',
  '2026-09-15',
  FALSE,
  '₹125 per student',
  'Gold, Silver, Bronze medals + cash prizes. Top performers receive scholarships and international recognition.',
  'Step 1: Ask your school to register with SOF. Step 2: Register for IMO through your school coordinator. Step 3: Prepare using SOF workbooks and previous papers. Step 4: Appear for Level 1 exam at your school. Step 5: Top performers are invited for Level 2.',
  '[
    {"question": "What is the last date to apply for SOF IMO 2026?", "answer": "The last date to register for SOF IMO 2026 is 15 September 2026."},
    {"question": "Who is eligible for SOF IMO?", "answer": "All students from Class 1 to Class 12 in any recognised school in India can participate in SOF IMO 2026."},
    {"question": "Is there a registration fee for SOF IMO?", "answer": "Yes, the registration fee is ₹125 per student, which includes exam fee and study material."},
    {"question": "How do I apply for SOF IMO 2026?", "answer": "Register through your school coordinator on the SOF website at sofworld.org."},
    {"question": "What is the prize for SOF IMO?", "answer": "Winners receive gold, silver, and bronze medals, cash prizes, scholarships, and trophies for school toppers."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 8. AFS Exchange Program
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'AFS Intercultural Exchange Program for Indian Students',
  'afs-intercultural-exchange-program-2026',
  (SELECT id FROM categories WHERE slug = 'exchange'),
  (SELECT id FROM organisers WHERE slug = 'afs'),
  'AFS India offers year-long and semester-long intercultural exchange programs for Indian high school students. Selected students live with host families in countries across Europe, Asia, and the Americas, attend local schools, and gain invaluable cross-cultural experience. AFS also offers merit-based scholarships for deserving students.',
  ARRAY[9, 10, 11],
  'Students aged 15-17.5 years, currently in Class 9, 10, or 11',
  'https://afs.org/india',
  '2026-05-01',
  '2026-08-15',
  FALSE,
  'Programme fee varies by country (scholarships available). Application is free.',
  'Full and partial scholarships available. Students get to live abroad for a semester or full year, attend local schools, and earn a global certificate.',
  'Step 1: Visit afs.org/india and explore available programs. Step 2: Fill the online application form. Step 3: Attend a local interview and selection camp. Step 4: If selected, complete pre-departure orientation. Step 5: Depart for your host country.',
  '[
    {"question": "What is the last date to apply for AFS Exchange Program 2026?", "answer": "The last date to apply for the AFS Intercultural Exchange Program 2026 is 15 August 2026."},
    {"question": "Who is eligible for AFS Exchange Program?", "answer": "Indian students aged 15-17.5 years, currently studying in Class 9, 10, or 11, with a good academic record are eligible."},
    {"question": "Is there a registration fee for AFS?", "answer": "The application itself is free. Programme fees vary by country, but AFS offers need-based and merit-based scholarships to Indian students."},
    {"question": "How do I apply for AFS Exchange Program 2026?", "answer": "Apply online at afs.org/india. After submitting the application, attend a local interview and selection camp."},
    {"question": "What is the prize for AFS Exchange Program?", "answer": "Selected students get to live with a host family abroad for a semester or full year, attend local schools, and earn a global AFS certificate. Full and partial scholarships are available."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);

-- 9. CBSE Expression Series (Writing)
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'CBSE Expression Series — Creative Writing Competition',
  'cbse-expression-series-2026',
  (SELECT id FROM categories WHERE slug = 'writing'),
  (SELECT id FROM organisers WHERE slug = 'cbse'),
  'The CBSE Expression Series is a platform for students to express their thoughts and creativity through essays, poems, and artwork on contemporary themes. It is conducted in multiple rounds throughout the academic year. The themes cover social issues, environmental concerns, national events, and more. Entries are evaluated for creativity, originality, and expression.',
  ARRAY[3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  'Students from Class 3 to Class 12 in CBSE-affiliated schools',
  'https://cbse.gov.in/expression-series',
  '2026-04-01',
  '2026-04-30',
  FALSE,
  'Free — no registration fee',
  'Certificates, e-publication of selected entries on CBSE website, recognition at national level',
  'Step 1: Check the current theme on the CBSE website. Step 2: Write your essay, poem, or create artwork on the given theme. Step 3: Submit your entry through your school or directly on the CBSE portal. Step 4: Selected entries are published on the CBSE website.',
  '[
    {"question": "What is the last date to apply for CBSE Expression Series 2026?", "answer": "The current edition deadline is 30 April 2026. CBSE releases new themes periodically throughout the year."},
    {"question": "Who is eligible for CBSE Expression Series?", "answer": "Students from Class 3 to 12 in CBSE-affiliated schools can participate in the Expression Series."},
    {"question": "Is there a registration fee for Expression Series?", "answer": "No, the CBSE Expression Series is completely free for all CBSE-affiliated school students."},
    {"question": "How do I apply for CBSE Expression Series 2026?", "answer": "Submit your essay, poem, or artwork on the given theme through your school or the CBSE portal."},
    {"question": "What is the prize for CBSE Expression Series?", "answer": "Selected entries are published on the CBSE website. Students receive certificates and national recognition."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 10. National Cyber Olympiad
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'SOF National Cyber Olympiad (NCO)',
  'sof-national-cyber-olympiad-2026',
  (SELECT id FROM categories WHERE slug = 'coding'),
  (SELECT id FROM organisers WHERE slug = 'sof'),
  'The SOF National Cyber Olympiad tests students on computer science, information technology, logical reasoning, and cyber awareness. It is one of the most popular IT olympiads in India with participation from thousands of schools across the country.',
  ARRAY[1,2,3,4,5,6,7,8,9,10,11,12],
  'Students from Class 1 to Class 12 in any recognised school in India',
  'https://sofworld.org/nco',
  '2026-06-01',
  '2026-09-15',
  FALSE,
  '₹125 per student',
  'Gold, Silver, Bronze medals + cash prizes up to ₹50,000 and scholarships',
  'Step 1: Register through your school coordinator on the SOF website. Step 2: Prepare using SOF cyber olympiad workbooks. Step 3: Appear for Level 1 at your school. Step 4: Top performers qualify for Level 2.',
  '[
    {"question": "What is the last date to apply for SOF NCO 2026?", "answer": "The registration deadline for SOF National Cyber Olympiad 2026 is 15 September 2026."},
    {"question": "Who is eligible for SOF NCO?", "answer": "Students from Class 1 to 12 in any recognised school in India can participate."},
    {"question": "Is there a registration fee for SOF NCO?", "answer": "Yes, the fee is ₹125 per student including exam fee and study material."},
    {"question": "How do I apply for SOF NCO 2026?", "answer": "Register through your school coordinator on sofworld.org."},
    {"question": "What is the prize for SOF NCO?", "answer": "Medals, cash prizes up to ₹50,000, scholarships, and certificates for all participants."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 11. Quiz competition (ongoing)
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'CBSE Heritage India Quiz',
  'cbse-heritage-india-quiz-2026',
  (SELECT id FROM categories WHERE slug = 'quiz'),
  (SELECT id FROM organisers WHERE slug = 'cbse'),
  'The CBSE Heritage India Quiz tests students'' knowledge of Indian heritage, culture, art, literature, and history. It promotes awareness and pride in India''s rich cultural diversity. The quiz is conducted at school, regional, and national levels.',
  ARRAY[9, 10, 11, 12],
  'Students of Class 9 to 12 from CBSE-affiliated schools',
  'https://cbse.gov.in/heritage-quiz',
  NULL,
  NULL,
  TRUE,
  'Free — no registration fee',
  'Trophies, certificates, and national recognition for school and individual winners',
  'Step 1: Form a team of 2 students from your school. Step 2: Your school registers the team on the CBSE portal. Step 3: Participate in school-level, then zonal, and finally national-level rounds.',
  '[
    {"question": "What is the last date to apply for CBSE Heritage India Quiz 2026?", "answer": "The CBSE Heritage India Quiz has rolling registration throughout the academic year. Check the CBSE website for current dates."},
    {"question": "Who is eligible for CBSE Heritage India Quiz?", "answer": "Students of Class 9 to 12 from CBSE-affiliated schools can participate in teams of 2."},
    {"question": "Is there a registration fee for CBSE Heritage Quiz?", "answer": "No, the quiz is completely free for students of CBSE-affiliated schools."},
    {"question": "How do I apply for CBSE Heritage India Quiz 2026?", "answer": "Form a team of 2 from your school and ask your school to register on the CBSE portal."},
    {"question": "What is the prize for CBSE Heritage India Quiz?", "answer": "Winners receive trophies, certificates, and national recognition at the CBSE annual ceremony."}
  ]'::jsonb,
  FALSE, TRUE, TRUE
);

-- 12. Sports opportunity (approaching deadline — for testing urgency)
INSERT INTO opportunities (
  title, slug, category_id, organiser_id, description, eligibility_classes,
  eligibility_text, registration_url, registration_opens, deadline, is_ongoing,
  fee_text, prize_text, how_to_apply, faqs, is_featured, is_verified, is_published
) VALUES (
  'CBSE National Athletics Meet',
  'cbse-national-athletics-meet-2026',
  (SELECT id FROM categories WHERE slug = 'sports'),
  (SELECT id FROM organisers WHERE slug = 'cbse'),
  'The CBSE National Athletics Meet is the premier inter-school athletics competition for CBSE schools across India. Events include track and field, cross-country, and relay races. The meet promotes physical fitness and sportsmanship among school students.',
  ARRAY[9, 10, 11, 12],
  'Students of Class 9 to 12 from CBSE-affiliated schools',
  'https://cbse.gov.in/athletics',
  '2026-02-01',
  '2026-03-28',
  FALSE,
  'Free — schools bear participation costs',
  'Gold, Silver, Bronze medals and certificates. Winners represent their region at the national finals.',
  'Step 1: Participate in your school-level athletics selection. Step 2: Selected students compete at cluster-level meets. Step 3: Cluster winners advance to regional and finally national meets.',
  '[
    {"question": "What is the last date to apply for CBSE Athletics Meet 2026?", "answer": "The registration deadline for CBSE National Athletics Meet 2026 is 28 March 2026."},
    {"question": "Who is eligible for CBSE Athletics Meet?", "answer": "Students of Class 9 to 12 from CBSE-affiliated schools can participate through their school selection."},
    {"question": "Is there a registration fee for CBSE Athletics Meet?", "answer": "No registration fee for students. Schools bear the participation and travel costs."},
    {"question": "How do I apply for CBSE Athletics Meet 2026?", "answer": "Participate in your school-level athletics selection. Schools then register qualified students for cluster-level meets."},
    {"question": "What is the prize for CBSE Athletics Meet?", "answer": "Winners receive Gold, Silver, and Bronze medals with certificates, and advance to represent their region nationally."}
  ]'::jsonb,
  TRUE, TRUE, TRUE
);
