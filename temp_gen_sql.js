const fs = require('fs');

const csvPath = 'c:\\Users\\mahendra.singh\\myark\\myark_olympiad_complete_database.csv';

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
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
    try {
        const [
            sNo, title, shortName, organiser, type, eligibilityClass, 
            regOpens, regCloses, examDate, results, fee, prizes, 
            regProcess, website, level, pathway, shortDesc, tags, 
            confidence, slug
          ] = row;
        
          let subject = 'Other';
          const typeLower = (type || '').toLowerCase();
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
        
          const isFree = (fee || '').toLowerCase().includes('free') || (fee || '').toLowerCase().includes('nil');
          const govKeywords = ['HBCSE', 'ISRO', 'NCERT', 'CBSE', 'GSI', 'NCMS', 'TIFR', 'MTA', 'IAPT'];
          const isGovernment = govKeywords.some(key => (organiser || '').includes(key));
          const isInternational = (level || '').toLowerCase().includes('international');
          const isSchool = (regProcess || '').toLowerCase().includes('school');
          const isIndividual = (regProcess || '').toLowerCase().includes('individual') || (regProcess || '').toLowerCase().includes('at indiantalent.org') || (regProcess || '').toLowerCase().includes('crestolympiads.com');
          const isOnline = (regProcess || '').toLowerCase().includes('online') || (shortDesc || '').toLowerCase().includes('online') || (regProcess || '').toLowerCase().includes('from home');
        
          let organiserGroup = 'Other India Olympiads';
          if ((organiser || '').includes('HBCSE') || (organiser || '').includes('IAPT') || (organiser || '').includes('MTA')) organiserGroup = 'HBCSE / IAPT';
          else if ((organiser || '').includes('Science Olympiad Foundation')) organiserGroup = 'SOF';
          else if ((organiser || '').includes('Silverzone')) organiserGroup = 'Silverzone';
          else if ((organiser || '').includes('Unified Council')) organiserGroup = 'Unified Council';
          else if (isInternational && !isGovernment) organiserGroup = 'International Olympiads';
        
          const regMonth = regOpens && regCloses ? `${regOpens.split(' ')[0]}–${regCloses.split(' ')[0]}` : (regOpens || 'TBD');
        
          return {
            name: (title || '').replace(/'/g, "''"),
            short_name: (shortName || '').replace(/'/g, "''"),
            slug: (slug || '').replace(/'/g, "''"),
            organiser: (organiser || '').replace(/'/g, "''"),
            type: (type || '').replace(/'/g, "''"),
            eligibility_classes: (eligibilityClass || '').replace(/'/g, "''"),
            registration_month: regMonth.replace(/'/g, "''"),
            exam_month: (examDate || '').replace(/'/g, "''"),
            fee: (fee || '').replace(/'/g, "''"),
            prizes: (prizes || '').replace(/'/g, "''"),
            website: (website || '').replace(/'/g, "''"),
            level: (level || '').replace(/'/g, "''"),
            pathway: (pathway || '').replace(/'/g, "''"),
            short_description: (shortDesc || '').replace(/'/g, "''"),
            description: (shortDesc || '').replace(/'/g, "''"),
            registration_process: (regProcess || '').replace(/'/g, "''"),
            tags: (tags || '').split(',').map(t => t.trim().replace(/'/g, "''")),
            subject: subject,
            is_school_registration: isSchool,
            is_individual_registration: isIndividual,
            is_online: isOnline,
            is_free: isFree,
            is_government: isGovernment,
            is_international: isInternational,
            difficulty: 'Medium',
            organiser_group: organiserGroup,
            is_published: true
          };
    } catch (e) {
        console.error('Error parsing row:', row);
        return null;
    }
}).filter(Boolean);

let sql = "INSERT INTO olympiad_directory (name, short_name, slug, organiser, type, eligibility_classes, registration_month, exam_month, fee, prizes, website, level, pathway, short_description, description, registration_process, tags, subject, is_school_registration, is_individual_registration, is_online, is_free, is_government, is_international, difficulty, organiser_group, is_published) VALUES\n";

data.forEach((item, index) => {
  const tagsStr = `ARRAY['${item.tags.join("', '")}']`;
  sql += `('${item.name}', '${item.short_name}', '${item.slug}', '${item.organiser}', '${item.type}', '${item.eligibility_classes}', '${item.registration_month}', '${item.exam_month}', '${item.fee}', '${item.prizes}', '${item.website}', '${item.level}', '${item.pathway}', '${item.short_description}', '${item.description}', '${item.registration_process}', ${tagsStr}, '${item.subject}', ${item.is_school_registration}, ${item.is_individual_registration}, ${item.is_online}, ${item.is_free}, ${item.is_government}, ${item.is_international}, '${item.difficulty}', '${item.organiser_group}', ${item.is_published})${index === data.length - 1 ? ';' : ',\n'}`;
});

fs.writeFileSync('c:\\Users\\mahendra.singh\\myark\\supabase\\seed_olympiads.sql', sql);
console.log('Seed SQL file generated successfully at supabase/seed_olympiads.sql');
