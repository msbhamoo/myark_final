import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import type { Opportunity } from '@/types/opportunity';
import { getOpportunities } from '@/lib/opportunityService';
import OpportunitiesSearch from './OpportunitiesSearch';
import { OpportunitiesList } from '@/components/OpportunitiesList';

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

export default async function OpportunitiesPage(props: any) {
  const searchParams = props?.searchParams ?? {};
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const segment = typeof searchParams.segment === 'string' ? searchParams.segment : '';
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const { opportunities, segments } = await getOpportunities({
    category,
    segment,
    search,
    limit: 60,
  });

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
              <OpportunitiesSearch />
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <OpportunitiesList opportunities={opportunities} />
          </div>
        </section>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
}




