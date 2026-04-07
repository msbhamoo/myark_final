'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROADMAPS = {
  'Class 5-8': [
    { title: 'Foundational Olympiads', month: 'Aug - Sep', description: 'Begin your journey with Unified Council & Silverzone Olympiads.' },
    { title: 'Creative Challenges', month: 'Oct - Nov', description: 'Participate in Google Doodle or NASA Space Apps (Submissions).' },
    { title: 'Annual Check-Up', month: 'Dec - Jan', description: 'Review your achievements and prepare for early year competitions.' },
  ],
  'Class 9-10': [
    { title: 'Olympiad Peak', month: 'Aug - Oct', description: 'Focus on IOQM, NSEP, and other national level subject olympiads.' },
    { title: 'Project Innovation', month: 'Nov - Jan', description: 'Apply for Innovation challenges (INSPIRE AWS) and science fairs.' },
    { title: 'Scholarship Season', month: 'Feb - Mar', description: 'Monitor NTSE status and KVPY alternatives (if available).' },
  ],
  'Class 11-12': [
    { title: 'Master Scholarships', month: 'Jul - Sep', description: 'Focus on merit-based university scholarships (Tata, Reliance).' },
    { title: 'Global Competitions', month: 'Oct - Dec', description: 'Target international exams (IChO, IMO) and research projects.' },
    { title: 'Final Transitions', month: 'Jan - Mar', description: 'Focus on competitive exam prep & university application deadlines.' },
  ]
};

export function ClassRoadmap() {
  const [activeRange, setActiveRange] = useState<keyof typeof ROADMAPS>('Class 9-10');

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-20 md:py-32">
      <div className="container-main max-w-[1200px] px-6">
        
        <div className="max-w-3xl mb-16 md:mb-24">
           <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-800/30 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Your Class Journey</span>
           </div>
           <h2 className="text-[32px] md:text-[48px] font-heading font-black text-heading leading-[1.1] tracking-tight mb-6">
             Your Roadmap to <br />
             <span className="text-amber-500">Academic Glory.</span>
           </h2>
           <p className="text-[16px] md:text-[18px] font-medium text-slate-500 dark:text-slate-400 opacity-90 leading-relaxed mb-10">
             Student success isn&apos;t accidental. Follow a curated timeline that ensures you never miss a milestone in your academic career.
           </p>

           <div className="flex flex-wrap gap-2 md:gap-4 p-1.5 md:p-2 bg-slate-100 dark:bg-white/5 rounded-[20px] inline-flex">
              {Object.keys(ROADMAPS).map((range) => (
                 <button
                    key={range}
                    onClick={() => setActiveRange(range as keyof typeof ROADMAPS)}
                    className={`px-5 md:px-7 py-2.5 md:py-3.5 rounded-[16px] text-[13px] md:text-[14px] font-black tracking-tight transition-all active:scale-95 ${activeRange === range ? 'bg-white dark:bg-[#1a1c1e] text-primary shadow-sm border border-slate-200 dark:border-white/10' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {range}
                 </button>
              ))}
           </div>
        </div>

        <div className="relative">
           {/* Connecting Line */}
           <div className="absolute left-[24px] top-4 md:left-[32px] bottom-4 w-1 bg-slate-100 dark:bg-white/5 rounded-full hidden md:block"></div>

           <div className="space-y-12 relative z-10">
              <AnimatePresence mode="wait">
                 <motion.div
                    key={activeRange}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                 >
                    {ROADMAPS[activeRange].map((step, idx) => (
                       <motion.div 
                          key={step.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-6 md:gap-10 pb-12 last:pb-0"
                       >
                          <div className="flex flex-col items-center shrink-0">
                             <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-white dark:bg-[#1a1c1e] border-[3px] border-slate-100 dark:border-white/10 flex items-center justify-center shadow-lg group">
                                <span className="text-[12px] md:text-[14px] font-black text-amber-500 leading-none">0{idx + 1}</span>
                             </div>
                          </div>

                          <div className="pt-2 md:pt-4">
                             <span className="text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2 inline-block">
                                {step.month}
                             </span>
                             <h4 className="text-[18px] md:text-[22px] font-black text-heading mb-3">{step.title}</h4>
                             <p className="text-[14px] md:text-[16px] text-body opacity-80 leading-relaxed max-w-2xl font-medium">
                                {step.description}
                             </p>
                          </div>
                       </motion.div>
                    ))}
                 </motion.div>
              </AnimatePresence>
           </div>
        </div>

      </div>
    </section>
  );
}
