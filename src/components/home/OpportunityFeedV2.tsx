'use client';

import { Opportunity } from '@/lib/types';
import { OpportunityCard } from '@/components/OpportunityCard';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpportunityFeedV2Props {
  initialOpportunities: Opportunity[];
  title?: string;
  subtitle?: string;
  badge?: string;
  accentColor?: 'blue' | 'blue' | 'indigo' | 'amber';
  showGradeFilter?: boolean;
  viewAllLink?: string;
  limit?: number;
}

export function OpportunityFeedV2({
  initialOpportunities,
  title = "Top Trending For Your Class.",
  subtitle = "We've analyzed thousands of programs. Here are the top picks specifically for your academic level.",
  badge = "Curated Intelligence",
  accentColor = "blue",
  showGradeFilter = true,
  viewAllLink = "/opportunities",
  limit = 6
}: OpportunityFeedV2Props) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const filteredOpportunities = useMemo(() => {
    if (!selectedGrade) return initialOpportunities.slice(0, limit);

    return initialOpportunities.filter(opp => {
      const classes = opp.eligibility_classes || [];
      return classes.includes(selectedGrade);
    }).slice(0, limit);
  }, [initialOpportunities, selectedGrade, limit]);

  const grades = [5, 6, 7, 8, 9, 10, 11, 12];

  const colors = {
    emerald: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-100 dark:border-blue-800/30',
      dot: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      primary: 'text-blue-500',
      btn: 'bg-blue-500 shadow-[0_3px_0_0_#0066FF]'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-100 dark:border-blue-800/30',
      dot: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      primary: 'text-blue-500',
      btn: 'bg-blue-500 shadow-[0_3px_0_0_#1e3a8a]'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-100 dark:border-indigo-800/30',
      dot: 'bg-indigo-500',
      text: 'text-indigo-600 dark:text-indigo-400',
      primary: 'text-indigo-500',
      btn: 'bg-indigo-500 shadow-[0_3px_0_0_#312e81]'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-800/30',
      dot: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      primary: 'text-amber-500',
      btn: 'bg-amber-500 shadow-[0_3px_0_0_#92400e]'
    }
  };

  const c = colors[accentColor];

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-20 md:py-32 first-of-type:pt-16">
      <div className="container-main max-w-[1200px] px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div className="max-w-xl">
            <div className={`inline-flex items-center gap-1.5 ${c.bg} px-2.5 py-1 rounded-lg border ${c.border} mb-3`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`}></span>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${c.text}`}>{badge}</span>
            </div>
            <h2 className="text-[28px] md:text-[42px] font-heading font-black text-heading leading-[1.1] tracking-tight">
              {title.split(' ').map((word, i) => (
                <span key={i} className={word.endsWith('.') ? c.primary : ''}>{word} </span>
              ))}
            </h2>
            <p className="text-[15px] md:text-[17px] text-body mt-4 font-medium max-w-lg opacity-80 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex shrink-0">
            <Link
              href={viewAllLink}
              className={`group h-14 px-8 flex items-center justify-center rounded-[20px] bg-slate-50 dark:bg-white/5 border-[3px] border-slate-100 dark:border-white/10 text-[14px] font-black text-heading uppercase tracking-widest hover:border-${accentColor}-500/30 transition-all active:scale-95 shadow-[0_5px_0_0_rgba(0,0,0,0.02)] active:translate-y-[2px] active:shadow-none`}
            >
              Explore All <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Grade Filter UI */}
        {showGradeFilter && (
          <div className="mb-8 md:mb-10">
            <div className="relative flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 rounded-[24px] md:rounded-[32px] bg-slate-50 dark:bg-white/[0.015] border-2 border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/10 dark:shadow-none overflow-hidden">
              {/* Subtle accent glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] ${c.dot}/30 blur-[1px]`}></div>

              <div className="flex flex-col items-center text-center mb-2 md:mb-4">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">Feed Customizer</span>
                <h3 className="text-[14px] md:text-[18px] font-heading font-black text-heading leading-none">Which class are you in?</h3>
              </div>

              <div className="w-full max-w-xl mx-auto">
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className={`px-3 md:px-5 h-8 md:h-10 rounded-[12px] md:rounded-xl flex items-center justify-center text-[10px] md:text-[12px] font-black transition-all active:scale-95 border-2 shadow-[0_2px_0_0_rgba(0,0,0,0.03)] active:translate-y-[1px] active:shadow-none ${!selectedGrade ? `${c.btn.replace('3px', '2px')} text-white` : 'bg-white dark:bg-[#1a1c1e] border-slate-100 dark:border-white/10 text-slate-400 hover:border-blue-500/40'}`}
                  >
                    All Classes
                  </button>
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-[12px] md:rounded-xl flex items-center justify-center text-[12px] md:text-[14px] font-black transition-all active:scale-95 border-2 shadow-[0_2px_0_0_rgba(0,0,0,0.03)] active:translate-y-[1px] active:shadow-none ${selectedGrade === grade ? `${c.btn.replace('3px', '2px')} text-white` : 'bg-white dark:bg-[#1a1c1e] border-slate-100 dark:border-white/10 text-slate-400 hover:border-blue-500/40'}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 min-h-[400px] content-start">
          <AnimatePresence mode="popLayout">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp, idx) => (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <OpportunityCard
                    opportunity={opp}
                    variant="duo"
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-heading mb-2">No items for Grade {selectedGrade}</h3>
                <p className="text-slate-400 font-medium italic">We&apos;re constantly adding new programs. Check back soon!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            href={viewAllLink}
            className={`inline-flex items-center gap-2 text-[14px] font-black ${c.text} uppercase tracking-widest hover:gap-3 transition-all`}
          >
            View All Opportunities <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
