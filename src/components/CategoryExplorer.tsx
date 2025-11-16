'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OpportunityCategoryWithMeta } from '@/types/masters';

interface CategoryExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: OpportunityCategoryWithMeta[];
  onSelectCategory?: (category: OpportunityCategoryWithMeta) => void;
}

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

export default function CategoryExplorer({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
}: CategoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) =>
      cat.name?.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Explore Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {filteredCategories.length} of {categories.length} categories
              </p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No categories found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filteredCategories.map((category) => {
                  const gradient = getCategoryGradient(category);
                  const emoji = getCategoryEmoji(category);
                  const categoryKey =
                    category.name?.toLowerCase().replace(/\s+/g, '') || '';

                  return (
                    <Link
                      key={category.id}
                      href={`/opportunities?category=${encodeURIComponent(categoryKey)}`}
                      onClick={() => {
                        onSelectCategory?.(category);
                        onClose();
                      }}
                      className="group flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      {/* Icon Circle */}
                      <div
                        className={cn(
                          'flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1',
                          `bg-gradient-to-br ${gradient.from} ${gradient.to}`
                        )}
                      >
                        {emoji}
                      </div>

                      {/* Category Name */}
                      <span className="text-center text-sm font-semibold text-slate-700 line-clamp-2 dark:text-slate-200">
                        {category.name}
                      </span>

                      {/* Opportunity Count */}
                      {(category as any).opportunityCount !== undefined && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {(category as any).opportunityCount} opportunity
                          {(category as any).opportunityCount !== 1 ? 'ies' : ''}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
