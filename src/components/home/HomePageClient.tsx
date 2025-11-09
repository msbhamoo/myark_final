'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, GraduationCap, Target, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Opportunity } from '@/types/opportunity';
import { FALLBACK_HOME_SEGMENTS as HOME_SEGMENT_DEFINITIONS } from '@/constants/homeSegments';
import { cn } from '@/lib/utils';

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
  students: 500_000,
  organizations: 2_500,
  verifiedSchools: 1_200,
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#071045] py-16 md:py-28 overflow-hidden">
          {/* Modern Background Decorations */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full opacity-50 blur-3xl animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-block mb-4 animate-fade-in-up">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-orange-400 border border-orange-500/20 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                    Welcome to MyArk
                  </span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white animate-fade-in-up animation-delay-150">
                    Empowering 
                    <span className="text-orange-400"> Students, Schools  </span>
                    & their 
                    <span className="relative inline-block ml-2">
                      <span className="relative z-10 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Success</span>
                      <span className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-orange-400/30 to-pink-400/30 -z-10 transform skew-x-12 animate-pulse"></span>
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up animation-delay-300 leading-relaxed">
Discover opportunities around the world to hone your skills, showcase your abilities, boost your academic credentials, and chase your dream job profession.                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-450">
                    <Button className="group px-8 py-6 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 transition-all duration-300">
                      Start Learning Now
                      <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 rounded-xl bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                    >
                      View Courses
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Content - Cards Grid */}
              <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto w-full animate-fade-in-up animation-delay-600">
                {/* Top Row - 3 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {/* Scholarships Card */}
                  <Link href="/opportunities?category=scholarships" className="group block">
                    <div className="w-full sm:w-[200px] h-[240px] bg-gradient-to-br from-orange-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col overflow-hidden relative border border-white/10 hover:border-orange-500/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                      <h3 className="text-lg font-semibold text-white z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                        Scholarships
                      </h3>
                      {/* <p className="text-sm text-gray-400 mt-2">Access top scholarships worldwide</p> */}
                      <div className="flex-1 flex items-end justify-center">
                        <img 
                          src="/images/scholarship-girl.png"
                          alt="Scholarships"
                          className="h-[140px] w-auto object-contain drop-shadow-2xl transform translate-y-4 group-hover:scale-110 group-hover:translate-y-2 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>

                  {/* Olympiad Card */}
                  <Link href="/opportunities?category=olympiad" className="group block perspective animation-delay-150">
                    <div className="w-full sm:w-[200px] h-[240px] bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl p-6 flex flex-col overflow-hidden relative preserve-3d hover:shadow-2xl transition-all duration-500 hover:[transform:rotateY(10deg)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                      <h3 className="text-xl font-semibold text-white z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
                        Olympiad
                      </h3>
                      <div className="flex-1 flex items-end justify-center transform preserve-3d group-hover:[transform:translateZ(20px)] transition-transform duration-500">
                        <img 
                          src="/images/olympiad-trophy.png"
                          alt="Olympiad"
                          className="h-[180px] w-auto object-contain drop-shadow-2xl transform translate-y-4 group-hover:scale-110 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>

                  {/* School Entrance Card */}
                  <Link href="/opportunities?category=school-entrance" className="group block perspective animation-delay-300">
                    <div className="w-full sm:w-[200px] h-[240px] bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-6 flex flex-col overflow-hidden relative preserve-3d hover:shadow-2xl transition-all duration-500 hover:[transform:rotateY(10deg)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                      <h3 className="text-xl font-semibold text-white z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
                        School Entrance
                      </h3>
                      <div className="flex-1 flex items-end justify-center transform preserve-3d group-hover:[transform:translateZ(20px)] transition-transform duration-500">
                        <img 
                          src="/images/school-entrance.png"
                          alt="School Entrance"
                          className="h-[180px] w-auto object-contain drop-shadow-2xl transform translate-y-4 group-hover:scale-110 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>
                </div>

                {/* Bottom Row - 2 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:w-2/3">
                  {/* Talent Search Card */}
                  <Link href="/opportunities?category=talent-search" className="group block perspective animation-delay-450">
                    <div className="w-full sm:w-[200px] h-[240px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 flex flex-col overflow-hidden relative preserve-3d hover:shadow-2xl transition-all duration-500 hover:[transform:rotateY(10deg)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                      <h3 className="text-xl font-semibold text-white z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
                        Talent Search
                      </h3>
                      <div className="flex-1 flex items-end justify-center transform preserve-3d group-hover:[transform:translateZ(20px)] transition-transform duration-500">
                        <img 
                          src="/images/talent-search.png"
                          alt="Talent Search"
                          className="h-[180px] w-auto object-contain drop-shadow-2xl transform translate-y-4 group-hover:scale-110 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>

                  {/* Blog Card */}
                  <Link href="/resources" className="group block perspective animation-delay-600">
                    <div className="w-full sm:w-[200px] h-[240px] bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 flex flex-col overflow-hidden relative preserve-3d hover:shadow-2xl transition-all duration-500 hover:[transform:rotateY(10deg)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                      <h3 className="text-xl font-semibold text-white z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
                        Blog
                      </h3>
                      <div className="flex-1 flex items-end justify-center transform preserve-3d group-hover:[transform:translateZ(20px)] transition-transform duration-500">
                        <img 
                          src="/images/blog-girl.png"
                          alt="Blog"
                          className="h-[180px] w-auto object-contain drop-shadow-2xl transform translate-y-4 group-hover:scale-110 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#050b3a] border-y border-white/5 py-12">
          <div className="container mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_CONFIG.map(({ key, label }) => {
                const value = formatStatValue(stats[key]);
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur transition-all duration-300 hover:border-orange-400/40 hover:bg-white/10"
                  >
                    <p className={`text-3xl font-bold text-white md:text-4xl ${statsLoading ? 'animate-pulse' : ''}`}>
                      {value}
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-wide text-white/60">{label}</p>
                  </div>
                );
              })}
            </div>
            {statsError && (
              <p className="mt-4 text-center text-xs text-white/40">{statsError}</p>
            )}
          </div>
        </section>

        {segmentsError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-center mx-auto mt-4 max-w-4xl rounded-2xl px-4 py-3">
            {segmentsError}
          </div>
        )}
        {segmentsLoading && (
          <div className="text-center text-sm text-white/60 mt-6">Loading the latest opportunities...</div>
        )}

        {homeSegments
          .sort((a, b) => a.order - b.order)
          .map((segment) => {
            const items = Array.isArray(segment.opportunities)
              ? (segment.opportunities as Opportunity[]).slice(0, segment.limit)
              : [];
            const hasItems = items.length > 0;

            const highlightClasses = segment.highlight
              ? 'bg-gradient-to-b from-[#071045] via-[#050b3a] to-[#071045]'
              : 'bg-[#050b3a]';
            const viewAllDisabled = !hasItems;
            const viewAllClasses = [
              'inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300',
              'border-white/20 text-white hover:border-orange-400/50 hover:bg-orange-500/10',
              viewAllDisabled ? 'pointer-events-none opacity-50' : '',
            ]
              .filter(Boolean)
              .join(' ');
            const segmentLink = segment.segmentKey ? `/opportunities?segment=${encodeURIComponent(segment.segmentKey)}` : '/opportunities';

            return (
              <section key={segment.id} className={`relative py-16 md:py-20 ${highlightClasses}`}>
                <div className="absolute inset-0 bg-grid-white/[0.02] opacity-40"></div>
                <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
                  <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                          <Sparkles className="h-5 w-5 text-orange-300" />
                        </div>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">{segment.title}</h2>
                      </div>
                      {segment.subtitle && (
                        <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">{segment.subtitle}</p>
                      )}
                    </div>
                    <Link href={segmentLink} aria-disabled={viewAllDisabled} className={viewAllClasses}>
                      View {hasItems ? 'all' : 'segment'}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative -mx-2">
                    {hasItems ? (
                      <div className="flex gap-4 overflow-x-auto px-2 pb-4">
                        {items.map((item) => (
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
                            className="w-[280px] flex-shrink-0"
                          />
                        ))}
                      </div>
                    ) : (
                      !segmentsLoading && (
                        <div className="mx-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/60">
                          No opportunities available yet for this segment. Check back soon.
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            );
          })}

        <section className="relative py-16 md:py-20 bg-[#050b3a]">
          <div className="absolute inset-0 bg-grid-white/[0.02] opacity-40"></div>
          <div className="container relative mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 xl:px-16">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                    <MapPin className="h-5 w-5 text-orange-300" />
                  </div>
                  <h2 className="text-3xl font-bold text-white md:text-4xl">Discover programs near you</h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                  Filter live listings to find opportunities available in specific Indian states.
                </p>
              </div>
              {currentStateGroup && (
                <div className="text-sm text-white/70 md:text-right">
                  Showing{' '}
                  <span className="font-semibold text-white">{currentStateGroup.count}</span>{' '}
                  {currentStateGroup.count === 1 ? 'opportunity' : 'opportunities'} in{' '}
                  <span className="font-semibold text-white">{currentStateGroup.state}</span>
                </div>
              )}
            </div>

            {stateError ? (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-8 text-sm text-red-200">
                {stateError}
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-wrap gap-3">
                  {stateLoading && stateGroups.length === 0 ? (
                    <div className="text-sm text-white/60">Loading state-wise opportunities...</div>
                  ) : stateGroups.length === 0 ? (
                    <div className="text-sm text-white/60">
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
                              ? 'border-white bg-white text-slate-900'
                              : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                          )}
                        >
                          <span>{group.state}</span>
                          <span className="ml-2 text-xs text-white/60">{group.count}</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {stateLoading && stateGroups.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/70">
                    Updating opportunities for {displayedState || 'selected state'}...
                  </div>
                ) : displayedOpportunities.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/70">
                    No live opportunities right now for this state. Try another selection.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedOpportunities.map((opportunity) => (
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
                        className="h-full"
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-orange-500 to-pink-500 text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#071045]/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#071045]/80 to-transparent"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your <span className="text-[#071045]">Journey</span> Today
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Practice with past papers, explore resources, and track your progress to achieve your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40">
                <div className="mb-6 p-3 bg-[#071045] rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Practice Papers</h3>
                <p className="text-blue-100 mb-6 text-lg">Access solved and unsolved past papers with detailed progress tracking</p>
                <Button variant="secondary" className="w-full py-6 text-lg rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                  Start Practice
                </Button>
              </div>

              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10">
                <div className="mb-6 p-3 bg-white/10 rounded-xl w-fit group-hover:bg-white/20 transition-colors">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Resources</h3>
                <p className="text-blue-100 mb-6 text-lg">Comprehensive collection of reference materials and guides</p>
                <Button variant="secondary" className="w-full py-6 text-lg rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                  Explore Resources
                </Button>
              </div>

              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10">
                <div className="mb-6 p-3 bg-white/10 rounded-xl w-fit group-hover:bg-white/20 transition-colors">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Dashboard</h3>
                <p className="text-blue-100 mb-6 text-lg">Track your progress, achievements, and manage your bookmarks</p>
                <Button variant="secondary" className="w-full py-6 text-lg rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}












