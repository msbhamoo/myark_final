import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
import { OlympiadCard } from '@/components/OlympiadCard';
import { Olympiad } from '@/lib/types';

export const revalidate = 86400; // ISR for 24 hours

export const metadata: Metadata = {
  title: "Complete Olympiad List for Class 1–12 India 2025–26 | Myark",
  description: "Discover every verified olympiad for school students in India. From SOF to HBCSE pathway (IMO, IPhO, IChO). Find eligibility, registration dates, and prep tips.",
  alternates: {
    canonical: 'https://myark.in/olympiads',
  },
  openGraph: {
    title: "Complete Olympiad List for Class 1–12 Students India | Myark",
    description: "Browse 50+ olympiads available to Indian students. From Science and Math to Astronomy and Computer Science.",
    url: 'https://myark.in/olympiads',
    type: 'website',
  },
};

interface OlympiadsPageProps {
  searchParams: {
    subject?: string;
    class?: string;
    level?: string;
    free?: string;
    individual?: string;
  };
}

export default async function OlympiadsPage({ searchParams }: OlympiadsPageProps) {
  const supabase = createServerClient();

  let query = supabase
    .from('olympiad_directory')
    .select('*')
    .eq('is_published', true);

  if (searchParams.subject && searchParams.subject !== 'All') {
    query = query.eq('subject', searchParams.subject);
  }
  
  if (searchParams.level && searchParams.level !== 'All') {
    query = query.ilike('level', `%${searchParams.level}%`);
  }

  if (searchParams.free === 'true') {
    query = query.eq('is_free', true);
  }

  if (searchParams.individual === 'true') {
    query = query.eq('is_individual_registration', true);
  }

  const { data: olympiadsData } = await query;
  let olympiads: Olympiad[] = olympiadsData || [];

  // Manual class filtering because eligibility_classes is a text field
  if (searchParams.class && searchParams.class !== 'All') {
    const classRange = searchParams.class;
    olympiads = olympiads.filter(o => {
        // Simple string matching for now, as eligibility_classes is like "Class 1–12"
        return o.eligibility_classes.includes(classRange) || o.eligibility_classes.includes('1–12') || o.eligibility_classes.includes('8–12');
    });
  }

  // Define subjects
  const subjects = [
    'All', 'Mathematics', 'Science', 'English', 'Computer Science', 
    'General Knowledge', 'Astronomy', 'Reasoning', 'Social Studies', 
    'Commerce', 'Hindi'
  ];

  const classRanges = [
    'All Classes', 'Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12'
  ];

  const levels = [
    'All Levels', 'School', 'National', 'International'
  ];

  // Group by Organiser Group as requested
  const groups = [
    'HBCSE / IAPT',
    'SOF',
    'Silverzone',
    'Unified Council',
    'Other India Olympiads',
    'International Olympiads'
  ];

  const groupedOlympiads = groups.reduce((acc, group) => {
    acc[group] = olympiads.filter(o => o.organiser_group === group);
    return acc;
  }, {} as Record<string, Olympiad[]>);

  // Statistics
  const stats = [
    { label: "Olympiads Listed", value: "51+" },
    { label: "Organiser Bodies", value: "12" },
    { label: "Classes", value: "1–12" },
    { label: "Updated for", value: "2026" }
  ];

  // JSON-LD ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": olympiads.map((o, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://myark.in/olympiads/${o.slug}`,
      "name": o.name
    }))
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-[#111110] text-white py-16 md:py-24 border-b border-white/5">
        <div className="container-main max-w-[1200px] px-4 md:px-6">
          <div className="max-w-2xl">
            <h1 className="text-[36px] md:text-[52px] font-heading font-extrabold leading-tight mb-4 text-[#f0ede5]">
              Every olympiad. <br />
              <span className="text-[#4ade80]">One place.</span>
            </h1>
            <p className="text-[16px] md:text-[19px] text-[#8a8a84] mb-10 leading-relaxed font-medium">
              From your first SOF olympiad to representing India at IMO — discover every competition available to you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 md:pt-10 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-[15px] font-bold text-[#f0ede5]">{stat.value}</span>
                <span className="text-[12px] font-semibold text-[#8a8a84] uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Sections */}
      <section className="sticky top-[64px] md:top-[80px] z-30 w-full bg-surface border-b border-[var(--color-border-default)] shadow-sm">
        <div className="container-main max-w-[1200px] px-4 py-4 md:py-6 overflow-x-auto scrollbar-hide">
            <div className="flex flex-col gap-4">
                {/* Subject Filter */}
                <div className="flex gap-2 min-w-max">
                    {subjects.map(sub => {
                        const isActive = (searchParams.subject || 'All') === sub || (sub === 'Computer Science' && searchParams.subject === 'Computer Science');
                        return (
                            <Link
                                key={sub}
                                href={`/olympiads?${new URLSearchParams({ ...searchParams, subject: sub }).toString()}`}
                                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-[var(--color-bg)] border border-[var(--color-border-default)] text-muted hover:border-primary'}`}
                            >
                                {sub}
                            </Link>
                        );
                    })}
                </div>

                {/* Class Filter */}
                <div className="flex gap-2 min-w-max">
                    {classRanges.map(cr => {
                        const isActive = (searchParams.class || 'All Classes') === cr;
                        return (
                            <Link
                                key={cr}
                                href={`/olympiads?${new URLSearchParams({ ...searchParams, class: cr }).toString()}`}
                                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-[var(--color-bg)] border border-[var(--color-border-default)] text-muted hover:border-primary'}`}
                            >
                                {cr}
                            </Link>
                        );
                    })}
                </div>

                {/* Level + Extra Filter */}
                <div className="flex gap-2 min-w-max">
                    {levels.map(lv => {
                        const isActive = (searchParams.level || 'All Levels') === lv;
                        const label = lv === 'All Levels' ? lv : `${lv}-Level`;
                        return (
                            <Link
                                key={lv}
                                href={`/olympiads?${new URLSearchParams({ ...searchParams, level: lv }).toString()}`}
                                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'bg-[var(--color-bg)] border border-[var(--color-border-default)] text-muted hover:border-primary'}`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    <Link
                        href={`/olympiads?${new URLSearchParams({ ...searchParams, free: searchParams.free === 'true' ? 'false' : 'true' }).toString()}`}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${searchParams.free === 'true' ? 'bg-green-600 text-white' : 'bg-[var(--color-bg)] border border-[var(--color-border-default)] text-muted hover:border-primary'}`}
                    >
                        Free Only
                    </Link>
                    <Link
                        href={`/olympiads?${new URLSearchParams({ ...searchParams, individual: searchParams.individual === 'true' ? 'false' : 'true' }).toString()}`}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${searchParams.individual === 'true' ? 'bg-blue-600 text-white' : 'bg-[var(--color-bg)] border border-[var(--color-border-default)] text-muted hover:border-primary'}`}
                    >
                        Individual Registration
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[var(--color-bg)] py-12 md:py-20">
        <div className="container-main max-w-[1200px] px-4">
          <div className="flex flex-col gap-16 md:gap-24">
            {groups.map(group => {
              const groupOlympiads = groupedOlympiads[group];
              if (groupOlympiads.length === 0) return null;

              return (
                <div key={group} className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[20px] md:text-[28px] font-heading font-extrabold text-heading">{group}</h2>
                    <div className="h-px flex-grow bg-[var(--color-border-default)]"></div>
                    <span className="text-[13px] font-bold text-muted bg-surface border border-[var(--color-border-default)] px-3 py-1 rounded-full">{groupOlympiads.length} Listed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {groupOlympiads.map(olympiad => (
                      <OlympiadCard key={olympiad.id} olympiad={olympiad} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {olympiads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-heading">No olympiads found</h3>
              <p className="text-muted mt-2">Try adjusting your filters or search terms.</p>
              <Link href="/olympiads" className="mt-6 text-primary font-bold hover:underline">
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
