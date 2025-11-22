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
  const sectionRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const isManualScroll = React.useRef(false);

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

  // Set up IntersectionObserver for scroll-spy
  React.useEffect(() => {
    if (!mounted) return;

    // Create a map of section elements
    tabs.forEach((tab) => {
      const element = document.getElementById(`section-${tab.value}`);
      if (element) {
        sectionRefs.current.set(tab.value, element);
      }
    });

    // Set up IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the middle 10% of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Don't update active tab if user is manually scrolling from tab click
      if (isManualScroll.current) return;

      // Find the most visible section
      let maxRatio = 0;
      let mostVisibleSection = '';

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const sectionId = entry.target.id.replace('section-', '');
          mostVisibleSection = sectionId;
        }
      });

      // Update active tab if we found a visible section
      if (mostVisibleSection && maxRatio > 0) {
        setActiveTab(mostVisibleSection);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted, tabs]);

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

    // Find the corresponding section and scroll to it
    const section = document.getElementById(`section-${value}`);
    if (section) {
      // Set flag to prevent observer from interfering
      isManualScroll.current = true;

      // Calculate scroll position (sticky tab bar height + header offset)
      const headerOffset = window.innerWidth < 1024 ? 150 : 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Reset flag after scroll completes
      setTimeout(() => {
        isManualScroll.current = false;
      }, 1000);
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
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-slate-300 dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white whitespace-nowrap flex-shrink-0"
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

      {/* Tab content - Continuous scroll layout */}
      <div className="mt-6 space-y-8">
        {tabs.map((tab) => (
          <div key={tab.value} id={`section-${tab.value}`} className="scroll-mt-[180px] lg:scroll-mt-[130px]">
            <TabsContent value={tab.value} className="mt-0 focus-visible:outline-none focus-visible:ring-0 data-[state=inactive]:hidden">
              {tab.content}
            </TabsContent>
            {/* Show content for all tabs to enable continuous scrolling */}
            <div className={activeTab === tab.value ? 'hidden' : ''}>
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </Tabs>
  );
}
