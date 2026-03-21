'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CLASS_RANGES } from '@/lib/constants';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  categories: Category[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentCategory = searchParams.get('category') || 'all';
  const currentClass = searchParams.get('class') || 'all';
  const currentSearch = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(currentSearch);

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
    // If we're not on the opportunities page (e.g., home page search), navigate there
    if (pathname !== '/opportunities') {
      const params = new URLSearchParams();
      if (value !== 'all' && value !== '') params.set(key, value);
      router.push(`/opportunities?${params.toString()}`);
    } else {
      router.push(`/opportunities?${createQueryString(key, value)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('q', searchInput);
  };

  return (
    <div className="bg-surface border border-default rounded-xl p-4 md:p-6 shadow-sm mb-8 space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search opportunities, organisers, or keywords..." 
          className="input pl-10"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
        {/* Category Chips - Scrollable horizontally on mobile */}
        <div className="overflow-x-auto pb-2 -mb-2">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => handleFilterChange('category', 'all')}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                currentCategory === 'all' 
                  ? "bg-dark text-surface border-dark" 
                  : "bg-surface text-body border-default hover:bg-bg"
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange('category', cat.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5",
                  currentCategory === cat.slug 
                    ? "border-primary ring-1 ring-primary" 
                    : "border-transparent hover:border-default"
                )}
                style={
                  currentCategory === cat.slug
                    ? { backgroundColor: cat.bg_color, color: cat.text_color }
                    : { backgroundColor: 'var(--color-bg)', color: 'var(--color-body)' }
                }
              >
                <span>{cat.icon_name}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Class Filter */}
        <div className="shrink-0 flex items-center gap-2">
          <label htmlFor="class-filter" className="text-sm font-medium text-muted whitespace-nowrap">
            Filter by Class:
          </label>
          <select
            id="class-filter"
            value={currentClass}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="input py-1.5 px-3 max-w-[140px]"
          >
            <option value="all">All Classes</option>
            {CLASS_RANGES.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
