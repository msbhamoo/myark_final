'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect, useCallback } from 'react';

const STREAMS = [
  "All", 
  "Science PCM", 
  "Science PCB", 
  "Science PCM+B", 
  "Commerce", 
  "Arts/Humanities", 
  "Any Stream"
];

const CATEGORIES = [
  "All", "Medicine & Healthcare", "Engineering", "Science & Research", "Technology", 
  "Business & Finance", "Creative Arts", "Fashion", "Media & Film", 
  "Sports", "Environment", "Hospitality & Food", "Unusual Careers"
];

export function CareerFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentStream = searchParams.get('stream') || 'All';
    const currentCategory = searchParams.get('category') || 'All';
    const currentQ = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(currentQ);

    const updateFilters = useCallback((updates: { stream?: string, category?: string, q?: string }) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (updates.stream !== undefined) {
            if (updates.stream === 'All') params.delete('stream');
            else params.set('stream', updates.stream);
        }
        
        if (updates.category !== undefined) {
            if (updates.category === 'All') params.delete('category');
            else params.set('category', updates.category);
        }

        if (updates.q !== undefined) {
            if (!updates.q.trim()) params.delete('q');
            else params.set('q', updates.q);
        }

        startTransition(() => {
            router.push(`/careers?${params.toString()}`, { scroll: false });
        });
    }, [searchParams, router]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== currentQ) {
                updateFilters({ q: searchQuery });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, currentQ, updateFilters]);

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/40 flex flex-col gap-8 relative z-20 -mt-10 mx-4 md:mx-0">
            
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search careers, e.g. 'Doctor', 'Game Developer'..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 dark:focus:ring-blue-500/30 focus:border-[#1B4332]/30 dark:focus:border-blue-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                />
                {isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-[#1B4332] dark:border-t-blue-400 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Stream Filter */}
            <div>
                <h3 className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Choose Your Stream
                </h3>
                <div className="flex flex-wrap gap-2">
                    {STREAMS.map(s => {
                        const isActive = currentStream === s;
                        return (
                            <button 
                                key={s} 
                                onClick={() => updateFilters({ stream: s })}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                                    isActive 
                                    ? 'bg-[#1B4332] dark:bg-blue-600 border-[#1B4332] dark:border-blue-500 text-white shadow-md transform -translate-y-0.5' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#1B4332]/30 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Explore by Interest
                </h3>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => {
                        const isActive = currentCategory === c;
                        return (
                            <button 
                                key={c}
                                onClick={() => updateFilters({ category: c })} 
                                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all border ${
                                    isActive 
                                    ? 'bg-[#70A5FF]/20 dark:bg-blue-500/20 text-[#1B4332] dark:text-blue-300 border-[#70A5FF]/50 dark:border-blue-500/50 shadow-sm' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
