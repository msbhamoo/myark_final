-- Migration: Add tags to opportunities for better categorization and discovery
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Index for faster tag-based lookups
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON opportunities USING GIN (tags);
