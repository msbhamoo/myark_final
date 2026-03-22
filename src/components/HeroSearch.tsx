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
      className="relative flex items-center w-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4ade80]/15 focus-within:border-[#4ade80]/25 transition-all shadow-xl shadow-black/15 h-[48px] md:h-[56px]"
    >
      <div className="pl-4 md:pl-5 text-[#6a6a64]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search scholarships, olympiads, competitions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow bg-transparent border-none text-[#f0ede5] placeholder-[#555550] text-[14px] md:text-[16px] px-3 md:px-4 py-3 outline-none h-full font-body min-w-0"
      />

      <button
        type="submit"
        className="hidden md:flex bg-[#22c55e] text-[#0a0f0a] h-[calc(100%-8px)] my-1 mr-1 px-7 items-center justify-center font-bold rounded-xl hover:bg-[#16a34a] transition-colors text-[14px] shrink-0"
      >
        Search
      </button>
    </form>
  );
}
