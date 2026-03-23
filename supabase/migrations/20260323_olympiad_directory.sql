-- Create olympiad_directory table
create table olympiad_directory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  slug text unique not null,
  organiser text not null,
  type text not null,
  eligibility_classes text not null,
  eligibility_age text,
  registration_month text,
  exam_month text,
  fee text,
  prizes text,
  website text not null,
  level text not null,
  pathway text,
  stage text,
  description text not null,
  short_description text not null,
  registration_process text,
  tags text[],
  subject text,
  is_school_registration boolean default false,
  is_individual_registration boolean default false,
  is_online boolean default false,
  is_free boolean default false,
  is_government boolean default false,
  is_international boolean default false,
  difficulty text,
  organiser_group text,
  related_opportunity_slug text,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table olympiad_directory enable row level security;

-- Create policies
create policy "Public read olympiad_directory" 
on olympiad_directory for select 
using (is_published = true);

create policy "Admin full access olympiad_directory"
on olympiad_directory for all
using (auth.role() = 'authenticated');

-- Create indexes
create index idx_olympiad_directory_slug on olympiad_directory(slug);
create index idx_olympiad_directory_subject on olympiad_directory(subject);
create index idx_olympiad_directory_organiser_group on olympiad_directory(organiser_group);
