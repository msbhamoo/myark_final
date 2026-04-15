'use client';

import { Opportunity } from '@/lib/types';
import { formatClassRange, getDeadlineUrgency, getDaysUntilDeadline } from '@/lib/utils';
import Link from 'next/link';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Compact Running Timer Component
function RunningTimer({ deadline, isOngoing }: { deadline: string | null; isOngoing: boolean }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (isOngoing || !deadline) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) return null;

      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
       const newTime = calculateTime();
       setTimeLeft(newTime);
       if (!newTime) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, isOngoing]);

  if (isOngoing) return <span>Ongoing</span>;
  if (!timeLeft) return <span className="text-slate-400">Closed</span>;

  const isUrgent = timeLeft.d === 0 && timeLeft.h < 24;

  return (
    <div className={`inline-flex items-center gap-1.5 ${isUrgent ? 'text-rose-500' : ''}`}>
      {timeLeft.d > 0 && <span>{timeLeft.d}d</span>}
      <span>{timeLeft.h}h</span>
      <span>{timeLeft.m}m</span>
      <span className="w-[2ch] tabular-nums">{timeLeft.s}s</span>
      {isUrgent && (
         <motion.span 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1"
         />
      )}
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'default' | 'featured' | 'small' | 'journey-node' | 'minimal' | 'horizontal' | 'poster' | 'duo';
  badgeType?: 'new' | 'hot' | null;
  index?: number;
}

function getCategoryTheme(categoryLabel: string) {
  const normalized = categoryLabel?.toLowerCase().trim() || 'program';
  
  const themes: Record<string, { bg: string, border: string, text: string, dot: string, accent: string, gradient: string }> = {
    'scholarship': { 
      bg: 'bg-blue-50 dark:bg-blue-950/20', 
      border: 'border-blue-200/60 dark:border-blue-800/40', 
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
      accent: 'blue',
      gradient: 'from-blue-400 to-blue-600'
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

  // DUO VARIANT (Inspired by Duolingo / Modern Education Apps)
  if (variant === 'duo') {
      return (
         <motion.div 
            whileHover={{ y: -6 }}
            onClick={() => {
               const event = new CustomEvent('openQuickViewModal', { detail: opportunity });
               window.dispatchEvent(event);
            }}
            className={`group relative flex flex-col w-full rounded-[28px] bg-white dark:bg-[#1a1c1e] border-[3px] ${theTheme.border.replace('/60', '')} p-5 md:p-6 transition-all duration-300 cursor-pointer shadow-[0_6px_0_0_rgba(0,0,0,0.05)] active:translate-y-[4px] active:shadow-none hover:border-primary/60`}
         >
            <div className="flex justify-between items-start mb-4 md:mb-5">
               <div className={`px-2.5 md:px-3 py-1 rounded-xl bg-white dark:bg-white/5 border-2 ${theTheme.border.replace('/60', '')} flex items-center gap-1.5 shadow-sm`}>
                  <span className="text-[14px] md:text-[16px]">{opportunity.category?.icon_name || '✨'}</span>
                  <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-wider ${theTheme.text}`}>
                     {opportunity.category?.label || 'Program'}
                  </span>
               </div>
               <div className="flex gap-2">
                  <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        const classes = formatClassRange(opportunity.eligibility_classes).replace('Class', '').trim();
                        const link = `${window.location.origin}/opportunities/${opportunity.slug}`;
                        const title = opportunity.title;
                        
                        const templates = [
                           `🔥 *Don't Miss Out!*\n\nI found this amazing opportunity: "*${title}*" on Myark.in.\n\nPerfect for Class ${classes} students! Check it out before the deadline:\n\n🔗 ${link}\n\n✨ *Simplify discovery with Myark.*`,
                           `🚀 *Student Alert!*\n\nFound this top-tier scholarship/olympiad: "*${title}*" on Myark.\n\nGreat fit for Class ${classes} students. Check details here:\n\n🔗 ${link}\n\n🙌 *Helping students make their mark!*`,
                           `🔔 *Urgent Update: Class ${classes}*\n\nThe "*${title}*" is currently trending on Myark.in!\n\nIf you're in Class ${classes}, don't miss this one:\n\n🔗 ${link}\n\n🎯 *Quality opportunities at your fingertips.*`,
                           `Hey! Thought of you when I saw this: "*${title}*" on Myark.\n\nIt's specifically for Class ${classes} students. Worth checked out:\n\n🔗 ${link}\n\n✨ *Curated for Indian students.*`,
                           `🌟 *Opportunity of the week!*\n\nCheck out "*${title}*" on Myark.in. \n\nPerfect for students in Class ${classes}. Apply before it's too late:\n\n🔗 ${link}\n\n🏆 *Your journey to excellence starts here.*`,
                           `👨‍🎓 *Attention Students!* (Class ${classes})\n\nJust discovered this on Myark: "*${title}*".\n\nHigh impact opportunity for Class ${classes}. Check it out:\n\n🔗 ${link}\n\n💪 *Build your profile with Myark.*`,
                           `📢 *Parent Alert!* (Class ${classes})\n\nFound a great program for students: "*${title}*" on Myark.in.\n\nHighly recommended for Class ${classes}. Details here:\n\n🔗 ${link}\n\n👨‍👩‍👧 *Helping parents find the best for their kids.*`,
                           `💎 *Hidden Gem Found!*\n\n"*${title}*" is now live on Myark.\n\nIf you know anyone in Class ${classes}, share this with them:\n\n🔗 ${link}\n\n✨ *Exclusive opportunities for Indian students.*`,
                           `🎯 *Targeting Scholarships?*\n\nYou must check out "*${title}*" on Myark.in.\n\nDesigned for Class ${classes} excellence. More info:\n\n🔗 ${link}\n\n⚡️ *Fast, clear, and verified.*`,
                           `🔥 *Trending Now: Class ${classes}*\n\nEveryone is talking about "*${title}*" on Myark!\n\nDeadline approaching. See more:\n\n🔗 ${link}\n\n✨ *Discovery made simple.*`,
                           `🌈 *Bright Futures Start Here!*\n\nDiscovery: "*${title}*" on Myark.in.\n\nPerfect for Class ${classes} dreamers. 🔗 ${link}\n\n✨ *Myark - Make your mark!*`,
                           `👋 *Quick Recommendation!*\n\nCheck out "*${title}*" on the Myark platform.\n\nTop pick for Class ${classes} this month. 🔗 ${link}\n\n🙌 *Share with a student who needs this!*`,
                           `⌛ *Deadline Approaching!*\n\nDon't let the "*${title}*" slip away. \n\nFound on Myark.in for Class ${classes}. 🔗 ${link}\n\n🚀 *Apply today!*`,
                           `🎉 *Big Opportunity Alert!*\n\n"*${title}*" is a must-see for all Class ${classes} students.\n\nFound via Myark.in. Check it out: 🔗 ${link}\n\n🌟 *Unlock your potential.*`,
                           `⚡ *Flash News!*\n\nNew verified opportunity found: "*${title}*".\n\nCurated for Class ${classes} on Myark.in. 🔗 ${link}\n\n✨ *Discovery without the noise.*`
                        ];

                        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                        window.open(`https://wa.me/?text=${encodeURIComponent(randomTemplate)}`, '_blank');
                     }}
                     title="Share on WhatsApp"
                     className="p-2 md:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-95 transition-all"
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="md:w-[18px] md:h-[18px]"><path d="M12.031 2c-5.511 0-9.997 4.486-9.997 9.998 0 1.761.458 3.411 1.258 4.846l-1.292 4.717 4.827-1.266c1.392.756 2.979 1.196 4.67 1.196 5.511 0 9.998-4.487 9.998-9.998 0-5.511-4.487-9.998-9.998-9.998zm0 18.286c-1.579 0-3.045-.436-4.301-1.191l-.307-.181-2.859.749.762-2.784-.198-.315c-.838-1.328-1.314-2.899-1.314-4.566 0-4.569 3.717-8.286 8.286-8.286 4.568 0 8.286 3.717 8.286 8.286s-3.718 8.286-8.286 8.286zM15.54 13.91c-.191-.096-1.13-.559-1.304-.623-.175-.064-.301-.096-.427.096-.127.191-.493.623-.604.752-.111.127-.223.143-.414.048-.191-.096-.807-.297-1.537-.95-.568-.507-.951-1.135-1.063-1.326-.111-.191-.012-.294.084-.39s.191-.223.286-.335c.096-.111.127-.191.191-.319.064-.127.032-.239-.016-.335-.048-.096-.427-1.031-.585-1.411-.154-.373-.323-.322-.442-.322l-.377-.008c-.131 0-.342.049-.523.242-.181.193-.69.674-.69 1.644 0 .97.705 1.905.803 2.039.098.134 1.388 2.119 3.363 2.973.47.203.836.324 1.122.415.471.15.9.129 1.239.078.378-.057 1.13-.462 1.289-.908.159-.447.159-.831.111-.911-.048-.08-.175-.127-.366-.223z"/></svg>
                  </button>
                  <button 
                     onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                     className={`p-2 md:p-2.5 rounded-xl transition-all ${isSaved ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-primary active:scale-95'}`}
                  >
                     <BookmarkIcon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
               </div>
            </div>

            <h3 className="text-[18px] md:text-[24px] font-heading font-black text-heading leading-[1.1] mb-5 md:mb-6 group-hover:text-primary transition-colors line-clamp-2">
               {opportunity.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
               <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Eligibility</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[12px] md:text-[14px]">
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                     Class {formatClassRange(opportunity.eligibility_classes).replace('Class', '').trim()}
                  </div>
               </div>

               <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deadline</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[12px] md:text-[14px] tabular-nums">
                     <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)] ${deadlineText.includes('Closed') ? 'bg-slate-300' : 'bg-amber-500'}`}></div>
                     <RunningTimer deadline={opportunity.deadline} isOngoing={opportunity.is_ongoing} />
                  </div>
               </div>

               <div className="hidden sm:flex flex-col gap-1 min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provider</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[14px] truncate">
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)] flex-shrink-0"></div>
                     <span className="truncate">{organiserName}</span>
                  </div>
               </div>
            </div>

            <div className="mt-auto flex items-center gap-4">
               <div 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1"
               >
                  <Link 
                     href={`/opportunities/${opportunity.slug}`}
                     className={`w-full h-11 md:h-12 flex items-center justify-center rounded-[16px] md:rounded-[18px] bg-primary text-white font-black text-[13px] md:text-[14px] shadow-[0_3px_0_0_#0050CC] active:shadow-none active:translate-y-[2px] transition-all hover:brightness-110`}
                  >
                     See Details
                  </Link>
               </div>
            </div>
         </motion.div>
      );
  }

  // MINIMAL / HORIZONTAL VARIANT (USED IN RAILS)
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => {
         const event = new CustomEvent('openQuickViewModal', { detail: opportunity });
         window.dispatchEvent(event);
      }}
      className={`group relative flex flex-col h-full ${variant === 'horizontal' ? 'w-[320px] md:w-[360px] shrink-0' : 'w-full'} rounded-[24px] ${theTheme.bg} border-2 ${theTheme.border} p-5 md:p-6 transition-all duration-300 decoration-none overflow-hidden cursor-pointer`}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${theTheme.text} px-3 py-1 bg-white/80 dark:bg-black/40 rounded-lg shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] backdrop-blur-sm`}>
              {opportunity.category?.label || 'Program'}
            </span>
            {badgeType && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-white ${badgeType === 'new' ? 'bg-blue-500 shadow-md shadow-blue-500/10' : 'bg-orange-500 shadow-md shadow-orange-500/10'}`}>
                {badgeType}
              </span>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
            className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-primary bg-white/80 dark:bg-white/5 border border-black/[0.03] active:scale-95 shadow-sm'}`}
          >
            <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <div className="block mb-4">
          <h3 className="text-[17px] md:text-[20px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] leading-[1.2] group-hover:text-primary transition-colors line-clamp-2">
            {opportunity.title}
          </h3>
        </div>

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
           <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
               <Link 
                 href={`/opportunities/${opportunity.slug}`} 
                 className={`h-9 px-4 rounded-xl bg-white dark:bg-white/5 border border-black/[0.03] dark:border-white/5 text-[11px] font-black ${theTheme.text} hover:scale-105 transition-transform active:scale-95 shadow-sm flex items-center`}
               >
                  Apply
               </Link>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
