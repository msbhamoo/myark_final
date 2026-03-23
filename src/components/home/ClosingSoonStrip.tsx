'use client';

import Link from 'next/link';
import { getDaysUntilDeadline } from '@/lib/utils';
import { Opportunity } from '@/lib/types';

interface ClosingSoonStripProps {
  items: Pick<Opportunity, 'title' | 'slug' | 'deadline'>[];
}

export function ClosingSoonStrip({ items }: ClosingSoonStripProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full bg-white dark:bg-[#0a0a09] py-8 sm:py-12 border-b border-default/50">
      <div className="container-main max-w-[800px] px-4">
        {/* EXACT STYLE FROM IMAGE: Yellow Box */}
        <div className="bg-[#fffbeb] dark:bg-amber-950/10 border-2 border-[#fef3c7] dark:border-amber-900/30 rounded-[24px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-[14px] md:text-[16px] font-bold text-[#92400e] dark:text-amber-500 mb-6">
            Closing soon — don&apos;t miss these
          </h3>

          <div className="flex flex-col">
            {items.slice(0, 3).map((item, i) => {
              const days = getDaysUntilDeadline(item.deadline as string) || 0;
              
              // Color mapping based on urgency as in image
              let tagColor = "bg-[#fdf2f2] text-[#991b1b]"; // Urgent (Pinkish/Red)
              if (days > 7) tagColor = "bg-[#fffbeb] text-[#92400e]"; // Upcoming (Yellow/Amber)
              if (days > 20) tagColor = "bg-[#f0fdf4] text-[#166534]"; // Distant (Green)

              return (
                <Link 
                  key={i} 
                  href={`/opportunities/${item.slug}`}
                  className={`flex items-center justify-between py-4 ${i !== items.slice(0, 3).length - 1 ? 'border-b border-[#f3f4f1] dark:border-white/5' : ''} group`}
                >
                  <span className="text-[14px] md:text-[16px] font-bold text-[#1a1c1e] dark:text-[#f0ede5] group-hover:text-[#92400e] transition-colors leading-tight pr-4">
                    {item.title}
                  </span>
                  <div className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-bold ${tagColor}`}>
                    {days} days
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
