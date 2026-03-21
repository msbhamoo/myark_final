import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  if (typeof window !== 'undefined') {
    console.error('❌ Supabase environment variables are missing! Client-side features will fail.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey);
