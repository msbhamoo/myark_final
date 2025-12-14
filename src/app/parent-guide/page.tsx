'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import {
  Search,
  Sparkles,
  BookOpen,
  Target,
  ChevronRight,
  GraduationCap,
  Trophy,
  Lightbulb,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Shield,
  ArrowRight,
  Palette,
  Code,
  Mic,
  Dumbbell,
  Gift,
} from 'lucide-react';
import Link from 'next/link';
import type { Opportunity } from '@/types/opportunity';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Category configuration with icons and descriptions
const GROWTH_PATHS = [
  {
    id: 'scholarships',
    title: 'Scholarships & Financial Aid',
    shortTitle: 'Scholarships',
    description: 'Help your child access quality education with financial support',
    parentMessage: 'Reduce education costs while rewarding academic excellence',
    icon: Gift,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    gradient: 'from-amber-500 to-orange-500',
    filterKey: 'scholarship',
  },
  {
    id: 'olympiads',
    title: 'Olympiads & Academic Challenges',
    shortTitle: 'Olympiads',
    description: 'Strengthen subject knowledge through healthy challenges',
    parentMessage: 'Build problem-solving skills that last a lifetime',
    icon: Trophy,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300',
    gradient: 'from-purple-500 to-indigo-500',
    filterKey: 'olympiad',
  },
  {
    id: 'stem',
    title: 'AI, Robotics & Innovation',
    shortTitle: 'Tech & Innovation',
    description: 'Explore technologies shaping the future',
    parentMessage: 'Prepare your child for the careers of tomorrow',
    icon: Code,
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
    gradient: 'from-sky-500 to-cyan-500',
    filterKey: 'stem',
  },
  {
    id: 'debate',
    title: 'Writing, Debate & Expression',
    shortTitle: 'Expression',
    description: 'Find your voice and share ideas with confidence',
    parentMessage: 'Communication skills are essential for every career',
    icon: Mic,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
    gradient: 'from-rose-500 to-pink-500',
    filterKey: 'debate',
  },
  {
    id: 'arts',
    title: 'Art, Creativity & Talent',
    shortTitle: 'Arts & Creativity',
    description: 'Nurture artistic skills and creative thinking',
    parentMessage: 'Every child has unique talents waiting to be discovered',
    icon: Palette,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    gradient: 'from-emerald-500 to-teal-500',
    filterKey: 'art',
  },
  {
    id: 'sports',
    title: 'Sports & Physical Excellence',
    shortTitle: 'Sports',
    description: 'Build discipline, teamwork, and physical fitness',
    parentMessage: 'A healthy body supports a healthy mind',
    icon: Dumbbell,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    gradient: 'from-blue-500 to-indigo-500',
    filterKey: 'sports',
  },
];

// Utility functions
const formatDate = (value?: string) => {
  if (!value) return 'TBA';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return format(date, 'MMM dd, yyyy');
  } catch {
    return value;
  }
};

const formatFee = (opportunity: Opportunity) => {
  const trimmedFee = opportunity.fee?.trim() ?? '';
  const numeric = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const isFree = !trimmedFee || trimmedFee.toLowerCase() === 'free' || (Number.isFinite(numeric) && numeric <= 0);
  if (isFree) return 'FREE';
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numeric);
  }
  return trimmedFee;
};

const normalizeMode = (mode?: Opportunity['mode']): Opportunity['mode'] => {
  if (mode === 'online' || mode === 'offline' || mode === 'hybrid') return mode;
  return 'online';
};

export default function ParentGuidePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Fetch opportunities and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [oppRes, catRes] = await Promise.all([
          fetch('/api/opportunities?limit=100'),
          fetch('/api/categories'),
        ]);

        if (oppRes.ok) {
          const data = await oppRes.json();
          setOpportunities(data.opportunities || []);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories || data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count opportunities by growth path
  const pathCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GROWTH_PATHS.forEach((path) => {
      counts[path.id] = opportunities.filter((opp) => {
        const cat = opp.category?.toLowerCase() || '';
        const catName = opp.categoryName?.toLowerCase() || '';
        return cat.includes(path.filterKey) || catName.includes(path.filterKey);
      }).length;
    });
    return counts;
  }, [opportunities]);

  // Get opportunities for selected path
  const filteredOpportunities = useMemo(() => {
    if (!selectedPath) return [];
    const path = GROWTH_PATHS.find((p) => p.id === selectedPath);
    if (!path) return [];

    return opportunities
      .filter((opp) => {
        const cat = opp.category?.toLowerCase() || '';
        const catName = opp.categoryName?.toLowerCase() || '';
        return cat.includes(path.filterKey) || catName.includes(path.filterKey);
      })
      .slice(0, 6);
  }, [selectedPath, opportunities]);

  // Get featured opportunities (deadline approaching)
  const featuredOpportunities = useMemo(() => {
    const now = new Date();
    return opportunities
      .filter((opp) => {
        if (!opp.registrationDeadline) return false;
        const deadline = new Date(opp.registrationDeadline);
        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysRemaining > 0 && daysRemaining <= 30;
      })
      .sort((a, b) => {
        const deadlineA = new Date(a.registrationDeadline!).getTime();
        const deadlineB = new Date(b.registrationDeadline!).getTime();
        return deadlineA - deadlineB;
      })
      .slice(0, 4);
  }, [opportunities]);

  // Stats from real data
  const stats = useMemo(() => ({
    totalOpportunities: opportunities.length,
    scholarships: opportunities.filter((o) => o.category?.toLowerCase().includes('scholarship')).length,
    freeOpportunities: opportunities.filter((o) => {
      const fee = o.fee?.trim() ?? '';
      return !fee || fee.toLowerCase() === 'free' || Number(fee) <= 0;
    }).length,
    onlineOpportunities: opportunities.filter((o) => o.mode === 'online').length,
  }), [opportunities]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section - Parent-focused */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/30 px-4 pt-12 pb-16 sm:px-6 md:pt-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800/90 dark:text-slate-200 dark:ring-slate-700">
              <Heart className="h-4 w-4 text-primary" />
              <span>A Guide Made for Parents</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
              Help Your Child Discover<br className="hidden sm:block" /> What They Can Become
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Every child has unique potential. Explore verified opportunities that match their age, interests, and dreams.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="rounded-full bg-primary px-8 py-6 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                <Link href="/opportunities">
                  Browse All Opportunities
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-2 border-slate-200 bg-white px-8 py-6 text-base font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <a href="#growth-paths">
                  Explore by Interest
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Live Stats Strip */}
        <section className="border-y border-slate-100 bg-slate-50/80 py-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalOpportunities}+</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Active Opportunities</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.scholarships}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Scholarships Available</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.freeOpportunities}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Free to Apply</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.onlineOpportunities}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Online Programs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters - Parent Connection */}
        <section className="py-12 md:py-16 px-4 bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
              Beyond Academics: The Opportunities That Shape Futures
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Research shows that students who participate in competitions, workshops, and skill-building programs
              develop stronger problem-solving abilities, better time management, and increased confidence.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Build a Strong Profile</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Recognition from national competitions strengthens college applications and opens doors.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Discover Hidden Talents</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Many students find their passion through exposure to new subjects and challenges.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Connect with Peers</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Meet like-minded students from across India and build lasting networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deadline Approaching - Urgency */}
        {featuredOpportunities.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-red-50/50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/20">
                    <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                      Deadlines Approaching
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Don't miss these opportunities</p>
                  </div>
                </div>
                <Link
                  href="/opportunities"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    id={opp.id}
                    title={opp.title}
                    category={opp.category}
                    gradeEligibility={opp.gradeEligibility || 'All Grades'}
                    eligibilityType={opp.eligibilityType}
                    ageEligibility={opp.ageEligibility}
                    organizer={opp.organizer || 'Unknown Organizer'}
                    startDate={formatDate(opp.startDate)}
                    endDate={formatDate(opp.endDate)}
                    registrationDeadline={opp.registrationDeadline ?? ''}
                    registrationDeadlineTBD={opp.registrationDeadlineTBD}
                    startDateTBD={opp.startDateTBD}
                    endDateTBD={opp.endDateTBD}
                    mode={normalizeMode(opp.mode)}
                    fee={formatFee(opp)}
                    image={opp.image}
                    status={'active'}
                    organizerLogo={opp.organizerLogo}
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Growth Paths - Interactive */}
        <section id="growth-paths" className="py-12 md:py-16 px-4 bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                Choose Your Child's Growth Path
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                What sparks your child's curiosity? Click a path to explore opportunities.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GROWTH_PATHS.map((path) => {
                const Icon = path.icon;
                const count = pathCounts[path.id] || 0;
                const isSelected = selectedPath === path.id;

                return (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(isSelected ? null : path.id)}
                    className={cn(
                      'text-left p-5 rounded-2xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('p-3 rounded-xl', path.color)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                            {path.shortTitle}
                          </h3>
                          <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {loading ? '...' : count}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {path.parentMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Path Opportunities */}
            {selectedPath && filteredOpportunities.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {GROWTH_PATHS.find((p) => p.id === selectedPath)?.title} Opportunities
                  </h3>
                  <Link
                    href={`/opportunities?category=${GROWTH_PATHS.find((p) => p.id === selectedPath)?.filterKey}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View all <ChevronRight className="inline h-4 w-4" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      id={opp.id}
                      title={opp.title}
                      category={opp.category}
                      gradeEligibility={opp.gradeEligibility || 'All Grades'}
                      eligibilityType={opp.eligibilityType}
                      ageEligibility={opp.ageEligibility}
                      organizer={opp.organizer || 'Unknown Organizer'}
                      startDate={formatDate(opp.startDate)}
                      endDate={formatDate(opp.endDate)}
                      registrationDeadline={opp.registrationDeadline ?? ''}
                      registrationDeadlineTBD={opp.registrationDeadlineTBD}
                      startDateTBD={opp.startDateTBD}
                      endDateTBD={opp.endDateTBD}
                      mode={normalizeMode(opp.mode)}
                      fee={formatFee(opp)}
                      image={opp.image}
                      status={'active'}
                      organizerLogo={opp.organizerLogo}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedPath && filteredOpportunities.length === 0 && !loading && (
              <div className="mt-10 text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-slate-600 dark:text-slate-400">
                  No opportunities found in this category yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Parent Tips Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                Tips for Parents
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                How to guide your child without adding pressure
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  🎯 Start with interests, not pressure
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ask your child what subjects excite them. Whether it's coding, art, or sports — there's an opportunity for every passion.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  📅 Plan ahead for deadlines
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Most competitions require advance registration. Set reminders 2-3 weeks before deadlines to avoid last-minute stress.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  🏆 Celebrate participation, not just winning
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The experience of preparing and participating teaches valuable life skills, regardless of the outcome.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-primary/5 via-white to-accent/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="mx-auto h-10 w-10 text-primary/60 mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white leading-snug">
              Every opportunity is a stepping stone.
            </h2>
            <p className="mt-3 text-xl text-slate-600 dark:text-slate-300">
              Help your child take the first step today.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-10 py-6 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                <Link href="/opportunities">
                  Explore All Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
