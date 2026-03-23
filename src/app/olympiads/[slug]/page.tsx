import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { Olympiad } from '@/lib/types';
import { OlympiadCard } from '@/components/OlympiadCard';

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: {
    slug: string;
  };
}

const subjects = [
    'mathematics', 'science', 'english', 'computer-science', 
    'astronomy', 'general-knowledge'
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const slug = params.slug.toLowerCase();

  // If it's a subject
  if (subjects.includes(slug)) {
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      title: `${title} Olympiad for School Students India 2026 — Complete List | Myark`,
      description: `Complete list of all ${title} olympiads available to school students in India. Verified, updated daily.`,
    };
  }

  // If it's an olympiad
  const { data: olympiad } = await supabase
    .from('olympiad_directory')
    .select('name')
    .eq('slug', params.slug)
    .single();

  if (!olympiad) return { title: 'Not Found' };

  return {
    title: `${olympiad.name} 2026 — Eligibility, Registration, Dates & How to Apply | Myark`,
    description: `Complete guide to ${olympiad.name}. Learn about eligibility, registration process, important dates, and preparation tips for school students.`,
  };
}

export default async function GenericOlympiadsPage({ params }: PageProps) {
  const supabase = createServerClient();
  const slug = params.slug.toLowerCase();

  // ── OPTION 1: SUBJECT FILTER PAGE ─────────────────────────
  if (subjects.includes(slug)) {
    const subjectTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Map URL slug to DB subject name
    const subjectMap: Record<string, string> = {
        'mathematics': 'Mathematics',
        'science': 'Science',
        'english': 'English',
        'computer-science': 'Computer Science',
        'astronomy': 'Astronomy',
        'general-knowledge': 'General Knowledge'
    };
    
    const dbSubject = subjectMap[slug];
    
    let query = supabase
      .from('olympiad_directory')
      .select('*')
      .eq('is_published', true);

    if (slug === 'science') {
        // Science includes Physics, Chemistry, Biology too
        query = query.or(`subject.eq.Science,type.ilike.%physics%,type.ilike.%chemistry%,type.ilike.%biology%`);
    } else {
        query = query.eq('subject', dbSubject);
    }

  const { data: olympiadsData } = await query;
  const olympiads = olympiadsData || [];

  // Sort by difficulty: placeholder sort for now
  const difficultyMap: Record<string, number> = { 'Beginner': 1, 'Medium': 2, 'Advanced': 3 };
  olympiads.sort((a, b) => (difficultyMap[a.difficulty || 'Medium'] || 2) - (difficultyMap[b.difficulty || 'Medium'] || 2));

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

      <section className="bg-[#111110] text-white py-16 md:py-24">
        <div className="container-main max-w-[1200px] px-4">
          <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold leading-tight mb-4 text-[#f0ede5]">
            {subjectTitle} Olympiads for School Students India 2026
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#8a8a84] font-medium max-w-2xl">
            Complete list of competitive {subjectTitle} olympiads. Compare eligibility, fees, and pathways to pick the right one.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[13px] font-bold text-[#4ade80]">
              <span className="bg-[#4ade80]/10 px-3 py-1 rounded-full">{olympiads.length} Olympiads Listed</span>
              <span className="bg-white/5 px-3 py-1 rounded-full text-white/60">Sorted by Difficulty</span>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] py-12 md:py-20">
        <div className="container-main max-w-[1200px] px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {olympiads.map(olympiad => (
              <OlympiadCard key={olympiad.id} olympiad={olympiad} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

  // ── OPTION 2: INDIVIDUAL OLYMPIAD DETAIL PAGE ─────────────
  const { data: olympiadData } = await supabase
    .from('olympiad_directory')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!olympiadData) {
    notFound();
  }

  const olympiad = olympiadData as Olympiad;

  // Fetch related opportunities if any
  const { data: relatedOpp } = await supabase
    .from('opportunities')
    .select('*')
    .eq('slug', olympiad.related_opportunity_slug || '')
    .single();

  // Fetch related olympiads (same subject)
  const { data: relatedOlympiads } = await supabase
    .from('olympiad_directory')
    .select('*')
    .eq('subject', olympiad.subject || '')
    .neq('id', olympiad.id)
    .limit(3);

  // Pathway steps
  const pathwaySteps = olympiad.pathway ? olympiad.pathway.split(' → ').map(s => s.trim()) : [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-10 md:py-16">
      <div className="container-main max-w-[1200px] px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-[13px] md:text-[14px] font-medium text-muted">
          <Link href="/olympiads" className="hover:text-primary transition-colors">Olympiads</Link>
          <span>/</span>
          <Link href={`/olympiads/${olympiad.subject?.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">{olympiad.subject}</Link>
          <span>/</span>
          <span className="text-heading truncate">{olympiad.short_name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-10 md:gap-14">
            
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{olympiad.short_name}</span>
                <span className="px-2.5 py-1 rounded bg-muted/10 text-muted text-[10px] font-bold uppercase tracking-wider">{olympiad.level}</span>
                <span className="px-2.5 py-1 rounded bg-muted/10 text-muted text-[10px] font-bold uppercase tracking-wider">{olympiad.subject}</span>
              </div>
              <h1 className="text-[32px] md:text-[44px] font-heading font-extrabold text-heading leading-[1.1] mb-4">{olympiad.name}</h1>
              <p className="text-[14px] font-medium text-muted mb-6 flex items-center gap-2">
                Organised by <span className="text-heading font-bold">{olympiad.organiser}</span>
                <span className="h-4 w-px bg-[var(--color-border-default)]"></span>
                <a href={`https://${olympiad.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Official Website ↗</a>
              </p>
              <p className="text-[16px] md:text-[18px] text-body leading-relaxed font-medium">{olympiad.short_description}</p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 md:p-8 shadow-sm">
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Eligibility</p>
                <p className="text-[14px] font-bold text-heading">{olympiad.eligibility_classes}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Fee</p>
                <p className="text-[14px] font-bold text-heading">{olympiad.fee || 'Nil'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Reg. Opens</p>
                <p className="text-[14px] font-bold text-heading">{olympiad.registration_month}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Exam Date</p>
                <p className="text-[14px] font-bold text-heading">{olympiad.exam_month}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Level</p>
                <p className="text-[14px] font-bold text-heading">{olympiad.level}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Pathway Stage</p>
                <p className="text-[14px] font-bold text-heading">National Entry</p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-12">
              <section>
                <h2 className="text-[24px] font-heading font-bold text-heading mb-4">About this olympiad</h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-body leading-relaxed whitespace-pre-line">
                  {olympiad.description}
                </div>
              </section>

              {pathwaySteps.length > 0 && (
                <section>
                  <h2 className="text-[24px] font-heading font-bold text-heading mb-6">The pathway</h2>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 p-6 bg-surface border border-[var(--color-border-default)] rounded-2xl shadow-sm">
                    {pathwaySteps.map((step, i) => {
                      const isCurrent = step.includes(olympiad.short_name);
                      return (
                        <div key={i} className="flex items-center gap-2 md:gap-4">
                          <div className={`px-4 py-2 rounded-xl text-[12px] md:text-[14px] font-bold border ${isCurrent ? 'bg-green-600 border-green-700 text-white shadow-md' : 'bg-[var(--color-bg)] border-[var(--color-border-default)] text-muted'}`}>
                            {step}
                          </div>
                          {i < pathwaySteps.length - 1 && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-[24px] font-heading font-bold text-heading mb-4">How registration works</h2>
                <div className="flex flex-col gap-4 p-6 bg-surface border border-[var(--color-border-default)] rounded-2xl shadow-sm">
                  {olympiad.registration_process?.split('. ').map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-[12px] font-bold flex items-center justify-center">{i + 1}</div>
                      <p className="text-[14px] md:text-[15px] text-body">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[24px] font-heading font-bold text-heading mb-4">How to prepare</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-surface border border-[var(--color-border-default)] rounded-xl shadow-sm">
                        <h3 className="font-bold text-heading mb-2">Understand the syllabus</h3>
                        <p className="text-[13px] text-muted leading-relaxed">Focus on the core concepts of the {olympiad.subject} curriculum with a higher weightage on analytical problems.</p>
                    </div>
                    <div className="p-5 bg-surface border border-[var(--color-border-default)] rounded-xl shadow-sm">
                        <h3 className="font-bold text-heading mb-2">Solve past papers</h3>
                        <p className="text-[13px] text-muted leading-relaxed">Practice with previous years&apos; question papers to understand the exam pattern and marking scheme.</p>
                    </div>
                </div>
              </section>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-8 sticky top-[100px]">
              
              <div className={`p-6 rounded-2xl border ${relatedOpp ? 'bg-green-600 border-green-700 text-white shadow-lg' : 'bg-surface border-[var(--color-border-default)] shadow-sm'}`}>
                {relatedOpp ? (
                  <>
                    <h3 className="text-[18px] font-bold mb-2">Registration Open Now</h3>
                    <p className="text-[14px] mb-6 opacity-90">Applications for {olympiad.short_name} 2026 are currently being accepted on the official portal.</p>
                    <Link 
                      href={`/opportunities/${relatedOpp.slug}`}
                      className="w-full inline-flex items-center justify-center h-12 rounded-xl bg-white text-green-700 font-bold text-[15px] hover:bg-gray-100 transition-all"
                    >
                      Apply on Myark →
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-[18px] font-bold text-heading mb-2">Notify Me</h3>
                    <p className="text-[13px] text-muted mb-6 leading-relaxed font-medium tracking-tight">Get notified when {olympiad.short_name} 2026 registration opens.</p>
                    <form className="flex flex-col gap-3">
                        <input type="email" placeholder="Your email" className="h-10 px-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-default)] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <button type="submit" className="h-10 px-4 rounded-lg bg-primary text-white font-bold text-[14px] hover:bg-primary-hover transition-colors">Notify Me</button>
                    </form>
                  </>
                )}
              </div>

              <div className="p-6 bg-surface border border-[var(--color-border-default)] rounded-2xl shadow-sm">
                <h3 className="text-[16px] font-bold text-heading mb-4">Quick Facts</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[13px] border-b border-[var(--color-border-default)] pb-2">
                        <span className="text-muted font-medium">Type</span>
                        <span className="font-bold text-heading">{olympiad.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] border-b border-[var(--color-border-default)] pb-2">
                        <span className="text-muted font-medium">International?</span>
                        <span className="font-bold text-heading">{olympiad.is_international ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] border-b border-[var(--color-border-default)] pb-2">
                        <span className="text-muted font-medium">Govt Recognized?</span>
                        <span className="font-bold text-heading">{olympiad.is_government ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-muted font-medium">Online Exam?</span>
                        <span className="font-bold text-heading">{olympiad.is_online ? 'Yes' : 'No'}</span>
                    </div>
                </div>
              </div>

              <div className="flex gap-2">
                  <button className="flex-grow flex items-center justify-center gap-2 h-11 rounded-xl bg-green-500/10 text-green-600 font-bold text-[13px] border border-green-500/20 hover:bg-green-500/20 transition-all">
                      Share
                  </button>
                  <button className="px-4 h-11 rounded-xl bg-surface border border-[var(--color-border-default)] text-[13px] font-bold hover:bg-muted/5 transition-all">
                      Link
                  </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Olympiads */}
        {relatedOlympiads && relatedOlympiads.length > 0 && (
          <div className="mt-20 md:mt-32">
            <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading mb-8">Related olympiads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedOlympiads.map(o => (
                <OlympiadCard key={o.id} olympiad={o} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
