'use client';

import { useState, useEffect } from 'react';
import { RegisterModal } from '@/components/RegisterModal';
import { LogoCloud } from '@/components/home/LogoCloud';
import Image from 'next/image';
import Link from 'next/link';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Opportunity } from '@/lib/types';

interface LatestFeedProps {
   latest: Opportunity[];
   activeOppCount: number;
}

interface CategoryGroup {
   label: string;
   items: Opportunity[];
}

export function LatestFeed({ latest, activeOppCount }: LatestFeedProps) {
   const [count, setCount] = useState(0);
   const [authOpp, setAuthOpp] = useState<Opportunity | null>(null);
   const targetCount = 1000;

   useEffect(() => {
      let startTime: number;
      const duration = 2500;
      const animate = (currentTime: number) => {
         if (!startTime) startTime = currentTime;
         const progress = Math.min((currentTime - startTime) / duration, 1);
         setCount(Math.floor(progress * targetCount));
         if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
   }, []);

   if (!latest || latest.length === 0) return null;

   // Group opportunities by category
   const categoriesMap: Record<string, Opportunity[]> = {};
   latest.forEach(opp => {
      const catLabel = opp.category?.label || 'Other';
      if (!categoriesMap[catLabel]) categoriesMap[catLabel] = [];
      categoriesMap[catLabel].push(opp);
   });

   const categoryGroups: CategoryGroup[] = Object.keys(categoriesMap).map(label => ({
      label,
      items: categoriesMap[label]
   }));

   // Select top 4 for Featured Spotlight
   const featuredItems = latest.slice(0, 4);

   return (
      <section className="w-full bg-[var(--color-bg)] py-20 md:py-32 relative overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

         <div className="container-main max-w-[1440px] px-6 md:px-10 relative z-10">

            {/* UPGRADED HEADER: MINIMAL & ELEGANT */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 px-4">
               <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-12 h-[3px] bg-primary rounded-full"></span>
                     <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">Discover Excellence</span>
                  </div>
                  <h2 className="text-[36px] md:text-[56px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] tracking-tighter leading-[0.9]">
                     Unlock Your <span className="text-primary italic">Career!</span>
                  </h2>
               </div>

               <div className="flex items-center gap-8 bg-slate-50 dark:bg-white/5 p-6 rounded-[24px] border border-black/[0.03] dark:border-white/[0.03]">
                  <div className="text-right">
                     <div className="text-[24px] font-black text-heading leading-none">{activeOppCount}+</div>
                     <div className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Verified Programs</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                  <div className="text-right">
                     <div className="text-[24px] font-black text-primary leading-none">2k+</div>
                     <div className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Active Students</div>
                  </div>
               </div>
            </div>

            {/* 1. FEATURED SPOTLIGHT RAIL (POSTER CARDS) */}
            <div className="mb-32">
               <div className="flex items-center justify-between mb-8 px-4">
                  <h3 className="text-[12px] font-black text-muted uppercase tracking-[0.3em]">Featured Spotlight</h3>
                  <div className="flex gap-2">
                     <div className="w-8 h-1 bg-primary rounded-full"></div>
                     <div className="w-2 h-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                     <div className="w-2 h-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                  </div>
               </div>
               <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-4 snap-x snap-mandatory">
                  {featuredItems.map((opp) => (
                     <OpportunityCard
                        key={`featured-${opp.id}`}
                        opportunity={opp}
                        variant="poster"
                     />
                  ))}
               </div>
            </div>

            {/* 2. CATEGORY DISCOVERY RAILS */}
            <div className="space-y-32">
               {categoryGroups.map((group) => (
                  <div key={group.label} className="relative group/rail">
                     <div className="flex items-center justify-between mb-10 px-4">
                        <div className="flex flex-col">
                           <h3 className="text-[28px] md:text-[32px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] tracking-tight group-hover/rail:text-primary transition-colors">
                              {group.label}s
                           </h3>
                           <p className="text-[12px] text-muted font-medium">Explore the latest {group.label.toLowerCase()} opportunities</p>
                        </div>
                        <Link
                           href={`/opportunities/category/${group.items[0].category?.slug || ''}`}
                           className="group/link flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.2em]"
                        >
                           Show All <span className="text-lg group-hover/link:translate-x-1 transition-transform">→</span>
                        </Link>
                     </div>

                     <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-10 px-4 snap-x snap-mandatory grayscale-[0.2] hover:grayscale-0 transition-all duration-500">
                        {group.items.map((opp) => (
                           <OpportunityCard
                              key={opp.id}
                              opportunity={opp}
                              variant="horizontal"
                           />
                        ))}
                     </div>
                  </div>
               ))}
            </div>

            {/* REFINED TRUST STRIP */}
            <div className="mt-48 pt-24 border-t border-black/[0.04] dark:border-white/5">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <h3 className="text-[32px] md:text-[42px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] tracking-tighter leading-none">
                           Trusted by <span className="text-primary italic">10k +</span> Students.
                        </h3>
                        <p className="text-[17px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                           Join a global community of high-achievers from over 1,500+ top-tier schools and universities.
                        </p>
                     </div>
                     <div className="flex items-center -space-x-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                           <div key={i} className="h-14 w-14 rounded-full border-4 border-[var(--color-bg)] bg-slate-100 overflow-hidden shadow-lg hover:-translate-y-2 transition-transform relative z-0 hover:z-10 cursor-pointer">
                              <Image 
                                 src={`https://i.pravatar.cc/150?u=${i + 70}`} 
                                 alt="Student" 
                                 width={56} 
                                 height={56} 
                                 className="w-full h-full object-cover grayscale hover:grayscale-0" 
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="relative p-10 rounded-[48px] bg-slate-50 dark:bg-white/5 border border-black/[0.03] dark:border-white/5 overflow-hidden group/stats">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover/stats:scale-125 transition-transform duration-1000"></div>
                     <div className="relative z-10 grid grid-cols-2 gap-10">
                        <div>
                           <span className="text-[48px] md:text-[64px] font-heading font-black text-heading leading-none tabular-nums drop-shadow-sm">
                              {(count / 1000).toFixed(1).replace('.', ',')}K
                           </span>
                           <p className="text-primary font-black text-[11px] uppercase tracking-widest mt-2">Active Students</p>
                        </div>
                        <div>
                           <span className="text-[48px] md:text-[64px] font-heading font-black text-heading leading-none tabular-nums drop-shadow-sm">500+</span>
                           <p className="text-primary font-black text-[11px] uppercase tracking-widest mt-2">Opportunities</p>
                        </div>
                        <div>
                           <span className="text-[48px] md:text-[64px] font-heading font-black text-heading leading-none tabular-nums drop-shadow-sm">50+</span>
                           <p className="text-primary font-black text-[11px] uppercase tracking-widest mt-2">Top School</p>
                        </div>
                        <div>
                           <span className="text-[48px] md:text-[64px] font-heading font-black text-heading leading-none tabular-nums drop-shadow-sm">200+</span>
                           <p className="text-primary font-black text-[11px] uppercase tracking-widest mt-2">Organizations</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-32 w-full opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-700">
                  <LogoCloud />
               </div>
            </div>

         </div>

         {authOpp && (
            <RegisterModal
               opportunity={authOpp}
               isOpen={true}
               onClose={() => setAuthOpp(null)}
            />
         )}
      </section>
   );
}
