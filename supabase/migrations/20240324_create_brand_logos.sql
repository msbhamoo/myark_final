-- Migration to create brand_logos table for industry veteran logos
CREATE TABLE IF NOT EXISTS brand_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brand_logos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read active logos" ON brand_logos 
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access brand_logos" ON brand_logos 
FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial logos as requested
INSERT INTO brand_logos (name, logo_url, sort_order) VALUES
('Myntra', 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png', 1),
('OLA', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Ola_Logo.svg', 2),
('PEPSICO', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/PepsiCo_logo.svg', 3),
('Reliance', 'https://upload.wikimedia.org/wikipedia/en/9/99/Reliance_Industries_Logo.svg', 4),
('SAMSUNG', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 5),
('Snapdeal', 'https://upload.wikimedia.org/wikipedia/commons/6/64/Snapdeal_logo.svg', 6),
('TATA', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg', 7);
