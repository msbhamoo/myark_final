import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { CareerCard } from '@/components/CareerCard';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: career } = await supabase
    .from('career_directory')
    .select('name, short_description')
    .eq('slug', params.slug)
    .single();

  if (!career) return { title: 'Career Not Found' };

  return {
    title: `${career.name} — What It Is, How to Become One, Salary & Colleges | Myark`,
    description: career.short_description,
  };
}

export default async function CareerDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  const { data: career } = await supabase
    .from('career_directory')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!career) notFound();

  // Related careers
  const { data: related } = await supabase
    .from('career_directory')
    .select('*')
    .eq('category', career.category)
    .neq('id', career.id)
    .limit(4);

  const isRare = career.rarity_level === 'Rare' || career.rarity_level === 'Very Rare';

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pb-20">
      {/* SEO SCHEMAS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            "name": career.name,
            "description": career.short_description,
            "occupationalCategory": career.category,
            "offers": {
              "@type": "Offer",
              "category": career.stream_required
            },
            "educationalCredentialAwarded": career.degree_required,
            "timeToComplete": career.duration
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What is the entry salary for ${career.name} in India?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Successful professionals starting as ${career.name} can expect a salary of ${career.salary_entry} initially.`
                }
              },
              {
                "@type": "Question",
                "name": `What degree do I need for ${career.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `To become a ${career.name}, you typically need a ${career.degree_required} degree.`
                }
              },
              {
                "@type": "Question",
                "name": `Which entrance exams are required for ${career.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": career.entrance_exams.length > 0 
                    ? `Common entrance exams include ${career.entrance_exams.join(', ')}.`
                    : "There are no specific national entrance exams for this career; admissions are usually merit-based or through direct university applications."
                }
              }
            ]
          })
        }}
      />
      {/* ─── HEADER SECTION ──────────────────────────────── */}
      <section className="bg-surface border-b border-default pt-24 pb-12">
        <div className="container-main max-w-[1240px] px-4">
            <nav className="flex items-center gap-2 mb-8 text-[11px] font-bold text-muted uppercase tracking-widest">
                <Link href="/careers" className="hover:text-primary">Careers</Link>
                <span>/</span>
                <Link href={`/careers/category/${career.category.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`} className="hover:text-primary">{career.category}</Link>
                <span>/</span>
                <span className="text-heading truncate max-w-[150px]">{career.name}</span>
            </nav>
            
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.1em]">{career.stream_required}</span>
                <span className="bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.1em]">{career.category}</span>
                {isRare && <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.1em]">Rare Career</span>}
            </div>

            <h1 className="text-[36px] md:text-[56px] font-heading font-extrabold text-heading leading-[1.05] tracking-tight mb-4">
                {career.name}
            </h1>
            <p className="text-[17px] md:text-[20px] text-muted max-w-2xl font-medium mb-10 leading-relaxed">
                {career.short_description}
            </p>

            {/* QUICK STATS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-default/40 border border-default rounded-3xl overflow-hidden shadow-sm">
                {[
                    { label: "Entry Salary", value: career.salary_entry, color: "text-[#4ade80]" },
                    { label: "Senior Salary", value: career.salary_senior, color: "text-[#4ade80]" },
                    { label: "Degree duration", value: career.duration, color: "text-heading" },
                    { label: "Competition", value: career.competition_level, color: career.competition_level === 'High' ? 'text-red-500' : 'text-amber-500' },
                    { label: "Demand Level", value: career.demand_level, color: career.demand_level === 'High' ? 'text-green-600' : 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-surface p-5 text-center flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{stat.label}</span>
                        <span className={`text-[16px] md:text-[18px] font-extrabold ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ────────────────────────────────── */}
      <section className="container-main max-w-[1240px] px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* L: CONTENT COLUMN */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* What you do */}
            <div id="what-you-do">
                <h2 className="text-[24px] md:text-[28px] font-heading font-extrabold text-heading mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">01</span>
                    What does a {career.name} actually do?
                </h2>
                <div className="bg-surface border border-default p-8 rounded-[40px] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-[15deg]">
                        <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    <p className="text-[16px] md:text-[17px] text-muted leading-relaxed font-medium whitespace-pre-line relative z-10">
                        {career.what_you_do}
                    </p>
                    <div className="mt-8 pt-8 border-t border-default/40 text-[15px] text-muted italic leading-relaxed">
                        &quot;Not the Wikipedia version. This is the reality of your day-to-day work.&quot;
                    </div>
                </div>
            </div>

            {/* Is this right for you */}
            <div id="is-this-for-you">
                <h2 className="text-[24px] md:text-[28px] font-heading font-extrabold text-heading mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#4ade80]/10 flex items-center justify-center text-[#4ade80]">02</span>
                    Is this career right for you?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 p-8 rounded-[40px]">
                        <h4 className="text-green-700 dark:text-green-400 font-extrabold text-[15px] uppercase tracking-wider mb-6 flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                           You&apos;ll love this if...
                        </h4>
                        <div className="space-y-4 text-[15px] text-green-900/80 dark:text-green-200/80 font-medium leading-relaxed">
                            {career.is_this_for_you.split('\n').filter((l: string) => l.includes('love this')).map((l: string, i: number) => (
                                <p key={i}>{l.replace('- You\'ll love this if ', '').replace('You\'ll love this if ', '')}</p>
                            ))}
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 p-8 rounded-[40px]">
                        <h4 className="text-red-700 dark:text-red-400 font-extrabold text-[15px] uppercase tracking-wider mb-6 flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                           Not for you if...
                        </h4>
                        <div className="space-y-4 text-[15px] text-red-900/80 dark:text-red-200/80 font-medium leading-relaxed">
                            {career.is_this_for_you.split('\n').filter((l: string) => l.includes('not be for you')).map((l: string, i: number) => (
                                <p key={i}>{l.replace('- This might not be for you if ', '').replace('This might not be for you if ', '')}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* How to prepare in school */}
            <div id="how-to-prepare">
                <h2 className="text-[24px] md:text-[28px] font-heading font-extrabold text-heading mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">03</span>
                    How to prepare in school right now
                </h2>
                <div className="space-y-4">
                    {career.how_to_prepare_in_school.split('\n').filter((l: string) => l.trim()).map((step: string, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-surface border border-default rounded-2xl hover:border-blue-400 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                            <p className="text-[15px] text-muted font-medium">{step.replace('- ', '').replace(/^\d+\.\s+/, '')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roadmap / Pathway */}
            <div id="pathway">
                <h2 className="text-[24px] md:text-[28px] font-heading font-extrabold text-heading mb-10 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">04</span>
                    The 12-to-Job Pathway
                </h2>
                <div className="relative pl-8 border-l-2 border-dashed border-default space-y-12">
                   {[
                       { stage: "Class 12", desc: `Focus on ${career.stream_required.replace('Science ', '')} subjects and boards.`, years: "0y" },
                       { stage: "Entrance Exams", desc: career.entrance_exams.join(', '), years: "+0.5y" },
                       { stage: career.degree_required, desc: `Core degree at a recognized university.`, years: career.duration },
                       { stage: "First Job", desc: `Entry-level ${career.name} role or internship.`, years: "+1y" },
                       { stage: "Senior Role", desc: `Expert at your field with specialized mastery.`, years: "5-10y+" }
                   ].map((step, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-black bg-purple-500 shadow-sm"></div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="text-[18px] font-heading font-bold text-heading">{step.stage}</h4>
                                    <p className="text-[14px] text-muted mt-1">{step.desc}</p>
                                </div>
                                <span className="bg-surface border border-default px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase text-muted whitespace-nowrap">{step.years}</span>
                            </div>
                        </div>
                   ))}
                </div>
            </div>

            {/* Colleges Section */}
            <div id="colleges">
                <h3 className="text-[24px] font-heading font-extrabold text-heading mb-8">Top Institutions</h3>
                <div className="space-y-8">
                    {/* India */}
                    <div>
                        <h4 className="text-[13px] font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                           <span className="w-5 h-[2px] bg-primary"></span>
                           Best Colleges in India
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {career.colleges_india?.map((coll: string, i: number) => (
                                <div key={i} className="bg-surface border border-default p-5 rounded-2xl flex flex-col justify-center text-center">
                                    <p className="text-[14px] font-bold text-heading">{coll}</p>
                                </div>
                            )) || <p className="text-muted italic">Data coming soon</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Breakdown */}
            <div id="salary">
                <div className="bg-[#111110] text-white p-8 md:p-12 rounded-[50px] overflow-hidden relative border border-white/5">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.1] -rotate-12">
                        <svg className="w-60 h-60" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                    </div>
                    <h2 className="text-[24px] md:text-[32px] font-heading font-extrabold mb-10 relative z-10 text-white">Salary Reality Check</h2>
                    
                    <div className="space-y-6 relative z-10">
                        {[
                            { label: "Starting (0–3 Years)", val: career.salary_entry, sub: "Typical first placement" },
                            { label: "Mid-level (3–8 Years)", val: career.salary_mid, sub: "After gaining solid expertise" },
                            { label: "Senior Expert (8+ Years)", val: career.salary_senior, sub: "Elite practitioners and leaders" }
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <div>
                                    <p className="text-[14px] font-bold text-gray-200">{s.label}</p>
                                    <p className="text-[11px] text-gray-500 font-medium italic mt-0.5">{s.sub}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[18px] font-black text-[#4ade80]">{s.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 text-[12px] text-gray-400 leading-relaxed font-medium">
                        * These are real-world ranges reported by professionals in India. Actual outcomes may vary based on institution, skills, and geography.
                    </div>
                </div>
            </div>

            {/* Related Careers */}
            <div>
                <h3 className="text-[20px] font-heading font-extrabold text-heading mb-6">Explore Similar Careers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {related?.map(c => <CareerCard key={c.id} career={c} />)}
                </div>
            </div>

          </div>

          {/* R: SIDEBAR COLUMN */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
                
                {/* SHARE & ACTION BOX */}
                <div className="bg-surface border border-default p-8 rounded-[40px] shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-[18px] font-heading font-bold text-heading mb-2">Want to pursue this?</h4>
                        <p className="text-[13px] text-muted mb-6 leading-relaxed">We&apos;ll notify you when new opportunities or scholarships for <strong className="text-heading">{career.name}</strong> go live.</p>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Your Email</label>
                                <input type="email" placeholder="email@example.com" className="w-full h-11 bg-surface border border-default rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                            </div>
                            <button className="w-full h-12 bg-primary text-white font-bold rounded-xl text-[14px] shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
                                Notify Me
                            </button>
                        </div>
                    </div>
                </div>

                {/* QUICK FACTS BOX */}
                <div className="bg-surface border border-default p-8 rounded-[40px]">
                    <h4 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-6">Quick Overview</h4>
                    <div className="space-y-6">
                        {[
                            { label: "Category", value: career.category },
                            { label: "Stream", value: career.stream_required },
                            { label: "Exams", value: career.entrance_exams.join(', ') || 'None' },
                            { label: "Demand", value: career.demand_level },
                            { label: "Competition", value: career.competition_level }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">{stat.label}</p>
                                <p className="text-[14px] font-bold text-heading">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HELP BUTTON */}
                <Link href="/careers" className="block w-full text-center py-4 bg-default text-muted font-bold rounded-2xl text-[13px] border border-default hover:bg-surface hover:text-primary transition-all">
                    Not sure? Take a quiz (Coming Soon)
                </Link>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
