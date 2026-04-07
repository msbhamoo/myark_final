'use client';

import { motion } from 'framer-motion';

export function OpportunityStatsStrip() {
  const stats = [
    { label: 'Verified Programs', value: '500+', icon: '🛡️' },
    { label: 'Active Students', value: '10,000+', icon: '👥' },
    { label: 'Prize Pool', value: '₹5Cr+', icon: '🏆' },
    { label: 'Support 24/7', value: 'Live', icon: '💬' }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a] border-y border-slate-100 dark:border-white/5 py-6">
      <div className="container-main max-w-[1200px] px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 group justify-center lg:justify-start"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[18px] group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div>
                <div className="text-[18px] md:text-[22px] font-black text-heading leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
