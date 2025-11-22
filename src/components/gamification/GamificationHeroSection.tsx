'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { UserGamification } from '@/types/gamification';
import type { StudentProfile } from '@/types/studentProfile';
import { BADGE_DEFINITIONS } from '@/constants/gamification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Flame, Sparkles, Share2, Trophy, MapPin, BookOpen, GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamificationHeroSectionProps {
  gamification: UserGamification | null;
  displayName?: string;
  photoUrl?: string;
  profile?: StudentProfile;
  className?: string;
}

export function GamificationHeroSection({
  gamification,
  displayName = 'Student',
  photoUrl,
  profile,
  className = '',
}: GamificationHeroSectionProps) {
  const [copied, setCopied] = useState(false);

  if (!gamification) {
    return null;
  }

  const { level, totalXP, badges, streaks, achievementStats } = gamification;

  // Calculate XP for level progress
  const currentLevelStart = level > 1 ? (level - 1) * 100 + (level - 2) * 50 : 0;
  const nextLevelStart = level * 100 + (level - 1) * 50;
  const xpInLevel = totalXP - currentLevelStart;
  const xpNeeded = nextLevelStart - currentLevelStart;
  const levelProgress = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

  const recentBadges = [...badges]
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 6);

  const handleShareProfile = async () => {
    if (typeof window === 'undefined') return;
    try {
      const shareText = `Check out my Myark profile! I'm level ${level} with ${totalXP.toLocaleString()} XP and ${badges.length} badges earned. 🚀`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: `${displayName}'s Myark Profile`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const buildAvatarFallback = (name: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0]!.slice(0, 2).toUpperCase();
    }
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Glassmorphic Hero Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-md shadow-2xl dark:border-white/10 dark:from-white/5 dark:via-white/3 dark:to-white/1 dark:shadow-2xl dark:shadow-black/50">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-bl from-indigo-400/30 to-purple-400/20 blur-3xl dark:from-indigo-500/20 dark:to-purple-500/10" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/10 blur-3xl dark:from-cyan-500/10 dark:to-blue-500/5" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
          {/* Header with profile and level */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Profile info */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Glowing avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 opacity-75 blur-lg" />
                  <Avatar className="relative h-20 w-20 rounded-3xl border-4 border-white shadow-xl dark:border-slate-900 sm:h-24 sm:w-24">
                    <AvatarImage src={photoUrl} alt={displayName} />
                    <AvatarFallback className="rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-400 text-lg font-bold text-white sm:text-xl">
                      {buildAvatarFallback(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Level badge and title */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl break-words">
                      {displayName}
                    </h2>
                    <Badge className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white shadow-lg flex-shrink-0">
                      <Sparkles className="h-3 w-3" />
                      Level {level}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {totalXP.toLocaleString()} total XP earned
                  </p>

                  {/* Profile details row */}
                  <div className="mt-3 space-y-2 text-sm">
                    {profile?.tagline && (
                      <p className="text-slate-700 dark:text-slate-200 italic font-medium truncate">
                        "{profile.tagline}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
                      {profile?.stats.currentClass && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                          <GraduationCap className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                          <span className="truncate">{profile.stats.currentClass}</span>
                        </div>
                      )}
                      {profile?.schoolInfo.schoolName && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                          <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-500" />
                          <span className="truncate">{profile.schoolInfo.schoolName}</span>
                        </div>
                      )}
                      {profile?.location && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-rose-500" />
                          <span className="truncate">{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio section */}
              {profile?.bio && (
                <div className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">About: </span>
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Interests section */}
              {profile?.interests && profile.interests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Interests ({profile.interests.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 8).map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-300/40 text-indigo-700 dark:border-indigo-900/40 dark:from-indigo-500/10 dark:to-purple-500/10 dark:text-indigo-300 text-xs"
                      >
                        #{interest}
                      </Badge>
                    ))}
                    {profile.interests.length > 8 && (
                      <Badge className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                        +{profile.interests.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons - Right side */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:flex-col sm:gap-3">
              <Button
                onClick={handleShareProfile}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 sm:flex-none text-xs sm:text-sm"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 sm:flex-none text-xs sm:text-sm"
              >
                <Link href="#leaderboard">
                  <Trophy className="mr-2 h-4 w-4" />
                  Rankings
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats grid - Gamification metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Level card */}
            <div className="rounded-2xl border border-white/40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 backdrop-blur-sm dark:border-white/10 dark:from-indigo-500/10 dark:to-purple-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Current Level
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{level}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Max level: 50</p>
            </div>

            {/* Total XP card */}
            <div className="rounded-2xl border border-white/40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 backdrop-blur-sm dark:border-white/10 dark:from-blue-500/10 dark:to-cyan-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Total XP
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {(totalXP / 1000).toFixed(1)}k
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {totalXP.toLocaleString()} points
              </p>
            </div>

            {/* Badges card */}
            <div className="rounded-2xl border border-white/40 bg-gradient-to-br from-primary/20 to-primaryDark/20 p-4 backdrop-blur-sm dark:border-white/10 dark:from-primary/10 dark:to-primaryDark/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Badges Earned
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {badges.length}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                of 32 available
              </p>
            </div>

            {/* Streak card */}
            <div className="rounded-2xl border border-white/40 bg-gradient-to-br from-rose-500/20 to-red-500/20 p-4 backdrop-blur-sm dark:border-white/10 dark:from-rose-500/10 dark:to-red-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Daily Streak
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {streaks.daily.current}
                </span>
                <span className="text-lg">
                  <Flame className="h-6 w-6 text-primary" />
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Best: {streaks.daily.best}
              </p>
            </div>
          </div>

          {/* XP Progress bar with animations */}
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Progress to Level {level + 1}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {Math.floor(xpInLevel).toLocaleString()} / {Math.floor(xpNeeded).toLocaleString()} XP
                </p>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(levelProgress)}%
              </span>
            </div>

            {/* Milestone progress bar */}
            <div className="relative">
              <Progress
                value={levelProgress}
                className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
              />
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="h-3 w-full animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>

            {/* Milestone markers */}
            <div className="flex justify-between px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Recent badges carousel */}
          {recentBadges.length > 0 && (
            <div className="space-y-4 border-t border-white/20 pt-6 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Recent Achievements
                </h3>
                <Badge variant="secondary" className="bg-slate-200/50 dark:bg-white/10">
                  {badges.length} total
                </Badge>
              </div>

              {/* Horizontal scrollable badges */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                <TooltipProvider>
                  {recentBadges.map((badge) => {
                    const badgeDefinition = BADGE_DEFINITIONS[badge.id];
                    return (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          <div className="group relative flex-shrink-0 cursor-pointer">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primaryDark/20 transition-transform hover:scale-110 dark:from-primary/20 dark:to-primaryDark/10">
                              <span className="text-2xl">{badgeDefinition?.icon ?? '🏆'}</span>
                            </div>
                            <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                              ✓
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-left">
                            <p className="font-semibold">{badgeDefinition?.displayName}</p>
                            <p className="mt-1 text-xs text-slate-300">
                              {badgeDefinition?.description}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                              Earned{' '}
                              {new Date(badge.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
