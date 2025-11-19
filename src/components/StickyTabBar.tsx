'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface StickyTabBarProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function StickyTabBar({ tabs, defaultValue, className = '' }: StickyTabBarProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value || '');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Initialize mounted state and detect mobile breakpoint
  React.useEffect(() => {
    setMounted(true);

    // Check initial mobile state
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check scroll position for navigation arrows
  const updateScrollArrows = React.useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    updateScrollArrows();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollArrows);
      return () => container.removeEventListener('scroll', updateScrollArrows);
    }
  }, [mounted, updateScrollArrows]);

  React.useEffect(() => {
    if (!mounted) return;

    // Re-check after a small delay for resize
    const handleResize = () => {
      setTimeout(updateScrollArrows, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted, updateScrollArrows]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 150;
    const container = scrollContainerRef.current;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Scroll back to top of content if we've scrolled past it
    // This prevents the user from being "lost" when switching from a long tab to a short one
    const tabBar = document.getElementById('sticky-tab-bar');
    if (tabBar) {
      const rect = tabBar.getBoundingClientRect();
      const headerOffset = window.innerWidth < 1024 ? 130 : 80; // Approximate header heights

      // If the tab bar is above the sticky position (meaning we scrolled down), scroll back up
      if (rect.top <= headerOffset + 10) {
        const scrollTop = window.scrollY + rect.top - headerOffset;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }
  };

  // Avoid hydration mismatch - render neutral structure until mounted
  if (!mounted) {
    return (
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        defaultValue={defaultValue}
        className={`w-full ${className}`}
      >
        <div className="sticky z-40 transition-all duration-200 bg-white dark:bg-slate-950 shadow-lg top-[120px] lg:top-[70px]">
          <div className="w-full rounded-xl border border-slate-200 bg-white/90 p-1 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50 h-10" />
        </div>
        <div className="mt-6" />
      </Tabs>
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      defaultValue={defaultValue}
      className={`w-full ${className}`}
    >
      {/* Tab Bar - Sticky below header */}
      <div
        id="sticky-tab-bar"
        className="sticky z-40 transition-all duration-200 bg-transparent pt-2 pb-2 top-[120px] lg:top-[70px]"
      >
        <div className="w-full rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
          <div className="relative flex items-center">
            {/* Left scroll arrow - Visible on both mobile and desktop if needed */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-8 bg-gradient-to-r from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent rounded-l-lg"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-100" />
              </button>
            )}

            {/* Scrollable Tabs Container - Unified for Mobile and Desktop */}
            <div
              ref={scrollContainerRef}
              className="flex w-full overflow-x-auto scrollbar-hide px-1 py-1 scroll-smooth gap-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              <TabsList className="flex h-auto w-max bg-transparent p-0 gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-slate-300 dark:data-[state=active]:bg-orange-500 dark:data-[state=active]:text-white whitespace-nowrap flex-shrink-0"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Right scroll arrow */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-8 bg-gradient-to-l from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent rounded-r-lg"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-100" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6 min-h-[50vh]">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
