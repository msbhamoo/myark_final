'use client';

import Link from 'next/link';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroFloatingCards } from '@/components/HeroFloatingCards';
import { Category } from '@/lib/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HomeHeroProps {
  categories: Category[];
}

export function HomeHero({ categories }: HomeHeroProps) {
  const [count, setCount] = useState(0);
  const targetCount = 12400;

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds

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


  return (
    <section className="w-full bg-[#0a0f0a] relative overflow-hidden">
      {/* Premium Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[800px] h-[800px] rounded-full bg-blue-600/[0.08] blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] rounded-full bg-blue-400/[0.06] blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.04] blur-[100px]"></div>
      </div>
      
      {/* Dot grid - consistent with premium feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      <div className="relative container-main max-w-[1240px] px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center min-h-[350px] md:min-h-[500px] py-10 md:py-16">

          {/* LEFT: Content */}
          <div className="flex flex-col items-start text-left max-w-xl z-10">
            <div className="group flex flex-col mb-10">
              <div className="relative inline-flex items-center">
                <div className="flex items-baseline font-heading font-black tracking-tighter transition-all duration-300">
                  <span className="text-[32px] md:text-[44px] text-primary tabular-nums">
                    {(count / 1000).toFixed(1).replace('.', ',')}
                  </span>
                  
                  <div className="relative flex items-center px-2 md:px-3 -mb-1 md:-mb-2">
                    <div className="flex -space-x-3 md:-space-x-5">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className="relative h-8 w-8 md:h-12 md:w-12 rounded-full border-[2px] md:border-[3px] border-[#0a0f0a] bg-slate-800 overflow-hidden shadow-lg animate-in fade-in zoom-in duration-700"
                          style={{ animationDelay: `${i * 200}ms` }}
                        >
                          <Image 
                            src={`https://i.pravatar.cc/150?u=${i + 20}`} 
                            alt="Student user" 
                            width={150}
                            height={150}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Tiny star icon */}
                    <div className="absolute -top-1 -right-1 md:-top-3 md:-right-2 text-xs md:text-lg animate-bounce duration-[2000ms]">
                      ⭐
                    </div>
                  </div>

                  <span className="text-[32px] md:text-[44px] text-[#f0ede5]">
                    0+
                  </span>
                </div>
              </div>
              <p className="text-[10px] md:text-[11px] font-black text-[#a8a8a0] uppercase tracking-[0.2em] mt-1 ml-0.5 opacity-80">
                Ambitious students applying this month
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-[24px] sm:text-[32px] md:text-[42px] lg:text-[48px] font-heading font-extrabold leading-[1.1] text-[#f0ede5] tracking-tight mb-4">
              Every scholarship.<br />
              <span className="text-white">Every olympiad.</span><br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">One platform.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[14px] md:text-[15px] text-[#8a8a84] max-w-md mb-8 leading-relaxed font-medium">
              India&apos;s premier directory for student excellence. Verified opportunities from top institutions, delivered to you daily.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-lg mb-8">
              <HeroSearch />
            </div>

            {/* Category Marquee */}
            <div className="w-full max-w-lg overflow-hidden mb-8 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0f0a] to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0f0a] to-transparent z-10"></div>
              <div className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]">
                {[...categories, ...categories].map((cat, i) => (
                  <Link
                    key={`${cat.id}-${i}`}
                    href={`/opportunities/category/${cat.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] font-bold text-[#8a8a84] hover:bg-white/[0.08] hover:border-primary/40 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <span className="text-[16px]">{cat.icon_name}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/[0.05] w-full">
              {[
                { label: '100% Verified', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: 'Zero Fees', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' },
                { label: 'Free Forever', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="text-[11px] font-extrabold text-[#6a6a64] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Visuals */}
          <div className="hidden lg:block relative">
            {/* Ambient Glow behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/[0.05] blur-[100px] rounded-full"></div>
            <HeroFloatingCards />
          </div>

        </div>
      </div>
    </section>
  );
}
