'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Users, Zap, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/types/opportunity';
import { LoadingGrid } from '@/components/LoadingSpinner';
import OpportunityCard from '@/components/OpportunityCard';
import { format } from 'date-fns';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
}

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

function OpportunitiesListContent({ opportunities }: OpportunitiesListProps) {
  return (
    <>
      {opportunities.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-16 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
          No opportunities match your filters yet. Try adjusting the search term or clearing the category filter.
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => {
          // Determine if opportunity is closed based on deadline or status field
          const isClosed = 
            opportunity.status?.toLowerCase() === 'closed' ||
            (opportunity.registrationDeadline && new Date(opportunity.registrationDeadline) < new Date());
          
          return (
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
              status={isClosed ? 'closed' : 'active'}
            />
          );
        })}
      </div>
    </>
  );
}

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {
  return (
    <Suspense fallback={<LoadingGrid itemCount={6} />}>
      <OpportunitiesListContent opportunities={opportunities} />
    </Suspense>
  );
}
