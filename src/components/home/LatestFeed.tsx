'use client';

import Link from 'next/link';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Opportunity } from '@/lib/types';
import { useState, useEffect } from 'react';
import { RegisterModal } from '@/components/RegisterModal';
import Image from 'next/image';

interface LatestFeedProps {
   latest: Opportunity[];
   activeOppCount: number;
}

export function LatestFeed({ latest, activeOppCount }: LatestFeedProps) {
   const [count, setCount] = useState(0);
   const [authOpp, setAuthOpp] = useState<Opportunity | null>(null);
   const targetCount = 12400;

   useEffect(() => {
      let startTime: number;
      const duration = 2500; // 2.5 seconds

      const animate = (currentTime: number) => {
         if (!startTime) startTime = currentTime;
         const progress = Math.min((currentTime - startTime) / duration, 1);
         setCount(Math.floor(progress * targetCount));

         if (progress < 1) {
            requestAnimationFrame(animate);
         }
      };

      requestAnimationFrame(animate);
   }, []);

   if (!latest || latest.length === 0) return null;

   return (
      <section className="w-full bg-[var(--color-bg)] py-12 md:py-24 relative overflow-hidden">
         {/* Decorative Grid Overlay */}
         <div className="absolute inset-0 grid-pattern opacity-[0.3] pointer-events-none"></div>

         {/* Background radial glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/[0.02] rounded-full blur-[140px] pointer-events-none"></div>

         <div className="container-main max-w-[1240px] px-4 relative z-10">

            {/* HEADER — Exact style from image */}
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-[18px] md:text-[20px] font-bold text-heading">
                  Latest opportunities
               </h2>
               <Link href="/opportunities" className="text-[14px] font-bold text-primary hover:underline flex items-center gap-1">
                  See all <span className="text-[18px]">→</span>
               </Link>
            </div>

            {/* DESKTOP: BENTO GRID LAYOUT (3 Columns, Perfect Balance) */}
            <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 mb-16">
               {/* Main Featured (Spans 2 columns, 2 rows) */}
               <div className="lg:col-span-2 lg:row-span-2 group/bento">
                  <OpportunityCard
                     opportunity={latest[0]}
                     variant="featured"
                     badgeType="new"
                     onAuthNeeded={setAuthOpp}
                  />
               </div>

               {/* Items to fill the side of Featured (2 items) */}
               {latest.slice(1, 3).map((opp: Opportunity) => (
                  <div key={opp.id} className="group/bento hover-lift">
                     <OpportunityCard
                        opportunity={opp}
                        variant="default"
                        badgeType="new"
                        onAuthNeeded={setAuthOpp}
                     />
                  </div>
               ))}

               {/* Row 3 (3 full cards) */}
               {latest.slice(3, 6).map((opp: Opportunity) => (
                  <div key={opp.id} className="group/bento hover-lift">
                     <OpportunityCard
                        opportunity={opp}
                        variant="default"
                        onAuthNeeded={setAuthOpp}
                     />
                  </div>
               ))}

               {/* Row 4 (2 cards + 1 CTA card) */}
               {latest.slice(6, 8).map((opp: Opportunity) => (
                  <div key={opp.id} className="group/bento hover-lift">
                     <OpportunityCard
                        opportunity={opp}
                        variant="default"
                        badgeType="hot"
                        onAuthNeeded={setAuthOpp}
                     />
                  </div>
               ))}

               {/* DESKTOP CTA CARD — Sits in the final cell */}
               <Link
                  href="/opportunities"
                  className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-emerald-500/[0.03] border-2 border-dashed border-primary/10 hover:border-primary/30 transition-all hover:bg-emerald-500/[0.05] group/cta relative overflow-hidden min-h-[250px] cursor-pointer"
               >
                  <div className="absolute inset-0 grid-pattern opacity-[0.1] -rotate-12 scale-150"></div>
                  <div className="relative z-10 flex flex-col items-center">
                     <div className="text-4xl mb-6 transform group-hover/cta:scale-125 transition-transform duration-500">✨</div>
                     <h3 className="text-[18px] font-heading font-extrabold text-heading mb-3 text-center">Looking for something specific?</h3>
                     <p className="text-[12px] text-muted text-center mb-6 font-medium">
                        Explore our full directory of {activeOppCount} active programs.
                     </p>
                     <div className="btn bg-primary text-white h-12 px-8 rounded-xl font-bold text-[14px] shadow-lg shadow-primary/20">
                        View All Feed →
                     </div>
                  </div>
               </Link>
            </div>

            {/* MOBILE: VERTICAL LIST LAYOUT (As per current request) */}
            <div className="flex md:hidden flex-col gap-6 mb-12">
               {latest.slice(0, 8).map((opp: Opportunity, i: number) => (
                  <div key={opp.id} className="w-full">
                     <OpportunityCard
                        opportunity={opp}
                        variant="default"
                        badgeType={i < 3 ? 'new' : (i > 5 ? 'hot' : null)}
                        onAuthNeeded={setAuthOpp}
                     />
                  </div>
               ))}
               {/* MOBILE CTA CARD */}
               <Link
                  href="/opportunities"
                  className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-emerald-500/[0.03] border-2 border-dashed border-primary/10 hover:border-primary/30 transition-all hover:bg-emerald-500/[0.05] group/cta relative overflow-hidden min-h-[250px] cursor-pointer"
               >
                  <div className="absolute inset-0 grid-pattern opacity-[0.1] -rotate-12 scale-150"></div>
                  <div className="relative z-10 flex flex-col items-center">
                     <div className="text-3xl mb-4 transform group-hover/cta:scale-125 transition-transform duration-500">✨</div>
                     <h3 className="text-[18px] font-heading font-extrabold text-heading mb-2 text-center">Looking for something specific?</h3>
                     <p className="text-[13px] text-muted text-center mb-6 font-medium">
                        Explore our full directory of {activeOppCount} opportunities.
                     </p>
                     <div className="btn bg-primary text-white h-12 w-full rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/20">
                        Explore Full Feed →
                     </div>
                  </div>
               </Link>
            </div>

            {/* STYLIZED TICKER — Image Style */}
            <div className="mt-20 flex flex-col items-center justify-center space-y-4">
               <div className="relative inline-flex items-center">
                  {/* Main Text */}
                  <div className="flex items-baseline font-heading font-black tracking-tighter transition-all duration-300">
                     <span className="text-[48px] md:text-[72px] lg:text-[100px] text-primary tabular-nums">
                        {(count / 1000).toFixed(1).replace('.', ',')}
                     </span>

                     {/* Avatars Integrated into '00' or around it */}
                     <div className="relative flex items-center px-4 -mb-2 md:-mb-4">
                        <div className="flex -space-x-4 md:-space-x-8">
                           {[1, 2, 3].map((i) => (
                              <div
                                 key={i}
                                 className="relative h-12 w-12 md:h-20 md:w-20 lg:h-28 lg:w-28 rounded-full border-[3px] md:border-[6px] border-[var(--color-bg)] bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
                                 style={{ animationDelay: `${i * 150}ms` }}
                              >
                                 <Image 
                                src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                                alt="Student user" 
                                width={120}
                                height={120}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                             />
                              </div>
                           ))}
                        </div>
                        {/* Decorative Star/Icon */}
                        <div className="absolute -top-4 -right-2 md:-top-10 md:-right-6 text-2xl md:text-5xl animate-bounce">
                           ⭐
                        </div>
                     </div>

                     <span className="text-[48px] md:text-[72px] lg:text-[100px] text-heading">
                        0+
                     </span>
                  </div>
               </div>

               <div className="text-center">
                  <p className="text-[14px] md:text-[18px] font-bold text-muted tracking-tight">
                     Join <span className="text-heading font-black italic">high-achieving students</span> applying this week.
                  </p>
                  <Link href="/opportunities" className="inline-flex items-center gap-2 mt-4 text-[13px] font-black text-primary hover:underline group">
                     Start your journey today
                     <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
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
