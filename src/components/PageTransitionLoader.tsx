'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

const quotes = [
  "The best way to predict the future is to create it.",
  "Opportunity is everywhere. The key is to develop the vision to see it.",
  "Your journey to extraordinary starts now.",
  "Dream big, discover often.",
  "Excellence is not a skill, it is an attitude.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "Aim for the moon. If you miss, you may hit a star."
];

export function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  // 1. IMMEDIATE CLICK INTERCEPTOR
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      
      // Skip if it's external, an ID anchor, or same-page hash
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Skip if it's the current page (unless it has different params)
      const targetUrl = new URL(href, window.location.origin);
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
        return;
      }

      // If we reach here, it's an internal navigation - TRIGGER LOADER IMMEDIATELY
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setLoading(true);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 2. HIDE LOADER ONCE NEW PAGE IS MOUNTED
  useEffect(() => {
    // We add a small artificial delay (400ms) even after mount 
    // to ensure the entrance is smooth and the quote is actually readable.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0f0a] px-6 text-center select-none"
        >
          {/* Animated Background Depth */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-2xl">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="mb-12"
            >
              <Logo size="lg" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-[20px] md:text-[26px] font-heading font-black text-[#111827] dark:text-[#f3f4f6] italic leading-tight px-4 drop-shadow-sm">
                &ldquo;{currentQuote}&rdquo;
              </p>
              
              <div className="flex flex-col items-center gap-3">
                 <div className="w-56 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                       initial={{ x: '-100%' }}
                       animate={{ x: '100%' }}
                       transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                       className="absolute inset-0 bg-primary w-1/2 rounded-full"
                    />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse opacity-80">
                    Entering your future...
                 </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
