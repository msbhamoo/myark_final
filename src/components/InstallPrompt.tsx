'use client';

import { useState, useEffect } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function InstallPrompt() {
    const { isInstallable, installApp } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isInstallable) {
            // Small delay to not overwhelm user immediately
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
            >
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <img src="/myark-logo.png" alt="Myark" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Install Myark App</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add to home screen for faster access and offline mode.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={installApp} className="h-8 px-3 text-xs">
                            Install
                        </Button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-xs text-slate-400 hover:text-slate-500"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
