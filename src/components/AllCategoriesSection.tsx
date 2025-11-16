'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { OpportunityCategoryWithMeta } from '@/types/masters';

const CATEGORY_COLORS = {
  scholarships: { from: 'from-amber-400', to: 'to-orange-500' },
  olympiad: { from: 'from-purple-400', to: 'to-pink-500' },
  olympiads: { from: 'from-purple-400', to: 'to-pink-500' },
  workshop: { from: 'from-cyan-400', to: 'to-blue-500' },
  workshops: { from: 'from-cyan-400', to: 'to-blue-500' },
  bootcamp: { from: 'from-rose-400', to: 'to-red-500' },
  bootcamps: { from: 'from-rose-400', to: 'to-red-500' },
  summercamp: { from: 'from-emerald-400', to: 'to-green-500' },
  summercamps: { from: 'from-emerald-400', to: 'to-green-500' },
  internship: { from: 'from-indigo-400', to: 'to-purple-500' },
  internships: { from: 'from-indigo-400', to: 'to-purple-500' },
  hackathon: { from: 'from-yellow-400', to: 'to-orange-500' },
  hackathons: { from: 'from-yellow-400', to: 'to-orange-500' },
  hiring: { from: 'from-orange-400', to: 'to-pink-500' },
  hiringchallenges: { from: 'from-orange-400', to: 'to-pink-500' },
  quiz: { from: 'from-blue-400', to: 'to-cyan-500' },
  quizzes: { from: 'from-blue-400', to: 'to-cyan-500' },
  conference: { from: 'from-slate-400', to: 'to-slate-600' },
  conferences: { from: 'from-slate-400', to: 'to-slate-600' },
  competition: { from: 'from-fuchsia-400', to: 'to-pink-500' },
  competitions: { from: 'from-fuchsia-400', to: 'to-pink-500' },
  cultural: { from: 'from-violet-400', to: 'to-purple-500' },
  culturalevents: { from: 'from-violet-400', to: 'to-purple-500' },
  sports: { from: 'from-red-400', to: 'to-orange-500' },
  sportsevents: { from: 'from-red-400', to: 'to-orange-500' },
  coding: { from: 'from-green-400', to: 'to-emerald-500' },
  codingchallenges: { from: 'from-green-400', to: 'to-emerald-500' },
  design: { from: 'from-pink-400', to: 'to-rose-500' },
  business: { from: 'from-cyan-400', to: 'to-blue-500' },
  other: { from: 'from-slate-400', to: 'to-slate-600' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  scholarships: '🎓',
  olympiad: '🧠',
  olympiads: '🧠',
  workshop: '🔨',
  workshops: '🔨',
  bootcamp: '🚀',
  bootcamps: '🚀',
  summercamp: '☀️',
  summercamps: '☀️',
  internship: '💼',
  internships: '💼',
  hackathon: '💻',
  hackathons: '💻',
  hiring: '👥',
  hiringchallenges: '👥',
  quiz: '❓',
  quizzes: '❓',
  conference: '🎤',
  conferences: '🎤',
  competition: '🏆',
  competitions: '🏆',
  cultural: '🎭',
  culturalevents: '🎭',
  sports: '⚽',
  sportsevents: '⚽',
  coding: '👨‍💻',
  codingchallenges: '👨‍💻',
  design: '🎨',
  business: '💰',
  other: '✨',
};

export default function AllCategoriesSection() {
  const [categories, setCategories] = useState<OpportunityCategoryWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <section className="px-4 py-8 md:hidden">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 md:hidden">
      <div className="mx-auto max-w-md">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Explore by Category
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Browse all available categories
        </p>

        {/* Categories Grid */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {categories.map((category) => {
            const gradient = getCategoryGradient(category);
            const emoji = getCategoryEmoji(category);
            const categoryKey = category.name?.toLowerCase().replace(/\s+/g, '') || '';

            return (
              <Link
                key={category.id}
                href={`/opportunities?category=${encodeURIComponent(categoryKey)}`}
                className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1',
                    `bg-gradient-to-br ${gradient.from} ${gradient.to}`
                  )}
                >
                  {emoji}
                </div>

                {/* Category Name */}
                <span className="text-center text-xs font-semibold text-slate-700 line-clamp-2 dark:text-slate-200">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
