import json

with open('careers_full.json', 'r', encoding='utf-8') as f:
    careers = json.load(f)

sql_lines = []
sql_lines.append("DELETE FROM career_directory;") # Careful!

for c in careers:
    # Escape single quotes for SQL
    def esc(val):
        if val is None: return "NULL"
        if isinstance(val, str):
            res = val.replace("'", "''")
            return f"'{res}'"
        if isinstance(val, list):
            res = [v.replace("'", "''") for v in val]
            items = ", ".join([f"'{v}'" for v in res])
            return f"ARRAY[{items}]"
        return str(val)

    # I'll use a dictionary to ensure correct order
    cols = [
        "name", "slug", "category", "stream_required", "short_description", 
        "full_description", "what_you_do", "is_this_for_you", "how_to_prepare_in_school", 
        "salary_entry", "salary_mid", "salary_senior", "entrance_exams", 
        "degree_required", "duration", "rarity_level", "demand_level", 
        "competition_level", "is_published"
    ]
    
    vals = [esc(c.get(col)) for col in cols]
    
    sql = f"INSERT INTO career_directory ({', '.join(cols)}) VALUES ({', '.join(vals)});"
    sql_lines.append(sql)

with open('careers_seed.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"Generated seed for {len(careers)} careers.")
