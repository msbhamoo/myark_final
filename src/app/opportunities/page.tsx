import { format } from 'date-fns';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import type { Opportunity } from '@/types/opportunity';
import type { Metadata } from 'next';
import { getOpportunities } from '@/lib/opportunityService';
import OpportunitiesSearch from './OpportunitiesSearch';
import OpportunitiesFilters from './OpportunitiesFilters';
import { OpportunitiesList } from '@/components/OpportunitiesList';

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myark.in';
const metadataBase = (() => {
  try {
    return new URL(RAW_SITE_URL);
  } catch {
    return new URL('https://myark.in');
  }
})();

// Get current year for SEO
const currentYear = new Date().getFullYear();
const academicYear = `${currentYear}-${String(currentYear + 1).slice(-2)}`;

export const metadata: Metadata = {
  metadataBase,
  title: `Scholarships, Olympiads & Competitions for Students ${currentYear} | Browse All - Myark`,
  description: `Browse 100+ verified scholarships, olympiads, entrance exams, and competitions for school students in India ${academicYear}. Filter by category, grade, and deadline. Apply before deadlines!`,
  keywords: [
    'scholarships for students',
    `scholarships ${currentYear}`,
    `olympiad exams India ${currentYear}`,
    'student competitions',
    'entrance exams for schools',
    'scholarship opportunities',
    'NTSE scholarship',
    `NTSE ${currentYear}`,
    'science olympiad',
    `science olympiad ${academicYear}`,
    'math olympiad India',
    `math olympiad ${currentYear}`,
    'talent search exams',
    `school competitions ${academicYear}`,
    `olympiads for students ${currentYear}`,
  ],
  alternates: {
    canonical: `${metadataBase.href}opportunities`,
  },
  openGraph: {
    type: 'website',
    url: `${metadataBase.href}opportunities`,
    title: `Browse Scholarships, Olympiads & Competitions ${academicYear} - Myark`,
    description: `Discover 100+ verified opportunities for students ${currentYear}. Scholarships, olympiads, entrance exams with deadlines and eligibility details.`,
    siteName: 'Myark',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Browse Opportunities for Students ${currentYear} - Myark`,
    description: `Find scholarships, olympiads & competitions for school students across India ${academicYear}.`,
    site: '@myark_in',
  },
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'TBA';
  }

  try {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return format(parsed, 'MMM dd, yyyy');
  } catch {
    return value;
  }
};

const formatFee = (opportunity: Opportunity) => {
  const trimmedFee = opportunity.fee?.trim() ?? '';
  const numeric = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericValue = Number.isFinite(numeric);
  const isFree =
    !trimmedFee ||
    trimmedFee.toLowerCase() === 'free' ||
    (hasNumericValue && numeric <= 0);

  if (isFree) {
    return 'FREE';
  }

  if (hasNumericValue) {
    const fractionDigits = Number.isInteger(numeric) ? 0 : 2;
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(numeric);
    } catch {
      return `₹${numeric.toFixed(fractionDigits)}`;
    }
  }

  return trimmedFee;
};

const normalizeMode = (mode?: Opportunity['mode']): Opportunity['mode'] => {
  if (mode === 'online' || mode === 'offline' || mode === 'hybrid') {
    return mode;
  }
  return 'online';
};

// Loading fallback for search
function SearchFallback() {
  return <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />;
}

// Loading fallback for filters
function FiltersFallback() {
  return <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />;
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<{ category?: string; segment?: string; search?: string }> }) {
  const params = await searchParams;
  const category = params.category ?? '';
  const segment = params.segment ?? '';
  const search = params.search ?? '';

  let opportunities: Opportunity[] = [];
  let segments: Record<string, Opportunity[]> = {};
  let availableCategories: string[] = [];

  try {
    const result = await getOpportunities({
      category,
      segment,
      search,
      limit: 60,
    });
    opportunities = result.opportunities;
    segments = result.segments ?? {};

    // Extract unique categories for filter dropdown
    availableCategories = Array.from(
      new Set(
        opportunities
          .map(opp => opp.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ).sort();
  } catch (error) {
    console.error('Failed to fetch opportunities:', error);
    // Continue with empty results - allows build to proceed
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#DFF7C8]/30 via-white to-[#DFF7C8]/10 dark:bg-[#050b3a]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <section className="relative overflow-hidden py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_60%)] dark:bg-[url('/images/grid-pattern.svg')] dark:opacity-[0.03]" />
          <div className="container relative mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Explore opportunities</p>
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                  Discover competitions, scholarships, and programs tailored for you
                </h1>
                <p className="text-sm text-slate-600 md:text-base dark:text-slate-100">
                  Use search or choose a category from the homepage to find programs that match your goals. Results update with live data from the platform.
                </p>
              </div>
              <Suspense fallback={<SearchFallback />}>
                <OpportunitiesSearch />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <Suspense fallback={<FiltersFallback />}>
              <OpportunitiesFilters availableCategories={availableCategories} />
            </Suspense>
            <OpportunitiesList opportunities={opportunities} />
          </div>
        </section>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
}




