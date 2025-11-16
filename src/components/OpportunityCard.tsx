'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Users, Zap, Lock, MapPin, Trophy, Sparkles } from 'lucide-react';
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
    : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200';

  const computeDaysLeft = () => {
    if (!registrationDeadline) {
      return { label: 'Closes soon', days: null };
    }
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      return { label: registrationDeadline, days: null };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 1) return { label: `${diff} days`, days: diff };
    if (diff === 1) return { label: '1 day', days: 1 };
    if (diff === 0) return { label: 'Today', days: 0 };
    return { label: 'Closed', days: -1 };
  };

  const formatDisplayDeadline = () => {
    if (!registrationDeadline) {
      return 'TBA';
    }
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) {
      return registrationDeadline;
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const gradeLabel = gradeEligibility?.trim() || 'All grades';
  const { label: daysLabel, days: daysCount } = computeDaysLeft();
  const isUrgent = daysCount !== null && daysCount <= 1;

  return (
    <Link href={`/opportunity/${id}`}>
      <Card
        className={cn(
          'group relative h-full overflow-hidden rounded-2xl border-b border-x transition-all duration-300 flex flex-col',
          'bg-white dark:bg-slate-900/90',
          'hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 dark:hover:border-orange-400/50',
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
  {/* Top accent gradient bar */}
        <div className={cn(
          'absolute top-32 sm:top-40 inset-x-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity',
          `bg-gradient-to-r ${categoryStyles.accentClass}`
        )} />

        <div className="flex flex-1 flex-col p-3 sm:p-4 border-t border-slate-200/70 dark:border-slate-800/60 group-hover:border-orange-200 dark:group-hover:border-orange-400/50 transition-colors">
          {/* Header Row: Category Badge & Urgent */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap flex-shrink-0',
              categoryStyles.badgeClass,
            )}>
              <span className="text-sm">{categoryStyles.icon}</span>
              <span className="hidden sm:inline text-xs">{normalizedCategory}</span>
            </span>
            
            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-500/20 dark:text-red-200 flex-shrink-0 animate-pulse">
                <Zap className="h-3 w-3" />
              </span>
            )}
          </div>

          {/* Title - Prominent */}
          <h3 className="text-sm sm:text-base font-bold leading-tight text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>

          {/* Organizer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3 min-h-5">
            <Users className="h-3 w-3 flex-shrink-0 opacity-70" />
            <span className="truncate line-clamp-1 text-xs">{organizer || 'Organizer'}</span>
          </div>

          {/* Info Pills - Horizontal Row */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {/* Grade */}
            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              {gradeLabel}
            </span>
            
            {/* Mode */}
            <span className={cn(
              'inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold',
              MODE_STYLES[normalizedMode].className,
            )}>
              {MODE_STYLES[normalizedMode].label}
            </span>
            
            {/* Fee */}
            <span className={cn(
              'inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold',
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

            {/* CTA Button */}
           <button
  className={cn(
    'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold',
    'transition-all duration-200 active:scale-95',
    categoryStyles.accentClass,
    // use transparent instead of a white end so the gradient doesn't push a white tint
    categoryStyles.bgGradient.startsWith('from-')
      ? `bg-gradient-to-r ${categoryStyles.bgGradient} to-transparent`
      : categoryStyles.bgGradient,
    'border border-slate-200/50 dark:border-slate-700/50',
    'hover:shadow-md group-hover:shadow-md',
    // dark: keep white, light: use a dark slate color for good contrast
    'text-slate-900 dark:text-white',
  )}
>
  <span>Explore</span>
  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
</button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
