'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Users, Zap, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { OpportunityStatusBadgeMinimal } from '@/components/OpportunityStatusBadge';
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
  status?: 'active' | 'closed' | 'pending';
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

// Enhanced category colors with professional differentiation
const CATEGORY_STYLES: Record<
  string,
  { 
    badgeClass: string; 
    accentClass: string; 
    borderClass: string;
    bgGradient: string;
    icon: string;
  }
> = {
  scholarships: {
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    accentClass: 'text-amber-600 dark:text-amber-300',
    borderClass: 'border-amber-200/70 dark:border-amber-400/30',
    bgGradient: 'from-amber-50/40 dark:from-amber-950/20',
    icon: '🎓',
  },
  olympiad: {
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
    accentClass: 'text-purple-600 dark:text-purple-300',
    borderClass: 'border-purple-200/70 dark:border-purple-400/30',
    bgGradient: 'from-purple-50/40 dark:from-purple-950/20',
    icon: '🧠',
  },
  olympiads: {
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
    accentClass: 'text-purple-600 dark:text-purple-300',
    borderClass: 'border-purple-200/70 dark:border-purple-400/30',
    bgGradient: 'from-purple-50/40 dark:from-purple-950/20',
    icon: '🧠',
  },
  workshop: {
    badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200',
    accentClass: 'text-cyan-600 dark:text-cyan-300',
    borderClass: 'border-cyan-200/70 dark:border-cyan-400/30',
    bgGradient: 'from-cyan-50/40 dark:from-cyan-950/20',
    icon: '🔨',
  },
  workshops: {
    badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200',
    accentClass: 'text-cyan-600 dark:text-cyan-300',
    borderClass: 'border-cyan-200/70 dark:border-cyan-400/30',
    bgGradient: 'from-cyan-50/40 dark:from-cyan-950/20',
    icon: '🔨',
  },
  bootcamp: {
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
    accentClass: 'text-rose-600 dark:text-rose-300',
    borderClass: 'border-rose-200/70 dark:border-rose-400/30',
    bgGradient: 'from-rose-50/40 dark:from-rose-950/20',
    icon: '🚀',
  },
  bootcamps: {
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
    accentClass: 'text-rose-600 dark:text-rose-300',
    borderClass: 'border-rose-200/70 dark:border-rose-400/30',
    bgGradient: 'from-rose-50/40 dark:from-rose-950/20',
    icon: '🚀',
  },
  summercamp: {
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    accentClass: 'text-emerald-600 dark:text-emerald-300',
    borderClass: 'border-emerald-200/70 dark:border-emerald-400/30',
    bgGradient: 'from-emerald-50/40 dark:from-emerald-950/20',
    icon: '☀️',
  },
  summercamps: {
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    accentClass: 'text-emerald-600 dark:text-emerald-300',
    borderClass: 'border-emerald-200/70 dark:border-emerald-400/30',
    bgGradient: 'from-emerald-50/40 dark:from-emerald-950/20',
    icon: '☀️',
  },
  internship: {
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
    accentClass: 'text-indigo-600 dark:text-indigo-300',
    borderClass: 'border-indigo-200/70 dark:border-indigo-400/30',
    bgGradient: 'from-indigo-50/40 dark:from-indigo-950/20',
    icon: '💼',
  },
  internships: {
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
    accentClass: 'text-indigo-600 dark:text-indigo-300',
    borderClass: 'border-indigo-200/70 dark:border-indigo-400/30',
    bgGradient: 'from-indigo-50/40 dark:from-indigo-950/20',
    icon: '💼',
  },
  competition: {
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200',
    accentClass: 'text-orange-600 dark:text-orange-300',
    borderClass: 'border-orange-200/70 dark:border-orange-400/30',
    bgGradient: 'from-orange-50/40 dark:from-orange-950/20',
    icon: '🏆',
  },
  competitions: {
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200',
    accentClass: 'text-orange-600 dark:text-orange-300',
    borderClass: 'border-orange-200/70 dark:border-orange-400/30',
    bgGradient: 'from-orange-50/40 dark:from-orange-950/20',
    icon: '🏆',
  },
  // Default fallback
  default: {
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200',
    accentClass: 'text-slate-600 dark:text-slate-300',
    borderClass: 'border-slate-200/70 dark:border-slate-400/30',
    bgGradient: 'from-slate-50/40 dark:from-slate-950/20',
    icon: '⭐',
  },
};

function getCategoryStyles(category: string) {
  const normalized = category?.toLowerCase().trim() || 'default';
  return CATEGORY_STYLES[normalized] || CATEGORY_STYLES['default'];
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
  className,
  status = 'active',
}: OpportunityCardProps) {
  const normalizedCategory = category?.trim() || 'Opportunity';
  const normalizedMode = MODE_STYLES[mode] ? mode : 'online';
  const categoryStyles = getCategoryStyles(normalizedCategory);
  const isClosed = status === 'closed';

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
  const daysLeft = computeDaysLeft();
  const isUrgent = daysLeft.includes('today') || daysLeft.includes('1 day');

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900',
        categoryStyles.borderClass,
        'border-slate-200/70 dark:border-slate-800/60',
        className,
      )}
    >
      {/* Category accent bar */}
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', categoryStyles.accentClass)} />
      
      <Link href={`/opportunity/${id}`} className="flex h-full flex-col gap-3 p-4 sm:p-5">
        {/* Header with category badge */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap w-fit',
                  categoryStyles.badgeClass,
                )}
              >
                <span>{categoryStyles.icon}</span>
                <span className="hidden sm:inline">{normalizedCategory}</span>
              </span>
              <OpportunityStatusBadgeMinimal registrationDeadline={registrationDeadline} />
            </div>
            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-500/20 dark:text-red-200 flex-shrink-0">
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">Urgent</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-900 transition group-hover:text-orange-500 dark:text-white line-clamp-2">
            {title}
          </h3>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{organizer || 'Unknown organizer'}</span>
          </div>
        </div>

        {/* Badges: Grade, Mode, Fee */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
            {gradeLabel}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              MODE_STYLES[normalizedMode].className,
            )}
          >
            {MODE_STYLES[normalizedMode].label}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              feeBadgeClass,
            )}
          >
            {feeLabel}
          </span>
        </div>

        {/* Deadline info */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200/50 bg-slate-50/60 p-3 text-xs sm:text-sm dark:border-slate-700 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-slate-400" />
              <span className={cn('font-semibold', isUrgent ? 'text-red-600 dark:text-red-300' : 'text-slate-700 dark:text-slate-300')}>
                {daysLeft}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">{formatDisplayDeadline()}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold transition-all',
            'bg-gradient-to-r to-transparent transition-all duration-300',
            categoryStyles.accentClass,
            categoryStyles.bgGradient.startsWith('from-') 
              ? `bg-gradient-to-r ${categoryStyles.bgGradient} to-white/0` 
              : categoryStyles.bgGradient,
            'border border-slate-200/50 dark:border-slate-700/50',
            'group-hover:shadow-md'
          )}>
            <span>Explore</span>
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
