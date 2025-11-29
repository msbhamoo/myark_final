'use client';

/**
 * PreloadResources Component
 * 
 * Preloads critical resources for better performance.
 * Use this component on pages where specific resources need to be prioritized.
 */

import { useEffect } from 'react';

interface PreloadResourcesProps {
    fonts?: string[];
    images?: string[];
    scripts?: string[];
}

export function PreloadResources({ fonts = [], images = [], scripts = [] }: PreloadResourcesProps) {
    useEffect(() => {
        // Preload fonts
        fonts.forEach((fontUrl) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = fontUrl;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Preload images
        images.forEach((imageUrl) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imageUrl;
            document.head.appendChild(link);
        });

        // Preload scripts
        scripts.forEach((scriptUrl) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = scriptUrl;
            document.head.appendChild(link);
        });
    }, [fonts, images, scripts]);

    return null; // This component doesn't render anything
}

// Example usage:
// <PreloadResources
//   images={['/hero-image.jpg', '/logo.png']}
//   fonts={['/fonts/inter-var.woff2']}
// />
