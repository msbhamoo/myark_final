import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { supabase as supabaseAnon } from '@/lib/supabase';
import { formatClassRange, formatDate, getDaysUntilDeadline, renderMarkdown, formatStatusDate } from '@/lib/utils';
import { generateOpportunityMetadata, generateEventJsonLd, generateFaqJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { Opportunity } from '@/lib/types';
import { ApplyButtonWrapper } from './ApplyButton';
import { ViewTracker } from './ViewTracker';
import { cookies } from 'next/headers';
import { ShareWidget } from './ShareWidget';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { data } = await supabaseAnon
    .from('opportunities')
    .select('*, organiser:organisers(name)')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'Not Found' };

  return generateOpportunityMetadata(data as unknown as Opportunity);
}



export default async function OpportunityDetail({ params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  const { data: oppData } = await supabase
    .from('opportunities')
    .select('*, category:categories(*), organiser:organisers(*)')
    .eq('slug', params.slug)
    .single();

  if (!oppData) {
    notFound();
  }

  const opportunity = oppData as Opportunity;

  const { data: relatedData } = await supabase
    .from('opportunities')
    .select('title, slug, eligibility_classes, fee_text, deadline, category:categories(*), organiser:organisers(*)')
    .eq('category_id', opportunity.category_id)
    .neq('id', opportunity.id)
    .eq('is_published', true)
    .limit(4);

  const related = (relatedData as unknown as Opportunity[]) || [];

  const eventJsonLd = generateEventJsonLd(opportunity);
  const faqJsonLd = generateFaqJsonLd(opportunity.faqs);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', href: '/' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: opportunity.category?.label || 'Category', href: `/opportunities/category/${opportunity.category?.slug}` },
    { name: opportunity.title, href: `/opportunities/${opportunity.slug}` },
  ]);

  const daysLeft = getDaysUntilDeadline(opportunity.deadline);

  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;
  let hasApplied = false;
  let isSaved = false;
  let feedbackStatus = 'pending';

  if (studentId) {
    const { data: reg } = await supabase
      .from('registrations')
      .select('id, feedback_status')
      .eq('student_id', studentId)
      .eq('opportunity_id', opportunity.id)
      .maybeSingle();
      
    if (reg) {
      hasApplied = true;
      feedbackStatus = reg.feedback_status || 'pending';
    }

    const { data: save } = await supabase
      .from('student_saves')
      .select('id')
      .eq('student_id', studentId)
      .eq('opportunity_id', opportunity.id)
      .maybeSingle();
      
    if (save) isSaved = true;
  }

  const stepHowToApply = opportunity.how_to_apply ? opportunity.how_to_apply.split('\n').filter(s => s.trim().length > 0) : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ViewTracker opportunityId={opportunity.id} />

      <div className="bg-white dark:bg-[#0a0f0a] min-h-screen relative overflow-hidden">
        {/* Geometric Accents (Matching Home Hero) */}
        <div className="absolute top-10 right-[-10%] w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-[64px] rotate-12 -z-0 opacity-50"></div>
        <div className="absolute bottom-20 left-[-5%] w-80 h-80 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -z-0 opacity-50"></div>

        <div className="container-main max-w-[1240px] px-6 relative z-10 pt-10 pb-20">
          
          {/* Breadcrumb Pill (Matching Home Hero style) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-full mb-10 shadow-sm">
             <span className="text-[14px]">🛡️</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Program • <Link href="/opportunities" className="hover:text-primary">All Opportunities</Link></span>
          </div>

          {/* Massive Header Section */}
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 rounded-lg bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest border-b-4 border-blue-700">
                  {opportunity.category?.label || 'Direct Entry'}
               </span>
               <span className="text-slate-400 font-black tracking-widest uppercase text-[11px]">
                  by {opportunity.organiser?.name || 'Authorized Body'}
               </span>
            </div>

            <h1 className="text-[34px] md:text-[54px] font-heading font-black text-heading leading-[1.05] tracking-tight mb-8">
              {opportunity.title}
            </h1>

            {/* High-Density Physical Stat Cards (Success Hub Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-14">
               {[
                 { label: 'Eligibility', value: formatClassRange(opportunity.eligibility_classes), icon: '🎓', color: 'slate' },
                 { label: 'Entry Fee', value: opportunity.fee_text, icon: '💰', color: opportunity.fee_text.toLowerCase().includes('free') ? 'blue' : 'slate' },
                 { label: 'Deadline', value: formatDate(opportunity.deadline), icon: '📅', color: (daysLeft !== null && daysLeft <= 14) ? 'red' : 'indigo' },
                 { label: 'Mode', value: 'Online', icon: '⚡', color: 'amber' }
               ].map((stat) => (
                 <div 
                   key={stat.label} 
                   className={`flex flex-col p-4 md:p-5 rounded-[24px] md:rounded-[28px] bg-white dark:bg-[#1a1c1e] border-[3px] shadow-[0_4px_0_0_rgba(0,0,0,0.02)] transition-all ${stat.color === 'blue' ? 'border-blue-100' : stat.color === 'red' ? 'border-red-100' : 'border-slate-100 dark:border-white/5'}`}
                 >
                    <div className="text-2xl md:text-3xl mb-3">{stat.icon}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className={`text-[15px] font-black truncate ${stat.color === 'blue' ? 'text-blue-500' : stat.color === 'red' ? 'text-red-500' : 'text-heading'}`}>
                       {stat.value}
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Responsive Two-Column Layout (Sidebar Restored) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-16">
               
               {/* 1. Program Brief */}
               <section>
                  <h2 className="text-[28px] font-black text-heading mb-6 flex items-center gap-3">
                     The Brief. <span className="w-12 h-1 bg-blue-500 rounded-full"></span>
                  </h2>
                  <div 
                    className="prose-hub max-w-none text-[18px] leading-[1.8] text-body font-medium [&_p]:mb-6 [&_strong]:font-black [&_strong]:text-heading [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_li]:mb-2 [&_h2]:text-[26px] [&_h2]:font-black [&_h2]:mt-10"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(opportunity.description) }}
                  />
               </section>

               {/* 2. Process / Timeline Card */}
               <section className="p-8 md:p-10 rounded-[36px] bg-slate-50 dark:bg-white/[0.02] border-[3px] border-slate-100 dark:border-white/5 shadow-sm">
                  <h3 className="text-[22px] font-black text-heading mb-8">Important Timeline.</h3>
                  <div className="space-y-4">
                     {[
                       { label: 'Applications Open', value: formatStatusDate(opportunity.registration_opens, opportunity.registration_opens_tentative) },
                       { label: 'Closing Soon (Deadline)', value: formatStatusDate(opportunity.deadline, opportunity.deadline_tentative), critical: true },
                       { label: 'Evaluation / Exam', value: opportunity.event_date ? formatStatusDate(opportunity.event_date, opportunity.event_date_tentative) : 'TBA' }
                     ].map((date) => (
                       <div key={date.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white dark:border-white/5 last:border-0 hover:translate-x-1 transition-transform">
                          <span className="text-[13px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 sm:mb-0">{date.label}</span>
                          <span className={`text-[16px] font-black ${date.critical ? 'text-red-500' : 'text-heading'}`}>{date.value}</span>
                       </div>
                     ))}
                  </div>
               </section>

               {/* 3. How to Apply */}
               {stepHowToApply.length > 0 && (
                 <section>
                    <h3 className="text-[24px] font-black text-heading mb-10">Application Process.</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {stepHowToApply.map((step, i) => (
                         <div key={i} className="p-6 rounded-[28px] bg-white dark:bg-[#1a1c1e] border-[3px] border-slate-100 dark:border-white/5 shadow-[0_4px_0_0_rgba(0,0,0,0.02)] hover:translate-y-[-2px] transition-all">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[18px] font-black italic mb-4">
                               0{i + 1}
                            </div>
                            <div 
                              className="text-[15px] leading-[1.6] text-body font-bold [&_p]:mb-0 [&_a]:text-primary [&_a]:underline font-bold"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(step) }}
                            />
                         </div>
                       ))}
                    </div>
                 </section>
               )}

               {/* 4. FAQs - Clean Success Style */}
               {opportunity.faqs && opportunity.faqs.length > 0 && (
                 <section className="mt-20">
                   <h3 className="text-[24px] font-black text-heading mb-10">Common Questions.</h3>
                   <div className="space-y-4">
                     {opportunity.faqs.map((faq, index) => (
                       <div key={index} className="p-7 rounded-[32px] bg-slate-50 dark:bg-white/[0.02] border-[3px] border-slate-100 dark:border-white/5">
                         <h5 className="text-[17px] font-black text-heading mb-3">{faq.question}</h5>
                         <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                       </div>
                     ))}
                   </div>
                 </section>
               )}
            </div>

            {/* Sticky Action Hub (Sidebar) */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="p-8 rounded-[40px] bg-white dark:bg-[#1a1c1e] border-[4px] border-slate-100 dark:border-white/10 shadow-[0_10px_0_0_rgba(0,0,0,0.04)] text-center">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">🚀</div>
                 <h4 className="text-[24px] font-black text-heading mb-2 leading-tight">Ready to start?</h4>
                 <p className="text-[13px] font-medium text-slate-500 mb-10 px-4 leading-relaxed">Click to open the verified official application host.</p>
                 
                 <div className="space-y-6">
                    <ApplyButtonWrapper 
                      opportunity={opportunity} 
                      initialHasApplied={hasApplied} 
                      initialFeedbackStatus={feedbackStatus}
                      initialIsSaved={isSaved}
                      daysLeft={daysLeft}
                    />
                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                       <ShareWidget title={opportunity.title} slug={opportunity.slug} />
                    </div>
                 </div>
              </div>

              {/* Related Paths Card */}
              {related.length > 0 && (
                <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/[0.01] border-2 border-slate-100 dark:border-white/5">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-2">More for your Path</h4>
                   <div className="space-y-3">
                      {related.map(opp => (
                        <Link key={opp.id} href={`/opportunities/${opp.slug}`} className="block p-5 rounded-[24px] bg-white dark:bg-[#1a1c1e] border-2 border-transparent hover:border-blue-500/30 transition-all group">
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">{opp.category?.label}</span>
                           <h5 className="text-[14px] font-black text-heading leading-[1.3] group-hover:text-primary transition-colors mt-1 line-clamp-2">{opp.title}</h5>
                        </Link>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar (Success Hub Style) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0a0f0a]/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
           <div className="max-w-md mx-auto">
              <ApplyButtonWrapper 
                opportunity={opportunity} 
                initialHasApplied={hasApplied} 
                initialFeedbackStatus={feedbackStatus}
                initialIsSaved={isSaved}
                daysLeft={daysLeft}
              />
           </div>
        </div>

        {/* Spacer for Mobile Sticky Bar */}
        <div className="h-24 lg:hidden"></div>
      </div>
    </>
  );
}
