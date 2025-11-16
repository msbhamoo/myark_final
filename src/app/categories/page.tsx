'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import AllCategoriesSection from '@/components/AllCategoriesSection';
import { Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        {/* <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm ring-1 ring-purple-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-purple-200 dark:ring-purple-300/40">
              <Sparkles className="h-4 w-4" />
              Browse All Categories
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Explore Opportunities by Category
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              Discover scholarships, competitions, workshops, internships, and more. Find the perfect opportunity that matches your interests and goals.
            </p>
          </div>
        </section> */}

        {/* Categories Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <AllCategoriesSection />
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
