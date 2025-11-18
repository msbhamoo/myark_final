'use client';

import React, { useMemo } from 'react';
import type { AppUserProfile } from '@/context/AuthContext';
import type { StudentProfile } from '@/types/studentProfile';
import { useGamification } from '@/hooks/use-gamification';
import { GamificationHeroSection } from './GamificationHeroSection';
import { InstagramBadgesDisplay } from './InstagramBadgesDisplay';
import { DuolingoXPProgress } from './DuolingoXPProgress';
import { StreakDisplay } from './StreakDisplay';
import { AchievementTimeline } from './AchievementTimeline';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentProfileGamificationSectionProps {
  user: AppUserProfile;
  profile: StudentProfile;
  className?: string;
}

export function StudentProfileGamificationSection({
  user,
  profile,
  className = '',
}: StudentProfileGamificationSectionProps) {
  const { gamification, loading, error } = useGamification(user.uid, profile.schoolInfo.schoolName || 'unknown');

  // Build avatar fallback
  const avatarFallback = useMemo(() => {
    const name = profile.displayName || user.displayName || 'Student';
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  }, [profile.displayName, user.displayName]);

  if (loading) {
    return (
      <div className={cn('space-y-8', className)}>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 dark:border-white/10 dark:bg-white/5">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="rounded-2xl border border-amber-200/40 bg-amber-50/40 p-6 backdrop-blur-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Gamification not available
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gamification) {
    return null;
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section */}
      <section id="gamification-hero">
        <GamificationHeroSection
          gamification={gamification}
          displayName={profile.displayName || user.displayName || 'Student'}
          photoUrl={profile.photoUrl ?? undefined}
          profile={profile}
        />
      </section>

      {/* Dual column layout for streaks and progress */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Streaks (1/3) */}
        <div className="lg:col-span-1">
          <StreakDisplay gamification={gamification} />
        </div>

        {/* Right: XP Progress (2/3) */}
        <div className="lg:col-span-2">
          <DuolingoXPProgress gamification={gamification} />
        </div>
      </div>

      {/* Badges Section */}
      <section id="achievements-badges" className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Your earned badges and milestones at a glance
          </p>
        </div>
        <InstagramBadgesDisplay badges={gamification.badges} />
      </section>

      {/* Timeline Section */}
      <section id="achievement-timeline" className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Journey</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            All your achievements, badges earned, and milestones in one place
          </p>
        </div>
        <AchievementTimeline gamification={gamification} profile={profile} />
      </section>

      {/* Motivational section */}
      <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-8 backdrop-blur-sm dark:border-white/10">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Keep the momentum going! 🚀
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            You're doing amazing! Every action you take—exploring opportunities, applying, uploading certificates—
            brings you closer to more badges and higher levels. Your next big achievement is just around the corner!
          </p>
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
            💡 Tip: Stay consistent with daily activities to build and maintain your streak!
          </div>
        </div>
      </div>
    </div>
  );
}
