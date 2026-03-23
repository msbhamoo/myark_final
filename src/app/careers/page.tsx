import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { CareerCard } from '@/components/CareerCard';
import { Career } from '@/lib/types';

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Careers After Class 12 — The Complete Guide | Myark",
  description: "150+ careers across 12 fields — with honest salary data, entrance exams, top colleges, and exactly how to prepare. Not just doctor and engineer.",
};

const STREAMS = [
  "All", 
  "Science PCM", 
  "Science PCB", 
  "Science PCM+B", 
  "Commerce", 
  "Arts/Humanities", 
  "Any Stream"
];

const CATEGORIES = [
  "All", "Medicine", "Engineering", "Science & Research", "Technology", 
  "Business & Finance", "Creative Arts", "Fashion", "Media & Film", 
  "Sports", "Environment", "Hospitality & Food", "Unusual Careers"
];

export default async function CareersHubPage({
  searchParams,
}: {
  searchParams: { stream?: string; category?: string };
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

  const { data: allCareers } = await query.order('name', { ascending: true });
  const careers: Career[] = allCareers || [];

  const rareCareers = careers.filter(c => c.rarity_level === 'Very Rare' || c.rarity_level === 'Rare').slice(0, 6);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* HERO SECTION */}
      <section className="w-full bg-[#111110] text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 via-transparent to-transparent"></div>
        <div className="container-main max-w-[1240px] px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full px-4 py-1.5 mb-8">
                <span className="text-[11px] font-bold text-[#4ade80] uppercase tracking-wider">Career Explorer 1.0</span>
            </div>
            <h1 className="text-[36px] md:text-[64px] font-heading font-extrabold text-[#f0ede5] leading-[1.05] mb-6 tracking-tight max-w-4xl mx-auto">
                Every career that exists. <br className="hidden md:block" />
                <span className="text-[#4ade80] italic">Not just doctor and engineer.</span>
            </h1>
            <p className="text-[16px] md:text-[20px] text-[#8a8a84] max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                150+ careers across 12 fields — with honest salary data, entrance exams, top colleges, and exactly how to prepare.
            </p>
            
            {/* Stats Strip */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-10 border-t border-white/5">
                {[
                    "150+ Careers Listed",
                    "12 Career Fields",
                    "Real Salary Data",
                    "Free for All Students"
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
                        <span className="text-[13px] md:text-[14px] font-bold text-[#f0ede5] uppercase tracking-wider">{stat}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FILTER BAR CARDS */}
      <section className="w-full -mt-10 mb-16 relative z-30">
        <div className="container-main max-w-[1240px] px-4">
            <div className="bg-white dark:bg-[#1A1A18] border border-default rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-8">
                
                {/* Stream Filter */}
                <div>
                    <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Choose your stream:</h3>
                    <div className="flex flex-wrap gap-2">
                        {STREAMS.map(s => {
                            const isActive = (searchParams.stream || 'All') === s;
                            return (
                                <Link 
                                    key={s} 
                                    href={`/careers?${new URLSearchParams({ ...searchParams, stream: s }).toString()}`}
                                    className={`px-6 py-3 rounded-xl text-[14px] font-bold transition-all border ${
                                        isActive 
                                        ? 'bg-[#4ade80] border-[#4ade80] text-black shadow-lg translate-y-[-2px]' 
                                        : 'bg-surface border-default text-muted hover:border-[#4ade80]/50 hover:text-heading'
                                    }`}
                                >
                                    {s}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Explore by Interest:</h3>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => {
                            const isActive = (searchParams.category || 'All') === c;
                            return (
                                <Link 
                                    key={c} 
                                    href={`/careers?${new URLSearchParams({ ...searchParams, category: c }).toString()}`}
                                    className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                                        isActive 
                                        ? 'bg-[#f0ede5] dark:bg-white text-black border-white shadow-md' 
                                        : 'bg-surface border-default text-muted hover:text-heading'
                                    }`}
                                >
                                    {c}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* RAVEST CAREERS (IF NOT FILTERED) */}
      {(!searchParams.stream && !searchParams.category) && rareCareers.length > 0 && (
          <section className="w-full pb-20">
              <div className="container-main max-w-[1240px] px-4">
                  <div className="flex items-center gap-3 mb-10">
                      <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading">Careers Nobody Told You About</h2>
                      <div className="h-px flex-1 bg-default/40"></div>
                      <span className="text-[11px] font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full uppercase tracking-tighter">You&apos;ve probably never heard of these</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rareCareers.map(c => <CareerCard key={c.id} career={c} />)}
                  </div>
              </div>
          </section>
      )}

      {/* ALL CAREERS GRID */}
      <section className="w-full pb-32">
        <div className="container-main max-w-[1240px] px-4">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading">
                        {searchParams.category && searchParams.category !== 'All' ? `${searchParams.category} Careers` : 'All Careers'}
                    </h2>
                    <p className="text-muted mt-1 font-medium italic">Showing {careers.length} results</p>
                </div>
            </div>

            {careers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {careers.map(c => <CareerCard key={c.id} career={c} />)}
                </div>
            ) : (
                <div className="bg-surface border border-dashed border-default p-20 rounded-[40px] text-center">
                    <p className="text-muted font-bold text-lg">No careers found matching your filters. Try something else!</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
