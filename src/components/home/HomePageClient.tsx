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
import { FloatingMotivation } from '@/components/home/FloatingMotivation';

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

// const HERO_GRADE_SEGMENTS = [
//   { label: 'Grades 4-6', href: '/opportunities?grades=4-6' },
//   { label: 'Grades 7-9', href: '/opportunities?grades=7-9' },
//   { label: 'Grades 10-12', href: '/opportunities?grades=10-12' },
// ] as const;

const HERO_SPOTLIGHTS = [
  {
    label: 'Scholarships',
    caption: 'Win up to Rs 50k',
    href: '/opportunities?category=scholarships',
    tone: 'blue',
    icon: '🎓',
    bgGradient: 'from-blue-400 to-blue-600',
    emoji: '💰',
  },
  {
    label: 'Olympiad',
    caption: 'STEM + language challenges',
    href: '/opportunities?category=olympiad',
    tone: 'purple',
    icon: '🧠',
    bgGradient: 'from-purple-400 to-purple-600',
    emoji: '🏅',
  },
  {
    label: 'School Entrance',
    caption: 'Top school admissions',
    href: '/opportunities?category=school-entrance',
    tone: 'teal',
    icon: '🎒',
    bgGradient: 'from-teal-400 to-cyan-500',
    emoji: '🏫',
  },
  {
    label: 'Talent Search Exams',
    caption: 'Discover your potential',
    href: '/opportunities?category=talent-search',
    tone: 'indigo',
    icon: '⭐',
    bgGradient: 'from-indigo-400 to-indigo-600',
    emoji: '✨',
  },
  {
    label: 'Blog',
    caption: 'Tips & success stories',
    href: '/opportunities?category=resources',
    tone: 'green',
    icon: '📝',
    bgGradient: 'from-chart-1 to-chart-2',
    emoji: '�',
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
  const [blogs, setBlogs] = useState<any[]>([]);

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

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' });
        if (!res.ok) {
          console.error('Failed to fetch blogs:', res.statusText);
          setBlogs([]);
          return;
        }
        const data = await res.json();
        if (data.error) {
          console.error('Blog API error:', data.error);
          setBlogs([]);
          return;
        }
        setBlogs(Array.isArray(data.posts) ? data.posts : []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      }
    };
    run();
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
        <section className="relative overflow-hidden bg-gradient-to-br from-accent/70 via-white to-accent/30 px-4 pt-8 pb-16 text-slate-900 sm:px-6 md:pt-24 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-sky-300/30 blur-3xl" />
            <FloatingMotivation />
          </div>

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/5 to-accent/10 px-6 py-2.5 text-base font-bold text-primary shadow-sm ring-1 ring-accent/50 backdrop-blur-md transition-all hover:scale-105 hover:shadow-md dark:from-primary/20 dark:to-accent/10 dark:text-accent dark:ring-primary/40">
                <Sparkles className="h-5 w-5 animate-pulse text-accent dark:text-primary" />
                <span className="tracking-wide">
                  Be Remyarkable
                </span>
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Discover Your Next Big Moment
              </h1>
              <p className="hidden md:block mt-4 text-lg leading-relaxed text-slate-700 md:text-xl dark:text-slate-100/80">
                Curated opportunities for Grades 4-12 students and the parents who cheer them on.
              </p>
              {/* <div className="hidden md:flex mt-6 flex-wrap items-center justify-center gap-3 text-sm font-medium lg:justify-start">
                {HERO_GRADE_SEGMENTS.map((segment) => (
                  <Link
                    key={segment.href}
                    href={segment.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:ring-accent/70 dark:bg-slate-800/80 dark:text-slate-100"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {segment.label}
                  </Link>
                ))}
              </div> */}
              <div className="hidden md:flex mt-8 w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                <Button
                  asChild
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-chart-1 to-chart-2 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:brightness-110 hover:shadow-primary/50"
                >
                  <Link href="/opportunities">
                    Explore Opportunities
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="inline-flex items-center justify-center rounded-full border-2 border-accent bg-white/50 px-8 py-6 text-lg font-semibold text-primary backdrop-blur-sm transition-all hover:border-primary hover:bg-white hover:scale-105 dark:border-primary/50 dark:bg-slate-900/50 dark:text-accent dark:hover:bg-slate-900"
                >
                  <Link href="/parent-guide">
                    Guide Your Child
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Stats Section - Integrated into Hero (Desktop Only) */}
              <div className="hidden md:grid mt-10 grid-cols-4 gap-8 border-t border-slate-200/60 pt-8 dark:border-slate-800/60">
                {STAT_CONFIG.map(({ key, label }) => {
                  const value = formatStatValue(stats[key]);
                  return (
                    <div key={key} className="flex flex-col gap-1">
                      <p className={`text-2xl font-bold text-slate-900 dark:text-white ${statsLoading ? 'animate-pulse' : ''}`}>
                        {value}
                      </p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400 leading-tight">
                        {label.replace('Students discovering opportunities', 'Students').replace('Organizations on the platform', 'Organizations').replace('Verified schools & colleges', 'Schools').replace('Total active opportunities', 'Opportunities')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full max-w-xl space-y-4 lg:max-w-[480px]">
              <div className="flex justify-end pr-2">
                <MascotBurst size="sm" className="hidden lg:inline-flex" />
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-accent/60 bg-white/80 p-4 sm:p-6 shadow-lg shadow-primary/20 dark:border-primary/20 dark:bg-slate-900/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-[#1A2A33] dark:bg-primary/20 dark:text-accent">
                  Weekly spotlight
                </span>
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Jump in this week</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Handpicked programs to help you explore, compete, and grow.
                </p>
                <div className="mt-5 grid gap-3 sm:gap-3 grid-cols-2 sm:grid-cols-3">
                  {HERO_SPOTLIGHTS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${item.bgGradient} p-4 sm:p-5 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition" />
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                        <span className="text-xs sm:text-sm font-bold text-white line-clamp-2">{item.label}</span>
                        <span className="text-xs text-white/90 line-clamp-1">{item.caption}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <Link
                  href="/innovation-labs"
                  className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border border-sky-200/70 bg-white/80 p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-sky-300/30 dark:bg-slate-900/80"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-100 text-sky-600 flex-shrink-0 dark:bg-sky-500/20 dark:text-sky-200">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">Innovation Labs</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">Robotics & IOT</p>
                  </div>
                </Link>
                <Link
                  href="/ai-in-schools"
                  className="flex items-center gap-3 rounded-2xl sm:rounded-3xl border border-emerald-200/70 bg-white/80 p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-emerald-300/30 dark:bg-slate-900/80"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex-shrink-0 dark:bg-emerald-500/20 dark:text-emerald-200">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">AI In Schools</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">AI & ML</p>
                  </div>
                </Link>
              </div>
            </div>
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
              ? 'bg-gradient-to-br from-accent/30 via-white to-accent/30 dark:from-[#0b1030] dark:via-[#101b4a] dark:to-[#0b1030]'
              : 'bg-white dark:bg-[#0f1538]';
            const viewAllDisabled = !hasItems;
            const viewAllClasses = [
              'inline-flex items-center gap-2 rounded-full border px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-300',
              'border-accent text-primary hover:border-primary hover:bg-accent/60 dark:border-primary/40 dark:text-accent dark:hover:bg-primary/10',
              viewAllDisabled ? 'pointer-events-none opacity-50' : '',
            ]
              .filter(Boolean)
              .join(' ');
            const segmentLink = segment.segmentKey ? `/opportunities?segment=${encodeURIComponent(segment.segmentKey)}` : '/opportunities';

            return (
              <section key={segment.id} className={`relative overflow-hidden py-16 md:py-20 ${highlightClasses}`}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-xl border border-accent bg-white/80 p-2 sm:p-3 shadow-sm dark:border-white/20 dark:bg-white/10 shrink-0">
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl dark:text-white truncate">{segment.title}</h2>
                      </div>
                      {segment.subtitle && (
                        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 md:text-base dark:text-slate-100 line-clamp-1 sm:line-clamp-2">{segment.subtitle}</p>
                      )}
                    </div>
                    <Link href={segmentLink} aria-disabled={viewAllDisabled} className={`${viewAllClasses} shrink-0 ml-2`}>
                      <span className="hidden sm:inline">View {hasItems ? 'all' : 'segment'}</span>
                      <span className="sm:hidden">View all</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
                            'rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/60',
                            isActive
                              ? 'border-accent bg-white text-primary shadow-sm dark:border-primary/60 dark:bg-primary/10 dark:text-accent'
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


        {/* Blog section */}
        {blogs.length > 0 && (
          <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-accent/50 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
            <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
              <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl border border-accent bg-white/80 p-3 shadow-sm dark:border-primary/20 dark:bg-white/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">Latest from our Blog</h2>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">Insights, tips, and success stories to help you make the most of your opportunities</p>
                </div>
                <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-accent bg-white/80 px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-white dark:border-primary/40 dark:bg-slate-800/80 dark:text-accent dark:hover:bg-slate-800">
                  View all posts
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Blog Post */}
                {blogs[0] && (
                  <Link href={`/blog/${blogs[0].slug}`} className="lg:col-span-2 group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-md transition hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/80">
                    <div className="flex flex-col h-full">
                      {/* Featured Image */}
                      {blogs[0].coverImage && (
                        <div className="relative overflow-hidden h-72 sm:h-80 md:h-96 bg-slate-200 dark:bg-slate-800">
                          <img
                            src={blogs[0].coverImage}
                            alt={blogs[0].title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {blogs[0].tags && blogs[0].tags.length > 0 && (
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                {blogs[0].tags[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            {blogs[0].author && (
                              <>
                                <span className="font-medium text-slate-900 dark:text-slate-200">{blogs[0].author}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{blogs[0].publishedAt ? new Date(blogs[0].publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently published'}</span>
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white line-clamp-3 mb-3 group-hover:text-primary dark:group-hover:text-primary transition">
                          {blogs[0].title}
                        </h3>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-1">
                          {blogs[0].excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-primary dark:text-accent font-semibold text-sm group-hover:gap-3 transition-all">
                          Read article
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Blog Grid */}
                <div className="lg:col-span-1 flex flex-col gap-5">
                  {blogs.slice(1, 4).map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/80"
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        {post.coverImage && (
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition group-hover:scale-110"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Published'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Stats Section (Bottom) */}
        <section className="md:hidden border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6">
              {STAT_CONFIG.map(({ key, label }) => {
                const value = formatStatValue(stats[key]);
                return (
                  <div key={key} className="flex flex-col items-center text-center gap-1">
                    <p className={`text-3xl font-bold text-primary dark:text-accent ${statsLoading ? 'animate-pulse' : ''}`}>
                      {value}
                    </p>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider dark:text-slate-400">
                      {label.replace('Students discovering opportunities', 'Students').replace('Organizations on the platform', 'Organizations').replace('Verified schools & colleges', 'Schools').replace('Total active opportunities', 'Opportunities')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Mobile-only Stats Section - Before Footer */}


      {/* All Categories Section - Mobile Only */}
      {/* <AllCategoriesSection /> */}

      <Footer />
      <BottomNavigation />
    </div>
  );
}



















