-- Migration to add tentative deadline support to opportunities
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS deadline_tentative TEXT;
COMMENT ON COLUMN opportunities.deadline_tentative IS 'A text-based description of the deadline if the exact date is not known (e.g., "Late November 2025").';
