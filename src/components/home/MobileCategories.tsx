'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface MobileCategoriesProps {
  categories: Category[];
}

export function MobileCategories({ categories }: MobileCategoriesProps) {
  return (
    <section className="w-full md:hidden bg-white dark:bg-[#0a0a0a] pt-8 pb-4 border-b border-[var(--color-border-default)] relative z-10">
      <div className="container-main px-4">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[18px] font-extrabold text-[#0a0a0a] dark:text-[#f0ede5] tracking-tight">Explore <span className="text-primary">Opportunities</span></h3>
           <Link href="/opportunities" className="text-[11px] font-bold text-primary uppercase tracking-wider">All →</Link>
        </div>
        
        <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide pb-5 h-[140px]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/opportunities/category/${cat.slug}`}
              className="shrink-0 flex flex-col w-[100px] p-4 rounded-[24px] bg-[#f1f8ff]/80 dark:bg-white/[0.03] active:scale-95 transition-all shadow-sm"
            >
              <span className="text-[11px] font-bold text-[#000000] dark:text-[#f0ede5] leading-tight mb-auto text-center">
                {cat.label}
              </span>
              
              <div className="mt-auto flex justify-center">
                <span className="text-3xl saturate-[1.1]">
                  {cat.icon_name}
                </span>
              </div>
            </Link>
          ))}
          
          {/* VIEW ALL MOBILE */}
          <Link
            href="/opportunities"
            className="shrink-0 flex flex-col w-[140px] p-4 rounded-[32px] bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-transparent border border-primary/20 active:scale-95 transition-all"
          >
            <span className="text-[14px] font-black text-primary leading-tight mb-auto">
              Explore More
            </span>
            <div className="mt-auto flex justify-center">
              <span className="text-4xl opacity-80">📂</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
