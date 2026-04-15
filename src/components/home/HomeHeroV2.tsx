'use client';

import { Category } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HomeHeroV2Props {
  categories: Category[];
}

export function HomeHeroV2({ categories }: HomeHeroV2Props) {
  return (
    <section className="w-full bg-[#f9fafb] dark:bg-[#0a0f0a] pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">
      {/* Friendly Geometric Shapes (Duolingo Style) */}
      <div className="absolute top-10 right-[-10%] md:right-[-5%] w-48 md:w-56 h-48 md:h-56 bg-blue-100 dark:bg-blue-900/10 rounded-[64px] rotate-12 -z-0"></div>
      <div className="absolute bottom-10 left-[-10%] md:left-[-5%] w-56 md:w-64 h-56 md:h-64 bg-indigo-100 dark:bg-indigo-900/10 rounded-full -z-0"></div>

      <div className="relative container-main max-w-[1240px] px-6 z-10 text-center md:text-left">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-full mb-6 md:mb-8 shadow-sm">
            <motion.span 
               animate={{ y: [0, -3, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="text-[14px] md:text-lg"
            >
               👋
            </motion.span>
            <span className="text-[10px] md:text-[12px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Simplifying discovery</span>
          </div>

          <h1 className="text-[30px] md:text-[52px] font-heading font-black text-heading leading-[1.1] tracking-tight mb-5 md:mb-6">
            The simplest way to<br className="hidden md:block" />
            <span className="text-blue-500">find your future.</span>
          </h1>

          <p className="text-[15px] md:text-[19px] text-body mb-8 md:mb-10 font-medium max-w-2xl leading-relaxed opacity-80">
            Scholarships, Olympiads, and Careers curated for Indian students. No clutter, no ads—just clarity.
          </p>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/opportunities/category/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-3 md:p-4 rounded-[20px] md:rounded-[24px] bg-white dark:bg-[#1a1c1e] border-[3px] border-slate-100 dark:border-white/5 shadow-[0_3px_0_0_rgba(0,0,0,0.02)] hover:shadow-none hover:translate-y-[3px] transition-all"
              >
                <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon_name || '✨'}
                </div>
                <span className="text-[11px] md:text-[12px] font-black text-heading uppercase tracking-widest text-center line-clamp-1">
                  {cat.label}
                </span>
                <p className="text-[8px] md:text-[9px] text-muted font-bold mt-1 text-center opacity-70 uppercase">Explore</p>
              </Link>
            ))}

            {/* Careers Link */}
            <Link
              href="/careers"
              className="group flex flex-col items-center justify-center p-3 md:p-4 rounded-[20px] md:rounded-[24px] bg-white dark:bg-[#1a1c1e] border-[3px] border-amber-100 dark:border-amber-900/20 shadow-[0_3px_0_0_rgba(245,158,11,0.02)] hover:shadow-none hover:translate-y-[3px] transition-all"
            >
              <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">🧩</div>
              <span className="text-[11px] md:text-[12px] font-black text-heading uppercase tracking-widest text-center">Careers</span>
              <p className="text-[8px] md:text-[9px] text-muted font-bold mt-1 text-center opacity-70 uppercase">Discover</p>
            </Link>

            {/* Everything Link */}
            <Link
              href="/opportunities"
              className="group flex flex-col items-center justify-center p-3 md:p-4 rounded-[20px] md:rounded-[24px] bg-blue-500 text-white border-[3px] border-blue-600 shadow-[0_3px_0_0_#14532d] hover:shadow-none hover:translate-y-[3px] transition-all"
            >
              <div className="w-7 h-7 md:w-9 md:h-9 mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-95 md:scale-110"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
              </div>
              <span className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-center">All Items</span>
              <p className="text-[8px] md:text-[9px] text-white/80 font-bold mt-1 text-center uppercase tracking-tighter">500+ Items</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
