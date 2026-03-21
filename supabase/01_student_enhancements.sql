-- ── Phase 9 Enhancements ─────────────────────────────

-- 1. Student Views
CREATE TABLE student_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_views_student ON student_views(student_id);
CREATE INDEX idx_student_views_opportunity ON student_views(opportunity_id);

-- 2. Registration Feedback
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS feedback_status TEXT DEFAULT 'pending';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS feedback_note TEXT;

-- 3. Student Saves
CREATE TABLE student_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id)
);

CREATE INDEX idx_student_saves_student ON student_saves(student_id);
CREATE INDEX idx_student_saves_opportunity ON student_saves(opportunity_id);

-- Enable RLS
ALTER TABLE student_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_saves ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can log a view" ON student_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can save" ON student_saves FOR ALL USING (true);
CREATE POLICY "Anyone can update registration feedback" ON registrations FOR UPDATE USING (true);
