import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Initial check
        const checkStandalone = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://');
            setIsStandalone(!!isStandaloneMode);
        };

        checkStandalone();

        // Listen for changes (rare but possible)
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        try {
            mediaQuery.addEventListener('change', checkStandalone);
        } catch (e) {
            // Fallback for older browsers
            mediaQuery.addListener(checkStandalone);
        }

        // Check if device is iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Handle Android/Desktop install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            try {
                mediaQuery.removeEventListener('change', checkStandalone);
            } catch (e) {
                mediaQuery.removeListener(checkStandalone);
            }
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isInstallable, isIOS, isStandalone, installApp };
}
