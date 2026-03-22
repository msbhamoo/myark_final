-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.submitted_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_mobile TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    eligible_classes TEXT NOT NULL,
    deadline DATE NOT NULL,
    registration_link TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security but allow inserts (public can submit)
ALTER TABLE public.submitted_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.submitted_opportunities
    FOR INSERT WITH CHECK (true);

-- Allow admins to read/update the submissions
CREATE POLICY "Allow admin read" ON public.submitted_opportunities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON public.submitted_opportunities
    FOR UPDATE USING (auth.role() = 'authenticated');
