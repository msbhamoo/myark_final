-- Migration to support metadata from Opportunity Scanner
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS confidence_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS confidence_reasoning TEXT;

COMMENT ON COLUMN opportunities.confidence_score IS 'AI Confidence Score from scanner.';
COMMENT ON COLUMN opportunities.confidence_reasoning IS 'AI Rationale from scanner.';
