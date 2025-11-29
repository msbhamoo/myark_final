'use client';

import Link from 'next/link';
import { Calendar, Clock, Users, Zap, MapPin, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  { label: string; className: string; icon: any }
> = {
  online: {
    label: 'Online',
    className: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
    icon: Sparkles,
  },
  offline: {
    label: 'On Campus',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
    icon: MapPin,
  },
  hybrid: {
    label: 'Hybrid',
    className: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
    icon: Zap,
  },
};

// Simplified category styles for a cleaner look
const CATEGORY_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    icon: string;
  }
> = {
  scholarships: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '🎓' },
  olympiad: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🧠' },
  olympiads: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🧠' },
  workshop: { bg: 'bg-cyan-100', text: 'text-cyan-800', icon: '🔨' },
  workshops: { bg: 'bg-cyan-100', text: 'text-cyan-800', icon: '🔨' },
  bootcamp: { bg: 'bg-rose-100', text: 'text-rose-800', icon: '🚀' },
  bootcamps: { bg: 'bg-rose-100', text: 'text-rose-800', icon: '🚀' },
  summercamp: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '☀️' },
  summercamps: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '☀️' },
  internship: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: '💼' },
  internships: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: '💼' },
  competition: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🏆' },
  competitions: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🏆' },
  default: { bg: 'bg-slate-100', text: 'text-slate-800', icon: '⭐' },
};

function getCategoryStyles(category: string) {
  const normalized = category?.toLowerCase().trim() || 'default';
  return CATEGORY_STYLES[normalized] || CATEGORY_STYLES['default'];
}

export function getEligibilityDisplay(props: OpportunityCardProps): string {
  const type = props.eligibilityType || 'grade';
  if (type === 'age' && props.ageEligibility?.trim()) return `Age ${props.ageEligibility.trim()}`;
  if (type === 'grade' && props.gradeEligibility?.trim()) return `Grade ${props.gradeEligibility.trim()}`;
  if (type === 'both') {
    const parts: string[] = [];
    if (props.ageEligibility?.trim()) parts.push(`Age ${props.ageEligibility.trim()}`);
    if (props.gradeEligibility?.trim()) parts.push(`Grade ${props.gradeEligibility.trim()}`);
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
  mode,
  fee,
  className,
  status = 'active',
  image,
}: OpportunityCardProps) {
  const normalizedCategory = category?.trim() || 'Opportunity';
  const normalizedMode = MODE_STYLES[mode] ? mode : 'online';
  const categoryStyle = getCategoryStyles(normalizedCategory);

  // Default cover image fallback
  const coverImage = image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';

  const trimmedFee = fee?.trim() ?? '';
  const numericFee = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericFee = Number.isFinite(numericFee);
  const isFree = !trimmedFee || trimmedFee.toLowerCase() === 'free' || (hasNumericFee && numericFee <= 0);

  const feeDisplay = (() => {
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
        return `₹${numericFee}`;
      }
    }
    return trimmedFee;
  })();

  const computeDaysLeft = () => {
    if (registrationDeadlineTBD || !registrationDeadline) return { label: 'TBD', days: null, isTBD: true };
    const parsed = new Date(registrationDeadline);
    if (Number.isNaN(parsed.getTime())) return { label: 'TBD', days: null, isTBD: true };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff > 1) return { label: `${diff} days left`, days: diff, isTBD: false };
    if (diff === 1) return { label: 'Ends tomorrow', days: 1, isTBD: false };
    if (diff === 0) return { label: 'Ends today', days: 0, isTBD: false };
    return { label: 'Closed', days: -1, isTBD: false };
  };

  const { label: daysLabel, days: daysCount, isTBD } = computeDaysLeft();
  const isUrgent = !isTBD && daysCount !== null && daysCount <= 3 && daysCount >= 0;
  const eligibilityLabel = getEligibilityDisplay({ gradeEligibility, eligibilityType, ageEligibility } as OpportunityCardProps);

  return (
    <Link href={`/opportunity/${id}`} className="block h-full">
      <Card
        className={cn(
          'group relative h-full flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 p-0 gap-0',
          className
        )}
      >
        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md',
              'bg-white/95 text-slate-800 dark:bg-slate-900/90 dark:text-slate-100'
            )}>
              <span>{categoryStyle.icon}</span>
              <span>{normalizedCategory}</span>
            </span>
          </div>

          {/* Urgent Badge */}
          {isUrgent && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm animate-pulse">
                <Clock className="w-3 h-3" />
                <span>Urgent</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title & Organizer */}
          <div className="mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span className="truncate">{organizer}</span>
            </div>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium dark:bg-slate-800 dark:text-slate-300">
              {eligibilityLabel}
            </span>
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
              MODE_STYLES[normalizedMode].className
            )}>
              {MODE_STYLES[normalizedMode].label}
            </span>
          </div>

          {/* Footer: Fee & Deadline */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Entry Fee</span>
              <span className={cn(
                "text-sm font-bold",
                isFree ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"
              )}>
                {feeDisplay}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Deadline</span>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isUrgent ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-300"
              )}>
                <span>{daysLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
