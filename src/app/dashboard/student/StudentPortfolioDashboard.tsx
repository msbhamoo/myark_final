'use client';

import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchStudentProfile, updateStudentProfile } from '@/lib/studentProfileClient';

import {
  ModernAcademicCard,
  ModernAchievementCard,
  ModernCompetitionCard,
  ModernExtracurricularCard,
  SubjectPerformanceCard,
} from '@/components/profile/ModernSectionComponents';
import AppliedOpportunityCard from '@/components/AppliedOpportunityCard';
import type { AppUserProfile } from '@/context/AuthContext';
import type {
  StudentProfile,
  StudentProfileAcademicSubject,
  StudentProfileAcademicYear,
  StudentProfileAchievement,
  StudentProfileCompetition,
  StudentProfileExtracurricular,
  StudentProfileUpdatePayload,
  StudentProfileVisibility,
  StudentProfileCompletionStep,
} from '@/types/studentProfile';
import type { Opportunity } from '@/types/opportunity';
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Circle as CircleIcon,
  Edit,
  ExternalLink,
  Flag,
  Globe2,
  GraduationCap,
  Loader2,
  MapPin,
  PenLine,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  Star,
  Trophy,
  UploadCloud,
  Users2,
} from 'lucide-react';

// --- Types ---

type StudentPortfolioDashboardProps = {
  user: AppUserProfile;
  getIdToken: (force?: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
};

type SavedOpportunity = Opportunity & { savedAt?: string | null };

type AppliedOpportunity = {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  registeredAt: string;
  status?: string;
  registrationType?: 'internal' | 'external';
};

type AcademicYearDraft = {
  id?: string;
  session: string;
  grade: string;
  board: string;
  schoolName: string;
  summary: string;
  teacherComments: string;
  subjects: Array<{
    id: string;
    name: string;
    marks: string;
    maxMarks: string;
    grade: string;
    teacherComment: string;
  }>;
};

type AchievementDraft = {
  id?: string;
  title: string;
  description: string;
  level: string;
  year: string;
  certificateUrl: string;
  tags: string;
};

type CompetitionDraft = {
  id?: string;
  name: string;
  category: string;
  result: string;
  date: string;
  status: string;
  description: string;
  location: string;
};

type ExtracurricularDraft = {
  id?: string;
  name: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
};

type BasicProfileDraft = {
  displayName: string;
  photoUrl: string;
  tagline: string;
  bio: string;
  location: string;
  interests: string;
};

type StatsDraft = {
  currentClass: string;
  gpa: string;
  averageScore: string;
  totalAwards: string;
  competitionsParticipated: string;
};

type SchoolInfoDraft = {
  schoolName: string;
  board: string;
  className: string;
  otherSchoolName: string;
  otherBoard: string;
};

// --- Constants & Helpers ---

const MAX_SUBJECTS_PER_YEAR = 16;

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

const completionLabels: Record<StudentProfileCompletionStep, string> = {
  profile: 'Profile basics',
  school: 'School information',
  academicHistory: 'Academic history',
  achievements: 'Achievements',
  competitions: 'Competitions',
  visibility: 'Visibility settings',
};

const normalizeInterests = (value: string): string[] =>
  value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 20);

const normalizeTags = (value: string): string[] =>
  value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 8);

const sanitizeNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildAvatarFallback = (value: string | null | undefined): string => {
  if (!value) return 'ST';
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
};

// --- Main Component ---

export default function StudentPortfolioDashboard({
  user,
  getIdToken,
  signOut,
}: StudentPortfolioDashboardProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Data States
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [appliedOpportunities, setAppliedOpportunities] = useState<AppliedOpportunity[]>([]);
  const [isLoadingApplied, setIsLoadingApplied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // UI States
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Dialog States
  const [isBasicsOpen, setIsBasicsOpen] = useState(false);
  const [basicsDraft, setBasicsDraft] = useState<BasicProfileDraft | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsDraft, setStatsDraft] = useState<StatsDraft | null>(null);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [schoolDraft, setSchoolDraft] = useState<SchoolInfoDraft | null>(null);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [academicDraft, setAcademicDraft] = useState<AcademicYearDraft | null>(null);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [achievementDraft, setAchievementDraft] = useState<AchievementDraft | null>(null);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [competitionDraft, setCompetitionDraft] = useState<CompetitionDraft | null>(null);
  const [isExtracurricularOpen, setIsExtracurricularOpen] = useState(false);
  const [extracurricularDraft, setExtracurricularDraft] = useState<ExtracurricularDraft | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [slugDraft, setSlugDraft] = useState('');

  // --- Data Loading ---

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Missing auth token');
        const data = await fetchStudentProfile(token);
        setProfile(data);
        setSlugDraft(data.slug ?? '');
      } catch (error) {
        console.error('Failed to load profile', error);
        setProfileError('Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [getIdToken]);

  const loadSavedOpportunities = useCallback(async () => {
    setIsLoadingSaved(true);
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch('/api/opportunities/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const body = await response.json();
        setSavedOpportunities(body.items ?? []);
      }
    } catch (error) {
      console.error('Failed to load saved', error);
    } finally {
      setIsLoadingSaved(false);
    }
  }, [getIdToken]);

  const loadAppliedOpportunities = useCallback(async () => {
    setIsLoadingApplied(true);
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch('/api/opportunities/applied', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const body = await response.json();
        setAppliedOpportunities(body.items ?? []);
      }
    } catch (error) {
      console.error('Failed to load applied', error);
    } finally {
      setIsLoadingApplied(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadSavedOpportunities();
    loadAppliedOpportunities();
  }, [loadSavedOpportunities, loadAppliedOpportunities]);

  // --- Handlers ---

  const handleUpdate = useCallback(
    async (payload: StudentProfileUpdatePayload, actionKey: string) => {
      if (!profile) return null;
      setPendingAction(actionKey);
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Missing auth token');
        const updated = await updateStudentProfile(token, payload);
        setProfile(updated);
        setFeedback({ type: 'success', message: 'Updated successfully' });
        return updated;
      } catch (error) {
        setFeedback({ type: 'error', message: 'Update failed' });
        return null;
      } finally {
        setPendingAction(null);
      }
    },
    [getIdToken, profile]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Missing auth token');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/student/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      if (type === 'avatar') {
        await handleUpdate({ photoUrl: data.url }, 'avatar');
      } else {
        await handleUpdate({ bannerUrl: data.url }, 'banner');
      }

      setFeedback({ type: 'success', message: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated` });
    } catch (error) {
      console.error('Upload error:', error);
      setFeedback({ type: 'error', message: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Dialog Openers ---

  const openBasicsDialog = () => {
    if (!profile) return;
    setBasicsDraft({
      displayName: profile.displayName ?? '',
      photoUrl: profile.photoUrl ?? '',
      tagline: profile.tagline ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      interests: profile.interests.join(', '),
    });
    setIsBasicsOpen(true);
  };

  const openStatsDialog = () => {
    if (!profile) return;
    setStatsDraft({
      currentClass: profile.stats.currentClass ?? '',
      gpa: profile.stats.gpa?.toString() ?? '',
      averageScore: profile.stats.averageScore?.toString() ?? '',
      totalAwards: profile.stats.totalAwards?.toString() ?? '',
      competitionsParticipated: profile.stats.competitionsParticipated?.toString() ?? '',
    });
    setIsStatsOpen(true);
  };

  const openSchoolDialog = () => {
    if (!profile) return;
    setSchoolDraft({
      schoolName: profile.schoolInfo.schoolName ?? '',
      board: profile.schoolInfo.board ?? '',
      className: profile.schoolInfo.className ?? '',
      otherSchoolName: profile.schoolInfo.otherSchoolName ?? '',
      otherBoard: profile.schoolInfo.otherBoard ?? '',
    });
    setIsSchoolOpen(true);
  };

  const openAcademicDialog = (item?: StudentProfileAcademicYear) => {
    setAcademicDraft({
      id: item?.id,
      session: item?.session ?? '',
      grade: item?.grade ?? '',
      board: item?.board ?? '',
      schoolName: item?.schoolName ?? '',
      summary: item?.summary ?? '',
      teacherComments: item?.teacherComments ?? '',
      subjects: item?.subjects.map(s => ({
        id: s.id,
        name: s.name,
        marks: s.marks?.toString() ?? '',
        maxMarks: s.maxMarks?.toString() ?? '',
        grade: s.grade ?? '',
        teacherComment: s.teacherComment ?? '',
      })) ?? [{ id: crypto.randomUUID(), name: '', marks: '', maxMarks: '', grade: '', teacherComment: '' }],
    });
    setIsAcademicOpen(true);
  };

  const openAchievementDialog = (item?: StudentProfileAchievement) => {
    setAchievementDraft({
      id: item?.id,
      title: item?.title ?? '',
      description: item?.description ?? '',
      level: item?.level ?? '',
      year: item?.year ?? '',
      certificateUrl: item?.certificateUrl ?? '',
      tags: (item?.tags ?? []).join(', '),
    });
    setIsAchievementOpen(true);
  };

  const openCompetitionDialog = (item?: StudentProfileCompetition) => {
    setCompetitionDraft({
      id: item?.id,
      name: item?.name ?? '',
      category: item?.category ?? '',
      result: item?.result ?? '',
      date: item?.date ?? '',
      status: item?.status ?? '',
      description: item?.description ?? '',
      location: item?.location ?? '',
    });
    setIsCompetitionOpen(true);
  };

  const openExtracurricularDialog = (item?: StudentProfileExtracurricular) => {
    setExtracurricularDraft({
      id: item?.id,
      name: item?.name ?? '',
      role: item?.role ?? '',
      description: item?.description ?? '',
      startDate: item?.startDate ?? '',
      endDate: item?.endDate ?? '',
      status: item?.status ?? '',
    });
    setIsExtracurricularOpen(true);
  };

  // --- Submission Handlers ---

  const handleSubmitBasics = async () => {
    if (!basicsDraft) return;
    const updated = await handleUpdate({
      displayName: basicsDraft.displayName,
      photoUrl: basicsDraft.photoUrl || null,
      tagline: basicsDraft.tagline || null,
      bio: basicsDraft.bio || null,
      location: basicsDraft.location || null,
      interests: normalizeInterests(basicsDraft.interests),
    }, 'basics');
    if (updated) setIsBasicsOpen(false);
  };

  const handleSubmitStats = async () => {
    if (!statsDraft) return;
    const updated = await handleUpdate({
      stats: {
        currentClass: statsDraft.currentClass || null,
        gpa: sanitizeNumber(statsDraft.gpa),
        averageScore: sanitizeNumber(statsDraft.averageScore),
        totalAwards: sanitizeNumber(statsDraft.totalAwards),
        competitionsParticipated: sanitizeNumber(statsDraft.competitionsParticipated),
      }
    }, 'stats');
    if (updated) setIsStatsOpen(false);
  };

  const handleSubmitSchool = async () => {
    if (!schoolDraft) return;
    const updated = await handleUpdate({
      schoolInfo: {
        schoolName: schoolDraft.schoolName,
        board: schoolDraft.board || null,
        className: schoolDraft.className || null,
        otherSchoolName: schoolDraft.otherSchoolName || null,
        otherBoard: schoolDraft.otherBoard || null,
      }
    }, 'school');
    if (updated) setIsSchoolOpen(false);
  };

  const handleSubmitAcademic = async () => {
    if (!academicDraft || !profile) return;
    const subjects: StudentProfileAcademicSubject[] = academicDraft.subjects
      .filter(s => s.name.trim())
      .map(s => ({
        id: s.id,
        name: s.name,
        marks: sanitizeNumber(s.marks),
        maxMarks: sanitizeNumber(s.maxMarks),
        grade: s.grade || null,
        teacherComment: s.teacherComment || null,
      }));

    const entry: StudentProfileAcademicYear = {
      id: academicDraft.id ?? crypto.randomUUID(),
      session: academicDraft.session || null,
      grade: academicDraft.grade || null,
      board: academicDraft.board || null,
      schoolName: academicDraft.schoolName || null,
      summary: academicDraft.summary || null,
      teacherComments: academicDraft.teacherComments || null,
      subjects,
    };

    const nextHistory = academicDraft.id
      ? profile.academicHistory.map(item => item.id === academicDraft.id ? entry : item)
      : [...profile.academicHistory, entry];

    const updated = await handleUpdate({ academicHistory: nextHistory }, 'academic');
    if (updated) setIsAcademicOpen(false);
  };

  const handleSubmitAchievement = async () => {
    if (!achievementDraft || !profile) return;
    const entry: StudentProfileAchievement = {
      id: achievementDraft.id ?? crypto.randomUUID(),
      title: achievementDraft.title,
      description: achievementDraft.description || null,
      level: achievementDraft.level as any || null,
      year: achievementDraft.year || null,
      certificateUrl: achievementDraft.certificateUrl || null,
      tags: normalizeTags(achievementDraft.tags),
      approved: null,
    };
    const nextAchievements = achievementDraft.id
      ? profile.achievements.map(item => item.id === achievementDraft.id ? entry : item)
      : [...profile.achievements, entry];
    const updated = await handleUpdate({ achievements: nextAchievements }, 'achievement');
    if (updated) setIsAchievementOpen(false);
  };

  const handleSubmitCompetition = async () => {
    if (!competitionDraft || !profile) return;
    const entry: StudentProfileCompetition = {
      id: competitionDraft.id ?? crypto.randomUUID(),
      name: competitionDraft.name,
      category: competitionDraft.category || null,
      result: competitionDraft.result || null,
      date: competitionDraft.date || null,
      status: competitionDraft.status as any || null,
      description: competitionDraft.description || null,
      location: competitionDraft.location || null,
    };
    const nextCompetitions = competitionDraft.id
      ? profile.competitions.map(item => item.id === competitionDraft.id ? entry : item)
      : [...profile.competitions, entry];
    const updated = await handleUpdate({ competitions: nextCompetitions }, 'competition');
    if (updated) setIsCompetitionOpen(false);
  };

  const handleSubmitExtracurricular = async () => {
    if (!extracurricularDraft || !profile) return;
    const entry: StudentProfileExtracurricular = {
      id: extracurricularDraft.id ?? crypto.randomUUID(),
      name: extracurricularDraft.name,
      role: extracurricularDraft.role || null,
      description: extracurricularDraft.description || null,
      startDate: extracurricularDraft.startDate || null,
      endDate: extracurricularDraft.endDate || null,
      status: extracurricularDraft.status as any || null,
    };
    const nextExtracurriculars = extracurricularDraft.id
      ? profile.extracurriculars.map(item => item.id === extracurricularDraft.id ? entry : item)
      : [...profile.extracurriculars, entry];
    const updated = await handleUpdate({ extracurriculars: nextExtracurriculars }, 'extracurricular');
    if (updated) setIsExtracurricularOpen(false);
  };

  // --- Derived State ---

  const subjectSummary = useMemo(() => {
    if (!profile) return [];
    const map = new Map<string, { totalMarks: number; totalMax: number }>();
    profile.academicHistory.forEach(year => {
      year.subjects.forEach(subject => {
        const key = subject.name.trim();
        if (!key) return;
        const current = map.get(key) ?? { totalMarks: 0, totalMax: 0 };
        current.totalMarks += subject.marks ?? 0;
        current.totalMax += subject.maxMarks ?? 100;
        map.set(key, current);
      });
    });
    return Array.from(map.entries())
      .map(([name, stats]) => ({
        name,
        percent: stats.totalMax > 0 ? Math.round((stats.totalMarks / stats.totalMax) * 100) : null,
      }))
      .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
      .slice(0, 6);
  }, [profile]);

  const completionChecklist = useMemo(() => {
    if (!profile) return [];
    const completed = new Set(profile.completion.completedSteps);
    return Object.entries(completionLabels).map(([key, label]) => ({
      key,
      label,
      done: completed.has(key as StudentProfileCompletionStep),
    }));
  }, [profile]);

  if (isLoadingProfile || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8 w-full">

        {/* Feedback Banner */}
        {feedback && (
          <div className={cn(
            "mb-6 flex items-center justify-between rounded-xl border p-4 text-sm",
            feedback.type === 'success' ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          )}>
            <span>{feedback.message}</span>
            <Button variant="ghost" size="sm" onClick={() => setFeedback(null)}>Dismiss</Button>
          </div>
        )}

        {/* 2-Column Layout: Sidebar (4) | Content (8) */}
        <div className="grid gap-6 lg:grid-cols-12 w-full">

          {/* --- LEFT SIDEBAR (4/12) --- */}
          <aside className="space-y-6 lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 lg:self-start w-full">

            {/* Profile Card */}
            <Card className="overflow-hidden border-none shadow-lg w-full group">
              <div className="relative h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {profile.bannerUrl && (
                  <img src={profile.bannerUrl} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                <label className="absolute top-2 right-2 p-2 bg-black/30 hover:bg-black/50 rounded-full cursor-pointer text-white transition-colors opacity-0 group-hover:opacity-100">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} disabled={isUploading} />
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                </label>
              </div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6 group/avatar">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-xl relative overflow-visible">
                    <AvatarImage src={profile.photoUrl || undefined} alt={profile.displayName} className="object-cover rounded-full h-full w-full" />
                    <AvatarFallback className="bg-indigo-100 text-2xl font-bold text-indigo-600 rounded-full h-full w-full flex items-center justify-center">
                      {buildAvatarFallback(profile.displayName)}
                    </AvatarFallback>
                    <label className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={isUploading} />
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin text-indigo-600" /> : <Edit className="h-3 w-3 text-indigo-600" />}
                    </label>
                  </Avatar>
                </div>

                <div className="mt-14 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{profile.displayName}</h1>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 shrink-0">Student</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 break-words">
                      {profile.tagline || 'Aspiring Student'}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.schoolInfo.schoolName && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span>{profile.schoolInfo.schoolName}</span>
                      </div>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      {profile.bio}
                    </p>
                  )}

                  {profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.slice(0, 5).map(i => (
                        <Badge key={i} variant="outline" className="text-xs">#{i}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={openBasicsDialog}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
                        <Shield className="mr-2 h-4 w-4" /> Settings
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => signOut()}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress Card */}
            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Profile Strength</h3>
                <span className="text-lg font-bold text-indigo-600">{Math.round(profile.completion.percent)}%</span>
              </div>
              <Progress value={profile.completion.percent} className="h-2 mb-4" />
              <div className="space-y-2">
                {completionChecklist.slice(0, 4).map(item => (
                  <div key={item.key} className="flex items-center gap-2 text-sm">
                    {item.done ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <CircleIcon className="h-4 w-4 text-slate-300" />
                    )}
                    <span className={item.done ? 'text-slate-500' : 'text-slate-900'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-none shadow-lg">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={openStatsDialog}>
                  <Trophy className="mr-2 h-4 w-4 text-amber-500" /> Update Stats
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={openSchoolDialog}>
                  <BookOpen className="mr-2 h-4 w-4 text-blue-500" /> School Info
                </Button>
              </div>
            </Card>
          </aside>

          {/* --- MAIN CONTENT (8/12) --- */}
          <main className="space-y-8 lg:col-span-8 xl:col-span-9">

            {/* Welcome Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold">Welcome back, {profile.displayName?.split(' ')[0]}! 👋</h2>
              <p className="mt-2 text-indigo-100 max-w-xl">
                Your portfolio is looking great. Keep adding your achievements and academic progress to stand out.
              </p>
            </div>

            {/* Applied Opportunities */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-600" /> Applied Opportunities
                </h3>
                <Button variant="ghost" size="sm" onClick={loadAppliedOpportunities} disabled={isLoadingApplied}>
                  <RefreshCw className={cn("h-4 w-4", isLoadingApplied && "animate-spin")} />
                </Button>
              </div>

              {appliedOpportunities.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {appliedOpportunities.map(item => (
                    <AppliedOpportunityCard
                      key={item.id}
                      id={item.id}
                      opportunityId={item.opportunityId}
                      opportunityTitle={item.opportunityTitle}
                      registeredAt={item.registeredAt}
                      registrationType={item.registrationType}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">You haven't applied to any opportunities yet.</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/opportunities">Browse Opportunities</Link>
                  </Button>
                </div>
              )}
            </section>

            {/* Academic Journey */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> Academic Journey
                </h3>
                <Button size="sm" onClick={() => openAcademicDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Year
                </Button>
              </div>

              {profile.academicHistory.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.academicHistory.map(year => (
                    <ModernAcademicCard
                      key={year.id}
                      year={year}
                      schoolName={profile.schoolInfo.schoolName || ''}
                      onEdit={() => openAcademicDialog(year)}
                      onRemove={() => { }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">Add your academic history to showcase your grades.</p>
                </div>
              )}

              {/* Subject Performance */}
              {subjectSummary.length > 0 && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
                  <h4 className="font-semibold mb-4">Top Performing Subjects</h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subjectSummary.map(s => (
                      <SubjectPerformanceCard key={s.name} name={s.name} percent={s.percent} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Achievements */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Achievements
                </h3>
                <Button size="sm" variant="outline" onClick={() => openAchievementDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Achievement
                </Button>
              </div>

              {profile.achievements.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.achievements.map(item => (
                    <ModernAchievementCard
                      key={item.id}
                      achievement={item}
                      onEdit={() => openAchievementDialog(item)}
                      onRemove={() => { }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">Showcase your awards and certificates.</p>
                </div>
              )}
            </section>

            {/* Competitions */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Flag className="h-5 w-5 text-purple-500" /> Competitions
                </h3>
                <Button size="sm" variant="outline" onClick={() => openCompetitionDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Competition
                </Button>
              </div>

              {profile.competitions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.competitions.map(item => (
                    <ModernCompetitionCard
                      key={item.id}
                      competition={item}
                      onEdit={() => openCompetitionDialog(item)}
                      onRemove={() => { }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">Add competitions you've participated in.</p>
                </div>
              )}
            </section>

            {/* Extracurriculars */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-emerald-500" /> Extracurriculars
                </h3>
                <Button size="sm" variant="outline" onClick={() => openExtracurricularDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>

              {profile.extracurriculars.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.extracurriculars.map(item => (
                    <ModernExtracurricularCard
                      key={item.id}
                      activity={item}
                      onEdit={() => openExtracurricularDialog(item)}
                      onRemove={() => { }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">Share your clubs, volunteering, and hobbies.</p>
                </div>
              )}
            </section>

            {/* Saved Opportunities */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-pink-500" /> Saved Opportunities
                </h3>
                <Button variant="ghost" size="sm" onClick={loadSavedOpportunities} disabled={isLoadingSaved}>
                  <RefreshCw className={cn("h-4 w-4", isLoadingSaved && "animate-spin")} />
                </Button>
              </div>

              {savedOpportunities.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedOpportunities.map(item => (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow w-full max-w-full">
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="secondary" className="shrink-0">{item.category || 'Opportunity'}</Badge>
                        {item.registrationDeadline && (
                          <span className="text-xs text-slate-500 shrink-0 text-right">
                            Due {new Date(item.registrationDeadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 font-semibold line-clamp-2 break-words">{item.title}</h4>
                      <p className="text-sm text-slate-600 mt-1 break-words">{item.organizer}</p>
                      <Button asChild className="w-full mt-4" variant="outline" size="sm">
                        <Link href={`/opportunity/${item.id}`}>View Details</Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center bg-white dark:bg-slate-900">
                  <p className="text-slate-500">You haven't saved any opportunities yet.</p>
                </div>
              )}
            </section>

          </main>
        </div>
      </div>

      {/* --- DIALOGS --- */}

      {/* Basics Dialog */}
      <Dialog open={isBasicsOpen} onOpenChange={setIsBasicsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          {basicsDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Display Name</Label>
                <Input value={basicsDraft.displayName} onChange={e => setBasicsDraft({ ...basicsDraft, displayName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Tagline</Label>
                <Input value={basicsDraft.tagline} onChange={e => setBasicsDraft({ ...basicsDraft, tagline: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Bio</Label>
                <Textarea value={basicsDraft.bio} onChange={e => setBasicsDraft({ ...basicsDraft, bio: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={basicsDraft.location} onChange={e => setBasicsDraft({ ...basicsDraft, location: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Interests</Label>
                <Textarea value={basicsDraft.interests} onChange={e => setBasicsDraft({ ...basicsDraft, interests: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitBasics} disabled={pendingAction === 'basics'}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Stats</DialogTitle></DialogHeader>
          {statsDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Current Class</Label>
                <Input value={statsDraft.currentClass} onChange={e => setStatsDraft({ ...statsDraft, currentClass: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>GPA</Label>
                  <Input value={statsDraft.gpa} onChange={e => setStatsDraft({ ...statsDraft, gpa: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Avg Score</Label>
                  <Input value={statsDraft.averageScore} onChange={e => setStatsDraft({ ...statsDraft, averageScore: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitStats}>Save Stats</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* School Dialog */}
      <Dialog open={isSchoolOpen} onOpenChange={setIsSchoolOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>School Information</DialogTitle></DialogHeader>
          {schoolDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>School Name</Label>
                <Input value={schoolDraft.schoolName} onChange={e => setSchoolDraft({ ...schoolDraft, schoolName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Board</Label>
                <Input value={schoolDraft.board} onChange={e => setSchoolDraft({ ...schoolDraft, board: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitSchool}>Save School Info</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Academic Dialog */}
      <Dialog open={isAcademicOpen} onOpenChange={setIsAcademicOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>Academic Year</DialogTitle></DialogHeader>
          {academicDraft && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Session</Label>
                  <Input value={academicDraft.session} onChange={e => setAcademicDraft({ ...academicDraft, session: e.target.value })} placeholder="2023-2024" />
                </div>
                <div className="grid gap-2">
                  <Label>Grade</Label>
                  <Input value={academicDraft.grade} onChange={e => setAcademicDraft({ ...academicDraft, grade: e.target.value })} placeholder="Grade 10" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>School</Label>
                <Input value={academicDraft.schoolName} onChange={e => setAcademicDraft({ ...academicDraft, schoolName: e.target.value })} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Subjects</Label>
                  <Button size="sm" variant="outline" onClick={() => setAcademicDraft({
                    ...academicDraft,
                    subjects: [...academicDraft.subjects, { id: crypto.randomUUID(), name: '', marks: '', maxMarks: '', grade: '', teacherComment: '' }]
                  })}>Add Subject</Button>
                </div>
                {academicDraft.subjects.map((subject, idx) => (
                  <div key={subject.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input placeholder="Subject Name" value={subject.name} onChange={e => {
                        const newSubjects = [...academicDraft.subjects];
                        newSubjects[idx].name = e.target.value;
                        setAcademicDraft({ ...academicDraft, subjects: newSubjects });
                      }} />
                    </div>
                    <div className="col-span-3">
                      <Input placeholder="Marks" value={subject.marks} onChange={e => {
                        const newSubjects = [...academicDraft.subjects];
                        newSubjects[idx].marks = e.target.value;
                        setAcademicDraft({ ...academicDraft, subjects: newSubjects });
                      }} />
                    </div>
                    <div className="col-span-3">
                      <Input placeholder="Max" value={subject.maxMarks} onChange={e => {
                        const newSubjects = [...academicDraft.subjects];
                        newSubjects[idx].maxMarks = e.target.value;
                        setAcademicDraft({ ...academicDraft, subjects: newSubjects });
                      }} />
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newSubjects = academicDraft.subjects.filter((_, i) => i !== idx);
                        setAcademicDraft({ ...academicDraft, subjects: newSubjects });
                      }}>×</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitAcademic}>Save Academic Year</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Dialog */}
      <Dialog open={isAchievementOpen} onOpenChange={setIsAchievementOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Achievement</DialogTitle></DialogHeader>
          {achievementDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={achievementDraft.title} onChange={e => setAchievementDraft({ ...achievementDraft, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={achievementDraft.description} onChange={e => setAchievementDraft({ ...achievementDraft, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select value={achievementDraft.level} onValueChange={v => setAchievementDraft({ ...achievementDraft, level: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACHIEVEMENT_LEVEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Input value={achievementDraft.year} onChange={e => setAchievementDraft({ ...achievementDraft, year: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitAchievement}>Save Achievement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Competition Dialog */}
      <Dialog open={isCompetitionOpen} onOpenChange={setIsCompetitionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Competition</DialogTitle></DialogHeader>
          {competitionDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={competitionDraft.name} onChange={e => setCompetitionDraft({ ...competitionDraft, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Result</Label>
                <Input value={competitionDraft.result} onChange={e => setCompetitionDraft({ ...competitionDraft, result: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitCompetition}>Save Competition</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extracurricular Dialog */}
      <Dialog open={isExtracurricularOpen} onOpenChange={setIsExtracurricularOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Activity</DialogTitle></DialogHeader>
          {extracurricularDraft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Activity Name</Label>
                <Input value={extracurricularDraft.name} onChange={e => setExtracurricularDraft({ ...extracurricularDraft, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Input value={extracurricularDraft.role} onChange={e => setExtracurricularDraft({ ...extracurricularDraft, role: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={extracurricularDraft.description} onChange={e => setExtracurricularDraft({ ...extracurricularDraft, description: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitExtracurricular}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
