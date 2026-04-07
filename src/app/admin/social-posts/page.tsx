import { createServerClient } from '@/lib/supabase-server';
import { Opportunity } from '@/lib/types';
import { SocialPostGenerator } from '@/components/admin/SocialPostGenerator';

export const revalidate = 0; // Always fresh data for admin

export default async function SocialPostsPage() {
  const supabase = createServerClient();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // 1. Closing Soon: opportunities with deadlines within the next 14 days
  const closingSoonEnd = new Date();
  closingSoonEnd.setDate(closingSoonEnd.getDate() + 14);
  const closingSoonStr = closingSoonEnd.toISOString().split('T')[0];

  // 2. This Week: opportunities created in the last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const [
    { data: closingSoonData },
    { data: thisWeekData },
    { data: allPublishedData },
  ] = await Promise.all([
    // Closing Soon — next 14 days
    supabase
      .from('opportunities')
      .select('*, category:categories(*), organiser:organisers(*)')
      .eq('is_published', true)
      .eq('is_ongoing', false)
      .gte('deadline', todayStr)
      .lte('deadline', closingSoonStr)
      .order('deadline', { ascending: true })
      .limit(20),

    // This Week — added in last 7 days
    supabase
      .from('opportunities')
      .select('*, category:categories(*), organiser:organisers(*)')
      .eq('is_published', true)
      .gte('created_at', weekAgoStr)
      .order('created_at', { ascending: false })
      .limit(10),

    // All published — for "Did You Know" spotlight rotation
    supabase
      .from('opportunities')
      .select('*, organiser:organisers(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const closingSoon: Opportunity[] = closingSoonData || [];
  const thisWeek: Opportunity[] = thisWeekData || [];
  const allPublished: Opportunity[] = allPublishedData || [];

  return (
    <SocialPostGenerator
      closingSoon={closingSoon}
      thisWeek={thisWeek}
      allPublished={allPublished}
    />
  );
}
