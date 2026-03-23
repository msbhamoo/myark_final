'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface MobileCategoriesProps {
  categories: Category[];
}

export function MobileCategories({ categories }: MobileCategoriesProps) {
  return (
    <section className="w-full md:hidden bg-[var(--color-bg)] pt-4 pb-2 border-b border-[var(--color-border-default)] relative z-10">
      <div className="container-main px-4">
        <div className="flex items-center justify-between mb-3">
           <h3 className="text-[11px] font-black text-heading uppercase tracking-widest opacity-60">Explore</h3>
           <Link href="/opportunities" className="text-[11px] font-bold text-primary">View All →</Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Link 
            href="/opportunities" 
            className="shrink-0 px-5 py-2 rounded-xl bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/20"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/opportunities/category/${cat.slug}`}
              className="shrink-0 px-5 py-2 rounded-xl bg-surface border border-[var(--color-border-default)] text-heading text-[13px] font-bold active:scale-95 transition-transform"
            >
              <span className="mr-1.5">{cat.icon_name}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
