'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import type { UserGamification, UserBadge } from '@/types/gamification';
import type { StudentProfile } from '@/types/studentProfile';
import { BADGE_DEFINITIONS } from '@/constants/gamification';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'opportunity' | 'badge' | 'achievement' | 'certificate';
  title: string;
  description?: string;
  date: Date;
  icon: React.ReactNode;
  color: string;
  details?: Record<string, any>;
}

interface AchievementTimelineProps {
  gamification: UserGamification | null;
  profile: StudentProfile | null;
  className?: string;
  maxItems?: number;
}

export function AchievementTimeline({
  gamification,
  profile,
  className = '',
  maxItems = 20,
}: AchievementTimelineProps) {
  // Build timeline events
  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = [];

    // Add badge events
    if (gamification?.badges) {
      gamification.badges.forEach((badge) => {
        const definition = BADGE_DEFINITIONS[badge.id];
        allEvents.push({
          id: `badge-${badge.id}`,
          type: 'badge',
          title: `Badge Earned: ${definition?.displayName || badge.id}`,
          description: definition?.description,
          date: new Date(badge.earnedAt),
          icon: <span className="text-2xl">{definition?.icon || '🏆'}</span>,
          color: getBadgeColor(badge.rarity),
          details: { badge, definition },
        });
      });
    }

    // Add achievement events
    if (profile?.achievements) {
      profile.achievements.forEach((achievement) => {
        allEvents.push({
          id: `achievement-${achievement.id}`,
          type: 'achievement',
          title: `Achievement: ${achievement.title}`,
          description: achievement.description ?? undefined,
          date: new Date(), // Use current date since we don't have achievement dates
          icon: <Trophy className="h-5 w-5 text-primary" />,
          color: 'from-primary/20 to-primaryDark/20',
          details: { achievement },
        });
      });
    }

    // Add competition events
    if (profile?.competitions) {
      profile.competitions.forEach((competition) => {
        allEvents.push({
          id: `competition-${competition.id}`,
          type: 'opportunity',
          title: `Competition: ${competition.name}`,
          description: `Result: ${competition.result || 'Participated'}`,
          date: competition.date ? new Date(competition.date) : new Date(),
          icon: <Award className="h-5 w-5 text-purple-500" />,
          color: 'from-purple-500/20 to-violet-500/20',
          details: { competition },
        });
      });
    }

    // Sort by date descending
    return allEvents.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, maxItems);
  }, [gamification?.badges, profile?.achievements, profile?.competitions, maxItems]);

  if (events.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/3">
          <Calendar className="mx-auto h-8 w-8 text-slate-400 dark:text-white/30" />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Your achievement timeline will appear here. Start exploring, earning badges, and participating in opportunities! 🚀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Timeline */}
      <div className="relative space-y-6 pt-4">
        {/* Vertical line */}
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent dark:from-indigo-400 dark:via-purple-400" />

        {/* Timeline events */}
        {events.map((event, idx) => (
          <div key={event.id} className="relative pl-20">
            {/* Event dot */}
            <div className="absolute -left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br dark:border-slate-900" style={{}}>
              <div
                className={cn(
                  'flex h-full w-full items-center justify-center rounded-full text-white',
                  event.color,
                )}
              >
                {event.icon}
              </div>
            </div>

            {/* Event card */}
            <div className={cn(
              'rounded-2xl border-l-4 bg-white/50 p-4 backdrop-blur-sm transition-all hover:shadow-md dark:bg-white/5',
              {
                'border-l-indigo-500 dark:border-l-indigo-400': event.type === 'badge',
                'border-l-primary dark:border-l-primary': event.type === 'achievement',
                'border-l-purple-500 dark:border-l-purple-400': event.type === 'opportunity',
              },
            )}>
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      'whitespace-nowrap text-xs capitalize',
                      {
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200': event.type === 'badge',
                        'bg-accent text-accent-foreground dark:bg-primary/20 dark:text-accent': event.type === 'achievement',
                        'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200': event.type === 'opportunity',
                      },
                    )}
                  >
                    {event.type}
                  </Badge>
                </div>

                {/* Details */}
                {event.details?.badge && (
                  <div className="mt-3 space-y-2 rounded-xl bg-slate-100/50 p-3 dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Rarity: {event.details.badge.rarity}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Category: {event.details.definition?.category}
                      </span>
                    </div>
                  </div>
                )}

                {event.details?.achievement && (
                  <div className="mt-3 space-y-2 rounded-xl bg-slate-100/50 p-3 dark:bg-white/5">
                    <div className="flex flex-wrap gap-2">
                      {event.details.achievement.level && (
                        <Badge variant="outline" className="text-xs">
                          {event.details.achievement.level}
                        </Badge>
                      )}
                      {event.details.achievement.year && (
                        <Badge variant="outline" className="text-xs">
                          {event.details.achievement.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {event.details?.competition && (
                  <div className="mt-3 space-y-2 rounded-xl bg-slate-100/50 p-3 dark:bg-white/5">
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {event.details.competition.category && (
                        <span>{event.details.competition.category}</span>
                      )}
                      {event.details.competition.location && (
                        <span>•</span>
                      )}
                      {event.details.competition.location && (
                        <span>{event.details.competition.location}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {event.date.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View more link */}
      {(gamification?.badges.length || 0) + (profile?.achievements.length || 0) + (profile?.competitions.length || 0) > maxItems && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-950/50">
            View full timeline
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Get color for badge rarity
 */
function getBadgeColor(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'from-yellow-500/30 to-orange-500/30';
    case 'epic':
      return 'from-purple-500/30 to-pink-500/30';
    case 'rare':
      return 'from-blue-500/30 to-cyan-500/30';
    case 'uncommon':
      return 'from-green-500/30 to-emerald-500/30';
    default:
      return 'from-slate-500/30 to-slate-400/30';
  }
}
