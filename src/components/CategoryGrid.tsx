'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CategoryExplorer from '@/components/CategoryExplorer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { OpportunityCategoryWithMeta } from '@/types/masters';

const CATEGORY_COLORS = {
  scholarships: { from: 'from-amber-400', to: 'to-orange-500' },
  olympiad: { from: 'from-purple-400', to: 'to-pink-500' },
  workshop: { from: 'from-cyan-400', to: 'to-blue-500' },
  bootcamp: { from: 'from-rose-400', to: 'to-red-500' },
  summercamp: { from: 'from-emerald-400', to: 'to-green-500' },
  internship: { from: 'from-indigo-400', to: 'to-purple-500' },
  hackathon: { from: 'from-yellow-400', to: 'to-orange-500' },
  hiring: { from: 'from-orange-400', to: 'to-pink-500' },
  quiz: { from: 'from-blue-400', to: 'to-cyan-500' },
  conference: { from: 'from-slate-400', to: 'to-slate-600' },
  competition: { from: 'from-fuchsia-400', to: 'to-pink-500' },
  cultural: { from: 'from-violet-400', to: 'to-purple-500' },
  sports: { from: 'from-red-400', to: 'to-orange-500' },
  coding: { from: 'from-green-400', to: 'to-emerald-500' },
  design: { from: 'from-pink-400', to: 'to-rose-500' },
  other: { from: 'from-slate-400', to: 'to-slate-600' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  scholarships: '🎓',
  olympiad: '🧠',
  workshop: '🔨',
  bootcamp: '🚀',
  summercamp: '☀️',
  internship: '💼',
  hackathon: '💻',
  hiring: '👥',
  quiz: '❓',
  conference: '🎤',
  competition: '🏆',
  cultural: '🎭',
  sports: '⚽',
  coding: '👨‍💻',
  design: '🎨',
  business: '💰',
  other: '✨',
};

interface CategoryGridProps {
  visibleCount?: number;
  onCategorySelect?: (category: OpportunityCategoryWithMeta) => void;
}

export default function CategoryGrid({
  visibleCount = 6,
  onCategorySelect,
}: CategoryGridProps) {
  const [categories, setCategories] = useState<OpportunityCategoryWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/opportunity-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const fetchedCategories = Array.isArray(data.items)
          ? (data.items as OpportunityCategoryWithMeta[])
          : [];

        // Enrich categories with metadata
        const enriched = fetchedCategories.map((cat) => ({
          ...cat,
          displayOrder: cat.displayOrder ?? 999,
          isActive: cat.isActive !== false,
        }));

        // Sort by display order
        enriched.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setCategories(enriched);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryGradient = (category: OpportunityCategoryWithMeta) => {
    const categoryKey = category.name?.toLowerCase().replace(/\s+/g, '') || '';
    return (
      CATEGORY_COLORS[categoryKey as keyof typeof CATEGORY_COLORS] ||
      CATEGORY_COLORS.other
    );
  };

  const getCategoryEmoji = (category: OpportunityCategoryWithMeta) => {
    const categoryKey = category.name?.toLowerCase().replace(/\s+/g, '') || '';
    return CATEGORY_EMOJIS[categoryKey as keyof typeof CATEGORY_EMOJIS] || '✨';
  };

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = categories.length > visibleCount;

  const handleCategoryClick = (category: OpportunityCategoryWithMeta) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-center text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {visibleCategories.map((category) => {
          const gradient = getCategoryGradient(category);
          const emoji = getCategoryEmoji(category);
          const categoryKey = category.name?.toLowerCase().replace(/\s+/g, '') || '';

          return (
            <Link
              key={category.id}
              href={`/opportunities?category=${encodeURIComponent(categoryKey)}`}
              onClick={(e) => {
                handleCategoryClick(category);
              }}
              className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {/* 3D Icon Circle with Shadow */}
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 sm:h-16 sm:w-16 sm:text-3xl',
                  `bg-gradient-to-br ${gradient.from} ${gradient.to}`
                )}
              >
                {emoji}
              </div>

              {/* Category Name */}
              <span className="text-center text-xs font-semibold text-slate-700 line-clamp-2 dark:text-slate-200 sm:text-sm">
                {category.name}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        {hasMoreCategories && (
          <button
            onClick={() => setIsExplorerOpen(true)}
            className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            {/* More Icon Circle */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 sm:h-16 sm:w-16 sm:text-3xl">
              ⋯
            </div>

            {/* More Label */}
            <span className="text-center text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">
              More
            </span>
          </button>
        )}
      </div>

      {/* Category Explorer Modal */}
      <CategoryExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        categories={categories}
        onSelectCategory={handleCategoryClick}
      />
    </>
  );
}
