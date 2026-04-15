'use client';

import { motion } from 'framer-motion';

const STORIES = [
  {
    name: 'Arjun Mehta',
    class: 'Class 10',
    achievement: 'IOQM Qualifier 2024',
    avatar: '👨‍🎓',
    quote: 'Myark helped me find IOQM resources when I was completely lost.',
    tag: 'Olympiads'
  },
  {
    name: 'Sanya Iyer',
    class: 'Class 12',
    achievement: 'Tata Scholarship Winner',
    avatar: '👩‍🎓',
    quote: 'The clutter-free interface made it so easy to track my application.',
    tag: 'Scholarships'
  },
  {
    name: 'Karthik R.',
    class: 'Class 8',
    achievement: 'Unified Council Topper',
    avatar: '👦',
    quote: 'I check Myark every Sunday to see what is trending for my class.',
    tag: 'Trending'
  }
];

export function SuccessStories() {
  return (
    <section className="w-full bg-slate-50 dark:bg-[#080808] py-16 md:py-20 overflow-hidden">
      <div className="container-main max-w-[1200px] px-6">
        
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 mb-3">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Trust & Proof</span>
          </div>
          <h2 className="text-[28px] md:text-[36px] font-heading font-black text-heading leading-tight tracking-tight">
            Loved by <span className="text-primary">10,000+</span> <br className="hidden md:block" />
            students & parents.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STORIES.map((story, idx) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-[#1a1c1e] p-8 rounded-[32px] border-2 border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-primary/30 transition-all"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute top-6 right-8 text-slate-100 dark:text-white/5 text-6xl font-serif select-none group-hover:text-primary/10 transition-colors">
                &ldquo;
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {story.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-heading text-[16px] leading-tight">{story.name}</h4>
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{story.class}</span>
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                   {story.achievement}
                </div>

                <p className="text-[16px] text-body italic font-medium leading-relaxed opacity-90">
                  &quot;{story.quote}&quot;
                </p>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 border-2 border-white dark:border-[#1a1c1e]"></div>
                      ))}
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+12 others verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Social Proof Bar */}
        <div className="mt-20 md:mt-32 p-8 md:p-12 rounded-[40px] bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-primary/30">
           {/* Abstract Circle Decorations */}
           <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

           <div className="relative z-10 text-center md:text-left">
              <h3 className="text-[24px] md:text-[32px] font-heading font-black leading-tight mb-2">Join the smart generation.</h3>
              <p className="text-white/80 font-medium text-[16px] md:text-[18px]">Never miss a breakthrough opportunity again.</p>
           </div>

           <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="text-center">
                 <div className="text-[28px] md:text-[36px] font-black leading-none mb-1">10k+</div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-white/60">Active Users</div>
              </div>
              <div className="w-[1px] h-12 bg-white/20 hidden md:block"></div>
              <div className="text-center">
                 <div className="text-[28px] md:text-[36px] font-black leading-none mb-1">500+</div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-white/60">Programs</div>
              </div>
              <div className="w-[1px] h-12 bg-white/20 hidden md:block"></div>
              <div className="text-center">
                 <div className="text-[28px] md:text-[36px] font-black leading-none mb-1">₹5Cr+</div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-white/60">Prize Money</div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
