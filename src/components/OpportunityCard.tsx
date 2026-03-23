'use client';

import { Opportunity } from '@/lib/types';
import { formatClassRange, getDeadlineUrgency, getDaysUntilDeadline } from '@/lib/utils';
import Link from 'next/link';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { useState } from 'react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'default' | 'featured';
  badgeType?: 'new' | 'hot' | null;
  onAuthNeeded?: (opp: Opportunity) => void;
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

export function OpportunityCard({ 
  opportunity, 
  variant = 'default', 
  badgeType = null,
  onAuthNeeded 
}: OpportunityCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const organiserName = opportunity.organiser?.name || 'Organiser';
  const { label } = getDeadlineUrgency(opportunity.deadline, opportunity.is_ongoing);
  
  let deadlineText = label.replace('Closes in ', '').replace(' left', ' days left');
  if (label.includes('Registration Open')) deadlineText = 'Open — ' + label.replace('Registration Open - ', '');
  if (label.includes('Closes in')) deadlineText = label.replace('Closes in ', '') + ' days left — apply now';
  if (label.includes('Urgent')) deadlineText = 'Closing soon — apply now';

  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  
  if (!opportunity.is_ongoing && daysLeft !== null && daysLeft > 0) {
    if (daysLeft <= 7) deadlineText = `${daysLeft} days left — apply now`;
    else deadlineText = `Open — ${daysLeft} days`;
  } else if (opportunity.is_ongoing) {
    deadlineText = 'Ongoing';
  } else if (daysLeft !== null && daysLeft <= 0) {
    deadlineText = 'Closed';
  } else {
    deadlineText = 'Open registration';
  }

  const theFee = opportunity.fee_text.toLowerCase().includes('free') ? 'Free to enter' : opportunity.fee_text;
  if (variant === 'featured') {
    return (
      <div className="group relative flex flex-col h-full rounded-[32px] bg-white dark:bg-[#161616] border-2 border-primary/10 hover:border-primary px-8 py-10 md:px-12 md:py-14 transition-all overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Background glow decorator */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-[80px] pointer-events-none"></div>
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Featured</span>
              {opportunity.category && (
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${getCategoryTagClass(opportunity.category.label)}`}>
                  {opportunity.category.label}
                </span>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              aria-label="Save for later" 
              className={`transition-all ${isSaved ? 'text-primary scale-110' : 'text-[#9ca3af] hover:text-primary active:scale-90'}`}
            >
              <BookmarkIcon className={`w-8 h-8 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <Link href={`/opportunities/${opportunity.slug}`} className="block mb-8 group">
            <h3 className="text-[32px] md:text-[44px] font-heading font-extrabold text-[#1a1c1e] dark:text-white leading-[1.05] tracking-tight group-hover:text-primary transition-colors cursor-pointer">
              {opportunity.title}
            </h3>
          </Link>

          <p className="text-[17px] text-muted font-medium leading-relaxed line-clamp-4 mb-auto max-w-[90%]">
             Discover one of the most prestigious opportunities in our database. This program offers exceptional resources and support for high-achieving students across the country. Join many others in applying today.
          </p>

          <div className="pt-10 mt-10 border-t border-[#f3f4f6] dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex flex-wrap items-center gap-4">
                <div className="px-5 py-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border-default)]">
                   <span className="text-[14px] font-black text-heading">{formatClassRange(opportunity.eligibility_classes)}</span>
                </div>
                <div className="px-5 py-2.5 bg-primary/5 rounded-2xl border border-primary/10">
                   <span className="text-[14px] font-black text-primary">{theFee}</span>
                </div>
                <div className="text-[13px] font-bold text-muted ml-1">
                   {deadlineText}
                </div>
             </div>
             <Link href={`/opportunities/${opportunity.slug}`} className="btn bg-primary text-white h-14 px-10 rounded-[20px] font-bold text-[16px] shadow-xl shadow-primary/20">
                View Details &rarr;
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#161616] border border-[#e5e7eb] dark:border-white/10 rounded-[20px] p-6 flex flex-col group transition-all hover:shadow-md relative h-full">
        
        {/* 1. TOP ROW: Tag + Badge + Bookmark */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            {opportunity.category && (
              <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${getCategoryTagClass(opportunity.category.label)}`}>
                {opportunity.category.label}
              </span>
            )}
            {badgeType === 'new' && (
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20">NEW</span>
            )}
            {badgeType === 'hot' && (
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-orange-500/20">HOT</span>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Check if user is logged in (Demo check via cookie)
            const isStudent = document.cookie.includes('myark_student=');
            if (!isStudent && onAuthNeeded) {
               onAuthNeeded(opportunity);
               return;
            }
  
              setIsSaved(!isSaved);
            }}
            aria-label="Save for later" 
            className={`transition-all ${isSaved ? 'text-primary scale-110' : 'text-[#9ca3af] hover:text-primary active:scale-90'}`}
          >
            <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 2. TITLE */}
        <Link href={`/opportunities/${opportunity.slug}`} className="block mb-4">
          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a1c1e] dark:text-[#f0ede5] leading-tight group-hover:text-primary transition-colors cursor-pointer">
            {opportunity.title}
          </h3>
        </Link>

        {/* 3. DETAILS (Inline) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 text-[14px] text-[#6b7280] dark:text-[#a8a8a0] font-medium">
          <span>{formatClassRange(opportunity.eligibility_classes)}</span>
          <span className="text-[#d1d5db]">·</span>
          <span>{theFee}</span>
          <span className="text-[#d1d5db]">·</span>
          <span>International</span>
        </div>

        {/* 4. DEADLINE/URGENCY */}
        <div className={`text-[14px] font-bold mb-6 ${deadlineText.includes('apply now') ? 'text-amber-600 dark:text-amber-500' : 'text-primary'}`}>
          {deadlineText}
        </div>

        {/* 5. FOOTER */}
        <div className="pt-5 mt-auto border-t border-[#f3f4f6] dark:border-white/5 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#9ca3af] truncate pr-4">
            {organiserName}
          </span>
          <Link 
            href={`/opportunities/${opportunity.slug}`}
            className="text-[14px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            View details <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
