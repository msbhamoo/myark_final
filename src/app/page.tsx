import { createServerClient } from '@/lib/supabase-server';
import { Category, Opportunity, Career } from '@/lib/types';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

// Home Components
import { HomeHeroV2 } from '@/components/home/HomeHeroV2';
import { OpportunityFeedV2 } from '@/components/home/OpportunityFeedV2';
import { CareerExplorerHome } from '@/components/home/CareerExplorerHome';
import { SuccessStories } from '@/components/home/SuccessStories';
import { GlobalShareButton } from '@/components/home/GlobalShareButton';
import { OpportunityStatsStrip } from '@/components/home/OpportunityStatsStrip';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Myark — Discover Scholarships, Olympiads & Careers for Indian Students | Class 1–12",
  description: "India's premier discovery platform for K-12 students. Find verified scholarships, olympiads, coding competitions, and career roadmaps. All-in-one guide for student excellence.",
  alternates: {
    canonical: 'https://myark.in',
  },
  openGraph: {
    title: "Myark — Make your Mark. Discover Opportunities for Indian Students",
    description: "Verified scholarships, olympiads, and career roadmaps for students in India. Start your excellence journey today.",
    url: 'https://myark.in',
    type: 'website',
  },
};

export default async function Home() {
  const supabase = createServerClient();

  // Parallel data fetching for performance
  const [
    { data: categoriesData },
    { data: latestData },
    { data: featuredCareersData }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('opportunities').select('*, category:categories(*), organiser:organisers(*)').eq('is_published', true).order('created_at', { ascending: false }).limit(200),
    supabase.from('career_directory').select('*').eq('is_published', true).order('rarity_level', { ascending: false }).limit(4)
  ]);

  const categories: Category[] = categoriesData || [];
  const latest: Opportunity[] = latestData || [];
  const featuredCareers: Career[] = (featuredCareersData as unknown as Career[]) || [];

  // 1. Define styling for known categories
  const categoryStyles: Record<string, { title: string; subtitle: string; badge: string; accent: 'emerald' | 'blue' | 'indigo' | 'amber' }> = {
    'scholarship': { 
      title: "High Value Scholarships.", 
      subtitle: "Direct funding for your education. Verified and currently accepting applications.",
      badge: "Direct Funding",
      accent: "blue"
    },
    'olympiad': { 
      title: "Top National Olympiads.", 
      subtitle: "Test your excellence against the best. Pathway to international certificates.",
      badge: "National Excellence",
      accent: "indigo"
    },
    'coding': { 
      title: "Next-Gen Coding & Tech.", 
      subtitle: "Master the skills of the future. Hackathons, coding contests, and tech bootcamps.",
      badge: "Tech & Dev",
      accent: "emerald"
    },
    'innovation': { 
      title: "Innovation & Research.", 
      subtitle: "For the thinkers and creators. Science fairs, research grants, and novelty awards.",
      badge: "Future Ready",
      accent: "amber"
    },
    'competition': { 
      title: "Elite Student Competitions.", 
      subtitle: "Win big and grow faster. Case studies, quizzes, and skill-based contests.",
      badge: "Win & Grow",
      accent: "indigo"
    }
  };

  // 2. Identify all categories present in the current 'latest' data (published and active)
  const availableCategories = Array.from(new Set(latest.map(o => o.category?.id).filter(Boolean)));
  
  // 3. Shuffle and pick 2 random categories that have at least 1 opportunity
  // We'll use a simple deterministic-looking shuffle for each request (force-dynamic)
  const shuffledIds = availableCategories.sort(() => 0.5 - Math.random());
  const selectedCategoryIds = shuffledIds.slice(0, 2);

  // 4. Map them to display sections
  const dynamicSections = selectedCategoryIds.map(id => {
    const sectionOpps = latest.filter(o => o.category?.id === id).slice(0, 6);
    const categoryName = sectionOpps[0]?.category?.label || 'Featured';
    const slug = sectionOpps[0]?.category?.label.toLowerCase() || '';

    // Find style or use fallback
    const styleKey = Object.keys(categoryStyles).find(k => slug.includes(k));
    const style = styleKey ? categoryStyles[styleKey] : {
      title: `Top ${categoryName} Picks.`,
      subtitle: `Verified programs in ${categoryName} for school students in India.`,
      badge: "Verified Access",
      accent: "emerald" as const
    };

    return {
      opps: sectionOpps,
      name: categoryName,
      slug: slug,
      ...style
    };
  });

  const trending = latest.slice(0, 8);

  return (
    <div className="flex flex-col items-center w-full">
      <HomeHeroV2 
        categories={categories} 
      />

      {/* 1.5 Stats Bar — Instant Trust */}
      <OpportunityStatsStrip />

      {/* 2. Trending Feed — Dynamic Class Filter */}
      <OpportunityFeedV2 
        initialOpportunities={trending} 
        title="Trending For Your Class."
      />

      {/* 3 & 4. Randomized Dynamic Sections */}
      {dynamicSections.map((section, idx) => (
        <OpportunityFeedV2 
          key={section.slug + idx}
          initialOpportunities={section.opps} 
          title={section.title}
          subtitle={section.subtitle}
          badge={section.badge}
          accentColor={section.accent}
          showGradeFilter={false}
          limit={6}
          viewAllLink={`/opportunities/category/${section.slug.replace(/\s+/g, '-')}`}
        />
      ))}

      {/* 5. Success Stories — Proof */}
      <SuccessStories />

      {/* 5. Career Explorer — Depth */}
      <CareerExplorerHome featuredCareers={featuredCareers} />

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
            <GlobalShareButton />
          </div>
          
          <p className="mt-12 text-[12px] font-bold text-[#6a6a64] uppercase tracking-[0.2em]">
             Free. Verified. Secure.
          </p>
        </div>
      </section>
    </div>
  );
}
