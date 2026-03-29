import Link from 'next/link';
import { Career } from '@/lib/types';

export function CareerCard({ career }: { career: Career }) {
  const isRare = career.rarity_level === 'Rare' || career.rarity_level === 'Very Rare';
  
  // Salary display
  const salaryRange = career.salary_entry && career.salary_senior 
    ? `${career.salary_entry} → ${career.salary_senior}`
    : 'Data Coming Soon';

  return (
    <Link href={`/careers/${career.slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#4ade80] dark:hover:border-[#4ade80] transition-all duration-300 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4ade80]/10 dark:hover:shadow-[#4ade80]/10 relative overflow-hidden">
        
        {/* Rarity Badge */}
        {isRare && (
          <div className="absolute top-5 right-5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-200 dark:border-amber-800/50 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Rare
          </div>
        )}

        <div className="mb-5 pr-16 border-b border-gray-100 dark:border-gray-800 pb-5">
            <span className="inline-block bg-[#e0f2fe] dark:bg-sky-900/40 text-[#0369a1] dark:text-sky-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-3 border border-sky-100 dark:border-sky-800">
                {career.category}
            </span>
            <h3 className="text-[20px] md:text-[22px] font-heading font-extrabold text-[#1B4332] dark:text-emerald-100 group-hover:text-[#4ade80] dark:group-hover:text-[#4ade80] transition-colors leading-tight mb-3">
                {career.name}
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                {career.short_description}
            </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Stream
                </span>
                <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">
                    {career.stream_required}
                </span>
            </div>
            
            <div className="flex justify-between items-center bg-[#f0fdf4] dark:bg-emerald-950/30 rounded-xl p-3 border border-[#4ade80]/20 dark:border-emerald-800/40">
                <span className="text-[11px] text-[#166534] dark:text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Salary
                </span>
                <span className="text-[13px] font-extrabold text-[#15803d] dark:text-emerald-300">
                    {salaryRange}
                </span>
            </div>
        </div>
      </div>
    </Link>
  );
}
