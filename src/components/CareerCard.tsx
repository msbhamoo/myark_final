import Link from 'next/link';
import { Career } from '@/lib/types';

export function CareerCard({ career }: { career: Career }) {
  const isRare = career.rarity_level === 'Rare' || career.rarity_level === 'Very Rare';
  
  // Salary display
  const salaryRange = career.salary_entry && career.salary_senior 
    ? `${career.salary_entry} → ${career.salary_senior}`
    : 'Salary Data Coming Soon';

  return (
    <Link href={`/careers/${career.slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white dark:bg-[#1A1A18] border border-default hover:border-primary transition-all rounded-3xl p-6 shadow-sm hover:shadow-xl relative overflow-hidden">
        
        {/* Rarity Badge */}
        {isRare && (
          <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Rare Career
          </div>
        )}

        <div className="mb-4">
            <span className="inline-block bg-[#4ade80]/10 text-[#4ade80] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {career.category}
            </span>
            <h3 className="text-[20px] font-heading font-bold text-heading group-hover:text-primary transition-colors leading-tight mb-2">
                {career.name}
            </h3>
            <p className="text-[13px] text-muted line-clamp-2 leading-relaxed">
                {career.short_description}
            </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-default/40">
            <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted font-bold uppercase tracking-wider w-16">Stream:</span>
                <span className="text-[12px] font-bold text-heading bg-surface border border-default px-2 py-0.5 rounded-lg whitespace-nowrap">
                    {career.stream_required}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted font-bold uppercase tracking-wider w-16">Salary:</span>
                <span className="text-[14px] font-extrabold text-[#4ade80]">
                    {salaryRange}
                </span>
            </div>
            
            <div className="mt-4 flex items-center text-[13px] font-bold text-primary group-hover:translate-x-1 transition-transform">
               View Details <span className="ml-1.5">→</span>
            </div>
        </div>
      </div>
    </Link>
  );
}
