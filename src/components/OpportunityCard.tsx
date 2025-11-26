'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Users, Zap, Lock, MapPin, Trophy, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { OpportunityStatusBadgeMinimal } from '@/components/OpportunityStatusBadge';
import { cn } from '@/lib/utils';


export interface OpportunityCardProps {
  id: string;
  title: string;
  category: string;
  gradeEligibility: string;
  eligibilityType?: 'grade' | 'age' | 'both';
  ageEligibility?: string;
  organizer: string;
  startDate?: string;
  startDateTBD?: boolean;
  endDate?: string;
  endDateTBD?: boolean;
  registrationDeadline: string;
  registrationDeadlineTBD?: boolean;
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
    badgeClass: 'bg-accent text-[#1A2A33] dark:bg-primary/20 dark:text-accent',
    accentClass: 'text-primary dark:text-accent',
    borderClass: 'border-accent/70 dark:border-primary/30',
    bgGradient: 'from-accent/40 dark:from-primary/20',
    icon: '🏆',
  },
  competitions: {
    badgeClass: 'bg-accent text-[#1A2A33] dark:bg-primary/20 dark:text-accent',
    accentClass: 'text-primary dark:text-accent',
    borderClass: 'border-accent/70 dark:border-primary/30',
    bgGradient: 'from-accent/40 dark:from-primary/20',
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

// Helper to get eligibility display text
export function getEligibilityDisplay(props: OpportunityCardProps): string {
  const type = props.eligibilityType || 'grade';

  // For 'age' type, ONLY show age (ignore grade even if it exists)
  if (type === 'age') {
    if (props.ageEligibility?.trim()) {
      return `Age ${props.ageEligibility.trim()}`;
    }
    return 'Age eligibility TBD';
  }

  // For 'grade' type, ONLY show grade (ignore age even if it exists)
  if (type === 'grade') {
    if (props.gradeEligibility?.trim()) {
      return `Grade ${props.gradeEligibility.trim()}`;
    }
    return 'All grades';
  }

  // For 'both' type, show both age and grade
  if (type === 'both') {
    const parts: string[] = [];
    if (props.ageEligibility?.trim()) {
      parts.push(`Age ${props.ageEligibility.trim()}`);
    }
    if (props.gradeEligibility?.trim()) {
      parts.push(`Grade ${props.gradeEligibility.trim()}`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'All grades';
  }

  return 'All grades';
}

export default function OpportunityCard({
  id,
  title,
  category,
  gradeEligibility,
  eligibilityType,
  ageEligibility,
  organizer,
  registrationDeadline,
  registrationDeadlineTBD,
  startDateTBD,
  endDateTBD,
  mode,
  fee,
  className,
  status = 'active',
  image,
}: OpportunityCardProps) {
  const normalizedCategory = category?.trim() || 'Opportunity';
  const normalizedMode = MODE_STYLES[mode] ? mode : 'online';
  const categoryStyles = getCategoryStyles(normalizedCategory);
  const isClosed = status === 'closed';

  // Default cover image fallback
  const coverImage = image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';

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
    : 'bg-accent text-[#1A2A33] dark:bg-primary/20 dark:text-accent';

  const computeDaysLeft = () => {
    // Check if TBD first
    if (registrationDeadlineTBD || !registrationDeadline) {
      return { label: 'To Be Decided', days: null, isTBD: true };
    }

    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      // Treat invalid dates as TBD
      return { label: 'To Be Decided', days: null, isTBD: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 1) return { label: `${diff} days`, days: diff, isTBD: false };
    if (diff === 1) return { label: '1 day', days: 1, isTBD: false };
    if (diff === 0) return { label: 'Today', days: 0, isTBD: false };
    return { label: 'Closed', days: -1, isTBD: false };
  };

  const formatDisplayDeadline = () => {
    if (registrationDeadlineTBD || !registrationDeadline) {
      return 'TBD';
    }
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      return 'TBD';
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const eligibilityLabel = getEligibilityDisplay({ gradeEligibility, eligibilityType, ageEligibility } as OpportunityCardProps);
  const { label: daysLabel, days: daysCount, isTBD } = computeDaysLeft();
  const isUrgent = !isTBD && daysCount !== null && daysCount <= 1;

  return (
    <Link href={`/opportunity/${id}`}>
      <Card
        className={cn(
          'group relative h-full overflow-hidden rounded-2xl border-b border-x transition-all duration-300 flex flex-col py-0 gap-0',
          'bg-white dark:bg-slate-900/90',
          'hover:shadow-xl hover:-translate-y-1 hover:border-accent dark:hover:border-primary/50',
          'border-slate-200/70 dark:border-slate-800/60',
          'cursor-pointer',
          className,
        )}
      >
        {/* Cover Image */}
        <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Category Badge - Top Left Over Image */}
          <div className="absolute top-3 left-3 z-10">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md',
              'bg-white/90 text-slate-900 dark:bg-slate-900/90 dark:text-white',
              // categoryStyles.badgeClass // Using neutral style for better contrast on image, or use category color?
              // User asked for "tags like olympiad... top on top left". 
              // Let's use the category style but ensure it's readable.
              categoryStyles.badgeClass
            )}>
              <span className="text-sm">{categoryStyles.icon}</span>
              <span className="text-xs">{normalizedCategory}</span>
            </span>
          </div>

          {/* Urgent Badge - Top Right Over Image */}
          {isUrgent && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm animate-pulse">
                <Zap className="h-3 w-3 fill-current" />
                <span>Urgent</span>
              </span>
            </div>
          )}
        </div>

        {/* Content - Removed border-t and accent bar */}
        <div className="flex flex-1 flex-col p-3 sm:p-4 transition-colors">

          {/* Title - Prominent */}
          <h3 className="text-sm sm:text-base font-bold leading-tight text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors mt-1">
            {title}
          </h3>

          {/* Organizer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3 min-h-5">
            <Users className="h-3 w-3 flex-shrink-0 opacity-70" />
            <span className="truncate line-clamp-1 text-xs">{organizer || 'Organizer'}</span>
          </div>

          {/* Info Pills - Horizontal Row */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {/* Eligibility */}
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {eligibilityLabel}
            </span>

            {/* Mode */}
            <span className={cn(
              'inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium',
              MODE_STYLES[normalizedMode].className,
            )}>
              {MODE_STYLES[normalizedMode].label}
            </span>

            {/* Fee */}
            <span className={cn(
              'inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium',
              feeBadgeClass,
            )}>
              {feeLabel}
            </span>
          </div>

          {/* Deadline Section - Bottom */}
          <div className="mt-auto pt-1 space-y-2">
            {/* Days Left - Prominent Box */}
            <div className={cn(
              'flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold',
              isUrgent
                ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                : 'bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
            )}>
              <div className="flex items-center gap-1.5">
                <Clock className={cn(
                  'h-3.5 w-3.5',
                  isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-400'
                )} />
                <span>{daysLabel}</span>
              </div>
              <span className="text-xs opacity-80">{formatDisplayDeadline()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
