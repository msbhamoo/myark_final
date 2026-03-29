import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { CareerCard } from '@/components/CareerCard';
import { Career } from '@/lib/types';
import { CareerFilters } from '@/components/careers/CareerFilters';

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Careers After Class 12 — The Complete Guide | Myark",
  description: "150+ careers across 12 fields — with honest salary data, entrance exams, top colleges, and exactly how to prepare.",
};

export default async function CareersHubPage({
  searchParams,
}: {
  searchParams: { stream?: string; category?: string; q?: string };
}) {
  const supabase = createServerClient();

  let query = supabase
    .from('career_directory')
    .select('*')
    .eq('is_published', true);

  // Apply filters
  if (searchParams.stream && searchParams.stream !== 'All') {
      const streamVal = searchParams.stream === 'Arts/Humanities' ? 'Arts' : searchParams.stream;
      query = query.ilike('stream_required', `%${streamVal}%`);
  }
  
  if (searchParams.category && searchParams.category !== 'All') {
      query = query.ilike('category', `%${searchParams.category}%`);
  }

  if (searchParams.q) {
      query = query.ilike('name', `%${searchParams.q}%`);
  }

  const { data: allCareers } = await query.order('name', { ascending: true });
  const careers: Career[] = allCareers || [];

  const isFiltered = searchParams.stream || searchParams.category || searchParams.q;

  // Emphasize rare/unusual paths if no search is active
  const rareCareers = careers.filter(c => c.rarity_level === 'Very Rare' || c.rarity_level === 'Rare').slice(0, 6);

  return (
    <div className="bg-[#fafafa] dark:bg-gray-950 min-h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* HERO SECTION - Responsive Dark Mode styling */}
      <section className="w-full bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#fbf8cc] dark:from-sky-950/80 dark:via-emerald-950/40 dark:to-indigo-950/40 pt-24 pb-32 relative overflow-hidden border-b border-gray-200 dark:border-gray-800 transition-colors">
        
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 dark:bg-sky-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4ade80]/10 dark:bg-emerald-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/4"></div>

        <div className="container-main max-w-[1240px] px-4 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full px-5 py-2 mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#1B4332] dark:bg-emerald-400 animate-pulse"></span>
                <span className="text-[12px] font-bold text-[#1B4332] dark:text-emerald-300 uppercase tracking-[0.1em]">Myark Explorer</span>
            </div>
            
            <h1 className="text-[40px] md:text-[64px] font-heading font-extrabold text-[#1B4332] dark:text-white leading-[1.1] mb-6 tracking-tight max-w-4xl mx-auto">
                Discover Your Perfect Path. <br className="hidden md:block" />
                <span className="text-[#4ade80] dark:text-emerald-400">Explore 150+ Careers.</span>
            </h1>
            
            <p className="text-[18px] md:text-[22px] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Find honest salary data, top colleges, entrance exams, and real roadmaps for every profession—not just the traditional ones.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-8">
                {[
                    { text: "150+ Realistic Profiles", icon: "📚" },
                    { text: "Honest Salary Data", icon: "💰" },
                    { text: "Clear Education Roadmaps", icon: "🎓" }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <span className="text-[16px]">{stat.icon}</span>
                        <span className="text-[13px] md:text-[14px] font-bold text-gray-700 dark:text-gray-200">{stat.text}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FILTER BAR CARDS */}
      <section className="w-full relative z-30 flex justify-center">
        <div className="w-full max-w-[1240px]">
            <CareerFilters />
        </div>
      </section>

      {/* RAVEST CAREERS (IF NOT FILTERED) */}
      {(!isFiltered) && rareCareers.length > 0 && (
          <section className="w-full pt-16 pb-12">
              <div className="container-main max-w-[1240px] px-4">
                  <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </div>
                      <div>
                          <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">Hidden Gems</h2>
                          <p className="text-gray-500 dark:text-gray-400 font-medium text-[15px]">Careers you&apos;ve probably never heard of, but pay incredibly well.</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rareCareers.map(c => <CareerCard key={c.id} career={c} />)}
                  </div>
              </div>
          </section>
      )}

      {/* ALL CAREERS GRID */}
      <section className="w-full pb-32 pt-8">
        <div className="container-main max-w-[1240px] px-4">
            
            <div className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div>
                    <h2 className="text-[24px] md:text-[28px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-300">
                        {searchParams.q ? `Search Results for "${searchParams.q}"` : 
                         searchParams.category && searchParams.category !== 'All' ? `${searchParams.category} Careers` : 
                         'Explore All Paths'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-[15px]">Showing {careers.length} results</p>
                </div>
            </div>

            {careers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {careers.map(c => <CareerCard key={c.id} career={c} />)}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 p-20 rounded-[40px] text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-[22px] font-heading font-extrabold text-gray-800 dark:text-gray-200 mb-2">No careers found!</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-[16px]">Try adjusting your search terms or clearing the filters.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
