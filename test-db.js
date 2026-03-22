import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

async function test() {
  const { data: opps } = await supabase.from('opportunities').select('id').limit(1);
  if (!opps || opps.length === 0) return console.log('no opps');

  const { data, error } = await supabase.from('student_views').insert({
    opportunity_id: opps[0].id
  }).select();

  console.log('Error:', error);
  console.log('Data:', data);
}

test();
