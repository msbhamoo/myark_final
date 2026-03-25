-- Migration to add registration_opens_tentative and event_date supporting fields
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS registration_opens_tentative TEXT,
ADD COLUMN IF NOT EXISTS event_date DATE,
ADD COLUMN IF NOT EXISTS event_date_tentative TEXT;

COMMENT ON COLUMN opportunities.registration_opens_tentative IS 'A text-based description of when registration might open (e.g., "Early July 2025").';
COMMENT ON COLUMN opportunities.event_date IS 'The actual date of the exam/event, if known.';
COMMENT ON COLUMN opportunities.event_date_tentative IS 'A text-based description of when the event might take place (e.g., "Late October 2025").';
