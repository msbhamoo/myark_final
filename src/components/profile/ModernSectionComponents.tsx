'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type {
  StudentProfileAcademicYear,
  StudentProfileAchievement,
  StudentProfileCompetition,
  StudentProfileExtracurricular,
} from '@/types/studentProfile';
import {
  PenLine,
  Trophy,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Users2,
  CheckCircle,
  Calendar,
  MapPin,
} from 'lucide-react';

const ACHIEVEMENT_LEVEL_LABELS: Record<string, string> = {
  school: 'School',
  district: 'District',
  state: 'State',
  national: 'National',
  international: 'International',
  other: 'Other',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

// Academic Year Card Component
export function ModernAcademicCard({
  year,
  schoolName,
  onEdit,
  onRemove,
}: {
  year: StudentProfileAcademicYear;
  schoolName: string;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group relative rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white/80 via-white/60 to-blue-50/30 p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-blue-200/20 hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-300 dark:from-white/5 dark:via-white/3 dark:to-blue-950/20 dark:border-white/10 dark:shadow-blue-950/40 w-full max-w-full">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 shrink-0">
                {year.grade || 'Academic Record'}
              </Badge>
              {year.session && (
                <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs dark:border-white/20 dark:text-slate-300 shrink-0">
                  {year.session}
                </Badge>
              )}
              {year.board && (
                <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs dark:border-white/20 dark:text-slate-300 shrink-0">
                  {year.board}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">
              {year.schoolName || schoolName || 'Your School'}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50 dark:border-white/10 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
              onClick={onEdit}
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              onClick={onRemove}
            >
              ✕
            </Button>
          </div>
        </div>

        {year.summary && (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{year.summary}</p>
        )}

        {year.teacherComments && (
          <div className="rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Teacher's Comment</p>
            <p className="text-sm text-amber-900 dark:text-amber-200 break-words">{year.teacherComments}</p>
          </div>
        )}

        {year.subjects.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subjects ({year.subjects.length})</p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {year.subjects.slice(0, 4).map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-lg bg-white/80 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-3 hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-colors min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {subject.name}
                    </span>
                    {subject.grade && (
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-bold shrink-0">
                        {subject.grade}
                      </Badge>
                    )}
                  </div>
                  {(subject.marks !== null || subject.maxMarks !== null) && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {subject.marks ? `${subject.marks}` : '—'}{subject.maxMarks ? `/${subject.maxMarks}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {year.subjects.length > 4 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">+{year.subjects.length - 4} more subjects</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Achievement Card Component
export function ModernAchievementCard({
  achievement,
  onEdit,
  onRemove,
}: {
  achievement: StudentProfileAchievement;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group rounded-2xl border border-[#DFF7C8]/40 bg-gradient-to-br from-[#DFF7C8]/80 via-white/60 to-[#58CC02]/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-[#58CC02]/20 hover:shadow-xl hover:shadow-[#58CC02]/30 transition-all duration-300 dark:from-[#58CC02]/20 dark:via-white/3 dark:to-[#3FA001]/20 dark:border-[#58CC02]/30 dark:shadow-[#58CC02]/40 w-full max-w-full">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="flex items-center gap-1.5 bg-gradient-to-r from-[#DFF7C8] to-[#58CC02]/20 text-[#1A2A33] dark:from-[#58CC02]/40 dark:to-[#3FA001]/40 dark:text-[#DFF7C8] shrink-0">
                <Trophy className="h-3.5 w-3.5" />
                <span className="truncate max-w-[150px]">{achievement.title}</span>
              </Badge>
              {achievement.level && (
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 shrink-0">
                  {ACHIEVEMENT_LEVEL_LABELS[achievement.level] ?? achievement.level}
                </Badge>
              )}
              {achievement.year && (
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 shrink-0">
                  {achievement.year}
                </Badge>
              )}
              {achievement.approved && (
                <Badge className="flex items-center gap-1 border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400 shrink-0">
                  <CheckCircle className="h-3 w-3" />
                  Approved
                </Badge>
              )}
            </div>
            {achievement.description && (
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{achievement.description}</p>
            )}
            {achievement.tags && achievement.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {achievement.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-400"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-start">
            {achievement.certificateUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-indigo-600 hover:bg-indigo-50/50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
              >
                <a href={achievement.certificateUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50 dark:border-white/10 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
              onClick={onEdit}
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              onClick={onRemove}
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Competition Card Component
export function ModernCompetitionCard({
  competition,
  onEdit,
  onRemove,
}: {
  competition: StudentProfileCompetition;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    ongoing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  };

  return (
    <div className="group rounded-2xl border border-purple-200/40 bg-gradient-to-br from-purple-50/80 via-white/60 to-pink-50/40 p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-purple-200/20 hover:shadow-xl hover:shadow-purple-300/30 transition-all duration-300 dark:from-purple-950/20 dark:via-white/3 dark:to-pink-950/20 dark:border-purple-900/30 dark:shadow-purple-950/40 w-full max-w-full">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">{competition.name}</h3>
            {competition.description && (
              <p className="text-sm text-slate-700 dark:text-slate-300 break-words">{competition.description}</p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {competition.category && (
                <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs dark:border-white/10 dark:text-slate-300 shrink-0">
                  {competition.category}
                </Badge>
              )}
              {competition.result && (
                <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs dark:border-white/10 dark:text-slate-300 shrink-0">
                  {competition.result}
                </Badge>
              )}
              {competition.status && (
                <Badge className={cn('text-xs font-semibold shrink-0', statusColors[competition.status] || 'bg-slate-100 text-slate-700')}>
                  {EVENT_STATUS_LABELS[competition.status] ?? competition.status}
                </Badge>
              )}
            </div>
            {(competition.date || competition.location) && (
              <div className="space-y-1 pt-2 text-sm text-slate-600 dark:text-slate-400">
                {competition.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="truncate">{competition.date}</span>
                  </div>
                )}
                {competition.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="truncate">{competition.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50 dark:border-white/10 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
              onClick={onEdit}
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              onClick={onRemove}
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracurricular Card Component
export function ModernExtracurricularCard({
  activity,
  onEdit,
  onRemove,
}: {
  activity: StudentProfileExtracurricular;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    completed: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
  };

  return (
    <div className="group rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/80 via-white/60 to-teal-50/40 p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-emerald-200/20 hover:shadow-xl hover:shadow-emerald-300/30 transition-all duration-300 dark:from-emerald-950/20 dark:via-white/3 dark:to-teal-950/20 dark:border-emerald-900/30 dark:shadow-emerald-950/40 w-full max-w-full">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">{activity.name}</h3>
            {activity.description && (
              <p className="text-sm text-slate-700 dark:text-slate-300 break-words">{activity.description}</p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {activity.role && (
                <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs dark:border-white/10 dark:text-slate-300 shrink-0">
                  <Users2 className="h-3 w-3 mr-1" />
                  {activity.role}
                </Badge>
              )}
              {activity.status && (
                <Badge className={cn('text-xs font-semibold shrink-0', statusColors[activity.status] || 'bg-slate-100 text-slate-700')}>
                  {EVENT_STATUS_LABELS[activity.status] ?? activity.status}
                </Badge>
              )}
            </div>
            {(activity.startDate || activity.endDate) && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-2">
                <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {activity.startDate ?? '—'} {activity.endDate ? `to ${activity.endDate}` : ''}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50 dark:border-white/10 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
              onClick={onEdit}
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              onClick={onRemove}
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subject Performance Card
export function SubjectPerformanceCard({
  name,
  percent,
}: {
  name: string;
  percent: number | null;
}) {
  const getGradeColor = (percent: number | null): string => {
    if (!percent) return 'from-slate-100 to-slate-50 text-slate-600 dark:from-slate-900/40 dark:to-slate-950/30 dark:text-slate-300';
    if (percent >= 90) return 'from-emerald-100 to-emerald-50 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-950/30 dark:text-emerald-300';
    if (percent >= 80) return 'from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/40 dark:to-blue-950/30 dark:text-blue-300';
    if (percent >= 70) return 'from-yellow-100 to-yellow-50 text-yellow-700 dark:from-yellow-900/40 dark:to-yellow-950/30 dark:text-yellow-300';
    return 'from-orange-100 to-orange-50 text-orange-700 dark:from-orange-900/40 dark:to-orange-950/30 dark:text-orange-300';
  };

  return (
    <div className={cn(
      'rounded-xl bg-gradient-to-br p-4 border border-white/20 backdrop-blur-xs shadow-md w-full max-w-full',
      getGradeColor(percent)
    )}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-sm font-semibold truncate min-w-0">{name}</span>
        <Badge className="bg-white/30 backdrop-blur-sm font-bold text-xs shrink-0">
          {percent ?? 'N/A'}%
        </Badge>
      </div>
      <Progress
        value={percent ?? 0}
        className="h-2 rounded-full bg-white/40"
      />
    </div>
  );
}
