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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse shadow-[0_0_8px_#4ade80]"></span>
              <span className="text-[11px] font-black text-[#4ade80] uppercase tracking-[0.18em]">Career Navigator</span>
            </div>
            <h2 className="text-[32px] md:text-[48px] lg:text-[62px] font-heading font-black text-white leading-[1.05] tracking-tight mb-8">
              Explore your future.<br />
              <span className="text-[#4ade80]">Beyond doctor & engineer.</span>
            </h2>
            <p className="text-[18px] md:text-[20px] text-gray-400 font-medium leading-relaxed max-w-xl">
              Handpicked data on 150+ career paths. From rare specializations to high-impact roles, find your true calling with Myark.
            </p>
          </div>
          
          <div className="flex shrink-0">
             <Link href="/careers" className="group h-16 px-10 flex items-center justify-center rounded-[20px] bg-[#4ade80] text-black font-black text-[16px] shadow-[0_6px_0_0_#1b5e28] active:shadow-none active:translate-y-[4px] transition-all hover:brightness-110">
               Explore all paths 
               <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
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
