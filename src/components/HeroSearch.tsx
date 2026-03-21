'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLASS_RANGES } from '@/lib/constants';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    if (selectedClass !== 'all') params.set('class', selectedClass);
    router.push(`/opportunities?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center bg-white border border-[#d1d5db] rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-[#1b5e28]/10 focus-within:border-[#1b5e28] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto h-[60px] md:h-[72px]"
    >
      <div className="pl-6 text-[#9ca3af]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <input 
        type="text" 
        placeholder="Search competitions, scholarships..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow bg-transparent border-none text-heading placeholder-[#9ca3af] text-[16px] md:text-[18px] px-4 py-4 outline-none h-full font-body min-w-0"
      />
      
      <div className="hidden md:flex items-center h-full border-l border-[#e5e5e5] bg-[#fafafa]">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-transparent border-none py-2 px-6 h-full text-[14px] font-medium text-heading outline-none cursor-pointer focus:ring-0 appearance-none pr-8"
          style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
        >
          <option value="all">Any Class</option>
          {CLASS_RANGES.map(r => (
            <option key={r.slug} value={r.slug}>{r.label.replace('Class ', 'Class ')}</option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        className="hidden md:flex bg-[#1b5e28] text-white h-full px-10 items-center justify-center font-medium hover:bg-[#14461e] transition-colors text-[16px] shrink-0"
      >
        Search
      </button>
    </form>
  );
}
