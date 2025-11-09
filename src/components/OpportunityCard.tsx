'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Calendar, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function OpportunityCard({
  id,
  title,
  category,
  gradeEligibility,
  organizer,
  registrationDeadline,
  mode,
  fee,
  image,
  className,
}: OpportunityCardProps) {
  const normalizedCategory = category?.trim() || 'Opportunity';
  const normalizedMode =
    mode === 'online' ? 'Online' : mode === 'offline' ? 'Offline' : mode === 'hybrid' ? 'Hybrid' : 'Online';

  const modeBadgeClass =
    mode === 'online'
      ? 'bg-blue-500/15 text-blue-200 border border-blue-500/30'
      : mode === 'offline'
        ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
        : 'bg-purple-500/15 text-purple-200 border border-purple-500/30';

  const trimmedFee = fee?.trim() ?? '';
  const numericFee = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericFee = Number.isFinite(numericFee);
  const isFree =
    !trimmedFee ||
    trimmedFee.toLowerCase() === 'free' ||
    (hasNumericFee && numericFee <= 0);

  const feeLabel = (() => {
    if (isFree) return 'FREE';
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
        return `₹${numericFee.toFixed(fractionDigits)}`;
      }
    }
    return trimmedFee;
  })();

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
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card
      className={cn(
        'group h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-orange-400/40 hover:bg-white/10 hover:shadow-xl hover:shadow-orange-500/20',
        className,
      )}
    >
      <Link href={`/opportunity/${id}`} className="flex h-full flex-col">
        <div className="relative h-44 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-white/50">
              <span className="text-sm font-semibold">{normalizedCategory}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
          <div className="absolute left-4 bottom-4 flex items-center gap-2 text-xs font-medium text-white">
            <Badge variant="outline" className={cn('rounded-full px-3 py-1 text-xs', modeBadgeClass)}>
              {normalizedMode}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full px-3 py-1 text-xs',
                isFree ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-white/20 text-white border-white/30',
              )}
            >
              {feeLabel}
            </Badge>
          </div>
        </div>

        <div className="flex h-full flex-col px-5 pb-5 pt-6 gap-4 text-white/80">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
            <span>{normalizedCategory}</span>
            <span>{gradeEligibility || 'All Grades'}</span>
          </div>
          <h3 className="text-lg font-semibold leading-snug text-white line-clamp-2 transition-colors duration-300 group-hover:text-orange-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users className="h-4 w-4 text-white/40" />
            <span className="truncate">{organizer || 'Unknown organizer'}</span>
          </div>
          <div className="mt-auto flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="h-4 w-4 text-orange-300" />
              <span>{computeDaysLeft()}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="h-4 w-4 text-orange-300" />
              <span className="text-xs">{formatDisplayDeadline()}</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </Link>
    </Card>
  );
}


