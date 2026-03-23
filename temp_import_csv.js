const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kfsvsgciuvdaddaxxmgo.supabase.co';
const supabaseKey = 'sb_publishable_eOl7wkmR_LzjZAGRe2-2TA_1dfcpNPb'; // Using the key provided
const supabase = createClient(supabaseUrl, supabaseKey);

const csvPath = 'c:\\Users\\mahendra.singh\\myark\\myark_olympiad_complete_database.csv';

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  // Custom CSV parser because some fields contain commas within quotes
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"' && !inQuotes) inQuotes = true;
      else if (char === '"' && inQuotes) inQuotes = false;
      else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    results.push(row);
  }
  return results;
}

const rows = parseCSV(csvPath);

const data = rows.map(row => {
  const [
    sNo, title, shortName, organiser, type, eligibilityClass, 
    regOpens, regCloses, examDate, results, fee, prizes, 
    regProcess, website, level, pathway, shortDesc, tags, 
    confidence, slug
  ] = row;

  // DERIVED FIELDS
  // Subject mapping
  let subject = 'Other';
  const typeLower = type.toLowerCase();
  if (typeLower.includes('math')) subject = 'Mathematics';
  else if (typeLower.includes('science') || typeLower.includes('physics') || typeLower.includes('chemistry') || typeLower.includes('biology')) subject = 'Science';
  else if (typeLower.includes('english')) subject = 'English';
  else if (typeLower.includes('computer') || typeLower.includes('computing') || typeLower.includes('cyber')) subject = 'Computer Science';
  else if (typeLower.includes('astronomy')) subject = 'Astronomy';
  else if (typeLower.includes('gk') || typeLower.includes('general knowledge')) subject = 'General Knowledge';
  else if (typeLower.includes('reasoning') || typeLower.includes('aptitude')) subject = 'Reasoning';
  else if (typeLower.includes('social')) subject = 'Social Studies';
  else if (typeLower.includes('commerce')) subject = 'Commerce';
  else if (typeLower.includes('hindi')) subject = 'Hindi';

  // Booleans
  const isFree = fee.toLowerCase().includes('free') || fee.toLowerCase().includes('nil');
  const govKeywords = ['HBCSE', 'ISRO', 'NCERT', 'CBSE', 'GSI', 'NCMS', 'TIFR', 'MTA', 'IAPT'];
  const isGovernment = govKeywords.some(key => organiser.includes(key));
  const isInternational = level.toLowerCase().includes('international');
  const isSchool = regProcess.toLowerCase().includes('school');
  const isIndividual = regProcess.toLowerCase().includes('individual') || regProcess.toLowerCase().includes('at indiantalent.org') || regProcess.toLowerCase().includes('crestolympiads.com');
  const isOnline = regProcess.toLowerCase().includes('online') || shortDesc.toLowerCase().includes('online') || regProcess.toLowerCase().includes('from home');

  // Organiser Group
  let organiserGroup = 'Other India Olympiads';
  if (organiser.includes('HBCSE') || organiser.includes('IAPT') || organiser.includes('MTA')) organiserGroup = 'HBCSE / IAPT';
  else if (organiser.includes('Science Olympiad Foundation')) organiserGroup = 'SOF';
  else if (organiser.includes('Silverzone')) organiserGroup = 'Silverzone';
  else if (organiser.includes('Unified Council')) organiserGroup = 'Unified Council';
  else if (isInternational && !isGovernment) organiserGroup = 'International Olympiads';

  // Registration Month
  const regMonth = regOpens && regCloses ? `${regOpens.split(' ')[0]}–${regCloses.split(' ')[0]}` : regOpens || 'TBD';

  return {
    name: title,
    short_name: shortName,
    slug: slug,
    organiser: organiser,
    type: type,
    eligibility_classes: eligibilityClass,
    registration_month: regMonth,
    exam_month: examDate,
    fee: fee,
    prizes: prizes,
    website: website,
    level: level,
    pathway: pathway,
    short_description: shortDesc,
    description: shortDesc, // Using shortDesc as base for description as well
    registration_process: regProcess,
    tags: tags.split(',').map(t => t.trim()),
    subject: subject,
    is_school_registration: isSchool,
    is_individual_registration: isIndividual,
    is_online: isOnline,
    is_free: isFree,
    is_government: isGovernment,
    is_international: isInternational,
    difficulty: 'Medium', // Placeholder
    organiser_group: organiserGroup,
    is_published: true
  };
});

async function run() {
  console.log(`Importing ${data.length} records...`);
  const { error } = await supabase.from('olympiad_directory').insert(data);
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully imported data.');
  }
}

run();
