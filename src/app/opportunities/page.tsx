import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpportunityCard from '@/components/OpportunityCard';
import type { Opportunity } from '@/types/opportunity';
import { getOpportunities } from '@/lib/opportunityService';
import OpportunitiesSearch from './OpportunitiesSearch';

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

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
    <div className="min-h-screen flex flex-col bg-[#050b3a]">
      <Header />
      <main className="flex-1">
        <section className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
          <div className="container relative mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Explore opportunities</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Discover competitions, scholarships, and programs tailored for you
                </h1>
                <p className="text-sm md:text-base text-white/70">
                  Use search or choose a category from the homepage to find programs that match your goals. Results update with live data from the platform.
                </p>
              </div>
              <OpportunitiesSearch />
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            {opportunities.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-white/60">
                No opportunities match your filters yet. Try adjusting the search term or clearing the category filter.
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  id={opportunity.id}
                  title={opportunity.title}
                  category={opportunity.category}
                  gradeEligibility={opportunity.gradeEligibility || 'All Grades'}
                  organizer={opportunity.organizer || 'Unknown Organizer'}
                  startDate={formatDate(opportunity.startDate)}
                  endDate={formatDate(opportunity.endDate)}
                  registrationDeadline={opportunity.registrationDeadline ?? ''}
                  mode={normalizeMode(opportunity.mode)}
                  fee={formatFee(opportunity)}
                  image={opportunity.image}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
