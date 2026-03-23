-- Migration to create career_directory table
create table career_directory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  subcategory text,
  stream_required text not null,
  short_description text not null,
  full_description text not null,
  what_you_do text not null,
  is_this_for_you text not null,
  how_to_prepare_in_school text not null,
  salary_entry text not null,
  salary_mid text not null,
  salary_senior text not null,
  salary_global text,
  entrance_exams text[],
  degree_required text not null,
  duration text not null,
  colleges_india text[],
  colleges_global text[],
  top_employers text[],
  skills_needed text[],
  rarity_level text not null, -- Common, Rare, Very Rare
  demand_level text not null, -- High, Medium, Low
  competition_level text not null, -- High, Medium, Low
  tags text[],
  related_careers text[],
  is_published boolean default true,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_career_category on career_directory(category);
create index idx_career_stream on career_directory(stream_required);
create index idx_career_rarity on career_directory(rarity_level);

-- RLS Policies
alter table career_directory enable row level security;

create policy "Allow public read access for published careers"
on career_directory for select
to public
using (is_published = true);

create policy "Allow all access for authenticated admins"
on career_directory for all
to authenticated
using (true)
with check (true);
