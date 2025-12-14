// Career data types and constants
export interface CareerRoadmapStep {
    title: string;
    subtitle?: string;
    description: string;
}

export interface SalaryRange {
    entry: string;
    mid: string;
    senior: string;
}

export interface Career {
    slug: string;
    title: string;
    category: string;
    categoryColor: string;
    shortDescription: string;
    fullDescription: string;
    keywords: string[];
    roadmap: CareerRoadmapStep[];
    salary: SalaryRange;
    salaryNote?: string;
    exams: string[];
    collegesIndia: string[];
    collegesGlobal: string[];
    degrees: string[];
    relatedCareers: string[];
    didYouKnow: string[];
    goodStuff: string[];
    challenges: string[];
}

export const CAREER_CATEGORIES = [
    { id: 'science', name: 'Science & Research', color: 'bg-blue-100 text-blue-700' },
    { id: 'engineering', name: 'Engineering', color: 'bg-orange-100 text-orange-700' },
    { id: 'technology', name: 'Technology & IT', color: 'bg-purple-100 text-purple-700' },
    { id: 'medicine', name: 'Medicine & Healthcare', color: 'bg-green-100 text-green-700' },
    { id: 'business', name: 'Business & Finance', color: 'bg-amber-100 text-amber-700' },
    { id: 'creative', name: 'Creative & Design', color: 'bg-pink-100 text-pink-700' },
    { id: 'law', name: 'Law & Policy', color: 'bg-slate-100 text-slate-700' },
    { id: 'arts', name: 'Arts & Entertainment', color: 'bg-rose-100 text-rose-700' },
    { id: 'sports', name: 'Sports & Fitness', color: 'bg-cyan-100 text-cyan-700' },
    { id: 'education', name: 'Education', color: 'bg-teal-100 text-teal-700' },
];

export const CAREERS: Career[] = [
    {
        slug: 'astrophysicist',
        title: 'Astrophysicist',
        category: 'Science & Research',
        categoryColor: 'bg-blue-100 text-blue-700',
        shortDescription: "You'd study how stars, planets, galaxies, and the entire universe work, trying to understand cosmic mysteries and origins.",
        fullDescription: "Imagine helping humanity understand where we come from and what lies beyond! An Astrophysicist studies the physics of celestial objects - stars, planets, galaxies, black holes, and the very fabric of space-time. You'd use telescopes, satellites, and complex mathematics to unlock the secrets of the cosmos.",
        keywords: ['space', 'stars', 'universe', 'physics', 'astronomy', 'cosmos', 'planets', 'galaxies', 'nasa', 'isro', 'research', 'science'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Excel in Science & Math', description: 'Choose Physics, Chemistry, and Mathematics (PCM) in Class 11 & 12. Focus on building strong fundamentals. Participate in astronomy clubs and science olympiads.' },
            { title: 'Competitive Exams (Class 11-12)', subtitle: 'Prepare for Entrance Exams', description: 'Prepare for JEE Main & Advanced for IITs, or other entrance exams for top science institutes like IISER, NISER, IISc.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'Pursue an Engineering Degree', description: 'Enroll in a B.Sc. in Physics or B.Tech in Engineering Physics. Focus on theoretical physics, mathematics, and computational skills.' },
            { title: 'Postgraduate Studies (Optional, 2 years)', subtitle: 'Specialize in Astrophysics', description: 'Pursue M.Sc. in Physics/Astrophysics from institutes like IISc, IITs, or IUCAA. This opens doors to research roles.' },
            { title: 'First Job & Career Growth', subtitle: 'Gain Industry Experience', description: 'Apply for positions at ISRO, IUCAA, TIFR, or international organizations like NASA, ESA. Start with junior research positions and work your way up.' }
        ],
        salary: { entry: '6-10 LPA', mid: '15-30 LPA', senior: '40+ LPA' },
        salaryNote: 'Salaries can vary greatly based on the organization, your specific achievements, and your location. Work abroad (US, Europe) tends to offer higher compensation.',
        exams: ['JEE Main & Advanced (for IITs)', 'GATE (for M.Tech admissions)'],
        collegesIndia: ['IIT Bombay', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur', 'IISER Pune', 'IISc Bangalore', 'TIFR Mumbai'],
        collegesGlobal: ['MIT, USA', 'Caltech, USA', 'Stanford University, USA', 'Cambridge University, UK', 'ETH Zurich, Switzerland'],
        degrees: ['B.Sc. in Physics', 'B.Tech in Engineering Physics', 'M.Sc. in Astrophysics', 'Ph.D. in Astrophysics'],
        relatedCareers: ['planetary-scientist', 'aerospace-engineer', 'data-scientist'],
        didYouKnow: ['Space Mission Scientist', 'Astrobiologist', 'Cosmologist', 'Satellite Data Analyst'],
        goodStuff: ['Contributing to discoveries that shape human understanding', 'Working on cutting-edge technology and space missions', 'Global collaborations with space agencies'],
        challenges: ['Very high academic requirements', 'Limited positions in pure research', 'Long working hours during observations', 'Mistakes can be extremely costly (failed missions)']
    },
    {
        slug: 'aerospace-engineer',
        title: 'Aerospace Engineer',
        category: 'Engineering',
        categoryColor: 'bg-orange-100 text-orange-700',
        shortDescription: "You'd design, build, and test aircraft, spacecraft, rockets, and satellites, bringing space missions to life from the drawing board to launch.",
        fullDescription: "Aerospace Engineers are the masterminds behind flying machines - from commercial airplanes to Mars rovers! You'd work on aerodynamics, propulsion systems, structural design, and control systems. It's a career where your work literally touches the sky and beyond.",
        keywords: ['aerospace', 'aircraft', 'rockets', 'satellites', 'space', 'aviation', 'isro', 'nasa', 'drdo', 'planes', 'engineering'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Excel in Science & Math', description: 'Choose PCM stream. Focus on Physics and Mathematics. Build projects related to aerodynamics or model rockets.' },
            { title: 'Competitive Exams (Class 11-12)', subtitle: 'Prepare for JEE', description: 'Clear JEE Main & Advanced for IITs, or other exams for NITs and top engineering colleges.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'B.Tech in Aerospace Engineering', description: 'Pursue B.Tech/B.E. in Aerospace or Aeronautical Engineering. Participate in projects, internships at aerospace organizations.' },
            { title: 'Postgraduate Studies (Optional, 2 years)', subtitle: 'Specialize Further', description: 'M.Tech in specialized areas like Propulsion, Avionics, or Space Technology. Opens doors to R&D roles.' },
            { title: 'First Job & Career Growth', subtitle: 'Industry Experience', description: 'Join ISRO, DRDO, HAL, or private companies like Tata Boeing, GE Aviation. International opportunities at Boeing, Airbus, SpaceX.' }
        ],
        salary: { entry: '8-12 LPA', mid: '18-35 LPA', senior: '50+ LPA' },
        exams: ['JEE Main & Advanced', 'GATE (for M.Tech & PSU jobs)'],
        collegesIndia: ['IIT Bombay', 'IIT Madras', 'IIT Kharagpur', 'IISc Bangalore', 'Anna University'],
        collegesGlobal: ['MIT, USA', 'Stanford University, USA', 'Georgia Tech, USA', 'Imperial College London, UK'],
        degrees: ['B.Tech in Aerospace Engineering', 'B.Tech in Aeronautical Engineering', 'M.Tech in Propulsion', 'M.Tech in Avionics'],
        relatedCareers: ['satellite-engineer', 'astrophysicist', 'mechanical-engineer'],
        didYouKnow: ['Drone Engineer', 'Flight Test Engineer', 'Rocket Propulsion Specialist', 'UAV Systems Designer'],
        goodStuff: ['Work on cutting-edge technology', 'See your designs fly or launch into space', 'High-paying career with global opportunities'],
        challenges: ['Highly competitive field', 'Long project timelines', 'Heavy responsibility for safety', 'Continuous learning required']
    },
    {
        slug: 'satellite-engineer',
        title: 'Satellite Engineer',
        category: 'Engineering',
        categoryColor: 'bg-orange-100 text-orange-700',
        shortDescription: "You'd be involved in the full lifecycle of satellites, from designing and constructing them to launching and operating them in orbit for various purposes.",
        fullDescription: "Imagine helping create the 'eyes' and 'ears' that orbit our Earth! A Satellite Engineer is someone who designs, builds, tests, launches, and operates satellites. This job involves working on everything from the tiny electronic circuits inside a satellite to its overall structure, ensuring it can survive the harsh environment of space.",
        keywords: ['satellite', 'space', 'isro', 'communication', 'gps', 'orbit', 'spacecraft', 'engineering'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Excel in Science & Math', description: 'Choose PCM. Focus on Physics and advanced Mathematics. Build small projects related to electronics or mechanics.' },
            { title: 'Competitive Exams (Class 11-12)', subtitle: 'Prepare for Entrance Exams', description: 'JEE Main & Advanced for IITs. A good score is essential for top engineering colleges.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'Pursue Engineering Degree', description: 'Enroll in B.Tech in Aerospace Engineering, Electronics & Communication Engineering, Mechanical Engineering, or Computer Science Engineering.' },
            { title: 'Postgraduate Studies (Optional, 2 years)', subtitle: 'Specialize in Space Technology', description: 'M.Tech/MS in Space Technology, Satellite Communication, or Remote Sensing from IISc, IITs, or international universities.' },
            { title: 'First Job & Career Growth', subtitle: 'Industry Experience', description: 'Apply for roles at organizations like ISRO, DRDO, private space companies (Agnikul, Skyroot), or major corporations like Boeing, Airbus, SpaceX.' }
        ],
        salary: { entry: '7-12 LPA', mid: '18-35 LPA', senior: '45+ LPA' },
        exams: ['JEE Main & Advanced', 'GATE', 'ISRO centralized recruitment exam'],
        collegesIndia: ['IIT Bombay', 'IIT Madras', 'IIT Kharagpur', 'IISc Bangalore', 'BITS Pilani'],
        collegesGlobal: ['MIT, USA', 'Caltech, USA', 'Stanford University, USA', 'TU Delft, Netherlands'],
        degrees: ['B.Tech in Aerospace/Electronics/Mechanical Engineering', 'M.Tech in Space Technology', 'MS in Satellite Communication'],
        relatedCareers: ['aerospace-engineer', 'astrophysicist', 'data-scientist'],
        didYouKnow: ['Space Antenna Designer', 'Satellite Data Scientist', 'Space Weather Forecaster', 'Bioastronautics Engineer'],
        goodStuff: ['Contribute to global connectivity and observation', 'Work with international space agencies', 'High demand in growing private space sector'],
        challenges: ['Extremely high precision required', 'Long testing and validation cycles', 'Project delays can be costly', 'Launch failures are devastating']
    },
    {
        slug: 'data-scientist',
        title: 'Data Scientist',
        category: 'Technology & IT',
        categoryColor: 'bg-purple-100 text-purple-700',
        shortDescription: "You'd analyze massive datasets to uncover patterns, build predictive models, and help organizations make data-driven decisions.",
        fullDescription: "Data Scientists are the modern-day fortune tellers - but instead of crystal balls, they use algorithms and statistics! You'd work with big data, machine learning, and AI to solve complex business problems, from predicting customer behavior to optimizing supply chains.",
        keywords: ['data', 'analytics', 'machine learning', 'ai', 'python', 'statistics', 'big data', 'programming', 'algorithms'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Build Math Foundation', description: 'Focus on Mathematics and Computer Science. Learn basic programming in Python. Participate in coding competitions.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'Choose Technical Degree', description: 'B.Tech in Computer Science, B.Sc. in Statistics/Mathematics, or specialized Data Science programs. Focus on statistics, programming, and ML.' },
            { title: 'Skills Development', subtitle: 'Learn Core Tools', description: 'Master Python, R, SQL, and ML libraries (TensorFlow, PyTorch). Build projects on real datasets. Take online courses from Coursera, edX.' },
            { title: 'Entry-Level Jobs', subtitle: 'Start as Data Analyst', description: 'Begin as Data Analyst or Junior Data Scientist. Build experience with real-world problems. Work in any industry - tech, finance, healthcare.' }
        ],
        salary: { entry: '8-15 LPA', mid: '20-40 LPA', senior: '50-80+ LPA' },
        exams: ['No specific entrance exam required - skills matter most'],
        collegesIndia: ['IIT Delhi', 'IIT Madras', 'IISc Bangalore', 'ISI Kolkata', 'IIIT Hyderabad'],
        collegesGlobal: ['Stanford University, USA', 'MIT, USA', 'Carnegie Mellon University, USA', 'Oxford University, UK'],
        degrees: ['B.Tech in Computer Science', 'B.Sc. in Statistics', 'M.Tech in Data Science', 'MS in Analytics'],
        relatedCareers: ['ai-ml-engineer', 'software-developer', 'business-analyst'],
        didYouKnow: ['NLP Engineer', 'Computer Vision Specialist', 'ML Ops Engineer', 'Recommendation Systems Engineer'],
        goodStuff: ['One of the highest paying tech careers', 'Work from anywhere flexibility', 'Every industry needs data scientists', 'Intellectually stimulating work'],
        challenges: ['Constantly evolving field', 'Data quality issues in real projects', 'Explaining complex findings to non-technical stakeholders', 'High expectations from business']
    },
    {
        slug: 'software-developer',
        title: 'Software Developer',
        category: 'Technology & IT',
        categoryColor: 'bg-purple-100 text-purple-700',
        shortDescription: "You'd write code to build applications, websites, and systems that millions of people use every day.",
        fullDescription: "Software Developers are the architects of the digital world! From the apps on your phone to the websites you browse, developers create the software that powers modern life. It's a career with endless creativity and problem-solving.",
        keywords: ['coding', 'programming', 'software', 'developer', 'web', 'apps', 'javascript', 'python', 'java', 'tech', 'engineer'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Start Coding Early', description: 'Take Computer Science if available. Learn a programming language like Python or JavaScript. Build small projects and websites.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'Computer Science Degree', description: 'B.Tech/B.E. in Computer Science or IT. Focus on data structures, algorithms, and software engineering principles.' },
            { title: 'Build Portfolio', subtitle: 'Create Real Projects', description: 'Contribute to open source. Build personal projects. Complete internships at tech companies. Create a GitHub portfolio.' },
            { title: 'First Job', subtitle: 'Start Your Tech Career', description: 'Join startups or established tech companies. Specialize in frontend, backend, full-stack, or mobile development.' }
        ],
        salary: { entry: '6-15 LPA', mid: '18-40 LPA', senior: '40-100+ LPA' },
        exams: ['No mandatory exams - practical skills and interviews determine success'],
        collegesIndia: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'IIIT Hyderabad', 'NIT Trichy'],
        collegesGlobal: ['Stanford University, USA', 'MIT, USA', 'Berkeley, USA', 'ETH Zurich, Switzerland'],
        degrees: ['B.Tech in Computer Science', 'BCA', 'MCA', 'M.Tech in Software Engineering'],
        relatedCareers: ['data-scientist', 'ai-ml-engineer', 'ux-designer'],
        didYouKnow: ['DevOps Engineer', 'Mobile App Developer', 'Game Developer', 'Blockchain Developer'],
        goodStuff: ['High salaries and growth potential', 'Remote work opportunities', 'Creative problem solving', 'Always in demand globally'],
        challenges: ['Constant learning required', 'Tight deadlines and pressure', 'Can involve long hours', 'Sedentary work style']
    },
    {
        slug: 'doctor-mbbs',
        title: 'Doctor (MBBS)',
        category: 'Medicine & Healthcare',
        categoryColor: 'bg-green-100 text-green-700',
        shortDescription: "You'd diagnose illnesses, treat patients, and save lives while being respected as a pillar of society.",
        fullDescription: "Doctors are healers who dedicate their lives to helping others. From diagnosing diseases to performing surgeries, a career in medicine is one of the most respected and fulfilling paths. It requires dedication, empathy, and years of rigorous training.",
        keywords: ['doctor', 'medicine', 'mbbs', 'neet', 'hospital', 'healthcare', 'surgeon', 'physician', 'medical', 'aiims'],
        roadmap: [
            { title: 'High School (Classes 9-12)', subtitle: 'Science Stream with Biology', description: 'Take Physics, Chemistry, and Biology (PCB). Prepare for NEET alongside board exams. Join coaching if needed.' },
            { title: 'NEET Exam', subtitle: 'Clear the Medical Entrance', description: 'NEET-UG is mandatory for all medical colleges in India. Score high for government colleges like AIIMS, JIPMER.' },
            { title: 'MBBS (5.5 years)', subtitle: 'Medical School', description: '4.5 years of academics + 1 year internship. Learn anatomy, physiology, pathology, medicine, surgery, and clinical skills.' },
            { title: 'Postgraduate Specialization (3 years)', subtitle: 'Become a Specialist', description: 'MD/MS through NEET-PG. Specialize in Surgery, Pediatrics, Cardiology, Dermatology, etc. Super-specialization is also possible.' }
        ],
        salary: { entry: '8-15 LPA', mid: '20-50 LPA', senior: '1 Cr+' },
        salaryNote: 'Private practice can significantly increase earnings. Specialists and super-specialists earn considerably more.',
        exams: ['NEET-UG (for MBBS)', 'NEET-PG (for MD/MS)'],
        collegesIndia: ['AIIMS Delhi', 'JIPMER Puducherry', 'CMC Vellore', 'AFMC Pune', 'Maulana Azad Medical College'],
        collegesGlobal: ['Harvard Medical School, USA', 'Johns Hopkins, USA', 'Oxford University, UK', 'University of Melbourne, Australia'],
        degrees: ['MBBS', 'MD', 'MS', 'DM/MCh (Super-specialization)'],
        relatedCareers: ['dentist', 'pharmacist', 'physiotherapist'],
        didYouKnow: ['Emergency Medicine Specialist', 'Sports Medicine Doctor', 'Medical Researcher', 'Healthcare Administrator'],
        goodStuff: ['Save lives and help people', 'Highly respected profession', 'Job security and stability', 'Multiple specialization options'],
        challenges: ['Very long and expensive education (8-12 years)', 'Extremely competitive entrance (NEET)', 'High stress and emotional toll', 'Long working hours']
    },
    {
        slug: 'chartered-accountant',
        title: 'Chartered Accountant (CA)',
        category: 'Business & Finance',
        categoryColor: 'bg-amber-100 text-amber-700',
        shortDescription: "You'd manage finances, audits, and taxes for businesses, helping them stay profitable and compliant.",
        fullDescription: "Chartered Accountants are the financial doctors of businesses! They handle everything from auditing and taxation to financial planning and corporate law. It's a prestigious career with excellent earning potential.",
        keywords: ['ca', 'chartered accountant', 'finance', 'accounting', 'taxation', 'audit', 'commerce', 'icai', 'business'],
        roadmap: [
            { title: 'After Class 10', subtitle: 'Register for CA Foundation', description: 'Register with ICAI. Start preparing for CA Foundation exam while studying Class 11 & 12 Commerce.' },
            { title: 'CA Foundation', subtitle: 'First Level', description: 'Appear after Class 12. Four papers covering Accounting, Law, Economics, and Mathematics.' },
            { title: 'CA Intermediate', subtitle: 'Second Level', description: 'Two groups with 8 papers. Covers Accounting, Corporate Laws, Taxation, Auditing, and more.' },
            { title: 'Articleship (3 years)', subtitle: 'Practical Training', description: 'Work under a practicing CA while preparing for CA Final. Real-world experience in audits, taxation, and finance.' },
            { title: 'CA Final', subtitle: 'Become a Chartered Accountant', description: 'Pass the final exam to earn the CA designation. Can start practicing or join top companies.' }
        ],
        salary: { entry: '7-12 LPA', mid: '15-30 LPA', senior: '50+ LPA' },
        salaryNote: 'Partners in Big 4 firms or those with own practice can earn significantly more.',
        exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
        collegesIndia: ['ICAI (The Institute of Chartered Accountants of India) - self-study/coaching'],
        collegesGlobal: ['ACCA (UK)', 'CPA (USA)', 'CMA (USA)'],
        degrees: ['Chartered Accountant (CA)', 'B.Com (helpful but not mandatory)'],
        relatedCareers: ['investment-banker', 'financial-analyst', 'tax-consultant'],
        didYouKnow: ['Forensic Accountant', 'Internal Auditor', 'CFO', 'Tax Strategist'],
        goodStuff: ['High earning potential', 'Recession-proof career', 'Can start your own practice', 'Respected professional designation'],
        challenges: ['Very low pass rates (difficult exams)', 'Long study duration (4-5 years minimum)', 'Articleship can be demanding', 'Constant updates in laws and regulations']
    },
    {
        slug: 'civil-services-ias',
        title: 'Civil Services (IAS/IPS/IFS)',
        category: 'Law & Policy',
        categoryColor: 'bg-slate-100 text-slate-700',
        shortDescription: "You'd serve the nation as an administrator, policymaker, or diplomat, shaping India's future at the highest levels.",
        fullDescription: "The Civil Services represent service to the nation. As an IAS officer, you'd govern districts, implement policies, and be at the forefront of India's development. It's one of the most prestigious and impactful careers in the country.",
        keywords: ['ias', 'ips', 'upsc', 'civil services', 'government', 'administration', 'policy', 'bureaucracy', 'officer'],
        roadmap: [
            { title: 'High School & Graduation', subtitle: 'Any Stream Works', description: 'Complete Class 12 in any stream. Obtain a graduation degree (any discipline). Start building general knowledge early.' },
            { title: 'UPSC Preparation (1-3 years)', subtitle: 'Dedicated Preparation', description: 'Join coaching or self-study. Cover vast syllabus including History, Polity, Geography, Economy, Ethics, and Current Affairs.' },
            { title: 'UPSC CSE Prelims', subtitle: 'Screening Test', description: 'Two objective papers - General Studies and CSAT. Clears 3-4 lakh candidates to about 10,000.' },
            { title: 'UPSC CSE Mains', subtitle: 'Written Examination', description: 'Nine descriptive papers including Essay, GS, and Optional Subject. Tests in-depth knowledge and writing skills.' },
            { title: 'Interview & Training', subtitle: 'Final Selection', description: 'Personality test at UPSC. Selected candidates train at LBSNAA Mussoorie for 2 years before posting.' }
        ],
        salary: { entry: '10-12 LPA', mid: '18-25 LPA', senior: '30+ LPA' },
        salaryNote: 'The real value is in the power to create change, perks, government accommodation, and post-retirement opportunities.',
        exams: ['UPSC Civil Services Examination (Prelims + Mains + Interview)'],
        collegesIndia: ['Any recognized university for graduation', 'LBSNAA Mussoorie (training academy)'],
        collegesGlobal: ['Not applicable - purely Indian service'],
        degrees: ['Any graduation degree', 'Post-graduation can help in optional subject selection'],
        relatedCareers: ['lawyer', 'public-policy-analyst', 'diplomat'],
        didYouKnow: ['District Magistrate', 'Police Commissioner', 'Ambassador', 'Cabinet Secretary'],
        goodStuff: ['Power to create real change', 'High social respect', 'Job security for life', 'Serve the nation directly'],
        challenges: ['Extremely competitive (0.1% selection rate)', 'Age limit and attempt restrictions', '2-3+ years of intense preparation', 'Transfers and postings away from family']
    },
    {
        slug: 'lawyer',
        title: 'Lawyer/Advocate',
        category: 'Law & Policy',
        categoryColor: 'bg-slate-100 text-slate-700',
        shortDescription: "You'd represent clients in courts, draft legal documents, and fight for justice in various fields of law.",
        fullDescription: "Lawyers are the defenders of rights and seekers of justice. From criminal law to corporate law, intellectual property to human rights - lawyers work across diverse fields protecting interests and arguing cases in courts.",
        keywords: ['lawyer', 'advocate', 'law', 'legal', 'court', 'clat', 'llb', 'litigation', 'corporate law', 'justice'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'Any Stream', description: 'Any stream works for law. Humanities can be helpful but not mandatory. Focus on English and current affairs.' },
            { title: 'Entrance Exams', subtitle: 'Clear Law Entrance', description: 'CLAT for NLUs, AILET for NLU Delhi, LSAT for some private colleges. 5-year integrated LLB or 3-year LLB after graduation.' },
            { title: 'LLB Degree (3-5 years)', subtitle: 'Law School', description: '5-year BA LLB after Class 12, or 3-year LLB after graduation. Learn Constitutional Law, Criminal Law, Corporate Law, etc.' },
            { title: 'Bar Council Enrollment', subtitle: 'Become an Advocate', description: 'Pass the All India Bar Examination. Register with State Bar Council. Can now practice law.' },
            { title: 'Specialization & Practice', subtitle: 'Build Your Career', description: 'Join a law firm, work under a senior advocate, or start independent practice. Specialize in corporate, criminal, tax, or other areas.' }
        ],
        salary: { entry: '4-10 LPA', mid: '15-40 LPA', senior: '1 Cr+' },
        salaryNote: 'Top corporate lawyers and senior advocates can earn extremely well. Litigation success takes time to build.',
        exams: ['CLAT', 'AILET', 'LSAT India', 'All India Bar Examination'],
        collegesIndia: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi', 'NUJS Kolkata', 'NLUJ Jaipur'],
        collegesGlobal: ['Harvard Law School, USA', 'Yale Law School, USA', 'Oxford University, UK', 'Cambridge University, UK'],
        degrees: ['BA LLB (5 years)', 'LLB (3 years)', 'LLM (for specialization)'],
        relatedCareers: ['civil-services-ias', 'corporate-secretary', 'legal-consultant'],
        didYouKnow: ['IP Lawyer', 'Human Rights Advocate', 'Legal Journalist', 'Law Tech Entrepreneur'],
        goodStuff: ['Fight for justice and rights', 'Intellectually challenging work', 'High earning potential at top tier', 'Multiple career paths'],
        challenges: ['Initial years are financially tough', 'Long working hours', 'Stressful court proceedings', 'Takes years to build reputation']
    },
    {
        slug: 'architect',
        title: 'Architect',
        category: 'Creative & Design',
        categoryColor: 'bg-pink-100 text-pink-700',
        shortDescription: "You'd design buildings, spaces, and structures that blend functionality with aesthetics, shaping the world we live in.",
        fullDescription: "Architects are artists who build in three dimensions! They design homes, offices, public spaces, and entire cities. It's a career that combines creativity with technical knowledge, leaving a lasting legacy in bricks and mortar.",
        keywords: ['architect', 'architecture', 'design', 'buildings', 'construction', 'nata', 'interior', 'urban planning', 'creative'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'PCM with Drawing', description: 'Take Physics, Chemistry, Math. Some schools offer drawing/design subjects. Practice sketching and visualization.' },
            { title: 'Entrance Exams', subtitle: 'Clear NATA/JEE', description: 'NATA (National Aptitude Test in Architecture) or JEE Paper 2. Tests drawing skills, mathematics, and aptitude.' },
            { title: 'B.Arch (5 years)', subtitle: 'Architecture Degree', description: '5-year professional degree covering design, structures, history, planning, and practical training.' },
            { title: 'Internship & Registration', subtitle: 'Start Practicing', description: 'Complete internship. Register with Council of Architecture. Can practice as a licensed architect.' }
        ],
        salary: { entry: '4-8 LPA', mid: '12-25 LPA', senior: '40+ LPA' },
        salaryNote: 'Established architects with own practice can earn significantly more. Project-based income varies.',
        exams: ['NATA', 'JEE Main Paper 2'],
        collegesIndia: ['IIT Kharagpur', 'IIT Roorkee', 'SPA Delhi', 'SPA Bhopal', 'CEPT Ahmedabad'],
        collegesGlobal: ['MIT, USA', 'Harvard GSD, USA', 'AA School London, UK', 'ETH Zurich, Switzerland'],
        degrees: ['B.Arch', 'M.Arch', 'Urban Planning degrees'],
        relatedCareers: ['ux-designer', 'interior-designer', 'urban-planner'],
        didYouKnow: ['Landscape Architect', 'Sustainable Design Specialist', 'Heritage Conservation Architect', 'Set Designer'],
        goodStuff: ['Create lasting structures', 'Blend art with engineering', 'See your designs come to life', 'Diverse project types'],
        challenges: ['Long education (5+ years)', 'Initial years can be low-paying', 'Client demands can be frustrating', 'Project delays are common']
    },
    {
        slug: 'ux-designer',
        title: 'UX Designer',
        category: 'Creative & Design',
        categoryColor: 'bg-pink-100 text-pink-700',
        shortDescription: "You'd design digital experiences that are intuitive, beautiful, and user-friendly, making technology accessible to everyone.",
        fullDescription: "UX Designers are the bridge between humans and technology. They research users, create wireframes, design interfaces, and ensure every tap, swipe, and click feels natural. It's where psychology meets design.",
        keywords: ['ux', 'ui', 'design', 'user experience', 'interface', 'figma', 'product design', 'apps', 'websites', 'creative'],
        roadmap: [
            { title: 'High School', subtitle: 'Develop Creative Thinking', description: 'Any stream works. Focus on art, psychology, or computer science. Start learning design tools like Figma or Adobe XD.' },
            { title: 'Undergraduate Studies', subtitle: 'Design or Related Degree', description: 'B.Des in Communication/Graphic Design, B.Tech in CS with design interests, or specialized UX courses. Portfolio matters more than degree.' },
            { title: 'Build Portfolio', subtitle: 'Practice Design', description: 'Create case studies, redesign existing apps, take online courses (Google UX Certificate, Interaction Design Foundation). Build a strong portfolio.' },
            { title: 'First Job', subtitle: 'Start UX Career', description: 'Apply for UX Intern/Junior UX Designer roles at startups or tech companies. Learn from senior designers.' }
        ],
        salary: { entry: '5-12 LPA', mid: '15-35 LPA', senior: '40-70+ LPA' },
        exams: ['No specific exams - portfolio and skills matter most'],
        collegesIndia: ['NID Ahmedabad', 'IIT Bombay IDC', 'Srishti Bangalore', 'MIT Institute of Design'],
        collegesGlobal: ['Stanford d.school, USA', 'RISD, USA', 'Royal College of Art, UK', 'Parsons, USA'],
        degrees: ['B.Des', 'M.Des', 'Specialized UX Certifications'],
        relatedCareers: ['software-developer', 'product-manager', 'graphic-designer'],
        didYouKnow: ['UX Researcher', 'Interaction Designer', 'Design System Specialist', 'Voice UI Designer'],
        goodStuff: ['In-demand skill globally', 'Creative and analytical work', 'Remote work friendly', 'Shape products used by millions'],
        challenges: ['Subjective nature of design', 'Stakeholder pushback', 'Fast-changing tools and trends', 'Need to balance user needs with business goals']
    },
    {
        slug: 'investment-banker',
        title: 'Investment Banker',
        category: 'Business & Finance',
        categoryColor: 'bg-amber-100 text-amber-700',
        shortDescription: "You'd help companies raise capital, manage mergers and acquisitions, and advise on major financial decisions worth millions.",
        fullDescription: "Investment Bankers are the deal-makers of the financial world. They help companies go public (IPOs), merge with others, or raise billions in funding. It's a high-pressure, high-reward career for those who thrive on adrenaline.",
        keywords: ['investment banking', 'finance', 'mba', 'iim', 'mergers', 'acquisitions', 'ipo', 'wall street', 'capital markets'],
        roadmap: [
            { title: 'High School & Graduation', subtitle: 'Strong Academics', description: 'Commerce or any stream. Get into a top undergraduate college with strong academics. B.Com, Economics, Engineering all work.' },
            { title: 'Work Experience (2-3 years)', subtitle: 'Build Foundation', description: 'Work in analytics, consulting, or finance roles. Build financial modeling and analysis skills.' },
            { title: 'MBA from Top B-School', subtitle: 'Crucial Step', description: 'CAT/GMAT for IIMs, ISB, or international MBA. Investment banking recruiters primarily hire from top MBA programs.' },
            { title: 'Investment Banking Role', subtitle: 'Break Into IB', description: 'Join as Analyst/Associate at firms like Goldman Sachs, Morgan Stanley, JP Morgan, or boutique investment banks.' }
        ],
        salary: { entry: '15-25 LPA', mid: '40-80 LPA', senior: '2+ Cr' },
        salaryNote: 'Bonuses can equal or exceed base salary. Managing Directors at top firms earn extremely well.',
        exams: ['CAT (for IIMs)', 'GMAT (for international MBA)', 'CFA can be helpful'],
        collegesIndia: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'ISB Hyderabad', 'XLRI Jamshedpur'],
        collegesGlobal: ['Wharton, USA', 'Harvard Business School, USA', 'London Business School, UK', 'INSEAD, France'],
        degrees: ['B.Com/BA Economics/B.Tech', 'MBA', 'CFA'],
        relatedCareers: ['chartered-accountant', 'financial-analyst', 'private-equity-analyst'],
        didYouKnow: ['Private Equity Associate', 'Hedge Fund Manager', 'Venture Capitalist', 'M&A Specialist'],
        goodStuff: ['One of the highest paying careers', 'Work on billion-dollar deals', 'Fast-paced and exciting', 'Exit opportunities to PE/VC'],
        challenges: ['Extremely long working hours (80-100/week)', 'High stress and pressure', 'Highly competitive to get in', 'Work-life balance is poor']
    },
    {
        slug: 'film-director',
        title: 'Film Director',
        category: 'Arts & Entertainment',
        categoryColor: 'bg-rose-100 text-rose-700',
        shortDescription: "You'd bring stories to life on screen, guiding actors, crew, and creative vision to create memorable films.",
        fullDescription: "Film Directors are the creative visionaries behind movies. They interpret scripts, direct actors, make artistic decisions, and work with cinematographers, editors, and producers to create compelling cinema that moves audiences.",
        keywords: ['film', 'director', 'movies', 'cinema', 'bollywood', 'screenplay', 'filmmaking', 'acting', 'entertainment'],
        roadmap: [
            { title: 'High School', subtitle: 'Explore Creative Arts', description: 'Watch diverse films analytically. Write short scripts. Learn basic video editing. Any academic stream works.' },
            { title: 'Film School or Degree', subtitle: 'Formal Training (Optional)', description: 'Join Film & Television Institute of India (FTII), Whistling Woods, or international schools. Alternatively, learn by assisting on sets.' },
            { title: 'Assistant Director', subtitle: 'Learn on Set', description: 'Work as AD on film sets. Learn the craft by observing senior directors. Build network in the industry.' },
            { title: 'Short Films & Independent Projects', subtitle: 'Create Your Work', description: 'Direct short films. Submit to festivals. Build a portfolio. Use platforms like YouTube to showcase work.' },
            { title: 'Feature Film', subtitle: 'Your Big Break', description: 'Pitch to producers or fund independently. Direct your first feature. Success comes through persistence and talent.' }
        ],
        salary: { entry: '3-8 LPA', mid: '15-50 LPA', senior: '1 Cr - 50 Cr+' },
        salaryNote: 'Highly variable. Top Bollywood/Hollywood directors earn in crores per film. Success is unpredictable.',
        exams: ['FTII Entrance Exam', 'Whistling Woods admission process'],
        collegesIndia: ['FTII Pune', 'SRFTI Kolkata', 'Whistling Woods', 'LV Prasad Film Academy'],
        collegesGlobal: ['USC Film School, USA', 'NYU Tisch, USA', 'AFI, USA', 'London Film School, UK'],
        degrees: ['Diploma in Film Direction', 'BA in Film Studies', 'No degree is mandatory - talent matters'],
        relatedCareers: ['screenwriter', 'cinematographer', 'producer'],
        didYouKnow: ['Documentary Filmmaker', 'Web Series Director', 'Ad Film Director', 'Music Video Director'],
        goodStuff: ['Creative fulfillment', 'Tell stories that impact millions', 'Fame and recognition', 'No ceiling on earnings'],
        challenges: ['Extremely competitive industry', 'Financial instability initially', 'Years of struggle before success', 'Requires thick skin for rejection']
    },
    {
        slug: 'ai-ml-engineer',
        title: 'AI/ML Engineer',
        category: 'Technology & IT',
        categoryColor: 'bg-purple-100 text-purple-700',
        shortDescription: "You'd build intelligent systems that can learn, reason, and make decisions - from chatbots to self-driving cars.",
        fullDescription: "AI/ML Engineers are creating the future! They build systems that can recognize faces, understand language, recommend content, and even drive cars. It's one of the most exciting and rapidly growing fields in technology.",
        keywords: ['ai', 'ml', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'python', 'tech'],
        roadmap: [
            { title: 'High School', subtitle: 'Strong Math & CS Foundation', description: 'Excel in Mathematics. Learn programming (Python preferably). Participate in coding competitions.' },
            { title: 'Undergraduate Studies', subtitle: 'CS or Related Degree', description: 'B.Tech in Computer Science, AI/ML specialization if available. Focus on linear algebra, probability, and algorithms.' },
            { title: 'Specialize in ML/AI', subtitle: 'Deep Knowledge', description: 'Take advanced courses in Deep Learning, NLP, Computer Vision. Build projects. Contribute to research or open source.' },
            { title: 'Industry/Research', subtitle: 'Start Career', description: 'Join AI teams at tech companies, or pursue MS/PhD for research roles. Field is highly in demand.' }
        ],
        salary: { entry: '10-20 LPA', mid: '25-50 LPA', senior: '60-120+ LPA' },
        exams: ['No specific exam - skills and research matter'],
        collegesIndia: ['IIT Bombay', 'IIT Delhi', 'IISc Bangalore', 'IIIT Hyderabad', 'IIT Madras'],
        collegesGlobal: ['Stanford University', 'MIT', 'Carnegie Mellon', 'Berkeley', 'DeepMind (industry research)'],
        degrees: ['B.Tech in CS/AI', 'M.Tech in AI/ML', 'MS/PhD in AI'],
        relatedCareers: ['data-scientist', 'software-developer', 'research-scientist'],
        didYouKnow: ['Robotics Engineer', 'NLP Specialist', 'Computer Vision Engineer', 'AI Ethics Researcher'],
        goodStuff: ['Cutting-edge technology', 'One of the highest paying fields', 'Work on impactful problems', 'Global opportunities'],
        challenges: ['Rapidly changing field', 'High mathematical complexity', 'Compute resources can be expensive', 'Ethical considerations around AI']
    },
    {
        slug: 'sports-scientist',
        title: 'Sports Scientist',
        category: 'Sports & Fitness',
        categoryColor: 'bg-cyan-100 text-cyan-700',
        shortDescription: "You'd use science to help athletes perform better, prevent injuries, and optimize training and recovery.",
        fullDescription: "Sports Scientists apply physiology, psychology, biomechanics, and nutrition to enhance athletic performance. They work with sports teams, athletes, and fitness organizations to push the boundaries of human potential.",
        keywords: ['sports', 'athlete', 'fitness', 'physiology', 'training', 'performance', 'medicine', 'coaching'],
        roadmap: [
            { title: 'High School', subtitle: 'Science + Sports', description: 'Take PCB or PCM. Stay actively involved in sports. Develop understanding of human body and fitness.' },
            { title: 'Undergraduate Studies', subtitle: 'Sports Science Degree', description: 'B.Sc. in Sports Science, Exercise Physiology, or Kinesiology. Some pursue B.P.Ed. or physiotherapy.' },
            { title: 'Specialization', subtitle: 'Advanced Study', description: 'M.Sc. in Sports Science, certifications in strength & conditioning (CSCS), sports nutrition, or biomechanics.' },
            { title: 'Work with Teams/Athletes', subtitle: 'Practical Experience', description: 'Join sports academies, franchises (IPL, ISL), or work with Olympic committees. Build reputation through results.' }
        ],
        salary: { entry: '4-8 LPA', mid: '12-25 LPA', senior: '30-60+ LPA' },
        salaryNote: 'Top sports scientists with IPL/ISL teams or international postings can earn significantly more.',
        exams: ['No specific exam - relevant degree and certifications required'],
        collegesIndia: ['SAI (Sports Authority of India)', 'LNIPE Gwalior', 'SRM Sports Science', 'Amity Sports Science'],
        collegesGlobal: ['Loughborough University, UK', 'AMSI Australia', 'NSCA certifications'],
        degrees: ['B.Sc. Sports Science', 'M.Sc. Sports Science', 'CSCS Certification', 'Sports Nutrition Diploma'],
        relatedCareers: ['physiotherapist', 'fitness-trainer', 'sports-psychologist'],
        didYouKnow: ['Biomechanist', 'Performance Analyst', 'Sports Nutritionist', 'Team Conditioning Coach'],
        goodStuff: ['Work with elite athletes', 'Combine passion for sports with science', 'Growing field in India', 'Dynamic work environment'],
        challenges: ['Initial opportunities limited in India', 'Results-based pressure', 'Irregular hours during events', 'Need to stay updated with latest research']
    },
    // ===== NEW CAREERS ADDED =====
    {
        slug: 'psychologist',
        title: 'Psychologist',
        category: 'Medicine & Healthcare',
        categoryColor: 'bg-green-100 text-green-700',
        shortDescription: "You'd help people understand their minds, overcome mental health challenges, and live happier, more fulfilling lives.",
        fullDescription: "Psychologists study human behavior and mental processes to help people cope with life's challenges. From therapy to research, they work in clinics, schools, organizations, and private practice, making a profound difference in people's lives.",
        keywords: ['psychology', 'mental health', 'therapy', 'counseling', 'mind', 'behavior', 'psychiatry', 'wellness'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'Any Stream', description: 'Any stream works, but Psychology in Class 11-12 is helpful. Focus on English and develop empathy and listening skills.' },
            { title: 'Undergraduate Studies (3 years)', subtitle: 'BA/B.Sc. Psychology', description: 'Pursue BA or B.Sc. in Psychology from a recognized university. Build strong foundation in research methods and theories.' },
            { title: 'Postgraduate Studies (2 years)', subtitle: 'MA/M.Sc. Psychology', description: 'Specialize in Clinical, Counseling, Organizational, or Educational Psychology. RCI registration needed for clinical practice.' },
            { title: 'M.Phil/Ph.D (Optional)', subtitle: 'Advanced Specialization', description: 'M.Phil in Clinical Psychology is mandatory for clinical practice. Ph.D. opens research and academic positions.' },
            { title: 'Practice & Specialization', subtitle: 'Build Career', description: 'Work in hospitals, schools, corporate settings, or start private practice. Continuous learning and supervision required.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-18 LPA', senior: '25-50+ LPA' },
        salaryNote: 'Private practice can be highly lucrative. Corporate and international opportunities pay significantly more.',
        exams: ['CUET for DU/Central Universities', 'University entrance exams', 'RCI licensing for clinical'],
        collegesIndia: ['Delhi University', 'JNU', 'Christ University Bangalore', 'TISS Mumbai', 'Jamia Millia'],
        collegesGlobal: ['Harvard, USA', 'Stanford, USA', 'University College London, UK', 'University of Melbourne'],
        degrees: ['BA/B.Sc. Psychology', 'MA/M.Sc. Psychology', 'M.Phil Clinical Psychology', 'Ph.D. Psychology'],
        relatedCareers: ['doctor-mbbs', 'counselor', 'life-coach'],
        didYouKnow: ['Neuropsychologist', 'Sports Psychologist', 'Forensic Psychologist', 'Child Psychologist'],
        goodStuff: ['Help people heal and grow', 'Intellectually stimulating work', 'Flexible career paths', 'Growing demand for mental health services'],
        challenges: ['Long education path (5-7 years)', 'Emotionally demanding work', 'Burnout is common', 'Building private practice takes time']
    },
    {
        slug: 'pharmacist',
        title: 'Pharmacist',
        category: 'Medicine & Healthcare',
        categoryColor: 'bg-green-100 text-green-700',
        shortDescription: "You'd be an expert in medicines, ensuring patients get the right drugs safely and advising on their proper use.",
        fullDescription: "Pharmacists are medication experts who bridge the gap between doctors and patients. They dispense medications, provide drug information, monitor patient health, and increasingly play key roles in healthcare teams and pharmaceutical research.",
        keywords: ['pharmacy', 'medicine', 'drugs', 'healthcare', 'pharmaceutical', 'chemist', 'bpharma'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'PCB or PCM', description: 'Take Physics, Chemistry, Biology (or Math). Strong chemistry foundation is essential.' },
            { title: 'Entrance Exams', subtitle: 'Pharmacy Entrance Tests', description: 'State-level entrance exams. NEET is not required for B.Pharm. GPAT for M.Pharm admissions.' },
            { title: 'B.Pharm (4 years)', subtitle: 'Pharmacy Degree', description: 'Bachelor of Pharmacy covering pharmaceutics, pharmacology, chemistry, and clinical practice.' },
            { title: 'Pharm.D or M.Pharm (Optional)', subtitle: 'Advanced Study', description: 'Pharm.D for clinical pharmacy practice. M.Pharm for research and industry roles.' },
            { title: 'Registration & Practice', subtitle: 'Start Career', description: 'Register with State Pharmacy Council. Work in hospitals, retail, pharma industry, or drug regulatory bodies.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-15 LPA', senior: '20-40+ LPA' },
        exams: ['State Pharmacy Entrance Exams', 'GPAT (for M.Pharm)'],
        collegesIndia: ['NIPER (various locations)', 'Jamia Hamdard Delhi', 'ICT Mumbai', 'BITS Pilani', 'Manipal College of Pharmaceutical Sciences'],
        collegesGlobal: ['University of North Carolina, USA', 'University of Toronto, Canada', 'UCL, UK'],
        degrees: ['B.Pharm', 'Pharm.D', 'M.Pharm', 'Ph.D. Pharmacy'],
        relatedCareers: ['doctor-mbbs', 'biotechnologist', 'drug-inspector'],
        didYouKnow: ['Clinical Pharmacist', 'Pharmaceutical Scientist', 'Drug Safety Officer', 'Medical Affairs Manager'],
        goodStuff: ['Essential healthcare role', 'Multiple career paths', 'Growing pharma industry in India', 'Less stressful than MBBS path'],
        challenges: ['Retail pharmacy can be monotonous', 'Long hours in hospital settings', 'Requires constant updates on new drugs', 'Competition from online pharmacies']
    },
    {
        slug: 'mechanical-engineer',
        title: 'Mechanical Engineer',
        category: 'Engineering',
        categoryColor: 'bg-orange-100 text-orange-700',
        shortDescription: "You'd design, build, and maintain mechanical systems - from tiny components to massive industrial machines.",
        fullDescription: "Mechanical Engineering is one of the broadest engineering disciplines. Mechanical Engineers work on everything from car engines to power plants, robots to HVAC systems. It's a versatile career that spans almost every industry.",
        keywords: ['mechanical', 'engineering', 'machines', 'manufacturing', 'automobile', 'design', 'robotics', 'jee'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'PCM Stream', description: 'Take Physics, Chemistry, Mathematics. Develop interest in how machines work. Build small projects.' },
            { title: 'JEE/Entrance Exams', subtitle: 'Clear Engineering Entrance', description: 'JEE Main & Advanced for IITs/NITs. State CETs for other colleges. Good score gets you into top programs.' },
            { title: 'B.Tech Mechanical (4 years)', subtitle: 'Engineering Degree', description: 'Study thermodynamics, fluid mechanics, manufacturing, design, and materials. Complete internships and projects.' },
            { title: 'Industry or Higher Studies', subtitle: 'Career Path', description: 'Join core companies (Tata, L&T, Mahindra) or pursue M.Tech/MBA for specialized roles.' }
        ],
        salary: { entry: '4-10 LPA', mid: '12-25 LPA', senior: '35-60+ LPA' },
        exams: ['JEE Main & Advanced', 'GATE (for M.Tech/PSU jobs)'],
        collegesIndia: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'NIT Trichy', 'BITS Pilani'],
        collegesGlobal: ['MIT, USA', 'Stanford, USA', 'TU Munich, Germany', 'Imperial College, UK'],
        degrees: ['B.Tech in Mechanical Engineering', 'M.Tech in Thermal/Design/Manufacturing', 'MBA'],
        relatedCareers: ['aerospace-engineer', 'civil-engineer', 'automobile-designer'],
        didYouKnow: ['Robotics Engineer', 'HVAC Specialist', 'Automotive Designer', 'Product Development Engineer'],
        goodStuff: ['Evergreen branch with diverse opportunities', 'Can work in any industry', 'Strong fundamentals for entrepreneurship', 'PSU jobs offer stability'],
        challenges: ['Core jobs can be limited', 'Many switch to IT/consulting', 'Manufacturing roles may be in remote locations', 'Less glamorous than new-age tech roles']
    },
    {
        slug: 'civil-engineer',
        title: 'Civil Engineer',
        category: 'Engineering',
        categoryColor: 'bg-orange-100 text-orange-700',
        shortDescription: "You'd design and build infrastructure - roads, bridges, buildings, dams, and entire cities that shape our world.",
        fullDescription: "Civil Engineers are the builders of civilization. They plan, design, and oversee construction of infrastructure that society depends on. From skyscrapers to subway systems, their work literally shapes the world around us.",
        keywords: ['civil', 'construction', 'buildings', 'infrastructure', 'roads', 'bridges', 'engineering', 'jee'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'PCM Stream', description: 'Take Physics, Chemistry, Mathematics. Develop interest in structures and construction.' },
            { title: 'JEE/Entrance Exams', subtitle: 'Clear Engineering Entrance', description: 'JEE Main & Advanced for IITs/NITs. State CETs for other engineering colleges.' },
            { title: 'B.Tech Civil (4 years)', subtitle: 'Engineering Degree', description: 'Study structures, geotechnical, environmental, transportation, and water resources engineering. Site visits essential.' },
            { title: 'Industry or Higher Studies', subtitle: 'Career Path', description: 'Join L&T, Tata Projects, or government departments. Or pursue M.Tech/MS for specialized roles in structural or environmental engineering.' }
        ],
        salary: { entry: '4-8 LPA', mid: '10-20 LPA', senior: '30-50+ LPA' },
        exams: ['JEE Main & Advanced', 'GATE (for M.Tech/PSU jobs)', 'SSC JE for government jobs'],
        collegesIndia: ['IIT Delhi', 'IIT Roorkee', 'IIT Madras', 'NIT Trichy', 'BITS Pilani'],
        collegesGlobal: ['MIT, USA', 'Cambridge, UK', 'TU Delft, Netherlands', 'ETH Zurich, Switzerland'],
        degrees: ['B.Tech in Civil Engineering', 'M.Tech in Structural/Environmental', 'MBA in Construction Management'],
        relatedCareers: ['architect', 'urban-planner', 'construction-manager'],
        didYouKnow: ['Structural Engineer', 'Transportation Planner', 'Geotechnical Specialist', 'Smart City Consultant'],
        goodStuff: ['Build lasting structures', 'Government jobs with stability', 'Real estate boom creates opportunities', 'Can start own construction firm'],
        challenges: ['Site work can be demanding', 'Projects often in remote areas', 'Tight deadlines and budget pressures', 'Less trendy than IT roles']
    },
    {
        slug: 'biotechnologist',
        title: 'Biotechnologist',
        category: 'Science & Research',
        categoryColor: 'bg-blue-100 text-blue-700',
        shortDescription: "You'd use living organisms and biological systems to develop products and technologies that improve life.",
        fullDescription: "Biotechnologists work at the intersection of biology and technology. From developing vaccines to genetically modified crops, creating biofuels to producing pharmaceuticals - biotech is changing healthcare, agriculture, and the environment.",
        keywords: ['biotech', 'biotechnology', 'genetics', 'pharma', 'research', 'biology', 'science', 'vaccines'],
        roadmap: [
            { title: 'High School (Classes 11-12)', subtitle: 'PCB Stream', description: 'Take Physics, Chemistry, Biology. Develop strong foundation in molecular biology and chemistry.' },
            { title: 'Undergraduate Studies (4 years)', subtitle: 'B.Tech/B.Sc. Biotech', description: 'B.Tech in Biotechnology from engineering colleges or B.Sc. Biotech from science colleges. Focus on lab skills and research.' },
            { title: 'M.Tech/M.Sc. (2 years)', subtitle: 'Specialization', description: 'Specialize in areas like Genetic Engineering, Industrial Biotech, or Pharmaceutical Biotech. Research experience is valuable.' },
            { title: 'Industry or Research', subtitle: 'Start Career', description: 'Join pharma companies (Biocon, Dr. Reddys), research labs, or agribiotech firms. Ph.D. for senior research positions.' }
        ],
        salary: { entry: '3-7 LPA', mid: '10-20 LPA', senior: '30-60+ LPA' },
        exams: ['JEE/State CETs for B.Tech', 'GATE Biotechnology', 'DBT-JRF for research'],
        collegesIndia: ['IIT Delhi', 'IIT Kharagpur', 'Anna University', 'VIT Vellore', 'JNU'],
        collegesGlobal: ['MIT, USA', 'ETH Zurich, Switzerland', 'Cambridge, UK', 'Harvard, USA'],
        degrees: ['B.Tech/B.Sc. Biotechnology', 'M.Tech/M.Sc. Biotechnology', 'Ph.D. in specialized areas'],
        relatedCareers: ['pharmacist', 'doctor-mbbs', 'research-scientist'],
        didYouKnow: ['Genetic Counselor', 'Bioinformatics Specialist', 'Vaccine Developer', 'Regulatory Affairs Manager'],
        goodStuff: ['Work on life-changing innovations', 'Growing industry globally', 'Multiple specializations available', 'Combines science with real-world impact'],
        challenges: ['Ph.D. often needed for top positions', 'Initial salaries can be modest', 'Research can be slow and uncertain', 'Regulatory hurdles are complex']
    },
    {
        slug: 'journalist',
        title: 'Journalist',
        category: 'Arts & Entertainment',
        categoryColor: 'bg-rose-100 text-rose-700',
        shortDescription: "You'd investigate stories, report truth, and inform the public about important events happening in the world.",
        fullDescription: "Journalists are the watchdogs of democracy. They research, investigate, and report on news and events across politics, sports, entertainment, business, and more. In the digital age, journalism spans print, TV, online, and social media.",
        keywords: ['journalism', 'news', 'reporter', 'media', 'writing', 'tv', 'newspaper', 'editor'],
        roadmap: [
            { title: 'High School', subtitle: 'Any Stream', description: 'Any stream works. Focus on English, current affairs, and develop strong writing skills. Start a blog or school paper.' },
            { title: 'Undergraduate Studies (3 years)', subtitle: 'Degree in Journalism/Mass Comm', description: 'BJMC from top colleges. Alternatively, any graduation followed by PG Diploma in Journalism.' },
            { title: 'Internships & Projects', subtitle: 'Build Portfolio', description: 'Intern at newspapers, TV channels, or digital platforms. Build a portfolio of published work.' },
            { title: 'First Job', subtitle: 'Start Reporting', description: 'Join as reporter, sub-editor, or content writer. Specialize in politics, sports, tech, or investigative journalism.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-18 LPA', senior: '25-50+ LPA' },
        salaryNote: 'Top TV anchors and editors earn in crores. Digital media offers faster growth opportunities.',
        exams: ['IIMC entrance exam', 'University entrance tests', 'ACJ Chennai exam'],
        collegesIndia: ['IIMC Delhi', 'Asian College of Journalism', 'Xavier Institute Bombay', 'Jamia Millia', 'Symbiosis'],
        collegesGlobal: ['Columbia Journalism School, USA', 'Northwestern Medill, USA', 'Cardiff University, UK'],
        degrees: ['BA in Journalism', 'BJMC', 'PG Diploma in Journalism', 'MA Mass Communication'],
        relatedCareers: ['content-creator', 'public-relations', 'film-director'],
        didYouKnow: ['Data Journalist', 'Podcaster', 'Fact-Checker', 'Documentary Producer'],
        goodStuff: ['Be first to know and report news', 'Make a difference through stories', 'Meet interesting people', 'Never a boring day'],
        challenges: ['Low initial pay', 'Long and irregular hours', 'Safety concerns in some beats', 'Traditional media is declining']
    },
    {
        slug: 'content-creator',
        title: 'Content Creator/YouTuber',
        category: 'Arts & Entertainment',
        categoryColor: 'bg-rose-100 text-rose-700',
        shortDescription: "You'd create engaging videos, posts, and content that entertains, educates, or inspires audiences online.",
        fullDescription: "Content Creators are the new media moguls. They build audiences on YouTube, Instagram, and other platforms, creating content that ranges from entertainment to education. It's a career where creativity meets entrepreneurship.",
        keywords: ['youtube', 'content creator', 'influencer', 'social media', 'video', 'instagram', 'creator', 'vlog'],
        roadmap: [
            { title: 'Start Creating', subtitle: 'Pick Your Niche', description: 'Choose a niche you are passionate about - tech, gaming, education, comedy, lifestyle. Start creating content on YouTube/Instagram.' },
            { title: 'Build Skills', subtitle: 'Learn the Craft', description: 'Learn video editing, scripting, thumbnail design, and camera presence. Take online courses or learn by doing.' },
            { title: 'Grow Audience', subtitle: 'Consistency is Key', description: 'Post regularly, engage with audience, study analytics. Collaborate with other creators. Takes 1-3 years to build meaningful following.' },
            { title: 'Monetize', subtitle: 'Turn Passion to Profession', description: 'Earn through ads, sponsorships, merchandise, courses, and brand deals. Diversify income streams.' }
        ],
        salary: { entry: '0-5 LPA', mid: '10-50 LPA', senior: '1 Cr - 50 Cr+' },
        salaryNote: 'Highly variable. Top creators earn in crores. Most struggle initially. Combination of talent, consistency, and luck required.',
        exams: ['No exams needed'],
        collegesIndia: ['No formal degree required. Film & Media courses can help from MICA, Manipal, etc.'],
        collegesGlobal: ['YouTube Creator Academy (free)', 'Skillshare courses'],
        degrees: ['No degree required. Courses in Video Production, Digital Marketing can help'],
        relatedCareers: ['journalist', 'graphic-designer', 'digital-marketer'],
        didYouKnow: ['Podcaster', 'Live Streamer', 'Short-form Creator', 'Educational Content Expert'],
        goodStuff: ['Be your own boss', 'Creative freedom', 'Potential for massive earnings', 'Connect with millions'],
        challenges: ['No guaranteed income', 'Algorithm changes can hurt', 'Burnout from constant content pressure', 'Online criticism and trolling']
    },
    {
        slug: 'graphic-designer',
        title: 'Graphic Designer',
        category: 'Creative & Design',
        categoryColor: 'bg-pink-100 text-pink-700',
        shortDescription: "You'd create visual content that communicates ideas - from logos and branding to social media and packaging.",
        fullDescription: "Graphic Designers are visual storytellers. They create logos, branding, advertisements, packaging, website graphics, and more. It's a career where artistic ability meets commercial application.",
        keywords: ['graphic design', 'design', 'logo', 'branding', 'photoshop', 'illustrator', 'creative', 'visual'],
        roadmap: [
            { title: 'High School', subtitle: 'Develop Artistic Skills', description: 'Any stream works. Practice drawing, learn design basics. Start using Canva, Photoshop, or Illustrator.' },
            { title: 'Design Degree (3-4 years)', subtitle: 'Formal Training', description: 'B.Des in Graphic/Communication Design. Portfolio matters more than specific degree. Online courses can also work.' },
            { title: 'Build Portfolio', subtitle: 'Show Your Work', description: 'Create diverse projects. Do freelance work. Build an impressive portfolio on Behance or Dribbble.' },
            { title: 'First Job/Freelance', subtitle: 'Start Career', description: 'Join design agencies, startups, or go freelance. Specialize in branding, UI, or motion graphics.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-18 LPA', senior: '25-50+ LPA' },
        exams: ['NID DAT (for NID)', 'UCEED (for IIT)', 'College-specific entrance tests'],
        collegesIndia: ['NID Ahmedabad', 'IIT Bombay IDC', 'Srishti Bangalore', 'Pearl Academy'],
        collegesGlobal: ['RISD, USA', 'Parsons, USA', 'Central Saint Martins, UK'],
        degrees: ['B.Des in Graphic Design', 'BA in Graphic Design', 'Diploma in Digital Design'],
        relatedCareers: ['ux-designer', 'content-creator', 'brand-strategist'],
        didYouKnow: ['Motion Graphics Artist', 'Packaging Designer', 'Brand Identity Specialist', 'Illustrator'],
        goodStuff: ['Creative daily work', 'Freelance flexibility', 'Every business needs designers', 'Tangible output of your creativity'],
        challenges: ['Subjective client feedback', 'Tight deadlines', 'Constantly evolving trends', 'Rates can be low for beginners']
    },
    {
        slug: 'hotel-management',
        title: 'Hotel Manager',
        category: 'Business & Finance',
        categoryColor: 'bg-amber-100 text-amber-700',
        shortDescription: "You'd run hotels, restaurants, and hospitality businesses, ensuring guests have memorable experiences.",
        fullDescription: "Hotel Management professionals oversee all aspects of hospitality operations - from front desk to housekeeping, food service to events. It's a dynamic career in one of the world's largest industries.",
        keywords: ['hotel', 'hospitality', 'tourism', 'chef', 'restaurant', 'travel', 'management', 'ihcl'],
        roadmap: [
            { title: 'High School', subtitle: 'Any Stream', description: 'Any stream works. Develop communication skills and interest in hospitality. Travel exposure helps.' },
            { title: 'Hotel Management Entrance', subtitle: 'Clear NCHMCT JEE', description: 'NCHMCT JEE for IHMs. Some private colleges have their own entrance tests.' },
            { title: 'B.Sc. in Hotel Management (3 years)', subtitle: 'HM Degree', description: 'Learn food production, F&B service, front office, housekeeping, and management. Industrial training is mandatory.' },
            { title: 'Industry Experience', subtitle: 'Start Working', description: 'Join hotels like Taj, Oberoi, Marriott. Start from operational roles and work up to management positions.' }
        ],
        salary: { entry: '3-5 LPA', mid: '8-15 LPA', senior: '25-50+ LPA' },
        salaryNote: 'General Managers of 5-star hotels earn significantly more. International postings offer better packages.',
        exams: ['NCHMCT JEE', 'NCHM entrance exams'],
        collegesIndia: ['IHM Mumbai', 'IHM Delhi', 'IHM Bangalore', 'Welcomgroup Graduate School'],
        collegesGlobal: ['EHL Switzerland', 'Cornell Hotel School, USA', 'Les Roches Switzerland'],
        degrees: ['B.Sc. Hotel Management', 'BA in Hospitality', 'MBA in Hospitality'],
        relatedCareers: ['chef', 'event-manager', 'travel-consultant'],
        didYouKnow: ['Executive Chef', 'Cruise Ship Manager', 'Resort Manager', 'Hospitality Entrepreneur'],
        goodStuff: ['Travel and see the world', 'Meet diverse people', 'Multiple career paths', 'Can work anywhere globally'],
        challenges: ['Long working hours', 'Weekend and holiday work', 'Physically demanding initially', 'Career growth can be slow']
    },
    {
        slug: 'pilot',
        title: 'Commercial Pilot',
        category: 'Engineering',
        categoryColor: 'bg-orange-100 text-orange-700',
        shortDescription: "You'd fly aircraft, transporting passengers and cargo across the world while ensuring safety at 35,000 feet.",
        fullDescription: "Commercial Pilots command aircraft, making split-second decisions and ensuring the safety of hundreds of passengers. It's one of the most prestigious and well-paid careers, combining technical skill with adventure.",
        keywords: ['pilot', 'aviation', 'flying', 'airline', 'aircraft', 'captain', 'cockpit', 'indigo', 'airindia'],
        roadmap: [
            { title: 'High School (Class 12)', subtitle: 'PCM Stream', description: 'Take Physics, Chemistry, Math. Good grades required. English proficiency is essential.' },
            { title: 'Medical & Aptitude', subtitle: 'Clear DGCA Medical', description: 'Pass Class 1 Medical exam from DGCA-approved hospital. Clear pilot aptitude tests.' },
            { title: 'Flight Training (1.5-2 years)', subtitle: 'Get CPL License', description: 'Join flying school (Indira Gandhi Rashtriya Uran Akademi, private schools, or abroad). Get Commercial Pilot License with 200+ flying hours.' },
            { title: 'Type Rating & Job', subtitle: 'Join Airline', description: 'Get type rating on specific aircraft (Boeing/Airbus). Apply to airlines. Start as First Officer, become Captain after experience.' }
        ],
        salary: { entry: '12-20 LPA', mid: '30-50 LPA', senior: '60-120+ LPA' },
        salaryNote: 'Captains of international routes at major airlines earn very well. Plus benefits like travel perks.',
        exams: ['DGCA CPL exams', 'Airline selection processes'],
        collegesIndia: ['IGRUA Rae Bareli', 'CAE Oxford', 'Indigo Cadet Program', 'Air India Academy'],
        collegesGlobal: ['CAE Oxford Aviation Academy', 'Emirates Flight Training Academy', 'Lufthansa Aviation Training'],
        degrees: ['Commercial Pilot License (CPL)', 'ATPL (Airline Transport Pilot License)'],
        relatedCareers: ['aerospace-engineer', 'air-traffic-controller', 'flight-engineer'],
        didYouKnow: ['Charter Pilot', 'Flight Instructor', 'Helicopter Pilot', 'Bush Pilot'],
        goodStuff: ['Excellent salary and perks', 'Travel the world', 'Prestigious career', 'Structured career progression'],
        challenges: ['Very expensive training (₹40-80 lakhs)', 'Medical fitness mandatory throughout career', 'Irregular schedules affect personal life', 'Job market can be cyclical']
    },
    {
        slug: 'ethical-hacker',
        title: 'Ethical Hacker/Cybersecurity',
        category: 'Technology & IT',
        categoryColor: 'bg-purple-100 text-purple-700',
        shortDescription: "You'd protect systems by finding vulnerabilities before malicious hackers do, making the digital world safer.",
        fullDescription: "Ethical Hackers are the white-hat defenders of the digital world. They use hacker techniques to find and fix security vulnerabilities in systems, networks, and applications. With rising cyber threats, this career is more important than ever.",
        keywords: ['hacker', 'cybersecurity', 'security', 'hacking', 'penetration testing', 'infosec', 'cyber'],
        roadmap: [
            { title: 'High School', subtitle: 'Build Tech Foundation', description: 'Learn programming, networking basics. Participate in CTF (Capture The Flag) competitions. Any stream works.' },
            { title: 'Undergraduate Studies', subtitle: 'CS or Related Degree', description: 'B.Tech in Computer Science or Information Security. Learn operating systems, networking, and programming deeply.' },
            { title: 'Certifications', subtitle: 'Get Industry Certs', description: 'CEH (Certified Ethical Hacker), OSCP, CompTIA Security+ are highly valued. Practice on platforms like HackTheBox, TryHackMe.' },
            { title: 'First Job', subtitle: 'Start Security Career', description: 'Join as Security Analyst, Penetration Tester, or SOC Analyst. Specialize in web, network, or cloud security.' }
        ],
        salary: { entry: '6-12 LPA', mid: '15-35 LPA', senior: '50-100+ LPA' },
        exams: ['No specific entrance exams. Certifications matter more.'],
        collegesIndia: ['IITs', 'NITs', 'IIIT Allahabad', 'VIT', 'Amrita'],
        collegesGlobal: ['CMU, USA', 'Georgia Tech, USA', 'SANS Institute courses'],
        degrees: ['B.Tech in CS/IT', 'M.Tech in Cybersecurity', 'Industry Certifications (CEH, OSCP, CISSP)'],
        relatedCareers: ['software-developer', 'data-scientist', 'network-engineer'],
        didYouKnow: ['Bug Bounty Hunter', 'Malware Analyst', 'Digital Forensics Expert', 'Cloud Security Architect'],
        goodStuff: ['High demand and salaries', 'Intellectually challenging', 'Can work remotely', 'Bug bounties can pay well'],
        challenges: ['Constantly evolving threats', 'Need to think like attackers', 'High responsibility', 'Can be stressful during incidents']
    },
    {
        slug: 'game-developer',
        title: 'Game Developer',
        category: 'Technology & IT',
        categoryColor: 'bg-purple-100 text-purple-700',
        shortDescription: "You'd create video games that entertain millions, combining programming, art, and storytelling.",
        fullDescription: "Game Developers bring virtual worlds to life. They program game mechanics, design levels, create characters, and craft interactive experiences. It's where technical skills meet creative storytelling in one of the fastest-growing entertainment industries.",
        keywords: ['game', 'gaming', 'developer', 'unity', 'unreal', 'esports', 'video game', 'programmer'],
        roadmap: [
            { title: 'High School', subtitle: 'Start Making Games', description: 'Learn programming (C++, C#). Download Unity or Unreal Engine and start experimenting. Create simple games.' },
            { title: 'Undergraduate Studies', subtitle: 'CS or Game Development', description: 'B.Tech in Computer Science with focus on game development, or specialized game design programs.' },
            { title: 'Build Portfolio', subtitle: 'Create Games', description: 'Develop indie games, participate in game jams, build a strong portfolio on itch.io or Steam. Personal projects matter most.' },
            { title: 'Industry Job', subtitle: 'Join a Studio', description: 'Apply to game studios (Ubisoft, EA, KRAFTON, Indian studios). Start as Junior Developer and specialize in gameplay, graphics, or AI.' }
        ],
        salary: { entry: '5-12 LPA', mid: '15-35 LPA', senior: '40-80+ LPA' },
        exams: ['No specific exams. Portfolio and skills matter.'],
        collegesIndia: ['IIT Bombay', 'IIIT Hyderabad', 'DSK Supinfogame Pune', 'MIT Pune'],
        collegesGlobal: ['USC Games, USA', 'DigiPen, USA', 'Breda University Netherlands'],
        degrees: ['B.Tech in CS', 'B.Des in Game Design', 'Specialized Game Development Diplomas'],
        relatedCareers: ['software-developer', 'animator', 'ux-designer'],
        didYouKnow: ['Level Designer', 'Game AI Programmer', 'VR/AR Developer', 'Technical Artist'],
        goodStuff: ['Turn passion for games into career', 'Creative and technical blend', 'Growing industry in India', 'Remote work opportunities'],
        challenges: ['Crunch culture in studios', 'Can be competitive', 'Indie games are financially risky', 'Long development cycles']
    },
    {
        slug: 'teacher-educator',
        title: 'Teacher/Educator',
        category: 'Education',
        categoryColor: 'bg-teal-100 text-teal-700',
        shortDescription: "You'd shape young minds, inspiring students and passing on knowledge that changes lives.",
        fullDescription: "Teachers are the architects of society. They educate, inspire, and mentor the next generation. From school teachers to college professors, ed-tech instructors to curriculum designers - education offers diverse paths to make a lasting impact.",
        keywords: ['teacher', 'education', 'teaching', 'school', 'professor', 'tutor', 'edtech', 'learning'],
        roadmap: [
            { title: 'High School', subtitle: 'Choose Your Subject', description: 'Excel in the subject you want to teach. Any stream works based on subject preference.' },
            { title: 'Undergraduate Degree', subtitle: 'Subject Expertise', description: 'BA/B.Sc./B.Com in your chosen subject. Strong content knowledge is essential.' },
            { title: 'B.Ed (2 years)', subtitle: 'Teaching Qualification', description: 'Bachelor of Education is mandatory for school teaching. Some states accept D.El.Ed for primary. NET/SET for college.' },
            { title: 'Teaching Job', subtitle: 'Start Teaching', description: 'Join schools (government through TET/CTET, or private). Or teach in coaching institutes, online platforms, or start tutoring.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-15 LPA', senior: '20-40+ LPA' },
        salaryNote: 'Government school teachers have better job security and benefits. College professors and IIT/IIM faculty earn significantly more.',
        exams: ['CTET/TET for school teaching', 'UGC NET for college teaching', 'State recruitment exams'],
        collegesIndia: ['Regional Institutes of Education', 'NCERT', 'Lady Shri Ram', 'Christ University'],
        collegesGlobal: ['Stanford Education, USA', 'Harvard GSE, USA', 'UCL IOE, UK'],
        degrees: ['B.Ed', 'M.Ed', 'D.El.Ed', 'Ph.D. for higher education'],
        relatedCareers: ['psychologist', 'content-creator', 'curriculum-designer'],
        didYouKnow: ['EdTech Content Creator', 'Curriculum Designer', 'School Administrator', 'Special Educator'],
        goodStuff: ['Shape future generations', 'Job satisfaction and purpose', 'Government jobs offer stability', 'Long vacations'],
        challenges: ['Initial pay can be low', 'Government recruitment is competitive', 'Large class sizes are challenging', 'Parents can be demanding']
    },
    {
        slug: 'wildlife-biologist',
        title: 'Wildlife Biologist',
        category: 'Science & Research',
        categoryColor: 'bg-blue-100 text-blue-700',
        shortDescription: "You'd study animals in their natural habitats, working to protect endangered species and ecosystems.",
        fullDescription: "Wildlife Biologists are the guardians of the animal kingdom. They study wildlife behavior, ecology, and conservation. From tracking tigers to saving sea turtles, it's a career for those who love nature and want to protect it.",
        keywords: ['wildlife', 'animals', 'conservation', 'biology', 'nature', 'forest', 'ecology', 'environment'],
        roadmap: [
            { title: 'High School', subtitle: 'PCB Stream', description: 'Take Biology with Physics and Chemistry. Develop love for nature through wildlife documentaries, bird watching, and nature camps.' },
            { title: 'Undergraduate Studies (3-4 years)', subtitle: 'Life Sciences Degree', description: 'B.Sc. in Zoology, Wildlife Science, Environmental Science, or Forestry. Field experience during studies is valuable.' },
            { title: 'Masters (2 years)', subtitle: 'Specialization', description: 'M.Sc. in Wildlife Science, Conservation Biology, or Ecology from WII Dehradun, NCBS, or similar institutes.' },
            { title: 'Research or Conservation Work', subtitle: 'Start Career', description: 'Join WWF, Wildlife Trust, Forest Department, research institutions, or pursue Ph.D. for academic positions.' }
        ],
        salary: { entry: '3-6 LPA', mid: '8-15 LPA', senior: '20-35+ LPA' },
        salaryNote: 'Passion-driven career. International conservation organizations pay better. Grant-based work is common.',
        exams: ['University entrance exams', 'WII entrance for M.Sc.', 'Indian Forest Service (optional)'],
        collegesIndia: ['Wildlife Institute of India Dehradun', 'NCBS Bangalore', 'FRI Dehradun', 'SACON Coimbatore'],
        collegesGlobal: ['Oxford Wildlife Conservation, UK', 'Duke University, USA', 'University of Florida, USA'],
        degrees: ['B.Sc. Zoology/Wildlife', 'M.Sc. Wildlife Science', 'Ph.D. in Conservation Biology'],
        relatedCareers: ['biotechnologist', 'environmental-scientist', 'forest-officer'],
        didYouKnow: ['Wildlife Photographer', 'Conservation Policy Expert', 'Marine Biologist', 'Eco-tourism Specialist'],
        goodStuff: ['Work in beautiful natural settings', 'Protect endangered species', 'Contribute to global conservation', 'Adventure in daily work'],
        challenges: ['Low initial salary', 'Fieldwork can be physically demanding', 'Limited positions available', 'Funding for projects can be uncertain']
    },
    {
        slug: 'fashion-designer',
        title: 'Fashion Designer',
        category: 'Creative & Design',
        categoryColor: 'bg-pink-100 text-pink-700',
        shortDescription: "You'd create clothing and accessories that express style, culture, and personal identity.",
        fullDescription: "Fashion Designers conceptualize and create clothing, footwear, and accessories. From haute couture to street fashion, sustainable fashion to costume design - it's a career that blends creativity with an understanding of culture, trends, and business.",
        keywords: ['fashion', 'design', 'clothing', 'style', 'nift', 'textile', 'apparel', 'designer'],
        roadmap: [
            { title: 'High School', subtitle: 'Develop Creative Skills', description: 'Any stream works. Practice sketching, learn about fabrics and fashion history. Develop a sense of style.' },
            { title: 'Design Entrance Exams', subtitle: 'Clear NIFT/NID', description: 'NIFT entrance exam (CAT + GAT + Situation Test). NID DAT for product design. Private college entrances.' },
            { title: 'Fashion Design Degree (4 years)', subtitle: 'B.Des in Fashion', description: 'Learn design, pattern making, textiles, and fashion business. Internships with fashion houses are crucial.' },
            { title: 'Industry or Entrepreneurship', subtitle: 'Start Career', description: 'Join fashion houses, retail brands, or start your own label. Specialize in bridal, casual, sustainable, or other niches.' }
        ],
        salary: { entry: '3-7 LPA', mid: '10-25 LPA', senior: '40+ LPA' },
        salaryNote: 'Established designers with own labels can earn crores. International fashion houses pay well.',
        exams: ['NIFT Entrance Exam', 'NID DAT', 'Pearl Academy entrance'],
        collegesIndia: ['NIFT Delhi', 'NID Ahmedabad', 'Pearl Academy', 'Symbiosis Institute of Design'],
        collegesGlobal: ['Parsons, USA', 'Central Saint Martins, UK', 'FIT New York', 'Istituto Marangoni, Italy'],
        degrees: ['B.Des in Fashion Design', 'Diploma in Fashion Design', 'MA Fashion'],
        relatedCareers: ['graphic-designer', 'ux-designer', 'stylist'],
        didYouKnow: ['Costume Designer', 'Fashion Stylist', 'Textile Designer', 'Sustainable Fashion Expert'],
        goodStuff: ['Creative self-expression', 'See your designs worn by people', 'Glamorous industry', 'Can build your own brand'],
        challenges: ['Highly competitive field', 'Initial years can be low-paying', 'Fast-changing trends', 'Long hours before fashion weeks']
    }
];

// Quick interest chips for career finder
export const INTEREST_CHIPS = [
    { label: 'Science', keywords: ['science', 'research', 'physics', 'chemistry'] },
    { label: 'Technology', keywords: ['tech', 'coding', 'programming', 'software', 'ai'] },
    { label: 'Medicine', keywords: ['doctor', 'medicine', 'healthcare', 'medical'] },
    { label: 'Business', keywords: ['business', 'finance', 'management', 'money'] },
    { label: 'Arts', keywords: ['art', 'creative', 'design', 'drawing', 'film'] },
    { label: 'Law', keywords: ['law', 'lawyer', 'legal', 'justice', 'government'] },
    { label: 'Sports', keywords: ['sports', 'fitness', 'athlete', 'games'] },
    { label: 'Space', keywords: ['space', 'astronomy', 'rockets', 'isro', 'nasa'] },
];
