'use client';

import Link from 'next/link';
import { CareerCard } from '@/components/CareerCard';
import { Career } from '@/lib/types';

interface CareerExplorerHomeProps {
  featuredCareers: Career[];
}

export function CareerExplorerHome({ featuredCareers }: CareerExplorerHomeProps) {
  return (
    <section className="w-full bg-[#0a0a0a] py-16 md:py-24 relative overflow-hidden">
      {/* Premium Dark Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4ade80]/[0.02] rounded-full blur-[140px] -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1b5e28]/[0.04] rounded-full blur-[120px] -ml-32 -mb-32"></div>
      
      {/* Decorative Grid - extra subtle for dark mode */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="container-main max-w-[1240px] px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full px-3 py-1 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              <span className="text-[10px] font-black text-[#4ade80] uppercase tracking-[0.15em]">New: Career Explorer</span>
            </div>
            <h2 className="text-[28px] md:text-[42px] lg:text-[52px] font-heading font-extrabold text-white leading-[1.1] tracking-tighter mb-6">
              Discover your future.<br />
              <span className="text-[#4ade80] italic">Beyond doctor & engineer.</span>
            </h2>
            <p className="text-[16px] md:text-[17px] text-gray-400 font-medium leading-relaxed max-w-lg">
              Honest data on 150+ careers. From rare specializations to mainstream paths, find educational pathways and salary insights vetted by experts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <Link href="/careers" className="btn bg-white text-black hover:bg-gray-200 h-16 px-12 rounded-2xl font-black text-[15px] shadow-2xl transition-all hover:scale-[1.05] active:scale-[0.98] shrink-0">
               Explore 150+ Careers 
               <span className="ml-2">→</span>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredCareers.map((career) => (
            <div key={career.id} className="hover-lift">
               <CareerCard career={career} />
            </div>
          ))}
        </div>
        
        {/* Footer Link for Mobile */}
        <div className="mt-12 flex justify-center md:hidden">
           <Link href="/careers" className="text-[15px] font-bold text-[#4ade80] border-b border-[#4ade80]/30 pb-1">
              View all career paths →
           </Link>
        </div>
      </div>
    </section>
  );
}
