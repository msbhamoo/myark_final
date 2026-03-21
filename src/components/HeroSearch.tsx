'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    router.push(`/opportunities?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4ade80]/10 focus-within:border-[#4ade80]/20 transition-all shadow-lg shadow-black/10 max-w-2xl mx-auto h-[44px] md:h-[60px]"
    >
      <div className="pl-4 text-[#6a6a64] opacity-70">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search scholarships, olympiads..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow bg-transparent border-none text-[#f0ede5] placeholder-[#555550] text-[14px] md:text-[17px] px-3 py-3 outline-none h-full font-body min-w-0"
      />

      <button
        type="submit"
        className="hidden md:flex bg-[#22c55e] text-[#0a0f0a] h-[calc(100%-8px)] my-1 mr-1 px-8 items-center justify-center font-bold rounded-xl hover:bg-[#16a34a] transition-colors text-[15px] shrink-0"
      >
        Search
      </button>
    </form>
  );
}
