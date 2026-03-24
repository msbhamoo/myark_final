'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryExplorerProps {
  categories: Category[];
}

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="hidden md:block w-full bg-white dark:bg-[#0a0a0a] py-16 md:py-24 border-b border-[var(--color-border-default)]">
      <div className="container-main max-w-[1240px] px-6">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[32px] md:text-[44px] font-heading font-extrabold text-[#0a0a0a] dark:text-[#f0ede5] tracking-tight leading-none">
            Unlock Your <span className="text-primary italic">Opportunities!</span>
          </h2>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#f3e8ff] dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-800/30">
            <span className="text-purple-600 dark:text-purple-400">⚡</span>
            <span className="text-[12px] font-bold text-purple-700 dark:text-purple-300 tracking-tight">
              20K+ students Inspired to  #BeRemarkable
            </span>
          </div>
        </div>

        {/* TILES GRID */}
        <div className="flex items-stretch justify-start gap-4 flex-nowrap overflow-x-auto scrollbar-hide pb-6 h-[160px] md:h-[180px]">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/opportunities/category/${cat.slug}`}
              className="group flex flex-col min-w-[120px] md:min-w-[140px] p-4 rounded-[32px] bg-[#f1f8ff]/80 dark:bg-white/[0.03] transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 relative"
            >
              <span className="text-[12px] md:text-[13px] font-bold text-[#000000] dark:text-[#f0ede5] leading-tight mb-auto text-center group-hover:text-primary">
                {cat.label}
              </span>
              
              <div className="mt-auto transform transition-all duration-300 group-hover:scale-110 flex justify-center">
                <span className="text-4xl md:text-5xl saturate-[1.1]">
                  {cat.icon_name}
                </span>
              </div>
            </Link>
          ))}

          {/* VIEW ALL TILE */}
          <Link
            href="/opportunities"
            className="group flex flex-col min-w-[160px] md:min-w-[190px] p-6 rounded-[40px] bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-transparent border border-primary/20 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] hover:-translate-y-2 relative overflow-hidden"
          >
            <span className="text-[15px] md:text-[17px] font-black text-primary leading-tight mb-auto">
              Explore More
            </span>

            <div className="mt-auto flex justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <span className="text-6xl md:text-7xl opacity-80 group-hover:opacity-100 transition-opacity">
                📂
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
