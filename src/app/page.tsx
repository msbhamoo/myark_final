import { createServerClient } from '@/lib/supabase-server';
import { Category, Opportunity, Career } from '@/lib/types';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

// Home Components
import { HomeHero } from '@/components/home/HomeHero';
import { ClosingSoonStrip } from '@/components/home/ClosingSoonStrip';
import { CategoryExplorer } from '@/components/home/CategoryExplorer';
import { LatestFeed } from '@/components/home/LatestFeed';
import { CareerExplorerHome } from '@/components/home/CareerExplorerHome';
import { JourneySection } from '@/components/home/JourneySection';
import { TrustSection } from '@/components/home/TrustSection';

export const revalidate = 3600;

export default async function Home() {
  const supabase = createServerClient();

  // Parallel data fetching for performance
  const [
    { data: categoriesData },
    { data: latestData },
    { data: featuredCareersData },
    { count: oppCount }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('opportunities').select('*, category:categories(*), organiser:organisers(*)').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('career_directory').select('*').eq('is_published', true).order('rarity_level', { ascending: false }).limit(4),
    supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('is_published', true)
  ]);

  const categories: Category[] = categoriesData || [];
  const latest: Opportunity[] = latestData || [];
  const featuredCareers: Career[] = (featuredCareersData as unknown as Career[]) || [];
  const activeOppCount = oppCount || 0;

  // Fetch Closing Soon data
  const today = new Date().toISOString().split('T')[0];
  const threeWeeksFromNow = new Date();
  threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
  const closingDate = threeWeeksFromNow.toISOString().split('T')[0];

  const { data: closingSoonData } = await supabase
    .from('opportunities')
    .select('title, slug, deadline')
    .eq('is_published', true)
    .eq('is_ongoing', false)
    .gte('deadline', today)
    .lte('deadline', closingDate)
    .order('deadline', { ascending: true })
    .limit(3);

  const closingSoon = closingSoonData || [];

  return (
    <div className="flex flex-col items-center">
      {/* 1. Hero Section — The first impression */}
      <HomeHero 
        categories={categories} 
      />

      {/* 2. Urgency Layer */}
      <ClosingSoonStrip items={closingSoon} />

      {/* 4. Categorical Discovery */}
      <CategoryExplorer categories={categories} />

      {/* 5. The Live Feed — Linear staggered layout */}
      <LatestFeed 
        latest={latest} 
        activeOppCount={activeOppCount} 
      />

      {/* 6. Career Explorer — The Premium Dark Experience */}
      <CareerExplorerHome featuredCareers={featuredCareers} />

      {/* 7. Journey Path */}
      <JourneySection />

      {/* 8. Trust Matrix */}
      <TrustSection />

      {/* 9. Final Multi-Action CTA */}
      <section className="w-full bg-[#0a0f0a] py-24 md:py-32 lg:py-40 relative overflow-hidden">
        {/* Deep ambient glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.15), transparent)'
        }}></div>
        
        <div className="relative container-main max-w-[800px] px-4 text-center z-10">
          <Logo size="lg" variant="dark" className="mx-auto mb-8 transform scale-125" />
          <h2 className="text-[32px] md:text-[48px] font-heading font-extrabold text-[#f0ede5] mb-6 tracking-tight leading-[1.1]">
            Your journey to <span className="text-[#4ade80] italic">extraordinary</span> starts here.
          </h2>
          <p className="text-[17px] md:text-[19px] text-[#a8a8a0] max-w-lg mx-auto mb-12 leading-relaxed font-medium">
            Join thousands of ambitious students and parents discovering world-class opportunities they never knew existed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              href="/opportunities" 
              className="inline-flex items-center justify-center h-16 px-12 rounded-[20px] bg-[#22c55e] text-[#0a0f0a] font-black text-[17px] hover:bg-[#16a34a] transition-all shadow-2xl shadow-[#22c55e]/30 hover:scale-[1.05] active:scale-95"
            >
              Browse Opportunities
            </Link>
            <Link 
              href="/student/dashboard" 
              className="inline-flex items-center justify-center h-16 px-12 rounded-[20px] bg-white/[0.04] border border-white/[0.1] text-[#f0ede5] font-bold text-[17px] hover:bg-white/[0.08] transition-all backdrop-blur-md active:scale-95"
            >
              Student Dashboard
            </Link>
          </div>
          
          <p className="mt-12 text-[12px] font-bold text-[#6a6a64] uppercase tracking-[0.2em]">
             Free. Verified. Secure.
          </p>
        </div>
      </section>
    </div>
  );
}
