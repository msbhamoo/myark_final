import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { supabase } from '@/lib/supabase';
import { CareerCard } from '@/components/CareerCard';
import { notFound } from 'next/navigation';
import { generateBreadcrumbJsonLd } from '@/lib/seo';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data: careers } = await supabase
    .from('career_directory')
    .select('slug')
    .eq('is_published', true)
    .limit(100);

  return (careers || []).map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: career } = await supabase
    .from('career_directory')
    .select('name, short_description')
    .eq('slug', params.slug)
    .single();

  if (!career) return { title: 'Career Not Found' };

  return {
    title: `${career.name} — Roadmap, Salary & Colleges | Myark`,
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
    <div className="bg-[#f9fafb] dark:bg-gray-950 min-h-screen pb-20 font-sans text-gray-900 dark:text-gray-100 selection:bg-[#4ade80]/30 transition-colors">
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
            "offers": { "@type": "Offer", "category": career.stream_required },
            "educationalCredentialAwarded": career.degree_required,
            "timeToComplete": career.duration
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd([
            { name: 'Home', href: '/' },
            { name: 'Careers', href: '/careers' },
            { name: career.category, href: `/careers?category=${encodeURIComponent(career.category)}` },
            { name: career.name, href: `/careers/${career.slug}` },
          ]))
        }}
      />
      
      {/* ─── HEADER SECTION (Bright, Parent-Friendly) ───────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-24 pb-16 relative overflow-hidden transition-colors">
        {/* Soft Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e0f2fe]/40 dark:bg-sky-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f0fdf4]/60 dark:bg-emerald-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="container-main max-w-[1240px] px-4 relative z-10">
            <nav className="flex items-center gap-2 mb-8 text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Link href="/careers" className="hover:text-[#1B4332] dark:hover:text-emerald-400 transition-colors">Careers Directory</Link>
                <span>/</span>
                <Link href={`/careers?category=${encodeURIComponent(career.category)}`} className="hover:text-[#1B4332] dark:hover:text-emerald-400 transition-colors">{career.category}</Link>
                <span>/</span>
                <span className="text-[#1B4332] dark:text-emerald-300 truncate max-w-[200px]">{career.name}</span>
            </nav>
            
            <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#1B4332]/5 dark:bg-emerald-500/10 border border-[#1B4332]/10 dark:border-emerald-500/20 text-[#1B4332] dark:text-emerald-400 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    {career.stream_required}
                </span>
                <span className="bg-[#4ade80]/10 dark:bg-emerald-800/20 border border-[#4ade80]/20 dark:border-emerald-700/30 text-[#166534] dark:text-emerald-400 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {career.category}
                </span>
                {isRare && (
                    <span className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" /></svg>
                        Rare Career Path
                    </span>
                 )}
            </div>

            <h1 className="text-[40px] md:text-[56px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-50 leading-[1.05] tracking-tight mb-5 max-w-4xl">
                {career.name}
            </h1>
            <p className="text-[18px] md:text-[22px] text-gray-600 dark:text-gray-300 max-w-3xl font-medium mb-12 leading-relaxed">
                {career.short_description}
            </p>

            {/* QUICK STATS STRIP - Modern, rounded pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
                {[
                    { label: "Starting Salary", value: career.salary_entry, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { label: "Degree Duration", value: career.duration, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { label: "Demand Today", value: career.demand_level, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                    { label: "Competition", value: career.competition_level, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
                ].map((stat, i) => (
                    <div key={i} className="bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-5 rounded-[24px] flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-[#1B4332] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className="text-[16px] md:text-[18px] font-extrabold text-gray-800 dark:text-gray-100">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ────────────────────────────────── */}
      <section className="container-main max-w-[1240px] px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* L: CONTENT COLUMN */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* 01: What you do */}
            <div id="what-you-do">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] dark:bg-sky-900/40 text-[#0369a1] dark:text-sky-400 flex items-center justify-center font-heading font-black text-xl">1</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        The Reality of the Job
                    </h2>
                </div>
                {/* Blockquote styling to make it very easy to read vs raw paragraphs */}
                <div className="relative pl-8 md:pl-10">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#e0f2fe] dark:bg-sky-800/50 rounded-full"></div>
                    <div className="absolute -left-3 top-0">
                        <svg className="w-8 h-8 text-[#bae6fd] dark:text-sky-900/80" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p className="text-[17px] md:text-[19px] text-gray-700 dark:text-gray-300 leading-[1.8] font-medium whitespace-pre-line mb-6 pt-4">
                        {career.what_you_do}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        This strips away the Wikipedia definition—this is what your 9 to 5 truly looks like.
                    </div>
                </div>
            </div>

            {/* 02: Is this right for you */}
            <div id="is-this-for-you">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] dark:bg-emerald-900/40 text-[#166534] dark:text-emerald-400 flex items-center justify-center font-heading font-black text-xl">2</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        Is this a Good Match?
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros Card */}
                    <div className="bg-white dark:bg-gray-900 border-2 border-green-100 dark:border-green-900/30 rounded-[32px] p-8 shadow-sm hover:shadow-lg hover:shadow-green-500/5 dark:hover:shadow-green-500/10 transition-all">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <h4 className="text-[#166534] dark:text-emerald-400 font-extrabold text-[18px] mb-4">You&apos;ll Love This If...</h4>
                        <ul className="space-y-4">
                            {career.is_this_for_you.split('\n').filter((l: string) => l.toLowerCase().includes('love this') || l.length > 5).map((l: string, i: number) => {
                                // Extract just the points if they are bulleted
                                const text = l.replace(/.*love this if /i, '').replace(/^- /, '');
                                if(!text.trim() || text.includes('not be for you')) return null;
                                return (
                                    <li key={i} className="flex gap-3 text-[15px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        <span>{text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* Cons Card */}
                    <div className="bg-white dark:bg-gray-900 border-2 border-red-50 dark:border-red-900/30 rounded-[32px] p-8 shadow-sm hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </div>
                        <h4 className="text-red-800 dark:text-red-400 font-extrabold text-[18px] mb-4">Not For You If...</h4>
                        <ul className="space-y-4">
                            {career.is_this_for_you.split('\n').filter((l: string) => l.toLowerCase().includes('not be for you') || (l.length > 5 && l.includes('Not'))).map((l: string, i: number) => {
                                const text = l.replace(/.*not be for you if /i, '').replace(/^- /, '');
                                if(!text.trim()) return null;
                                return (
                                    <li key={i} className="flex gap-3 text-[15px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        <svg className="w-5 h-5 text-red-300 dark:text-red-800 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        <span>{text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 03: The Roadmap */}
            <div id="pathway">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-heading font-black text-xl">3</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        The 12-to-Job Pathway
                    </h2>
                </div>
                
                {/* Modern Timeline Component */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[32px] p-8 md:p-12 shadow-sm">
                    <div className="relative">
                        <div className="absolute left-[39px] top-6 bottom-6 w-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                        
                        {[
                            { step: "Class 12 Foundation", desc: `Keep focused on ${career.stream_required === 'Any Stream' ? 'your current core' : career.stream_required.replace('Science ', '')} subjects. Strong fundamentals are critical.`, sub: "0 years" },
                            career.entrance_exams?.length > 0 ? { step: "The Entrance Gate", desc: `Prepare for and clear ${career.entrance_exams.join(', ')}.`, sub: "+ 6 Months" } : null,
                            { step: "Higher Education", desc: `Secure admission for your ${career.degree_required} from a recognized institution.`, sub: career.duration },
                            { step: "The First Role", desc: `Land a junior placement or internship role to gain robust practical experience.`, sub: "+ 1 Year" },
                            { step: "Senior Authority", desc: `Grow into specialized mastery and advanced leadership in the sector.`, sub: "5 - 10 Years" },
                        ].filter(Boolean).map((item, i) => (
                            <div key={i} className="flex relative items-start gap-8 group mb-12 last:mb-0">
                                {/* Number Badge */}
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 flex flex-col items-center justify-center shrink-0 shadow-sm relative z-10 group-hover:border-purple-100 dark:group-hover:border-purple-500/30 group-hover:scale-105 transition-transform">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Step</span>
                                    <span className="text-xl font-black text-gray-800 dark:text-gray-100">0{i + 1}</span>
                                </div>
                                <div className="pt-2">
                                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest mb-2">Timeline: {item?.sub}</span>
                                    <h4 className="text-[20px] font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">{item?.step}</h4>
                                    <p className="text-[15px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">{item?.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 04: Prepare Right Now */}
            <div id="prepare">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-heading font-black text-xl">4</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        How to Prepare Right Now
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {career.how_to_prepare_in_school.split('\n').filter((l: string) => l.trim().length > 5).map((step: string, i: number) => (
                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-[24px] flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-500 font-bold flex items-center justify-center shrink-0">
                                {i+1}
                            </div>
                            <p className="text-[14px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed pt-1.5">
                                {step.replace(/^[0-9.-]+\s*/, '')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 05: Salary Breakdown Component */}
            <div id="salary">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-heading font-black text-xl">5</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        Salary Reality Check
                    </h2>
                </div>
                
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
                    {/* Background Graphic */}
                    <div className="absolute right-0 bottom-0 opacity-[0.03] dark:opacity-5 w-64 h-64 pointer-events-none">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-px bg-gray-100 dark:bg-gray-800 p-px rounded-3xl overflow-hidden relative z-10">
                        {[
                            { label: "Starting Out", range: "0 - 3 Years", val: career.salary_entry, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                            { label: "Mid-Level Professional", range: "3 - 8 Years", val: career.salary_mid, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                            { label: "Senior Expert", range: "8+ Years", val: career.salary_senior, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }
                        ].map((s, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 p-6 md:p-8 flex flex-col justify-center text-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon}/></svg>
                                </div>
                                <h4 className="text-[14px] font-bold text-gray-800 dark:text-gray-100">{s.label}</h4>
                                <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase mb-4 mt-1">{s.range}</p>
                                <span className="text-[20px] md:text-[24px] font-black text-[#15803d] dark:text-emerald-400">{s.val}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl font-medium border border-gray-100 dark:border-gray-800">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        These figures represent general industry standards across major Indian metros. Compensation varies heavily based on skill execution and alma mater legacy.
                    </div>
                </div>
            </div>

            {/* 06: Target Colleges */}
            <div id="colleges">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-heading font-black text-xl">6</div>
                    <h2 className="text-[28px] md:text-[32px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400">
                        Target Institutions
                    </h2>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[32px] p-8 md:p-10 shadow-sm text-center md:text-left">
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mb-6 max-w-2xl">If you are aiming for {career.name}, these are some of the most prestigious academies and universities to target directly:</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {career.colleges_india?.map((coll: string, i: number) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[120px]">
                                <span className="text-[14px] font-bold text-gray-800 dark:text-gray-200 leading-tight">{coll}</span>
                            </div>
                        )) || <p className="text-gray-400 italic">No specific data available.</p>}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
                            <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Entrance Exams to Clear</h4>
                            <div className="flex flex-wrap gap-2">
                                {career.entrance_exams?.map((ex: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[13px] font-bold rounded-lg border border-gray-200 dark:border-gray-700">{ex}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
                            <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Top Employers</h4>
                            <div className="flex flex-wrap gap-2">
                                {career.top_employers?.map((emp: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[13px] font-bold rounded-lg border border-indigo-100 dark:border-indigo-800/50">{emp}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* R: SIDEBAR COLUMN (Sticky Tracker) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-6">
                
                {/* CAREER DNA BOX */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-[32px] shadow-lg shadow-gray-200/50 dark:shadow-black/50">
                    <h4 className="text-[18px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#4ade80] dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Career DNA
                    </h4>
                    
                    <div className="space-y-5">
                        {[
                            { label: "Category", value: career.category },
                            { label: "Degree Level", value: career.degree_required },
                            { label: "Market Demand", value: career.demand_level },
                            { label: "Competition", value: career.competition_level }
                        ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                <span className="text-[14px] font-bold text-gray-800 dark:text-gray-200 text-right max-w-[150px]">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                        <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 text-center">Core Skills Required</h4>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {career.skills_needed?.map((skill: string, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-md">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PARENT CTA BOX */}
                <div className="bg-[#1B4332] dark:bg-emerald-950/80 dark:border dark:border-emerald-900 text-white dark:text-emerald-50 p-8 rounded-[32px] shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5 rotate-[20deg]">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[18px] font-heading font-bold mb-2">Want to pursue this?</h4>
                        <p className="text-[13px] text-[#e0f2fe] dark:text-emerald-100/80 mb-6 leading-relaxed">Save this career to your profile and get notified about matching internships and entrance exam dates.</p>
                        
                        <button className="w-full h-12 bg-[#4ade80] dark:bg-emerald-500 text-[#1B4332] dark:text-emerald-950 font-black rounded-xl text-[14px] shadow-lg shadow-[#4ade80]/20 hover:scale-[1.02] transition-transform">
                            Save to My Profile
                        </button>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </section>
      
      {/* 07: Related Careers Section at the very bottom */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-20 mt-10 transition-colors">
          <div className="container-main max-w-[1240px] px-4">
              <div className="flex flex-col items-center text-center mb-12">
                  <h3 className="text-[28px] md:text-[36px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-400 mb-3">Keep Exploring</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">If {career.name} caught your eye, check these out too.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related?.map(c => <CareerCard key={c.id} career={c} />)}
              </div>
          </div>
      </section>
    </div>
  );
}
