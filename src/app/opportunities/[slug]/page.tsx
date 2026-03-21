import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { formatClassRange, formatDate } from '@/lib/utils';
import { generateMetaDescription, generateEventJsonLd, generateFaqJsonLd, opportunityPageTitle } from '@/lib/seo';
import { Opportunity } from '@/lib/types';
import { ApplyButtonWrapper } from './ApplyButton';
import { ViewTracker } from './ViewTracker';
import { cookies } from 'next/headers';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
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

function getCategoryTagStyle(categoryLabel: string) {
  const defaults = [
    { bg: '#fdf2f8', text: '#be185d' },
    { bg: '#eff6ff', text: '#1d4ed8' },
    { bg: '#f0fdf4', text: '#15803d' },
    { bg: '#fef3c7', text: '#92400e' },
    { bg: '#f3e8ff', text: '#7e22ce' },
    { bg: '#f3f4f6', text: '#4b5563' },
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

  const catStyle = getCategoryTagStyle(opportunity.category?.label || 'General');

  // Calculate Days Left
  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : new Date();
  const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / 86400000);
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

      <div className="bg-surface min-h-[80vh] py-6 border-t border-[#e5e7eb]">
        <div className="container-main max-w-6xl">

          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-8 text-[11px] font-medium text-[#6b7280]">
            <span className="font-bold text-heading">my<span className="text-primary">ark</span>.in</span>
            <span className="px-1 text-[#d1d5db]">|</span>
            <Link href="/opportunities" className="hover:text-heading hover:underline underline-offset-2">Opportunities</Link>
            <span>›</span>
            <Link href={`/opportunities/category/${opportunity.category?.slug}`} className="hover:text-heading hover:underline underline-offset-2 hover:text-[#1b5e28]">
              {opportunity.category?.label}
            </Link>
            <span>›</span>
            <span className="text-[#9ca3af] truncate max-w-[200px]">{opportunity.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start relative">

            {/* Left Column (Main Content) */}
            <div className="flex-1 w-full max-w-3xl">

              {/* Header Badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {opportunity.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: catStyle.bg, color: catStyle.text }}>
                    {opportunity.category.label}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f3f4f6] text-[#4b5563]">International</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f3f4f6] text-[#4b5563]">
                  {isFree ? 'Free to enter' : 'Paid entry'}
                </span>
              </div>

              {/* Title & Metadata */}
              <h1 className="text-3xl sm:text-4xl font-heading font-medium text-heading mb-4 leading-[1.2] tracking-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-[13px] text-body">
                <span>{opportunity.organiser?.name || 'Organiser'}</span>
                {opportunity.is_verified && (
                  <span className="flex items-center gap-1 text-[#6b7280]">
                    Verified by Myark
                  </span>
                )}
                <span className="text-[#9ca3af]">Updated 2 days ago</span>
              </div>

              {/* Imminent Deadline Banner (Mockup Yellow Alert) */}
              {!opportunity.is_ongoing && daysLeft > 0 && daysLeft <= 14 && (
                <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-4 mb-8 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shrink-0"></div>
                  <p className="text-[13px] font-medium text-[#b45309]">
                    Registration closes in {daysLeft} days — {formatDate(opportunity.deadline)}. Apply on the official site now.
                  </p>
                </div>
              )}

              {/* Properties Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 mb-12 bg-[#f9fafb] p-6 rounded-xl border border-[#e5e7eb]">
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Eligible Classes</h4>
                  <p className="text-[14px] font-medium text-heading">{formatClassRange(opportunity.eligibility_classes)}</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Entry Fee</h4>
                  <p className={`text-[14px] font-medium ${isFree ? 'text-[#16a34a]' : 'text-heading'}`}>
                    {opportunity.fee_text}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Deadline</h4>
                  <p className={`text-[14px] font-medium ${daysLeft <= 7 ? 'text-[#dc2626]' : 'text-heading'}`}>
                    {formatDate(opportunity.deadline)}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Prizes</h4>
                  <p className="text-[14px] font-medium text-heading">Recognition</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Mode</h4>
                  <p className="text-[14px] font-medium text-heading">Online submission</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#6b7280] mb-1">Level</h4>
                  <p className="text-[14px] font-medium text-heading">International</p>
                </div>
              </div>

              {/* Full Description / About */}
              <div className="mb-12">
                <h3 className="text-[15px] font-bold text-heading mb-4">About this competition</h3>
                <div className="text-[14px] leading-relaxed text-[#374151] whitespace-pre-wrap space-y-4 font-body">
                  {opportunity.description}
                  {opportunity.eligibility_text && (
                    <p className="mt-4">{opportunity.eligibility_text}</p>
                  )}
                </div>
              </div>

              {/* Important Dates Table Mockup style */}
              <div className="mb-12">
                <h3 className="text-[15px] font-bold text-heading mb-4">Important dates</h3>
                <div className="border-t border-[#e5e7eb]">
                  <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[13px] text-[#4b5563]">Competition opens</span>
                    <span className="text-[13px] font-medium text-heading">{formatDate(opportunity.registration_opens)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[13px] text-[#4b5563]">Submission deadline</span>
                    <span className="text-[13px] font-medium text-[#dc2626]">{formatDate(opportunity.deadline)} <span className="text-[11px]">({daysLeft} days left)</span></span>
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              {opportunity.how_to_apply && (
                <div className="mb-12">
                  <h3 className="text-[15px] font-bold text-heading mb-5">How to apply — step by step</h3>
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
                  <h3 className="text-[15px] font-bold text-heading mb-4">Frequently asked questions</h3>
                  <div className="divide-y divide-[#e5e7eb]">
                    {opportunity.faqs.map((faq, index) => (
                      <details key={index} className="group py-4">
                        <summary className="font-heading font-medium text-[15px] text-heading cursor-pointer list-none flex justify-between items-center outline-none">
                          {faq.question}
                          <span className="text-[#9ca3af] group-open:rotate-45 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </span>
                        </summary>
                        <div className="pt-4 text-[14px] leading-relaxed text-[#4b5563] font-body">
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
                  <h3 className="text-[15px] font-bold text-heading mb-4">Related opportunities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map(opp => (
                      <Link key={opp.id} href={`/opportunities/${opp.slug}`} className="block border border-[#e5e7eb] rounded-xl p-4 hover:border-primary transition-colors">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#fdf2f8] text-[#be185d] mb-3 inline-block">
                          {opp.category?.label}
                        </span>
                        <h4 className="font-medium text-[14px] text-heading leading-[1.3] mb-2">{opp.title}</h4>
                        <div className="flex flex-wrap gap-2 text-[11px] text-[#6b7280]">
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

              <div className="bg-surface border border-[#e5e7eb] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
                <h2 className="text-4xl font-heading font-medium text-[#dc2626] mb-1">{daysLeft} days</h2>
                <p className="text-[12px] font-medium text-[#6b7280] mb-6 tracking-wide">left to apply • {formatDate(opportunity.deadline)}</p>

                <ApplyButtonWrapper 
                  opportunity={opportunity} 
                  initialHasApplied={hasApplied} 
                  initialFeedbackStatus={feedbackStatus}
                  initialIsSaved={isSaved}
                />

                <p className="text-[10px] text-[#16a34a] font-medium flex items-center justify-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                  Verified link • opens official site
                </p>
              </div>

              {/* Quick Facts */}
              <div className="bg-surface rounded-2xl pt-2">
                <h4 className="text-[11px] tracking-widest uppercase font-bold text-[#6b7280] mb-4">Quick Facts</h4>
                <div className="space-y-3 border-b border-[#e5e7eb] pb-6">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Organiser</span>
                    <span className="font-medium text-right text-heading max-w-[150px] truncate">{opportunity.organiser?.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Classes</span>
                    <span className="font-medium text-right text-heading">{formatClassRange(opportunity.eligibility_classes).replace('Classes', '').trim()}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Entry fee</span>
                    <span className={`font-medium text-right ${isFree ? 'text-[#16a34a]' : 'text-heading'}`}>{isFree ? 'Free' : opportunity.fee_text}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Mode</span>
                    <span className="font-medium text-right text-heading">Online</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Added to myark</span>
                    <span className="font-medium text-right text-heading">2 days ago</span>
                  </div>
                </div>

                {/* Share This */}
                <div className="py-6">
                  <h4 className="text-[11px] tracking-widest uppercase font-bold text-[#6b7280] mb-3">Share This</h4>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 border border-[#e5e7eb] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb]">WhatsApp</button>
                    <button className="flex-1 py-1.5 border border-[#e5e7eb] rounded-md text-[12px] font-medium text-heading hover:bg-[#f9fafb]">Copy link</button>
                  </div>
                </div>

                {/* Never miss a deadline widget */}
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
                  <h4 className="text-[13px] font-bold text-heading mb-1.5">Never miss a deadline</h4>
                  <p className="text-[11px] text-[#166534] leading-relaxed mb-4">Get weekly alerts for competitions matching your class and interests.</p>
                  <button className="w-full bg-primary text-white text-[12px] font-medium py-2 rounded shadow-sm hover:bg-[#15803d]">Set up alerts <span className="text-[10px] bg-white text-primary px-1 pt-0.5 rounded inline-block ml-1">Free</span></button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
