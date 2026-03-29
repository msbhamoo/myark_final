'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface OpportunityFiltersProps {
  categories: { id: string; label: string }[];
}

export function OpportunityFilters({ categories }: OpportunityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get('q') || '');
  const debouncedQ = useDebounce(q, 500);
  
  const status = searchParams.get('status') || '';
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQ) params.set('q', debouncedQ);
    else params.delete('q');
    params.set('page', '1'); // reset to page 1
    router.push(`/admin/opportunities?${params.toString()}`);
  }, [debouncedQ, router, searchParams]);

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('status', val);
    else params.delete('status');
    params.set('page', '1');
    router.push(`/admin/opportunities?${params.toString()}`);
  };

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('category', val);
    else params.delete('category');
    params.set('page', '1');
    router.push(`/admin/opportunities?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-[#161616] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm mb-8 transition-all">
      <div className="w-full lg:flex-1 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <svg className="text-gray-400 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" 
          placeholder="Search items by title or identifier..."
          className="w-full h-12 pl-12 pr-4 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-white/5 outline-none rounded-xl text-sm font-medium transition-all dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 hidden xl:block">Filter by:</span>
          <select 
            className="h-12 px-4 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:border-primary dark:focus:border-primary outline-none rounded-xl text-xs font-bold transition-all dark:text-gray-300 appearance-none min-w-[130px] cursor-pointer hover:bg-white dark:hover:bg-white/5"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts Only</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>

        <select 
          className="h-12 px-4 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:border-primary dark:focus:border-primary outline-none rounded-xl text-xs font-bold transition-all dark:text-gray-300 appearance-none min-w-[160px] cursor-pointer hover:bg-white dark:hover:bg-white/5"
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>

        {(q || status || categoryId) && (
          <button 
            onClick={() => router.push('/admin/opportunities')}
            className="h-12 px-5 text-[10px] font-black text-red-500/80 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all rounded-xl uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
