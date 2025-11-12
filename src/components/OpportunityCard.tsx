'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MascotBurst } from '@/components/MascotBurst';

interface OpportunityCardProps {
  id: string;
  title: string;
  category: string;
  gradeEligibility: string;
  organizer: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline: string;
  mode: 'online' | 'offline' | 'hybrid';
  fee?: string;
  image?: string;
  className?: string;
}

const MODE_STYLES: Record<
  OpportunityCardProps['mode'],
  { label: string; className: string }
> = {
  online: {
    label: 'Online',
    className:
      'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  },
  offline: {
    label: 'On campus',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  hybrid: {
    label: 'Hybrid',
    className:
      'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200',
  },
};

export default function OpportunityCard({
  id,
  title,
  category,
  gradeEligibility,
  organizer,
  registrationDeadline,
  mode,
  fee,
  className,
}: OpportunityCardProps) {
  const normalizedCategory = category?.trim() || 'Opportunity';
  const normalizedMode = MODE_STYLES[mode] ? mode : 'online';

  const trimmedFee = fee?.trim() ?? '';
  const numericFee = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericFee = Number.isFinite(numericFee);
  const isFree =
    !trimmedFee || trimmedFee.toLowerCase() === 'free' || (hasNumericFee && numericFee <= 0);

  const feeLabel = (() => {
    if (isFree) return 'Free';
    if (hasNumericFee) {
      const fractionDigits = Number.isInteger(numericFee) ? 0 : 2;
      try {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        }).format(numericFee);
      } catch {
        return `${numericFee.toFixed(fractionDigits)} INR`;
      }
    }
    return trimmedFee;
  })();

  const feeBadgeClass = isFree
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
    : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200';

  const computeDaysLeft = () => {
    if (!registrationDeadline) {
      return 'Closes soon';
    }
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      return registrationDeadline;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 1) return `${diff} days left`;
    if (diff === 1) return '1 day left';
    if (diff === 0) return 'Closes today';
    return 'Closed';
  };

  const formatDisplayDeadline = () => {
    if (!registrationDeadline) {
      return 'Deadline TBA';
    }
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      return registrationDeadline;
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const gradeLabel = gradeEligibility?.trim() || 'All grades';

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900',
        className,
      )}
    >
      <MascotBurst size="sm" className="pointer-events-none absolute right-5 top-5 hidden sm:inline-flex" />
      <Link href={`/opportunity/${id}`} className="flex h-full flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
              {gradeLabel}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                MODE_STYLES[normalizedMode].className,
              )}
            >
              {MODE_STYLES[normalizedMode].label}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                feeBadgeClass,
              )}
            >
              {feeLabel}
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 dark:text-orange-200/80">
            {normalizedCategory}
          </p>
          <h3 className="text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-orange-500 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="truncate">{organizer || 'Unknown organizer'}</span>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{computeDaysLeft()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{formatDisplayDeadline()}</span>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600 transition group-hover:bg-orange-100 dark:bg-orange-400/10 dark:text-orange-200">
          <span>See opportunity details</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </Link>
    </Card>
  );
}
