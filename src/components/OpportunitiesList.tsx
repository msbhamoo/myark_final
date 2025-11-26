'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  // Get filter params
  const statusFilter = searchParams.get('status') || 'all';
  const gradesFilter = searchParams.get('grades')?.split(',').filter(Boolean) || [];
  const categoriesFilter = searchParams.get('categories')?.split(',').filter(Boolean) || [];

  // Helper to check if opportunity is closed
  const isOpportunityClosed = (opp: Opportunity): boolean => {
    if (opp.status?.toLowerCase() === 'closed') return true;
    if (opp.registrationDeadline) {
      const deadline = new Date(opp.registrationDeadline);
      return deadline < new Date();
    }
    return false;
  };

  // Helper to check if opportunity matches grade filter
  const matchesGradeFilter = (opp: Opportunity, grades: string[]): boolean => {
    if (grades.length === 0) return true;
    const gradeEligibility = opp.gradeEligibility || '';
    return grades.some(grade => {
      // Check for exact match or range match
      if (gradeEligibility.toLowerCase().includes(grade.toLowerCase())) {
        return true;
      }
      // Handle range filters like "4-6"
      if (grade.includes('-')) {
        const [start, end] = grade.split('-').map(Number);
        // Extract numbers from gradeEligibility
        const matches = gradeEligibility.match(/\d+/g);
        if (matches) {
          return matches.some(num => {
            const n = Number(num);
            return n >= start && n <= end;
          });
        }
      }
      return false;
    });
  };

  // Helper to check if opportunity matches category filter
  const matchesCategoryFilter = (opp: Opportunity, categories: string[]): boolean => {
    if (categories.length === 0) return true;
    const oppCategory = (opp.category || '').toLowerCase();
    return categories.some(cat => oppCategory.includes(cat.toLowerCase()));
  };

  // Apply filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const isClosed = isOpportunityClosed(opp);

      // Status filter
      if (statusFilter === 'open' && isClosed) return false;
      if (statusFilter === 'closed' && !isClosed) return false;

      // Grade filter
      if (!matchesGradeFilter(opp, gradesFilter)) return false;

      // Category filter
      if (!matchesCategoryFilter(opp, categoriesFilter)) return false;

      return true;
    });
  }, [opportunities, statusFilter, gradesFilter, categoriesFilter]);

  return (
    <>
      {filteredOpportunities.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-16 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
          No opportunities match your filters. Try adjusting the filters or clearing them.
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.map((opportunity) => {
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
              eligibilityType={opportunity.eligibilityType}
              ageEligibility={opportunity.ageEligibility}
              organizer={opportunity.organizer || 'Unknown Organizer'}
              startDate={formatDate(opportunity.startDate)}
              endDate={formatDate(opportunity.endDate)}
              registrationDeadline={opportunity.registrationDeadline ?? ''}
              registrationDeadlineTBD={opportunity.registrationDeadlineTBD}
              startDateTBD={opportunity.startDateTBD}
              endDateTBD={opportunity.endDateTBD}
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
