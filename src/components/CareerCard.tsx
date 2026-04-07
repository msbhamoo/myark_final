import Link from 'next/link';
import { Career } from '@/lib/types';
import { motion } from 'framer-motion';

export function CareerCard({ career }: { career: Career }) {
  const isRare = career.rarity_level === 'Rare' || career.rarity_level === 'Very Rare';
  
  // Salary display - making it more compact and cleaning double symbols
  const salaryRange = career.salary_entry && career.salary_senior 
    ? `₹${career.salary_entry} — ₹${career.salary_senior}`
    : 'Data Soon';

  return (
    <Link href={`/careers/${career.slug}`} className="group block h-full">
      <motion.div 
         whileHover={{ y: -6 }}
         className="flex flex-col h-full bg-white dark:bg-[#1a1c1e] border-[3px] border-slate-100 dark:border-white/5 rounded-[32px] p-6 md:p-7 transition-all duration-300 shadow-[0_6px_0_0_rgba(0,0,0,0.02)] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none hover:border-emerald-500/40"
      >
        <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider border-2 border-emerald-100/50 dark:border-emerald-800/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {career.category || 'Career'}
            </span>
            {isRare && (
               <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest bg-amber-50/50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border-2 border-amber-100/30">
                 ⭐ RARE
               </span>
            )}
        </div>

        <h3 className="text-[20px] md:text-[22px] font-heading font-black text-heading leading-[1.15] mb-2.5 group-hover:text-emerald-500 transition-colors line-clamp-1">
            {career.name}
        </h3>

        <p className="text-[13px] text-body font-medium line-clamp-2 leading-snug mb-6 opacity-75">
            {career.short_description}
        </p>

        <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-white/5 rounded-2xl border-2 border-slate-100/50 dark:border-white/5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Stream</span>
                <span className="text-[12px] font-black text-heading font-mono">
                    {career.stream_required.split(' ')[0]} {career.stream_required.includes('Science') ? 'PCM/B' : ''}
                </span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 bg-emerald-50/40 dark:bg-emerald-900/10 rounded-2xl border-2 border-emerald-100/40 dark:border-emerald-800/20">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Yearly Potential</span>
                <span className="text-[14px] md:text-[16px] font-black text-emerald-700 dark:text-emerald-300">
                    {salaryRange}
                </span>
            </div>

            <div className="pt-1.5">
               <div className="w-full h-11 flex items-center justify-center rounded-[18px] bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 text-heading font-black text-[13px] group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm">
                  Roadmap →
               </div>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}
