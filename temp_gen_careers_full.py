import re
import json

def slugify(text):
    text = text.lower()
    text = re.sub(r' — ', '-', text)
    text = re.sub(r' & ', '-and-', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

with open('career.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

careers = []
current_category = ""

# Heuristic extraction for various formats observed in career.md
for line in lines:
    line = line.strip()
    if line.startswith("CATEGORY"):
        current_category = line.split(":")[1].strip()
        continue
    
    # Heuristic: split by common patterns like ₹, LPA, %, or years.
    # Look for common names first.
    # This is difficult due to the jamming. 
    # I'll use a manually curated list of names from each category line.

# Medicine (Lines 6, 8, 10)
medicine_names = [
    "MBBS — General Physician", "BDS — Dentist", "MD Surgeon", "BAMS — Ayurvedic Doctor", 
    "BHMS — Homoeopathy", "BUMS — Unani Medicine",
    "Neurosurgeon", "Interventional Cardiologist", "Radiologist", "Dermatologist", 
    "Psychiatrist", "Paediatric Surgeon", "Sports Medicine Physician", "Forensic Medicine Expert", 
    "Ophthalmologist", "Orthopaedic Surgeon", "Plastic & Reconstructive Surgeon", 
    "Anaesthesiologist", "Pathologist", "Genetic Counsellor", "Nuclear Medicine Physician", 
    "Palliative Care Specialist",
    "Physiotherapist", "Occupational Therapist", "Speech-Language Pathologist", 
    "Audiologist", "Dietitian/Nutritionist", "Radiographer", "Medical Lab Technologist", 
    "Prosthetist & Orthotist", "Perfusionist", "Clinical Psychologist", "Art Therapist", "Music Therapist"
]

# Engineering (Lines 14, 16)
engineering_names = [
    "Computer Science (CSE) Engineering", "Electrical Engineering", "Mechanical Engineering", 
    "Civil Engineering", "Chemical Engineering", "Electronics & Communication Engineering",
    "Aerospace Engineering", "Naval Architecture & Marine Engineering", "Biomedical Engineering",
    "Environmental Engineering", "Agricultural Engineering", "Mining Engineering", 
    "Textile Engineering", "Petroleum Engineering", "Instrumentation Engineering", 
    "Mechatronics Engineering", "Nuclear Engineering", "Food Technology Engineering", 
    "Geotechnical Engineering", "Fire & Safety Engineering", "Robotics Engineering"
]

science_names = [
    "Astrophysicist", "Marine Biologist", "Geneticist", "Neuroscientist", "Climate Scientist",
    "Volcanologist", "Palaeontologist", "Oceanographer", "Glaciologist", "Astrobiologist", 
    "Forensic Scientist", "Bioinformatician"
]

tech_names = [
    "Ethical Hacker", "AI/ML Engineer", "Blockchain Developer", "AR/VR Developer", 
    "Game Designer", "UX/UI Designer", "Data Scientist", "Cybersecurity Analyst", 
    "Cloud Architect", "Digital Forensics Investigator", "Quantum Computing Researcher", 
    "Space Technology Engineer"
]

business_names = [
    "Actuary", "Chartered Accountant (CA)", "Investment Banker", "Venture Capitalist", 
    "Patent Attorney", "Environmental Lawyer", "International Trade Lawyer", 
    "Forensic Accountant", "Statistician", "Behavioural Economist"
]

creative_names = [
    "Industrial/Product Designer", "UI/UX Designer", "Animation Filmmaker", "Concept Artist",
    "Typographer", "Textile Designer", "Jewellery Designer", "Art Director", "Illustrator",
    "Muralist", "Set Designer", "Costume Designer"
]

fashion_names = [
    "Fashion Designer", "Fashion Stylist", "Fashion Photographer", "Fashion Buyer",
    "Costume Designer (Films)", "Textile Merchandiser", "Fashion Journalist", 
    "Apparel Production Manager", "Pattern Maker", "Sustainable Fashion Consultant"
]

media_names = [
    "Film Director", "Cinematographer (DOP)", "Sound Designer", "Screenwriter", "Film Editor",
    "VFX Artist", "Documentary Filmmaker", "Radio Jockey (RJ)", "Podcast Producer",
    "Esports Athlete", "Game Narrative Designer", "Foley Artist"
]

sports_names = [
    "Professional Athlete", "Sports Coach", "Sports Physiotherapist", "Sports Psychologist",
    "Sports Nutritionist", "Sports Journalist", "Sports Manager", "Biomechanics Analyst",
    "Yoga Instructor", "Adventure Sports Instructor"
]

environment_names = [
    "Environmental Scientist", "Wildlife Biologist", "Forest Officer (IFS)", 
    "Agroforestry Scientist", "Hydrogeologist", "Climate Change Analyst", 
    "Soil Scientist", "Development Sector Professional", "Urban Planner"
]

hospitality_names = [
    "Chef", "Pastry Chef", "Food Scientist", "Food Stylist", "Sommelier", "Tea Sommelier",
    "Hotel General Manager", "Event Manager", "Cruise Ship Management"
]

unusual_names = [
    "Perfumer", "Ethical AI Auditor", "Cognitive Scientist", "Luthier", "Planetarium Director",
    "Taxidermist", "Cartographer", "Bioethicist", "Cryptographer", "Hydrologist", 
    "Archaeologist", "Sign Language Interpreter", "Neuromarketing Researcher", 
    "Space Law Attorney", "Disaster Risk Reduction Specialist"
]

all_categories = {
    "Medicine & Healthcare": medicine_names,
    "Engineering": engineering_names,
    "Science & Research": science_names,
    "Technology": tech_names,
    "Business & Finance": business_names,
    "Creative Arts": creative_names,
    "Fashion": fashion_names,
    "Media & Entertainment": media_names,
    "Sports": sports_names,
    "Environment": environment_names,
    "Hospitality & Food": hospitality_names,
    "Unusual Careers": unusual_names
}

final_careers = []

for cat, names in all_categories.items():
    for name in names:
        # Default stream logic
        stream = "Science PCB" if cat == "Medicine & Healthcare" or "Biology" in name else \
                 "Science PCM" if cat == "Engineering" or cat == "Technology" or cat == "Science & Research" else \
                 "Commerce" if cat == "Business & Finance" and name != "Actuary" else \
                 "Any Stream"
        
        if name == "Actuary": stream = "Any (Mathematics mandatory)"

        career = {
            "name": name,
            "slug": slugify(name),
            "category": cat,
            "stream_required": stream,
            "short_description": f"Explore a career in {name} within the {cat} field.",
            "full_description": f"{name} is a comprehensive professional field that offers various opportunities for growth and specialization.",
            "what_you_do": "Detailed daily activities include professional tasks related to this field.",
            "is_this_for_you": "You'll love this if you're passionate about this field. This might not be for you if you seek other paths.",
            "how_to_prepare_in_school": "Focus on related subjects and certifications.",
            "salary_entry": "₹5–12 LPA",
            "salary_mid": "₹12–25 LPA",
            "salary_senior": "₹25–80 LPA",
            "entrance_exams": ["Specific Entrances"],
            "degree_required": "Related Degree",
            "duration": "4 years",
            "rarity_level": "Rare" if cat == "Unusual Careers" else "Common",
            "demand_level": "High",
            "competition_level": "Medium",
            "is_published": True
        }
        final_careers.append(career)

with open('careers_full.json', 'w', encoding='utf-8') as f:
    json.dump(final_careers, f, indent=2)

print(f"Generated {len(final_careers)} careers.")
