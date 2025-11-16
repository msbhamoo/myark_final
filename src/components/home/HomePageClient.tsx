'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import AllCategoriesSection from '@/components/AllCategoriesSection';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, GraduationCap, Target, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Opportunity } from '@/types/opportunity';
import { FALLBACK_HOME_SEGMENTS as HOME_SEGMENT_DEFINITIONS } from '@/constants/homeSegments';
import { cn } from '@/lib/utils';
import { MascotBurst, MascotOrb } from '@/components/MascotBurst';
import { LoadingSpinner, LoadingGrid } from '@/components/LoadingSpinner';

type HomeSegment = {
  id: string;
  title: string;
  subtitle?: string;
  segmentKey: string;
  limit: number;
  order: number;
  highlight?: boolean;
  opportunities: Opportunity[];
};

type HomeStats = {
  students: number;
  organizations: number;
  verifiedSchools: number;
  activeOpportunities: number;
};

type StateOpportunityGroup = {
  state: string;
  count: number;
  opportunities: Opportunity[];
};

const FALLBACK_HOME_SEGMENTS: HomeSegment[] = HOME_SEGMENT_DEFINITIONS.map((segment) => ({
  ...segment,
  opportunities: [],
}));

const FALLBACK_HOME_STATS: HomeStats = {
  students: 50_000,
  organizations: 2_50,
  verifiedSchools: 1_20,
  activeOpportunities: 120,
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'TBA';
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return format(date, 'MMM dd, yyyy');
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

const STAT_CONFIG: Array<{ key: keyof HomeStats; label: string }> = [
  { key: 'students', label: 'Students discovering opportunities' },
  { key: 'organizations', label: 'Organizations on the platform' },
  { key: 'verifiedSchools', label: 'Verified schools & colleges' },
  { key: 'activeOpportunities', label: 'Total active opportunities' },
];

const formatStatValue = (value?: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return '--';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  return `${formatter.format(value)}+`;
};

const HERO_GRADE_SEGMENTS = [
  { label: 'Grades 4-6', href: '/opportunities?grades=4-6' },
  { label: 'Grades 7-9', href: '/opportunities?grades=7-9' },
  { label: 'Grades 10-12', href: '/opportunities?grades=10-12' },
] as const;

const HERO_SPOTLIGHTS = [
  {
    label: 'Scholarships',
    caption: 'Win up to Rs 50k',
    href: '/opportunities?category=scholarships',
    tone: 'sunset',
    icon: '🎓',
  },
  {
    label: 'Olympiads',
    caption: 'STEM + language challenges',
    href: '/opportunities?category=olympiad',
    tone: 'violet',
    icon: '🧠',
  },
  {
    label: 'Bootcamps',
    caption: 'Build projects in 4 weeks',
    href: '/opportunities?category=bootcamp',
    tone: 'teal',
    icon: '🚀',
  },
] as const;

export default function HomePageClient() {
  const [homeSegments, setHomeSegments] = useState<HomeSegment[]>(FALLBACK_HOME_SEGMENTS);
  const [segmentsLoading, setSegmentsLoading] = useState(true);
  const [segmentsError, setSegmentsError] = useState<string | null>(null);
  const [stats, setStats] = useState<HomeStats>(FALLBACK_HOME_STATS);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stateGroups, setStateGroups] = useState<StateOpportunityGroup[]>([]);
  const [stateLoading, setStateLoading] = useState(true);
  const [stateError, setStateError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    const fetchHomeSegments = async () => {
      try {
        setSegmentsLoading(true);
        setSegmentsError(null);
        const response = await fetch('/api/home/segments');
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? 'Failed to load home segments');
        }
        const data = await response.json();
        const configured = Array.isArray(data.items) ? data.items : [];
        const fallbackByKey = new Map(
          FALLBACK_HOME_SEGMENTS.map((segment) => [segment.segmentKey.toLowerCase(), segment]),
        );

        const normalized: HomeSegment[] = [];
        const seenKeys = new Set<string>();

        configured.forEach((segment: Record<string, unknown>) => {
          const rawKey = typeof segment.segmentKey === 'string' ? segment.segmentKey.trim() : '';
          const normalizedKey = rawKey.toLowerCase();
          const fallback =
            fallbackByKey.get(normalizedKey) ?? FALLBACK_HOME_SEGMENTS[0];
          const opportunitiesList = Array.isArray(segment.opportunities)
            ? (segment.opportunities as Opportunity[])
            : [];

          normalized.push({
            id:
              typeof segment.id === 'string' && segment.id
                ? segment.id
                : fallback.id,
            title:
              typeof segment.title === 'string' && segment.title.trim()
                ? segment.title
                : fallback.title,
            subtitle:
              typeof segment.subtitle === 'string' && segment.subtitle.trim()
                ? segment.subtitle
                : fallback.subtitle,
            segmentKey: rawKey || fallback.segmentKey,
            limit:
              typeof segment.limit === 'number'
                ? segment.limit
                : typeof segment.limit === 'string'
                  ? Number(segment.limit)
                  : fallback.limit,
            order:
              typeof segment.order === 'number'
                ? segment.order
                : typeof segment.order === 'string'
                  ? Number(segment.order)
                  : fallback.order,
            highlight: Boolean(
              segment.highlight ?? fallback.highlight ?? false,
            ),
            opportunities: opportunitiesList,
          });

          if (normalizedKey) {
            seenKeys.add(normalizedKey);
          }
        });

        fallbackByKey.forEach((fallback, key) => {
          if (!seenKeys.has(key)) {
            normalized.push({
              ...fallback,
              opportunities: [],
            });
          }
        });

        normalized.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
        setHomeSegments(normalized);
      } catch (err) {
        console.error('Failed to load home segments', err);
        setSegmentsError('We could not load homepage segments. Showing defaults for now.');
        setHomeSegments(FALLBACK_HOME_SEGMENTS);
      } finally {
        setSegmentsLoading(false);
      }
    };

    fetchHomeSegments();
  }, []);

  useEffect(() => {
    const fetchStateOpportunities = async () => {
      try {
        setStateLoading(true);
        setStateError(null);
        const response = await fetch('/api/home/states');
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to load state-wise opportunities');
        }
        const items = Array.isArray(payload?.items) ? payload.items : [];
        const normalized: StateOpportunityGroup[] = items
          .map((entry: Record<string, unknown>) => {
            const state = typeof entry.state === 'string' ? entry.state.trim() : '';
            const opportunities = Array.isArray(entry.opportunities)
              ? (entry.opportunities as Opportunity[])
              : [];
            const count =
              typeof entry.count === 'number'
                ? entry.count
                : opportunities.length;
            return {
              state,
              count,
              opportunities,
            };
          })
          .filter((group: StateOpportunityGroup) => group.state && group.opportunities.length > 0);

        setStateGroups(normalized);
        setSelectedState((prev) => {
          if (prev && normalized.some((group) => group.state === prev)) {
            return prev;
          }
          return normalized[0]?.state ?? '';
        });
      } catch (err) {
        console.error('Failed to load state opportunities', err);
        setStateError(
          err instanceof Error
            ? err.message
            : 'Failed to load state-wise opportunities',
        );
        setStateGroups([]);
        setSelectedState('');
      } finally {
        setStateLoading(false);
      }
    };

    fetchStateOpportunities();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await fetch('/api/home/stats');
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? 'Failed to load home stats');
        }
        const data = await response.json();
        const payload = (data?.stats ?? {}) as Record<string, unknown>;
        const nextStats: HomeStats = {
          students: Number(payload.students) || FALLBACK_HOME_STATS.students,
          organizations: Number(payload.organizations) || FALLBACK_HOME_STATS.organizations,
          verifiedSchools: Number(payload.verifiedSchools) || FALLBACK_HOME_STATS.verifiedSchools,
          activeOpportunities: Number(payload.activeOpportunities) || FALLBACK_HOME_STATS.activeOpportunities,
        };
        setStats(nextStats);
      } catch (err) {
        console.error('Failed to load home stats', err);
        setStats(FALLBACK_HOME_STATS);
        setStatsError('Showing fallback stats until live data is available.');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const currentStateGroup = useMemo(() => {
    if (stateGroups.length === 0) {
      return null;
    }
    if (selectedState) {
      const match = stateGroups.find((group) => group.state === selectedState);
      if (match) {
        return match;
      }
    }
    return stateGroups[0];
  }, [selectedState, stateGroups]);

  const displayedState = currentStateGroup?.state ?? '';
  const displayedOpportunities = currentStateGroup?.opportunities ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-200/70 via-pink-100 to-sky-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 md:pt-24 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-300/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-sky-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm ring-1 ring-orange-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-orange-200 dark:ring-orange-300/40">
                <Sparkles className="h-4 w-4" />
                Bright futures start here
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Discover Your Next Big Moment
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-700 md:text-xl dark:text-slate-100/80">
                Curated opportunities for Grades 4-12 students and the parents who cheer them on.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-medium lg:justify-start">
                {HERO_GRADE_SEGMENTS.map((segment) => (
                  <Link
                    key={segment.href}
                    href={segment.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:ring-orange-200/70 dark:bg-slate-800/80 dark:text-slate-100"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    {segment.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                <Button
                  asChild
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 hover:shadow-orange-500/40"
                >
                  <Link href="/opportunities">
                    Explore Opportunities
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="inline-flex items-center justify-center rounded-full border-2 border-orange-200 bg-white/70 px-7 py-3 text-base font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-white dark:border-orange-300/70 dark:bg-slate-900 dark:text-orange-200"
                >
                  <Link href="/parent-guide">
                    Guide Your Child
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="w-full max-w-xl space-y-4 lg:max-w-[480px]">
              <div className="flex justify-end pr-2">
                <MascotBurst size="sm" className="hidden lg:inline-flex" />
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-orange-200/60 bg-white/80 p-4 sm:p-6 shadow-lg shadow-orange-200/40 dark:border-orange-300/20 dark:bg-slate-900/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-400/20 dark:text-orange-200">
                  Weekly spotlight
                </span>
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Jump in this week</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Handpicked programs to help you explore, compete, and grow.
                </p>
                <div className="mt-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                  {HERO_SPOTLIGHTS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3 sm:p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{item.label}</span>
                        </div>
                        <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                      </div>
                      <span className="text-xs text-slate-600 group-hover:text-orange-500 dark:text-slate-300 line-clamp-2">
                        {item.caption}
                      </span>
                      <span className="mt-auto inline-flex items-center text-xs font-semibold text-orange-500 pt-1">
                        Explore
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <Link
                  href="/opportunities?mode=online"
                  className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border border-sky-200/70 bg-white/80 p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-sky-300/30 dark:bg-slate-900/80"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-100 text-sky-600 flex-shrink-0 dark:bg-sky-500/20 dark:text-sky-200">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">Skill Labs</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">Workshops & clubs</p>
                  </div>
                </Link>
                <Link
                  href="/opportunities?category=scholarships"
                  className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border border-emerald-200/70 bg-white/80 p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-emerald-300/30 dark:bg-slate-900/80"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex-shrink-0 dark:bg-emerald-500/20 dark:text-emerald-200">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">Scholarships</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">Financial support</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="hidden md:block border-y border-orange-100 bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-12 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_CONFIG.map(({ key, label }) => {
                const value = formatStatValue(stats[key]);
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/60 bg-white/90 px-6 py-8 text-center shadow-sm shadow-orange-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-200 dark:border-slate-800/80 dark:bg-slate-900/80"
                  >
                    <p className={`text-3xl font-bold text-orange-600 md:text-4xl dark:text-orange-200 ${statsLoading ? 'animate-pulse' : ''}`}>
                      {value}
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-wide text-slate-600 dark:text-slate-300">{label}</p>
                  </div>
                );
              })}
            </div>
            {statsError && (
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">{statsError}</p>
            )}
          </div>
        </section>

        {segmentsError && (
          <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-red-600 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {segmentsError}
          </div>
        )}
        {segmentsLoading && (
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-100">
            Loading the latest opportunities...
          </div>
        )}

        {homeSegments
          .sort((a, b) => a.order - b.order)
          .map((segment) => {
            const items = Array.isArray(segment.opportunities)
              ? (segment.opportunities as Opportunity[]).slice(0, segment.limit)
              : [];
            const hasItems = items.length > 0;

            const highlightClasses = segment.highlight
              ? 'bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 dark:from-[#0b1030] dark:via-[#101b4a] dark:to-[#0b1030]'
              : 'bg-white dark:bg-[#0f1538]';
            const viewAllDisabled = !hasItems;
            const viewAllClasses = [
              'inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300',
              'border-orange-200 text-orange-600 hover:border-orange-300 hover:bg-orange-100/60 dark:border-orange-400/40 dark:text-orange-200 dark:hover:bg-orange-500/10',
              viewAllDisabled ? 'pointer-events-none opacity-50' : '',
            ]
              .filter(Boolean)
              .join(' ');
            const segmentLink = segment.segmentKey ? `/opportunities?segment=${encodeURIComponent(segment.segmentKey)}` : '/opportunities';

            return (
              <section key={segment.id} className={`relative overflow-hidden py-16 md:py-20 ${highlightClasses}`}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                  <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-orange-100 bg-white/80 p-3 shadow-sm dark:border-white/20 dark:bg-white/10">
                          <Sparkles className="h-5 w-5 text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">{segment.title}</h2>
                      </div>
                      {segment.subtitle && (
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-100">{segment.subtitle}</p>
                      )}
                    </div>
                    <Link href={segmentLink} aria-disabled={viewAllDisabled} className={viewAllClasses}>
                      View {hasItems ? 'all' : 'segment'}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative -mx-2">
                    {segmentsLoading ? (
                      <div className="flex gap-4 overflow-x-auto px-2 pb-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-[280px] flex-shrink-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50 animate-pulse space-y-3"
                          >
                            <div className="flex gap-2">
                              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                            </div>
                            <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="space-y-2 pt-2">
                              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                              <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : hasItems ? (
                      <div className="flex gap-4 overflow-x-auto px-2 pb-4">
                        {items.map((item) => {
                          // Determine if opportunity is closed
                          const isClosed = 
                            item.status?.toLowerCase() === 'closed' ||
                            (item.registrationDeadline && new Date(item.registrationDeadline) < new Date());
                          
                          return (
                            <OpportunityCard
                              key={`${segment.id}-${item.id}`}
                              id={item.id}
                              title={item.title}
                              category={item.category}
                              gradeEligibility={item.gradeEligibility || 'All Grades'}
                              organizer={item.organizer || 'Unknown Organizer'}
                              startDate={formatDate(item.startDate)}
                              endDate={formatDate(item.endDate)}
                              registrationDeadline={item.registrationDeadline ?? ''}
                              mode={normalizeMode(item.mode)}
                              fee={formatFee(item)}
                              image={item.image}
                              status={isClosed ? 'closed' : 'active'}
                              className="w-[280px] flex-shrink-0"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mx-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
                        No opportunities available yet for this segment. Check back soon.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}

        <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-[#0c183a] dark:via-[#0c1f4a] dark:to-[#0b1638]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm dark:border-white/20 dark:bg-white/10">
                    <MapPin className="h-5 w-5 text-sky-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">Discover programs near you</h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-100">
                  Filter live listings to find opportunities available in specific Indian states.
                </p>
              </div>
              {currentStateGroup && (
                <div className="text-sm text-slate-600 md:text-right dark:text-slate-100">
                  Showing{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{currentStateGroup.count}</span>{' '}
                  {currentStateGroup.count === 1 ? 'opportunity' : 'opportunities'} in{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{currentStateGroup.state}</span>
                </div>
              )}
            </div>

            {stateError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-600 shadow-sm dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
                {stateError}
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-wrap gap-3">
                  {stateLoading && stateGroups.length === 0 ? (
                    <div className="text-sm text-slate-600 dark:text-slate-100">Loading state-wise opportunities...</div>
                  ) : stateGroups.length === 0 ? (
                    <div className="text-sm text-slate-600 dark:text-slate-100">
                      State-based opportunities will appear here as soon as organisers publish them.
                    </div>
                  ) : (
                    stateGroups.map((group) => {
                      const isActive = group.state === displayedState;
                      return (
                        <button
                          key={group.state}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setSelectedState(group.state)}
                          className={cn(
                            'rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/60',
                            isActive
                              ? 'border-orange-200 bg-white text-orange-600 shadow-sm dark:border-orange-300/60 dark:bg-orange-500/10 dark:text-orange-200'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100'
                          )}
                        >
                          <span>{group.state}</span>
                          <span className="ml-2 text-xs text-muted-foreground dark:text-slate-100">{group.count}</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {stateLoading && stateGroups.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/85 px-6 py-10 text-center text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
                    Updating opportunities for {displayedState || 'selected state'}...
                  </div>
                ) : displayedOpportunities.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/85 px-6 py-10 text-center text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
                    No live opportunities right now for this state. Try another selection.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedOpportunities.map((opportunity) => {
                      // Determine if opportunity is closed
                      const isClosed = 
                        opportunity.status?.toLowerCase() === 'closed' ||
                        (opportunity.registrationDeadline && new Date(opportunity.registrationDeadline) < new Date());
                      
                      return (
                        <OpportunityCard
                          key={`${displayedState}-${opportunity.id}`}
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
                          className="h-full"
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

       
      </main>

      {/* Mobile-only Stats Section - Before Footer */}
     

      {/* All Categories Section - Mobile Only */}
      <AllCategoriesSection />

      <Footer />
      <BottomNavigation />
    </div>
  );
}



















