import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { formatClassRange, formatDate, getDaysUntilDeadline } from '@/lib/utils';
import { generateMetaDescription, generateEventJsonLd, generateFaqJsonLd, opportunityPageTitle } from '@/lib/seo';
import { Opportunity } from '@/lib/types';
import { ApplyButtonWrapper } from './ApplyButton';
import { ViewTracker } from './ViewTracker';
import { cookies } from 'next/headers';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('opportunities')
    .select('title, description, deadline, registration_opens, eligibility_text, organiser:organisers(name)')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'Not Found' };

  return {
    title: opportunityPageTitle(data.title),
    description: generateMetaDescription(data as unknown as Opportunity),
  };
}

function getCategoryTagClass(categoryLabel: string) {
  const defaults = [
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  ];
  const index = categoryLabel.length % defaults.length;
  return defaults[index];
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

  const catClass = getCategoryTagClass(opportunity.category?.label || 'General');

  // Calculate Days Left
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  const isFree = opportunity.fee_text.toLowerCase().includes('free');

  // Check if student already registered
  const cookieStore = cookies();
  const studentId = cookieStore.get('myark_student')?.value;
  let hasApplied = false;
  let isSaved = false;
  let feedbackStatus = 'pending';

  if (studentId) {
    // Check registration
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

    // Check save
    const { data: save } = await supabase
      .from('student_saves')
      .select('id')
      .eq('student_id', studentId)
      .eq('opportunity_id', opportunity.id)
      .maybeSingle();
      
    if (save) isSaved = true;
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <ViewTracker opportunityId={opportunity.id} />

      <div className="bg-surface min-h-[80vh] py-6 border-t border-[var(--color-border-default)]">
        <div className="container-main max-w-6xl">

          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-8 text-[11px] font-medium text-muted">
            <span className="font-bold text-heading">my<span className="text-[var(--color-primary)]">ark</span>.in</span>
            <span className="px-1 text-hint">|</span>
            <Link href="/opportunities" className="hover:text-heading hover:underline underline-offset-2 transition-colors">Opportunities</Link>
            <span>›</span>
            <Link href={`/opportunities/category/${opportunity.category?.slug}`} className="hover:text-[var(--color-primary)] hover:underline underline-offset-2 transition-colors">
              {opportunity.category?.label}
            </Link>
            <span>›</span>
            <span className="truncate max-w-[200px] text-hint">{opportunity.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start relative">

            {/* Left Column (Main Content) */}
            <div className="flex-1 w-full max-w-3xl">

              {/* Header Badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {opportunity.category && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${catClass}`}>
                    {opportunity.category.label}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">International</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
                  {isFree ? 'Free to enter' : 'Paid entry'}
                </span>
              </div>

              {/* Title & Metadata */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-heading mb-4 leading-[1.2] tracking-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-[13px] text-body">
                <span className="font-medium text-heading">{opportunity.organiser?.name || 'Organiser'}</span>
                {opportunity.is_verified && (
                  <span className="flex items-center gap-1 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verified
                  </span>
                )}
                <span className="text-hint">Updated 2 days ago</span>
              </div>

              {/* Imminent Deadline Banner (Mockup Yellow Alert) */}
              {!opportunity.is_ongoing && daysLeft !== null && daysLeft > 0 && daysLeft <= 14 && (
                <div className="bg-[#fffbeb] border border-[#fde68a] dark:bg-amber-900/20 dark:border-amber-700/50 rounded-lg p-4 mb-8 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                  <p className="text-[13px] font-medium text-[#b45309] dark:text-amber-400">
                    Registration closes in {daysLeft} days — {formatDate(opportunity.deadline)}. Apply on the official site now.
                  </p>
                </div>
              )}

              {/* Properties Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 mb-12 bg-[#f9fafb] dark:bg-white/5 p-6 rounded-xl border border-[var(--color-border-default)]">
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Eligible Classes</h4>
                  <p className="text-[14px] font-medium text-heading">{formatClassRange(opportunity.eligibility_classes)}</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Entry Fee</h4>
                  <p className={`text-[14px] font-medium ${isFree ? 'text-[#16a34a] dark:text-green-400' : 'text-heading'}`}>
                    {opportunity.fee_text}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Deadline</h4>
                  <p className={`text-[14px] font-medium ${(daysLeft !== null && daysLeft <= 7) ? 'text-[#dc2626] dark:text-red-400' : 'text-heading'}`}>
                    {formatDate(opportunity.deadline)}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Prizes</h4>
                  <p className="text-[14px] font-medium text-heading">Recognition</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Mode</h4>
                  <p className="text-[14px] font-medium text-heading">Online submission</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-muted mb-1">Level</h4>
                  <p className="text-[14px] font-medium text-heading">International</p>
                </div>
              </div>

              {/* Full Description / About */}
              <div className="mb-12">
                <h3 className="text-[15px] font-extrabold font-heading text-heading mb-4">About this competition</h3>
                <div className="text-[14px] leading-relaxed text-body whitespace-pre-wrap space-y-4 font-body block [&_p]:mb-4">
                  {opportunity.description}
                  {opportunity.eligibility_text && (
                    <p className="mt-4">{opportunity.eligibility_text}</p>
                  )}
                </div>
              </div>

              {/* Important Dates Table Mockup style */}
              <div className="mb-12">
                <h3 className="text-[15px] font-extrabold font-heading text-heading mb-4">Important dates</h3>
                <div className="border-t border-[var(--color-border-default)]">
                  <div className="flex justify-between py-3 border-b border-[var(--color-border-default)]">
                    <span className="text-[13px] text-muted">Competition opens</span>
                    <span className="text-[13px] font-medium text-heading">{formatDate(opportunity.registration_opens)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[var(--color-border-default)]">
                    <span className="text-[13px] text-muted">Submission deadline</span>
                    <span className="text-[13px] font-medium text-[#dc2626] dark:text-red-400">{formatDate(opportunity.deadline)} {daysLeft !== null && <span className="text-[11px] ml-1">({daysLeft} days left)</span>}</span>
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              {opportunity.how_to_apply && (
                <div className="mb-12">
                  <h3 className="text-[15px] font-extrabold font-heading text-heading mb-5">How to apply — step by step</h3>
                  <div className="space-y-4">
                    {opportunity.how_to_apply.split('\n').filter(s => s.trim().length > 0).map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 shrink-0 rounded-full bg-primary text-white flex justify-center items-center text-[12px] font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-[14px] leading-relaxed text-[#374151] pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordions */}
              {opportunity.faqs && opportunity.faqs.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-[15px] font-extrabold font-heading text-heading mb-4">Frequently asked questions</h3>
                  <div className="divide-y divide-[#e5e7eb]">
                    {opportunity.faqs.map((faq, index) => (
                      <details key={index} className="group py-4">
                        <summary className="font-heading font-extrabold text-[15px] text-heading cursor-pointer list-none flex justify-between items-center outline-none">
                          {faq.question}
                          <span className="text-[#9ca3af] group-open:rotate-45 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </span>
                        </summary>
                        <div className="pt-4 text-[14px] leading-relaxed text-body font-body">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Opportunities Cards (Grid of small pill cards) */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-extrabold font-heading text-heading mb-4">Related opportunities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map(opp => (
                      <Link key={opp.id} href={`/opportunities/${opp.slug}`} className="block border border-[var(--color-border-default)] rounded-xl p-4 hover:border-primary transition-colors bg-surface hover:shadow-sm">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium mb-3 inline-block ${getCategoryTagClass(opp.category?.label || '')}`}>
                          {opp.category?.label}
                        </span>
                        <h4 className="font-extrabold text-[14px] font-heading text-heading leading-[1.3] mb-2">{opp.title}</h4>
                        <div className="flex flex-wrap gap-2 text-[11px] text-muted">
                          <span>{formatClassRange(opp.eligibility_classes).replace('Classes', 'Class')}</span>
                          <span>{opp.fee_text.includes('free') ? 'Free' : ''}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Sticky Apply Action Bar) */}
            <div className="w-full lg:w-[320px] shrink-0 sticky top-24 space-y-6">

              <div className="bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#dc2626] dark:text-red-400 mb-1">{daysLeft !== null ? `${daysLeft} days` : 'Open'}</h2>
                <p className="text-[12px] font-medium text-muted mb-6 tracking-wide">{daysLeft !== null ? 'left to apply • ' : ''}{formatDate(opportunity.deadline)}</p>

                <ApplyButtonWrapper 
                  opportunity={opportunity} 
                  initialHasApplied={hasApplied} 
                  initialFeedbackStatus={feedbackStatus}
                  initialIsSaved={isSaved}
                  daysLeft={daysLeft}
                />

                <p className="text-[10px] text-[var(--color-primary)] font-medium flex items-center justify-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-80"></span>
                  Verified link • opens official site
                </p>
              </div>

              {/* Quick Facts */}
              <div className="bg-surface rounded-2xl pt-2">
                <h4 className="text-[11px] tracking-widest uppercase font-bold text-muted mb-4">Quick Facts</h4>
                <div className="space-y-3 border-b border-[var(--color-border-default)] pb-6">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted">Organiser</span>
                    <span className="font-medium text-right text-heading max-w-[150px] truncate">{opportunity.organiser?.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted">Classes</span>
                    <span className="font-medium text-right text-heading">{formatClassRange(opportunity.eligibility_classes).replace('Classes', '').trim()}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted">Entry fee</span>
                    <span className={`font-medium text-right ${isFree ? 'text-[#16a34a] dark:text-green-400' : 'text-heading'}`}>{isFree ? 'Free' : opportunity.fee_text}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted">Mode</span>
                    <span className="font-medium text-right text-heading">Online</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted">Added to myark</span>
                    <span className="font-medium text-right text-heading">2 days ago</span>
                  </div>
                </div>

                {/* Share This */}
                <div className="py-6">
                  <h4 className="text-[11px] tracking-widest uppercase font-bold text-muted mb-3">Share This</h4>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 border border-[var(--color-border-default)] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb] dark:hover:bg-white/5 transition-colors">WhatsApp</button>
                    <button className="flex-1 py-1.5 border border-[var(--color-border-default)] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb] dark:hover:bg-white/5 transition-colors">Copy link</button>
                  </div>
                </div>

                {/* Never miss a deadline widget */}
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] dark:bg-green-900/10 dark:border-green-800/50 rounded-xl p-4">
                  <h4 className="text-[13px] font-bold text-heading mb-1.5">Never miss a deadline</h4>
                  <p className="text-[11px] text-[#166534] dark:text-green-400 leading-relaxed mb-4">Get weekly alerts for competitions matching your class and interests.</p>
                  <button className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-[12px] py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity">Set up alerts <span className="text-[10px] bg-white text-[var(--color-primary)] px-1 pt-0.5 rounded inline-block ml-1">Free</span></button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
