'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryExplorerProps {
  categories: Category[];
}

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="hidden md:block w-full bg-white dark:bg-[#0a0a0a] py-14 border-b border-[var(--color-border-default)]">
      <div className="container-main max-w-[1240px] px-6">
        <div className="flex items-start justify-between gap-4 lg:gap-6 flex-nowrap overflow-x-auto scrollbar-hide pb-2">
          {categories.slice(0, 7).map((cat) => (
            <Link
              key={cat.id}
              href={`/opportunities/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] transition-all active:scale-95"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-[24px] bg-[#f8f9fa] dark:bg-white/[0.03] group-hover:bg-white dark:group-hover:bg-white/10 group-hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300">
                <span className="text-3xl md:text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {cat.icon_name}
                </span>
              </div>
              
              <span className="text-[11px] md:text-[13px] font-bold text-[#4b5563] dark:text-[#a8a8a0] group-hover:text-primary transition-colors text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}

          {/* VIEW ALL CATEGORIES */}
          <Link
            href="/opportunities"
            className="group flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] transition-all active:scale-95 relative z-10"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-[24px] bg-[#f8f9fa] dark:bg-white/[0.03] group-hover:bg-primary transition-all duration-300">
              <span className="text-2xl md:text-3xl group-hover:text-white filter group-hover:brightness-0 group-hover:invert transition-all">
                📂
              </span>
            </div>
            
            <span className="text-[11px] md:text-[13px] font-bold text-primary group-hover:opacity-80 transition-opacity text-center leading-tight">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
