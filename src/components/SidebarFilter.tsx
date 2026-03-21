'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { CLASS_RANGES } from '@/lib/constants';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarFilterProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
}

export function SidebarFilter({ categories, categoryCounts }: SidebarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentCategory = searchParams.get('category') || 'all';
  const currentClass = searchParams.get('class') || 'all';
  // const currentFee = searchParams.get('fee') || 'all';
  // const currentDeadline = searchParams.get('deadline') || 'all';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(`${pathname}?${createQueryString(key, value)}`);
  };

  return (
    <div className="w-full bg-surface">
      
      {/* Category List */}
      <div className="mb-8 pl-1">
        <h4 className="text-[11px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Category</h4>
        <div className="space-y-3.5">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            const count = categoryCounts[cat.id] || 0;
            return (
              <label key={cat.id} className="flex items-center justify-between group cursor-pointer pr-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                    isActive ? "bg-[#1b5e28] border-[#1b5e28]" : "border-[#d1d5db] bg-white group-hover:border-[#9ca3af]"
                  )}>
                    {isActive && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className={cn("text-[13.5px] cursor-pointer select-none", isActive ? "text-heading font-medium" : "text-body")}>
                    {cat.label}
                  </span>
                </div>
                <span className="text-[11.5px] text-[#9ca3af] font-medium tracking-wide">{count}</span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isActive} 
                  onChange={() => handleFilterChange('category', isActive ? 'all' : cat.slug)}
                />
              </label>
            )
          })}
        </div>
      </div>

      {/* Class Horizontal Pills */}
      <div className="mb-8 pl-1">
        <h4 className="text-[11px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Class</h4>
        <div className="flex flex-wrap gap-2.5">
          {CLASS_RANGES.map((r) => {
            const isActive = currentClass === r.slug;
            const shortLabel = r.label.replace('Class ', '');
            
            return (
              <button
                key={r.slug}
                onClick={() => handleFilterChange('class', isActive ? 'all' : r.slug)}
                className={cn(
                  "w-[46px] h-[46px] rounded-full border flex flex-col items-center justify-center text-[11px] leading-tight font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive 
                    ? "bg-[#1b5e28] border-[#1b5e28] text-white" 
                    : "bg-surface border-[#e5e7eb] text-body hover:border-[#9ca3af]"
                )}
              >
                <span>{shortLabel}-</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Entry Fee (mock visually) */}
      <div className="mb-8 pl-1">
        <h4 className="text-[11px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Entry Fee</h4>
        <div className="space-y-3.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 rounded-[4px] border bg-[#1b5e28] border-[#1b5e28] flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <span className="text-[13.5px] text-heading font-medium">Free to enter</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 rounded-[4px] border bg-[#1b5e28] border-[#1b5e28] flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <span className="text-[13.5px] text-heading font-medium">Under ₹500</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 rounded-[4px] border border-[#d1d5db] bg-white group-hover:border-[#9ca3af] flex items-center justify-center"></div>
            <span className="text-[13.5px] text-body">₹500 and above</span>
          </label>
        </div>
      </div>

      {/* Deadline (mock visually) */}
      <div className="mb-8 pl-1">
        <h4 className="text-[11px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Deadline</h4>
        <div className="space-y-3.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 rounded-[4px] border border-[#d1d5db] bg-white group-hover:border-[#9ca3af] flex items-center justify-center"></div>
            <span className="text-[13.5px] text-body">Closing this week</span>
          </label>
        </div>
      </div>

    </div>
  );
}
