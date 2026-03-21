-- ================================================================
-- MYARK DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Categories ─────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT DEFAULT '📋',
  bg_color TEXT NOT NULL DEFAULT '#f1efe8',
  text_color TEXT NOT NULL DEFAULT '#444441',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ── Organisers ─────────────────────────────────────────────
CREATE TABLE organisers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organisers_slug ON organisers(slug);

-- ── Opportunities ──────────────────────────────────────────
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  organiser_id UUID REFERENCES organisers(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  eligibility_classes INT[] DEFAULT '{}',
  eligibility_text TEXT DEFAULT '',
  registration_url TEXT DEFAULT '',
  registration_opens DATE,
  deadline DATE,
  is_ongoing BOOLEAN DEFAULT FALSE,
  fee_text TEXT DEFAULT 'Free',
  prize_text TEXT,
  how_to_apply TEXT DEFAULT '',
  faqs JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_opportunities_slug ON opportunities(slug);
CREATE INDEX idx_opportunities_category ON opportunities(category_id);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX idx_opportunities_published ON opportunities(is_published);
CREATE INDEX idx_opportunities_featured ON opportunities(is_featured);

-- ── Students ───────────────────────────────────────────────
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  mobile TEXT NOT NULL,
  school_name TEXT NOT NULL,
  city TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_mobile ON students(mobile);

-- ── Registrations (Student × Opportunity) ──────────────────
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  feedback_status TEXT DEFAULT 'pending', -- 'pending', 'applied', 'not_relevant', 'not_applied'
  feedback_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id)
);

CREATE INDEX idx_registrations_student ON registrations(student_id);
CREATE INDEX idx_registrations_opportunity ON registrations(opportunity_id);

-- ── Student Views (Browsing History) ───────────────────────
CREATE TABLE student_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_views_student ON student_views(student_id);
CREATE INDEX idx_student_views_opportunity ON student_views(opportunity_id);

-- ── Student Saves ─────────────────────────────────────────
CREATE TABLE student_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id)
);

CREATE INDEX idx_student_saves_student ON student_saves(student_id);
CREATE INDEX idx_student_saves_opportunity ON student_saves(opportunity_id);

-- ── Auto-update updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Public read for published data
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read organisers" ON organisers FOR SELECT USING (true);
CREATE POLICY "Public read published opportunities" ON opportunities FOR SELECT USING (is_published = true);

-- Allow anonymous inserts for student registration capture
CREATE POLICY "Anyone can register as student" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create registration" ON registrations FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access organisers" ON organisers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access opportunities" ON opportunities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read students" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');
