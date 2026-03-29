'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "Don&apos;t wait for opportunity. Create it.",
  "Your future depends on what you do today.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The best way to predict the future is to create it.",
  "Believe you can and you&apos;re halfway there.",
  "The capacity to learn is a gift; the ability to learn is a skill.",
  "Your only limit is your mind."
];

export function QuoteLoader({ isOpen }: { isOpen: boolean }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl"
        >
          <div className="max-w-[320px] w-full px-6 flex flex-col items-center text-center">
            
            {/* Pulsing Logo Label */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-12"
            >
              <div className="text-white text-[32px] font-black tracking-tighter">
                Myark<span className="text-[#4ade80]">.</span>
              </div>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="text-[#4ade80] text-[11px] font-black uppercase tracking-[0.2em] mb-2">
                Getting it ready...
              </div>
              <p className="text-white text-[18px] font-black leading-tight tracking-tight">
                &quot;{quotes[quoteIndex]}&quot;
              </p>
            </motion.div>

            {/* Progress indicator */}
            <div className="mt-12 w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]"
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
