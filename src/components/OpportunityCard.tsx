'use client';

import { Opportunity } from '@/lib/types';
import { formatClassRange, getDeadlineUrgency, getDaysUntilDeadline } from '@/lib/utils';
import Link from 'next/link';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'default' | 'featured' | 'small' | 'journey-node' | 'minimal' | 'horizontal' | 'poster';
  badgeType?: 'new' | 'hot' | null;
  index?: number;
}

function getCategoryTheme(categoryLabel: string) {
  const normalized = categoryLabel?.toLowerCase().trim() || 'program';
  
  const themes: Record<string, { bg: string, border: string, text: string, dot: string, accent: string, gradient: string }> = {
    'scholarship': { 
      bg: 'bg-emerald-50 dark:bg-emerald-950/20', 
      border: 'border-emerald-200/60 dark:border-emerald-800/40', 
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      accent: 'emerald',
      gradient: 'from-emerald-400 to-emerald-600'
    },
    'competition': { 
      bg: 'bg-blue-50 dark:bg-blue-950/20', 
      border: 'border-blue-200/60 dark:border-blue-800/40', 
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
      accent: 'blue',
      gradient: 'from-blue-400 to-blue-600'
    },
    'olympiad': { 
      bg: 'bg-purple-50 dark:bg-purple-950/20', 
      border: 'border-purple-200/60 dark:border-purple-800/40', 
      text: 'text-purple-700 dark:text-purple-400',
      dot: 'bg-purple-500',
      accent: 'purple',
      gradient: 'from-purple-400 to-purple-600'
    },
    'hackathon': { 
      bg: 'bg-rose-50 dark:bg-rose-950/20', 
      border: 'border-rose-200/60 dark:border-rose-800/40', 
      text: 'text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500',
      accent: 'rose',
      gradient: 'from-rose-400 to-rose-600'
    },
    'internship': { 
      bg: 'bg-indigo-50 dark:bg-indigo-950/20', 
      border: 'border-indigo-200/60 dark:border-indigo-800/40', 
      text: 'text-indigo-700 dark:text-indigo-400',
      dot: 'bg-indigo-500',
      accent: 'indigo',
      gradient: 'from-indigo-400 to-indigo-600'
    },
    'program': { 
      bg: 'bg-amber-50 dark:bg-amber-950/20', 
      border: 'border-amber-200/60 dark:border-amber-800/40', 
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-400',
      accent: 'amber',
      gradient: 'from-amber-400 to-amber-600'
    },
    'innovation': { 
      bg: 'bg-cyan-50 dark:bg-cyan-950/20', 
      border: 'border-cyan-200/60 dark:border-cyan-800/40', 
      text: 'text-cyan-700 dark:text-cyan-400',
      dot: 'bg-cyan-400',
      accent: 'cyan',
      gradient: 'from-cyan-400 to-cyan-600'
    },
  };
  
  return themes[normalized] || { 
    bg: 'bg-slate-50 dark:bg-slate-900/40', 
    border: 'border-slate-200/60 dark:border-white/10', 
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
    accent: 'slate',
    gradient: 'from-slate-400 to-slate-600'
  };
}

export function OpportunityCard({ 
  opportunity, 
  variant = 'minimal', 
  badgeType = null,
}: OpportunityCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const organiserName = opportunity.organiser?.name || 'Organiser';
  const { label } = getDeadlineUrgency(opportunity.deadline, opportunity.is_ongoing);
  
  let deadlineText = label.replace('Closes in ', '').replace(' left', ' d left');
  if (label.includes('Registration Open')) deadlineText = 'Open — ' + label.replace('Registration Open - ', '');
  if (label.includes('Closes in')) deadlineText = label.replace('Closes in ', '') + ' d';
  if (label.includes('Urgent')) deadlineText = 'Closing soon';
  if (label.includes('Today')) deadlineText = 'Today';

  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  
  if (!opportunity.is_ongoing && daysLeft !== null && daysLeft > 0) {
    if (daysLeft <= 7) deadlineText = `${daysLeft} d left`;
    else deadlineText = `In ${daysLeft} d`;
  } else if (opportunity.is_ongoing) {
    deadlineText = 'Ongoing';
  } else if (daysLeft !== null && daysLeft <= 0) {
    deadlineText = 'Closed';
  }

  const theTheme = getCategoryTheme(opportunity.category?.label || '');

  // POSTER VARIANT: HIGH IMPACT VISUAL CARDS
  if (variant === 'poster') {
     return (
        <motion.div 
           whileHover={{ y: -8, scale: 1.02 }}
           className="relative w-[280px] md:w-[320px] aspect-[5/6] rounded-[32px] overflow-hidden group/poster shrink-0 shadow-2xl"
        >
           {/* Visual Background (Gradient-based Poster) */}
           <div className={`absolute inset-0 bg-gradient-to-br ${theTheme.gradient} opacity-90 transition-transform duration-700 group-hover/poster:scale-110`}></div>
           <div className="absolute inset-0 bg-black/20 group-hover/poster:bg-black/10 transition-colors"></div>
           
           {/* Decorative Design Elements */}
           <div className="absolute top-0 right-0 p-8 opacity-20">
              <div className="w-24 h-24 border-8 border-white rounded-full"></div>
           </div>
           <div className="absolute bottom-[-20%] left-[-10%] p-8 opacity-10">
              <div className="w-40 h-40 bg-white rounded-full blur-3xl"></div>
           </div>

           {/* Content Overlay */}
           <div className="absolute inset-0 p-5 md:p-6 flex flex-col z-10">
              <div className="flex justify-between items-start mb-auto">
                 <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                    {opportunity.category?.label || 'Program'}
                 </span>
                 <button onClick={() => setIsSaved(!isSaved)} className={`p-2 rounded-full backdrop-blur-md transition-colors ${isSaved ? 'bg-primary text-white' : 'bg-white/10 text-white/60 hover:text-white'}`}>
                    <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                 </button>
              </div>

              <div className="space-y-2">
                 <h3 className="text-[20px] md:text-[24px] font-heading font-black text-white leading-tight tracking-tight drop-shadow-lg">
                    {opportunity.title}
                 </h3>
                 <div className="flex items-center gap-3 text-white/80 text-[12px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-white/10">Classes {formatClassRange(opportunity.eligibility_classes)}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 uppercase">{deadlineText}</span>
                 </div>
                 
                 <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] font-black text-white/60 uppercase tracking-widest truncate max-w-[120px]">
                       {organiserName}
                    </span>
                    <Link href={`/opportunities/${opportunity.slug}`} className="h-10 w-10 rounded-full bg-white text-heading flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                       <span className="text-xl">→</span>
                    </Link>
                 </div>
              </div>
           </div>
        </motion.div>
     );
  }

  // MINIMAL / HORIZONTAL VARIANT (USED IN RAILS)
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col h-full ${variant === 'horizontal' ? 'w-[320px] md:w-[360px] shrink-0' : 'w-full'} rounded-[24px] ${theTheme.bg} border-2 ${theTheme.border} p-5 md:p-6 transition-all duration-300 decoration-none overflow-hidden`}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${theTheme.text} px-3 py-1 bg-white/80 dark:bg-black/40 rounded-lg shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] backdrop-blur-sm`}>
              {opportunity.category?.label || 'Program'}
            </span>
            {badgeType && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-white ${badgeType === 'new' ? 'bg-emerald-500 shadow-md shadow-emerald-500/10' : 'bg-orange-500 shadow-md shadow-orange-500/10'}`}>
                {badgeType}
              </span>
            )}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }}
            className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-primary bg-white/80 dark:bg-white/5 border border-black/[0.03] active:scale-95 shadow-sm'}`}
          >
            <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/opportunities/${opportunity.slug}`} className="block mb-4">
          <h3 className="text-[17px] md:text-[20px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] leading-[1.2] group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {opportunity.title}
          </h3>
        </Link>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
           <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Eligibility</span>
              <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">Class {formatClassRange(opportunity.eligibility_classes).replace('Class', '').trim()}</span>
           </div>
           <div className="flex flex-col gap-0.5 items-end">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Deadline</span>
              <span className={`text-[13px] font-bold ${deadlineText.includes('Closed') ? 'text-slate-400' : theTheme.text}`}>{deadlineText}</span>
           </div>
        </div>

        {/* Footer Card */}
        <div className="mt-auto pt-4 border-t border-black/[0.03] dark:border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-full ${theTheme.bg} flex items-center justify-center border ${theTheme.border} shadow-sm flex-shrink-0 bg-white dark:bg-slate-800`}>
                 <span className="text-[12px] leading-none select-none">🏛️</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 truncate pr-1 uppercase tracking-tight">{organiserName}</span>
           </div>
           <Link 
             href={`/opportunities/${opportunity.slug}`} 
             className={`h-9 px-4 rounded-xl bg-white dark:bg-white/5 border border-black/[0.03] dark:border-white/5 text-[11px] font-black ${theTheme.text} hover:scale-105 transition-transform active:scale-95 shadow-sm flex items-center`}
           >
              Apply
           </Link>
        </div>
      </div>
    </motion.div>
  );
}
