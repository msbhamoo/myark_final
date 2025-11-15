'use client';

import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/types/studentProfile';
import type { Opportunity } from '@/types/opportunity';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CheckCircle,
  ExternalLink,
  Flag,
  Globe2,
  GraduationCap,
  Loader2,
  Lock,
  PenLine,
  Plus,
  RefreshCw,
  Shield,
  Star,
  Trophy,
  UploadCloud,
  Users2,
} from 'lucide-react';

type StudentPortfolioDashboardProps = {
  user: AppUserProfile;
  getIdToken: (force?: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
};

type SavedOpportunity = Opportunity & { savedAt?: string | null };

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

const MAX_SUBJECTS_PER_YEAR = 16;
const DEFAULT_BOARDS = ['CBSE', 'ICSE', 'IB', 'Cambridge', 'State Board', 'Other'];
const DEFAULT_CLASSES = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'First Year',
  'Second Year',
];

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

const VISIBILITY_LABELS: Record<StudentProfileVisibility, { title: string; description: string }> = {
  private: {
    title: 'Private',
    description: 'Only you can view this portfolio.',
  },
  teachers: {
    title: 'Teachers only',
    description: 'Share safely with your teachers and mentors inside Myark.',
  },
  public: {
    title: 'Public',
    description: 'Create a link to share with colleges and friends.',
  },
};

const completionLabels: Record<string, string> = {
  profile: 'Profile basics',
  school: 'School information',
  academicHistory: 'Academic history',
  achievements: 'Achievements',
  competitions: 'Competitions',
  visibility: 'Visibility settings',
};

const DASHBOARD_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'progress', label: 'Progress' },
  { id: 'academics', label: 'Academics' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'extracurricular', label: 'Extracurricular' },
  { id: 'resources', label: 'Resources' },
] as const;

const PANEL_BASE_CLASSES =
  'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60';

const normalizeInterests = (value: string): string[] =>
  value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);

const normalizeTags = (value: string): string[] =>
  value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

const sanitizeNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatSavedDate = (value?: string | null): string => {
  if (!value) return 'Recently saved';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently saved';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const buildAvatarFallback = (value: string | null | undefined): string => {
  if (!value) return 'ST';
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
};

const formatAcademicTitle = (year: StudentProfileAcademicYear): string => {
  const tokens = [year.session, year.grade, year.board].filter(Boolean);
  return tokens.length > 0 ? tokens.join(' • ') : 'Untitled academic record';
};

export default function StudentPortfolioDashboard({
  user,
  getIdToken,
  signOut,
}: StudentPortfolioDashboardProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [isBasicsOpen, setIsBasicsOpen] = useState(false);
  const [basicsDraft, setBasicsDraft] = useState<BasicProfileDraft | null>(null);
  const [basicsError, setBasicsError] = useState<string | null>(null);

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsDraft, setStatsDraft] = useState<StatsDraft | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [schoolDraft, setSchoolDraft] = useState<SchoolInfoDraft | null>(null);
  const [schoolError, setSchoolError] = useState<string | null>(null);

  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [academicDraft, setAcademicDraft] = useState<AcademicYearDraft | null>(null);
  const [academicError, setAcademicError] = useState<string | null>(null);

  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [achievementDraft, setAchievementDraft] = useState<AchievementDraft | null>(null);
  const [achievementError, setAchievementError] = useState<string | null>(null);

  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [competitionDraft, setCompetitionDraft] = useState<CompetitionDraft | null>(null);
  const [competitionError, setCompetitionError] = useState<string | null>(null);

  const [isExtracurricularOpen, setIsExtracurricularOpen] = useState(false);
  const [extracurricularDraft, setExtracurricularDraft] = useState<ExtracurricularDraft | null>(
    null,
  );
  const [extracurricularError, setExtracurricularError] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [slugDraft, setSlugDraft] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Missing auth token');
        }
        const data = await fetchStudentProfile(token);
        setProfile(data);
        setSlugDraft(data.slug ?? '');
      } catch (error) {
        console.error('Failed to load student profile', error);
        setProfileError(
          error instanceof Error ? error.message : 'Failed to load student profile.',
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile().catch((error) => {
      console.error('Unexpected profile load error', error);
    });
  }, [getIdToken]);

  const loadSavedOpportunities = useCallback(async () => {
    setIsLoadingSaved(true);
    setSavedError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setSavedOpportunities([]);
        return;
      }
      const response = await fetch('/api/opportunities/saved', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Failed to load saved opportunities');
      }
      const body = (await response.json()) as { items?: SavedOpportunity[] };
      setSavedOpportunities(body.items ?? []);
    } catch (error) {
      console.error('Failed to load saved opportunities', error);
      setSavedError(
        error instanceof Error ? error.message : 'Failed to load saved opportunities',
      );
    } finally {
      setIsLoadingSaved(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadSavedOpportunities().catch((error) => {
      console.error('Unexpected saved opportunities error', error);
    });
  }, [loadSavedOpportunities]);

  const handleUpdate = useCallback(
    async (payload: StudentProfileUpdatePayload, actionKey: string) => {
      if (!profile) return null;
      setPendingAction(actionKey);
      setFeedback(null);
      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Missing auth token');
        }
        const updated = await updateStudentProfile(token, payload);
        setProfile(updated);
        setFeedback({ type: 'success', message: 'Profile updated successfully.' });
        return updated;
      } catch (error) {
        console.error('Failed to update student profile', error);
        setFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to update profile.',
        });
        return null;
      } finally {
        setPendingAction(null);
      }
    },
    [getIdToken, profile],
  );

  const openBasicsDialog = useCallback(() => {
    if (!profile) return;
    setBasicsError(null);
    setBasicsDraft({
      displayName: profile.displayName ?? '',
      photoUrl: profile.photoUrl ?? '',
      tagline: profile.tagline ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      interests: profile.interests.join(', '),
    });
    setIsBasicsOpen(true);
  }, [profile]);

  const openStatsDialog = useCallback(() => {
    if (!profile) return;
    setStatsError(null);
    setStatsDraft({
      currentClass: profile.stats.currentClass ?? '',
      gpa: profile.stats.gpa?.toString() ?? '',
      averageScore: profile.stats.averageScore?.toString() ?? '',
      totalAwards: profile.stats.totalAwards?.toString() ?? '',
      competitionsParticipated: profile.stats.competitionsParticipated?.toString() ?? '',
    });
    setIsStatsOpen(true);
  }, [profile]);

  const openSchoolDialog = useCallback(() => {
    if (!profile) return;
    setSchoolError(null);
    setSchoolDraft({
      schoolName: profile.schoolInfo.schoolName ?? '',
      board: profile.schoolInfo.board ?? '',
      className: profile.schoolInfo.className ?? '',
      otherSchoolName: profile.schoolInfo.otherSchoolName ?? '',
      otherBoard: profile.schoolInfo.otherBoard ?? '',
    });
    setIsSchoolOpen(true);
  }, [profile]);

  const buildAcademicDraft = (item?: StudentProfileAcademicYear): AcademicYearDraft => {
    if (!item) {
      return {
        session: '',
        grade: '',
        board: '',
        schoolName: '',
        summary: '',
        teacherComments: '',
        subjects: [
          {
            id: crypto.randomUUID(),
            name: '',
            marks: '',
            maxMarks: '',
            grade: '',
            teacherComment: '',
          },
        ],
      };
    }

    return {
      id: item.id,
      session: item.session ?? '',
      grade: item.grade ?? '',
      board: item.board ?? '',
      schoolName: item.schoolName ?? '',
      summary: item.summary ?? '',
      teacherComments: item.teacherComments ?? '',
      subjects:
        item.subjects.length > 0
          ? item.subjects.map((subject) => ({
              id: subject.id || crypto.randomUUID(),
              name: subject.name ?? '',
              marks: subject.marks?.toString() ?? '',
              maxMarks: subject.maxMarks?.toString() ?? '',
              grade: subject.grade ?? '',
              teacherComment: subject.teacherComment ?? '',
            }))
          : [
              {
                id: crypto.randomUUID(),
                name: '',
                marks: '',
                maxMarks: '',
                grade: '',
                teacherComment: '',
              },
            ],
    };
  };

  const openAcademicDialog = useCallback(
    (item?: StudentProfileAcademicYear) => {
      setAcademicError(null);
      setAcademicDraft(buildAcademicDraft(item));
      setIsAcademicOpen(true);
    },
    [],
  );

  const buildAchievementDraft = (item?: StudentProfileAchievement): AchievementDraft => ({
    id: item?.id,
    title: item?.title ?? '',
    description: item?.description ?? '',
    level: item?.level ?? '',
    year: item?.year ?? '',
    certificateUrl: item?.certificateUrl ?? '',
    tags: (item?.tags ?? []).join(', '),
  });

  const openAchievementDialog = useCallback((item?: StudentProfileAchievement) => {
    setAchievementError(null);
    setAchievementDraft(buildAchievementDraft(item));
    setIsAchievementOpen(true);
  }, []);

  const buildCompetitionDraft = (item?: StudentProfileCompetition): CompetitionDraft => ({
    id: item?.id,
    name: item?.name ?? '',
    category: item?.category ?? '',
    result: item?.result ?? '',
    date: item?.date ?? '',
    status: item?.status ?? '',
    description: item?.description ?? '',
    location: item?.location ?? '',
  });

  const openCompetitionDialog = useCallback((item?: StudentProfileCompetition) => {
    setCompetitionError(null);
    setCompetitionDraft(buildCompetitionDraft(item));
    setIsCompetitionOpen(true);
  }, []);

  const buildExtracurricularDraft = (
    item?: StudentProfileExtracurricular,
  ): ExtracurricularDraft => ({
    id: item?.id,
    name: item?.name ?? '',
    role: item?.role ?? '',
    description: item?.description ?? '',
    startDate: item?.startDate ?? '',
    endDate: item?.endDate ?? '',
    status: item?.status ?? '',
  });

  const openExtracurricularDialog = useCallback((item?: StudentProfileExtracurricular) => {
    setExtracurricularError(null);
    setExtracurricularDraft(buildExtracurricularDraft(item));
    setIsExtracurricularOpen(true);
  }, []);

  const normalizeSubjects = (
    subjects: AcademicYearDraft['subjects'],
  ): StudentProfileAcademicSubject[] =>
    subjects
      .map((subject) => ({
        id: subject.id,
        name: subject.name.trim(),
        marks: sanitizeNumber(subject.marks),
        maxMarks: sanitizeNumber(subject.maxMarks),
        grade: subject.grade.trim() || null,
        teacherComment: subject.teacherComment.trim() || null,
      }))
      .filter((subject) => subject.name.length > 0)
      .slice(0, MAX_SUBJECTS_PER_YEAR);

  const handleSubmitBasics = async () => {
    if (!basicsDraft) return;
    if (!basicsDraft.displayName.trim()) {
      setBasicsError('Display name is required.');
      return;
    }
    const payload: StudentProfileUpdatePayload = {
      displayName: basicsDraft.displayName.trim(),
      photoUrl: basicsDraft.photoUrl.trim() || null,
      tagline: basicsDraft.tagline.trim() || null,
      bio: basicsDraft.bio.trim() || null,
      location: basicsDraft.location.trim() || null,
      interests: normalizeInterests(basicsDraft.interests),
    };
    const updated = await handleUpdate(payload, 'basics');
    if (updated) {
      setIsBasicsOpen(false);
    }
  };

  const handleSubmitStats = async () => {
    if (!statsDraft) return;
    const payload: StudentProfileUpdatePayload = {
      stats: {
        currentClass: statsDraft.currentClass.trim() || null,
        gpa: sanitizeNumber(statsDraft.gpa),
        averageScore: sanitizeNumber(statsDraft.averageScore),
        totalAwards: sanitizeNumber(statsDraft.totalAwards),
        competitionsParticipated: sanitizeNumber(statsDraft.competitionsParticipated),
      },
    };
    const updated = await handleUpdate(payload, 'stats');
    if (updated) {
      setIsStatsOpen(false);
    }
  };

  const handleSubmitSchool = async () => {
    if (!schoolDraft) return;
    if (!schoolDraft.schoolName.trim()) {
      setSchoolError('Please add your school name.');
      return;
    }
    const payload: StudentProfileUpdatePayload = {
      schoolInfo: {
        schoolName: schoolDraft.schoolName.trim(),
        board: schoolDraft.board.trim() || null,
        className: schoolDraft.className.trim() || null,
        otherSchoolName: schoolDraft.otherSchoolName.trim() || null,
        otherBoard: schoolDraft.otherBoard.trim() || null,
      },
    };
    const updated = await handleUpdate(payload, 'school');
    if (updated) {
      setIsSchoolOpen(false);
    }
  };

  const handleSubmitAcademic = async () => {
    if (!academicDraft || !profile) return;
    const subjects = normalizeSubjects(academicDraft.subjects);
    if (!academicDraft.session.trim() && subjects.length === 0) {
      setAcademicError('Add a session name or at least one subject to save this record.');
      return;
    }
    const entry: StudentProfileAcademicYear = {
      id: academicDraft.id ?? crypto.randomUUID(),
      session: academicDraft.session.trim() || null,
      grade: academicDraft.grade.trim() || null,
      board: academicDraft.board.trim() || null,
      schoolName: academicDraft.schoolName.trim() || null,
      summary: academicDraft.summary.trim() || null,
      teacherComments: academicDraft.teacherComments.trim() || null,
      subjects,
    };
    const nextHistory = academicDraft.id
      ? profile.academicHistory.map((item) => (item.id === academicDraft.id ? entry : item))
      : [...profile.academicHistory, entry];
    const updated = await handleUpdate({ academicHistory: nextHistory }, 'academic');
    if (updated) {
      setIsAcademicOpen(false);
    }
  };

  const handleRemoveAcademicYear = async (id: string) => {
    if (!profile) return;
    const nextHistory = profile.academicHistory.filter((item) => item.id !== id);
    await handleUpdate({ academicHistory: nextHistory }, 'academic-remove');
  };

  const handleSubmitAchievement = async () => {
    if (!achievementDraft || !profile) return;
    if (!achievementDraft.title.trim()) {
      setAchievementError('Achievement title is required.');
      return;
    }
    const entry: StudentProfileAchievement = {
      id: achievementDraft.id ?? crypto.randomUUID(),
      title: achievementDraft.title.trim(),
      description: achievementDraft.description.trim() || null,
      level: achievementDraft.level
        ? (achievementDraft.level as StudentProfileAchievement['level'])
        : null,
      year: achievementDraft.year.trim() || null,
      certificateUrl: achievementDraft.certificateUrl.trim() || null,
      tags: normalizeTags(achievementDraft.tags),
      approved: profile.achievements.find((item) => item.id === achievementDraft.id)?.approved ?? null,
    };
    const nextAchievements = achievementDraft.id
      ? profile.achievements.map((item) => (item.id === achievementDraft.id ? entry : item))
      : [...profile.achievements, entry];
    const updated = await handleUpdate({ achievements: nextAchievements }, 'achievement');
    if (updated) {
      setIsAchievementOpen(false);
    }
  };

  const handleRemoveAchievement = async (id: string) => {
    if (!profile) return;
    const nextAchievements = profile.achievements.filter((item) => item.id !== id);
    await handleUpdate({ achievements: nextAchievements }, 'achievement-remove');
  };

  const handleSubmitCompetition = async () => {
    if (!competitionDraft || !profile) return;
    if (!competitionDraft.name.trim()) {
      setCompetitionError('Competition name is required.');
      return;
    }
    const entry: StudentProfileCompetition = {
      id: competitionDraft.id ?? crypto.randomUUID(),
      name: competitionDraft.name.trim(),
      category: competitionDraft.category.trim() || null,
      result: competitionDraft.result.trim() || null,
      date: competitionDraft.date.trim() || null,
      status: competitionDraft.status
        ? (competitionDraft.status as StudentProfileCompetition['status'])
        : null,
      description: competitionDraft.description.trim() || null,
      location: competitionDraft.location.trim() || null,
    };
    const nextCompetitions = competitionDraft.id
      ? profile.competitions.map((item) => (item.id === competitionDraft.id ? entry : item))
      : [...profile.competitions, entry];
    const updated = await handleUpdate({ competitions: nextCompetitions }, 'competition');
    if (updated) {
      setIsCompetitionOpen(false);
    }
  };

  const handleRemoveCompetition = async (id: string) => {
    if (!profile) return;
    const nextCompetitions = profile.competitions.filter((item) => item.id !== id);
    await handleUpdate({ competitions: nextCompetitions }, 'competition-remove');
  };

  const handleSubmitExtracurricular = async () => {
    if (!extracurricularDraft || !profile) return;
    if (!extracurricularDraft.name.trim()) {
      setExtracurricularError('Activity name is required.');
      return;
    }
    const entry: StudentProfileExtracurricular = {
      id: extracurricularDraft.id ?? crypto.randomUUID(),
      name: extracurricularDraft.name.trim(),
      role: extracurricularDraft.role.trim() || null,
      description: extracurricularDraft.description.trim() || null,
      startDate: extracurricularDraft.startDate.trim() || null,
      endDate: extracurricularDraft.endDate.trim() || null,
      status: extracurricularDraft.status
        ? (extracurricularDraft.status as StudentProfileExtracurricular['status'])
        : null,
    };
    const nextExtracurriculars = extracurricularDraft.id
      ? profile.extracurriculars.map((item) =>
          item.id === extracurricularDraft.id ? entry : item,
        )
      : [...profile.extracurriculars, entry];
    const updated = await handleUpdate({ extracurriculars: nextExtracurriculars }, 'extracurricular');
    if (updated) {
      setIsExtracurricularOpen(false);
    }
  };

  const handleRemoveExtracurricular = async (id: string) => {
    if (!profile) return;
    const nextExtracurriculars = profile.extracurriculars.filter((item) => item.id !== id);
    await handleUpdate({ extracurriculars: nextExtracurriculars }, 'extracurricular-remove');
  };

  const handleVisibilityChange = async (visibility: StudentProfileVisibility) => {
    await handleUpdate({ visibility }, 'visibility');
  };

  const handleSlugSave = async () => {
    if (!profile) return;
    const normalized = slugDraft.trim().toLowerCase();
    if (!normalized) {
      setFeedback({ type: 'error', message: 'Enter a profile link before saving.' });
      return;
    }
    const updated = await handleUpdate({ slug: normalized }, 'slug');
    if (updated) {
      setSlugDraft(updated.slug ?? normalized);
    }
  };

  const toggleDownloadSetting = async (value: boolean) => {
    if (!profile) return;
    await handleUpdate(
      {
        settings: {
          allowDownload: value,
          showProgressBar: profile.settings.showProgressBar,
        },
      },
      'settings-download',
    );
  };

  const toggleProgressSetting = async (value: boolean) => {
    if (!profile) return;
    await handleUpdate(
      {
        settings: {
          allowDownload: profile.settings.allowDownload,
          showProgressBar: value,
        },
      },
      'settings-progress',
    );
  };

  const shareUrl = useMemo(() => {
    if (!profile?.shareablePath) return null;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${profile.shareablePath}`;
    }
    return profile.shareablePath;
  }, [profile?.shareablePath]);

  const handleCopyShareLink = async () => {
    if (!profile?.shareablePath) {
      setFeedback({
        type: 'error',
        message: 'Create a public profile link before sharing.',
      });
      return;
    }
    try {
      const link =
        shareUrl ??
        (typeof window !== 'undefined'
          ? `${window.location.origin}${profile.shareablePath}`
          : profile.shareablePath);
      await navigator.clipboard.writeText(link);
      setFeedback({ type: 'success', message: 'Shareable link copied to clipboard!' });
    } catch (error) {
      console.error('Failed to copy share link', error);
      setFeedback({ type: 'error', message: 'Unable to copy link right now.' });
    }
  };

  const handleDownload = () => {
    if (!profile?.settings.allowDownload) {
      setFeedback({
        type: 'error',
        message: 'Enable downloads in settings to export your profile.',
      });
      return;
    }
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const completionChecklist = useMemo(() => {
    if (!profile) return []; // Ensure profile is not null
    const completed = new Set<keyof typeof completionLabels>(profile.completion.completedSteps);
    return Object.entries(completionLabels).map(([key, label]) => ({
      key,
      label,
      done: completed.has(key),
    }));
  }, [profile]);

  const subjectSummary = useMemo(() => {
    if (!profile) return [];
    const map = new Map<
      string,
      {
        totalMarks: number;
        totalMax: number;
      }
    >();
    profile.academicHistory.forEach((year) => {
      year.subjects.forEach((subject) => {
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
        percent:
          stats.totalMax > 0 ? Math.round((stats.totalMarks / stats.totalMax) * 100) : null,
      }))
      .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
      .slice(0, 6);
  }, [profile]);

  const renderFeedbackBanner = () => {
    if (!feedback) return null;
    return (
      <div
        className={cn(
          'flex items-center justify-between rounded-xl border p-3 text-sm',
          feedback.type === 'success'
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
            : 'border-red-500/40 bg-red-500/10 text-red-100',
        )}
      >
        <span>{feedback.message}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-slate-600 dark:text-white/70"
          onClick={() => setFeedback(null)}
        >
          Dismiss
        </Button>
      </div>
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-10 text-center text-red-100">
        <h2 className="text-2xl font-semibold">We couldn&apos;t load your dashboard</h2>
        <p className="mt-3 text-sm opacity-80">{profileError}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => router.refresh()}
            className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white hover:bg-card/60 dark:bg-white/20"
          >
            Try again
          </Button>
          <Button
            variant="ghost"
            className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const heroCards: Array<{
    key: string;
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    action?: { label: string; onClick: () => void };
  }> = [
    {
      key: 'class',
      label: 'Academic level',
      value: profile.stats.currentClass ?? profile.schoolInfo.className ?? 'Add class',
      description: 'Keep your academic progress up to date.',
      icon: GraduationCap,
      action: {
        label: 'Update stats',
        onClick: openStatsDialog,
      },
    },
    {
      key: 'visibility',
      label: 'Discoverability',
      value: VISIBILITY_LABELS[profile.visibility].title,
      description: VISIBILITY_LABELS[profile.visibility].description,
      icon: Shield,
      action: {
        label: 'Manage',
        onClick: () => setIsSettingsOpen(true),
      },
    },
    {
      key: 'school',
      label: 'School information',
      value: profile.schoolInfo.schoolName ?? 'Add school',
      description: profile.schoolInfo.board
        ? `Board: ${profile.schoolInfo.board}`
        : 'Tell us where you study.',
      icon: BookOpen,
      action: {
        label: 'Update',
        onClick: openSchoolDialog,
      },
    },
  ];

  const firstName = profile.displayName?.split(' ')[0] ?? 'there';

  return (
    <>
      <div className="space-y-8">
        {renderFeedbackBanner()}
        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
              <div className="absolute bottom-0 left-6 translate-y-1/2">
                <Avatar className="h-24 w-24 rounded-3xl border-4 border-white shadow-xl shadow-purple-300/40">
                  <AvatarImage src={profile.photoUrl ?? undefined} alt={profile.displayName} />
                  <AvatarFallback className="rounded-3xl bg-indigo-100 text-lg font-semibold text-indigo-600">
                    {buildAvatarFallback(profile.displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="px-6 pb-6 pt-20">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold text-slate-900">{profile.displayName}</h1>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      <Star className="h-3.5 w-3.5 text-indigo-500" />
                      Student
                    </Badge>
                  </div>
                  {profile.tagline && <p className="text-sm text-slate-600">{profile.tagline}</p>}
                  <div className="space-y-2 text-sm text-slate-500">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-slate-400" />
                        {profile.location}
                      </div>
                    )}
                    {profile.schoolInfo.schoolName && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">
                          {profile.schoolInfo.schoolName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {profile.bio && (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    {profile.bio}
                  </p>
                )}
                {profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                      >
                        #{interest}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
                    onClick={openBasicsDialog}
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Edit profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Visibility &amp; settings
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={handleCopyShareLink}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Share profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={handleDownload}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="w-full border border-transparent text-slate-500 hover:bg-slate-100"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur md:hidden">
            {DASHBOARD_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {section.label}
              </a>
            ))}
          </div>
          <nav className="sticky top-20 z-20 hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur md:flex">
            {DASHBOARD_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <section id="overview" className={cn(PANEL_BASE_CLASSES, 'relative overflow-hidden lg:p-8')}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-24 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <Badge className="w-fit bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    Portfolio snapshot
                  </Badge>
                  <h2 className="text-3xl font-semibold leading-tight text-slate-900">Welcome back, {firstName}</h2>
                  <p className="max-w-2xl text-sm text-slate-600">
                    Keep refining your journey, highlight wins you are proud of, and share a polished portfolio with mentors and colleges.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-indigo-600 text-white shadow-md shadow-indigo-300/40 hover:bg-indigo-700"
                    onClick={() => openAcademicDialog()}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Log academic year
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => openAchievementDialog()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add achievement
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={() => handleDownload()}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {heroCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.key}
                      className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              {card.label}
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                              {card.value}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-slate-500">{card.description}</p>
                      {card.action && (
                        <Button
                          variant="ghost"
                          className="mt-4 w-fit px-0 text-sm font-medium text-indigo-600 hover:bg-transparent hover:text-indigo-700"
                          onClick={card.action.onClick}
                        >
                          {card.action.label}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="progress" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Profile progress</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Complete the steps to unlock a standout public portfolio.
                </p>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span className="text-sm uppercase tracking-wide">Completion</span>
                <span className="text-3xl font-semibold text-slate-900">
                  {Math.round(profile.completion.percent)}%
                </span>
              </div>
            </div>
            {profile.settings.showProgressBar && (
              <Progress
                value={profile.completion.percent}
                className="my-6 h-3 overflow-hidden rounded-full bg-slate-100"
              />
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {completionChecklist.map((item) => (
                <div
                  key={item.key}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 text-sm transition-colors',
                    item.done
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600',
                  )}
                >
                  {item.done ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <CircleIcon className="h-5 w-5 text-slate-300" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="academics" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Academic story</h2>
                <p className="text-sm text-slate-600">
                  Capture your journey year by year with grades, highlights, and teacher feedback.
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
                onClick={() => openAcademicDialog()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add academic year
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              {profile.academicHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  Add your first academic record to showcase your grades, favourite subjects, and teacher comments.
                </div>
              ) : (
                profile.academicHistory.map((year) => (
                  <div
                    key={year.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm shadow-slate-200/60"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {formatAcademicTitle(year)}
                        </h3>
                        {year.summary && <p className="mt-2 text-sm text-slate-600">{year.summary}</p>}
                        {year.teacherComments && (
                          <p className="mt-2 text-sm text-slate-500">
                            Teacher comment{' '}
                            <span className="font-medium text-slate-700">{year.teacherComments}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => openAcademicDialog(year)}
                        >
                          <PenLine className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="border border-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => handleRemoveAcademicYear(year.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    {year.subjects.length > 0 && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-sm text-slate-600">
                          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-4 py-2 font-medium">Subject</th>
                              <th className="px-4 py-2 font-medium">Marks</th>
                              <th className="px-4 py-2 font-medium">Grade</th>
                              <th className="px-4 py-2 font-medium">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {year.subjects.map((subject) => (
                              <tr key={subject.id} className="border-t border-slate-100 odd:bg-slate-50">
                                <td className="px-4 py-2 text-slate-700">{subject.name}</td>
                                <td className="px-4 py-2 text-slate-600">
                                  {subject.marks ?? '-'}
                                  {subject.maxMarks ? ` / ${subject.maxMarks}` : ''}
                                </td>
                                <td className="px-4 py-2 text-slate-600">{subject.grade ?? '-'}</td>
                                <td className="px-4 py-2 text-slate-500">{subject.teacherComment ?? '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {subjectSummary.length > 0 && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Subject performance highlights</h3>
                <p className="mt-2 text-sm text-slate-600">
                  A quick glimpse at your strongest subjects based on average scores across the years.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {subjectSummary.map((subject) => (
                    <div
                      key={subject.name}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{subject.name}</span>
                        <Badge
                          variant="outline"
                          className="border-indigo-100 bg-indigo-50 text-indigo-600"
                        >
                          {subject.percent ?? 'N/A'}%
                        </Badge>
                      </div>
                      <Progress
                        value={subject.percent ?? 0}
                        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="achievements" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Achievements &amp; awards</h2>
                <p className="text-sm text-slate-600">
                  Celebrate milestones with descriptions, levels, and certificate links.
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
                onClick={() => openAchievementDialog()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add achievement
              </Button>
            </div>

            {profile.achievements.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                Add awards or certifications that highlight your progress.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-[1.6fr,1fr,1fr,auto]">
                  <span>Achievement</span>
                  <span>Highlights</span>
                  <span>Proof &amp; tags</span>
                  <span className="text-right">Actions</span>
                </div>
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200/50 md:grid-cols-[1.6fr,1fr,1fr,auto]"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="flex items-center gap-1.5 bg-amber-100 text-amber-700">
                          <Trophy className="h-3.5 w-3.5 text-amber-500" />
                          {achievement.title}
                        </Badge>
                        {achievement.level && (
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600"
                          >
                            {ACHIEVEMENT_LEVEL_LABELS[achievement.level] ?? achievement.level}
                          </Badge>
                        )}
                        {achievement.year && (
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600"
                          >
                            {achievement.year}
                          </Badge>
                        )}
                        {achievement.approved && (
                          <Badge className="flex items-center gap-1 border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-600">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </Badge>
                        )}
                      </div>
                      {achievement.description && (
                        <p className="text-sm text-slate-600">{achievement.description}</p>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide text-slate-500">Level</span>
                        <span>{ACHIEVEMENT_LEVEL_LABELS[achievement.level ?? ''] ?? achievement.level ?? '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide text-slate-500">Year</span>
                        <span>{achievement.year ?? '-'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {achievement.certificateUrl && (
                        <a
                          href={achievement.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View certificate
                        </a>
                      )}
                      {achievement.tags && achievement.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {achievement.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2 md:justify-end">
                      <Button
                        variant="outline"
                        className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => openAchievementDialog(achievement)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="border border-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => handleRemoveAchievement(achievement.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

      <section id="extracurricular" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Competitions &amp; challenges</h2>
            <p className="text-sm text-slate-600">
              Document Olympiads, hackathons, tournaments, and other competitive experiences.
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
            onClick={() => openCompetitionDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add competition
          </Button>
        </div>

        {profile.competitions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Add competitions you&apos;ve participated in to showcase your grit and curiosity.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-[1.6fr,1fr,auto]">
              <span>Competition</span>
              <span>Highlights</span>
              <span className="text-right">Actions</span>
            </div>
            {profile.competitions.map((competition) => (
              <div
                key={competition.id}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200/50 md:grid-cols-[1.6fr,1fr,auto]"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{competition.name}</h3>
                  {competition.description && (
                    <p className="text-sm text-slate-600">{competition.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {competition.category && <span>{competition.category}</span>}
                    {competition.status && (
                      <span>{EVENT_STATUS_LABELS[competition.status] ?? competition.status}</span>
                    )}
                    {competition.result && <span>{competition.result}</span>}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">Date</span>
                    <span>{competition.date ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">Location</span>
                    <span>{competition.location ?? '-'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 md:justify-end">
                  <Button
                    variant="outline"
                    className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => openCompetitionDialog(competition)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleRemoveCompetition(competition.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="competitions" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Extracurricular life</h2>
            <p className="text-sm text-slate-600">
              Capture clubs, volunteering, and passion projects that shape your learning identity.
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
            onClick={() => openExtracurricularDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add activity
          </Button>
        </div>

        {profile.extracurriculars.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Share leadership roles, clubs, volunteering, or creative endeavours you&apos;re proud of.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-[1.6fr,1fr,auto]">
              <span>Activity</span>
              <span>Involvement</span>
              <span className="text-right">Actions</span>
            </div>
            {profile.extracurriculars.map((activity) => (
              <div
                key={activity.id}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200/50 md:grid-cols-[1.6fr,1fr,auto]"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{activity.name}</h3>
                  {activity.description && (
                    <p className="text-sm text-slate-600">{activity.description}</p>
                  )}
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">Role</span>
                    <span>{activity.role ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">Status</span>
                    <span>{activity.status ? EVENT_STATUS_LABELS[activity.status] ?? activity.status : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">Timeline</span>
                    <span>
                      {activity.startDate ?? '-'}
                      {activity.endDate ? ` - ${activity.endDate}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 md:justify-end">
                  <Button
                    variant="outline"
                    className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => openExtracurricularDialog(activity)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleRemoveExtracurricular(activity.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="resources" className={cn(PANEL_BASE_CLASSES, 'lg:p-8')}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Saved opportunities</h2>
            <p className="text-sm text-slate-600">
              Access programmes you bookmarked and keep an eye on upcoming deadlines.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => loadSavedOpportunities()}
              disabled={isLoadingSaved}
            >
              {isLoadingSaved ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => router.push('/opportunities')}
            >
              Browse more
            </Button>
          </div>
        </div>
        {savedError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
            {savedError}
          </div>
        )}
        <div className="mt-6 space-y-4">
          {isLoadingSaved ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              Loading your saved opportunities...
            </div>
          ) : savedOpportunities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              You haven&apos;t saved any opportunities yet. Explore the catalogue and bookmark programmes that inspire you.
            </div>
          ) : (
            savedOpportunities.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm shadow-slate-200/50 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-900">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>{item.category || 'General'}</span>
                    {item.organizer && <span>{item.organizer}</span>}
                    {item.mode && <span>{item.mode.toUpperCase()}</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>
                      Deadline{' '}
                      <strong className="text-slate-900">
                        {item.registrationDeadline
                          ? new Date(item.registrationDeadline).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </strong>
                    </span>
                    <span>
                      Saved on{' '}
                      <strong className="text-slate-900">{formatSavedDate(item.savedAt)}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <Badge
                    variant="outline"
                    className="border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-600"
                  >
                    {item.gradeEligibility || 'All grades'}
                  </Badge>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-foreground dark:text-white shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Link href={`/opportunity/${item.id}`}>View details</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
        </div>
      </div>
    </div>

    {/* Dialogs are rendered below */}
    <Dialogs
        state={{
          basics: { open: isBasicsOpen, draft: basicsDraft, error: basicsError },
          stats: { open: isStatsOpen, draft: statsDraft, error: statsError },
          school: { open: isSchoolOpen, draft: schoolDraft, error: schoolError },
          academic: { open: isAcademicOpen, draft: academicDraft, error: academicError },
          achievement: { open: isAchievementOpen, draft: achievementDraft, error: achievementError },
          competition: { open: isCompetitionOpen, draft: competitionDraft, error: competitionError },
          extracurricular: {
            open: isExtracurricularOpen,
            draft: extracurricularDraft,
            error: extracurricularError,
          },
          settings: { open: isSettingsOpen, slug: slugDraft },
        }}
        actions={{
          setBasicsOpen: setIsBasicsOpen,
          setStatsOpen: setIsStatsOpen,
          setSchoolOpen: setIsSchoolOpen,
          setAcademicOpen: setIsAcademicOpen,
          setAchievementOpen: setIsAchievementOpen,
          setCompetitionOpen: setIsCompetitionOpen,
          setExtracurricularOpen: setIsExtracurricularOpen,
          setSettingsOpen: setIsSettingsOpen,
          setBasicsDraft,
          setStatsDraft,
          setSchoolDraft,
          setAcademicDraft,
          setAchievementDraft,
          setCompetitionDraft,
          setExtracurricularDraft,
          setSlugDraft,
        }}
        handlers={{
          handleSubmitBasics,
          handleSubmitStats,
          handleSubmitSchool,
          handleSubmitAcademic,
          handleSubmitAchievement,
          handleSubmitCompetition,
          handleSubmitExtracurricular,
          pendingAction,
          handleSlugSave,
          toggleDownloadSetting,
          toggleProgressSetting,
          handleVisibilityChange,
        }}
        profile={profile}
      />
    </>
  );
}

type DialogsProps = {
  profile: StudentProfile;
  state: {
    basics: { open: boolean; draft: BasicProfileDraft | null; error: string | null };
    stats: { open: boolean; draft: StatsDraft | null; error: string | null };
    school: { open: boolean; draft: SchoolInfoDraft | null; error: string | null };
    academic: { open: boolean; draft: AcademicYearDraft | null; error: string | null };
    achievement: { open: boolean; draft: AchievementDraft | null; error: string | null };
    competition: { open: boolean; draft: CompetitionDraft | null; error: string | null };
    extracurricular: {
      open: boolean;
      draft: ExtracurricularDraft | null;
      error: string | null;
    };
    settings: { open: boolean; slug: string };
  };
  actions: {
    setBasicsOpen: (value: boolean) => void;
    setStatsOpen: (value: boolean) => void;
    setSchoolOpen: (value: boolean) => void;
    setAcademicOpen: (value: boolean) => void;
    setAchievementOpen: (value: boolean) => void;
    setCompetitionOpen: (value: boolean) => void;
    setExtracurricularOpen: (value: boolean) => void;
    setSettingsOpen: (value: boolean) => void;
    setBasicsDraft: Dispatch<SetStateAction<BasicProfileDraft | null>>;
    setStatsDraft: Dispatch<SetStateAction<StatsDraft | null>>;
    setSchoolDraft: Dispatch<SetStateAction<SchoolInfoDraft | null>>;
    setAcademicDraft: Dispatch<SetStateAction<AcademicYearDraft | null>>;
    setAchievementDraft: Dispatch<SetStateAction<AchievementDraft | null>>;
    setCompetitionDraft: Dispatch<SetStateAction<CompetitionDraft | null>>;
    setExtracurricularDraft: Dispatch<SetStateAction<ExtracurricularDraft | null>>;
    setSlugDraft: Dispatch<SetStateAction<string>>;
  };
  handlers: {
    handleSubmitBasics: () => void;
    handleSubmitStats: () => void;
    handleSubmitSchool: () => void;
    handleSubmitAcademic: () => void;
    handleSubmitAchievement: () => void;
    handleSubmitCompetition: () => void;
    handleSubmitExtracurricular: () => void;
    handleVisibilityChange: (visibility: StudentProfileVisibility) => void;
    handleSlugSave: () => void;
    toggleDownloadSetting: (value: boolean) => void;
    toggleProgressSetting: (value: boolean) => void;
    pendingAction: string | null;
  };
};

function Dialogs({ profile, state, actions, handlers }: DialogsProps) {
  const {
    basics,
    stats,
    school,
    academic,
    achievement,
    competition,
    extracurricular,
    settings,
  } = state;
  const {
    setBasicsOpen,
    setStatsOpen,
    setSchoolOpen,
    setAcademicOpen,
    setAchievementOpen,
    setCompetitionOpen,
    setExtracurricularOpen,
    setSettingsOpen,
    setBasicsDraft,
    setStatsDraft,
    setSchoolDraft,
    setAcademicDraft,
    setAchievementDraft,
    setCompetitionDraft,
    setExtracurricularDraft,
    setSlugDraft,
  } = actions;
  const {
    handleSubmitBasics,
    handleSubmitStats,
    handleSubmitSchool,
    handleSubmitAcademic,
    handleSubmitAchievement,
    handleSubmitCompetition,
    handleSubmitExtracurricular,
    handleVisibilityChange,
    handleSlugSave,
    toggleDownloadSetting,
    toggleProgressSetting,
    pendingAction,
  } = handlers;

  return (
    <>
      <Dialog open={basics.open} onOpenChange={(value) => setBasicsOpen(value)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-200 dark:border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>Profile basics</DialogTitle>
          </DialogHeader>
          {basics.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={basics.draft.displayName}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, displayName: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photoUrl">Profile photo URL</Label>
                <Input
                  id="photoUrl"
                  value={basics.draft.photoUrl}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, photoUrl: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="https://…"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={basics.draft.tagline}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, tagline: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Aspiring engineer | Grade 10 | Science stream"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">About you</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={basics.draft.bio}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, bio: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Share your journey, motivations, and what excites you."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={basics.draft.location}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, location: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Mumbai, India"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Textarea
                  id="interests"
                  rows={3}
                  value={basics.draft.interests}
                  onChange={(event) =>
                    setBasicsDraft({ ...basics.draft!, interests: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Robotics, Debate, Community service"
                />
              </div>
              {basics.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {basics.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setBasicsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitBasics}
              disabled={pendingAction === 'basics'}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-foreground dark:text-white hover:from-orange-600 hover:to-pink-600"
            >
              {pendingAction === 'basics' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PenLine className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={extracurricular.open} onOpenChange={(value) => setExtracurricularOpen(value)}>
        <DialogContent className="border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {extracurricular.draft?.id
                ? 'Edit extracurricular activity'
                : 'Add extracurricular activity'}
            </DialogTitle>
          </DialogHeader>
          {extracurricular.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="activityName">Activity name</Label>
                <Input
                  id="activityName"
                  value={extracurricular.draft.name}
                  onChange={(event) =>
                    setExtracurricularDraft({
                      ...extracurricular.draft!,
                      name: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activityRole">Role</Label>
                <Input
                  id="activityRole"
                  value={extracurricular.draft.role}
                  onChange={(event) =>
                    setExtracurricularDraft({
                      ...extracurricular.draft!,
                      role: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Team lead, Volunteer, Performer…"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="activityStart">Start date</Label>
                  <Input
                    id="activityStart"
                    value={extracurricular.draft.startDate}
                    onChange={(event) =>
                      setExtracurricularDraft({
                        ...extracurricular.draft!,
                        startDate: event.target.value,
                      })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                    placeholder="Jan 2023"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activityEnd">End date</Label>
                  <Input
                    id="activityEnd"
                    value={extracurricular.draft.endDate}
                    onChange={(event) =>
                      setExtracurricularDraft({
                        ...extracurricular.draft!,
                        endDate: event.target.value,
                      })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                    placeholder="Dec 2023"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={extracurricular.draft.status}
                  onValueChange={(value) =>
                    setExtracurricularDraft({
                      ...extracurricular.draft!,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                    {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activityDescription">Description</Label>
                <Textarea
                  id="activityDescription"
                  rows={3}
                  value={extracurricular.draft.description}
                  onChange={(event) =>
                    setExtracurricularDraft({
                      ...extracurricular.draft!,
                      description: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Explain what you do, the impact, or skills you developed."
                />
              </div>
              {extracurricular.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {extracurricular.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setExtracurricularOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitExtracurricular}
              disabled={pendingAction === 'extracurricular'}
              className="bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-900 hover:from-emerald-400 hover:to-lime-400"
            >
              {pendingAction === 'extracurricular' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              Save activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={competition.open} onOpenChange={(value) => setCompetitionOpen(value)}>
        <DialogContent className="border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {competition.draft?.id ? 'Edit competition' : 'Add competition'}
            </DialogTitle>
          </DialogHeader>
          {competition.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="competitionName">Competition name</Label>
                <Input
                  id="competitionName"
                  value={competition.draft.name}
                  onChange={(event) =>
                    setCompetitionDraft({ ...competition.draft!, name: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitionCategory">Category</Label>
                <Input
                  id="competitionCategory"
                  value={competition.draft.category}
                  onChange={(event) =>
                    setCompetitionDraft({
                      ...competition.draft!,
                      category: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Robotics, Debate, Sports…"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitionResult">Result / Outcome</Label>
                <Input
                  id="competitionResult"
                  value={competition.draft.result}
                  onChange={(event) =>
                    setCompetitionDraft({ ...competition.draft!, result: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Winner, Finalist, Participation"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="competitionDate">Date</Label>
                  <Input
                    id="competitionDate"
                    value={competition.draft.date}
                    onChange={(event) =>
                      setCompetitionDraft({ ...competition.draft!, date: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                    placeholder="July 2024"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={competition.draft.status}
                    onValueChange={(value) =>
                      setCompetitionDraft({ ...competition.draft!, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                      {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitionLocation">Location</Label>
                <Input
                  id="competitionLocation"
                  value={competition.draft.location}
                  onChange={(event) =>
                    setCompetitionDraft({
                      ...competition.draft!,
                      location: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Delhi, India"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitionDescription">Description</Label>
                <Textarea
                  id="competitionDescription"
                  rows={3}
                  value={competition.draft.description}
                  onChange={(event) =>
                    setCompetitionDraft({
                      ...competition.draft!,
                      description: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Share highlights, learnings, or results."
                />
              </div>
              {competition.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {competition.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setCompetitionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCompetition}
              disabled={pendingAction === 'competition'}
              className="bg-gradient-to-r from-sky-500 to-violet-500 text-foreground dark:text-white hover:from-sky-600 hover:to-violet-600"
            >
              {pendingAction === 'competition' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Flag className="mr-2 h-4 w-4" />
              )}
              Save competition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={achievement.open} onOpenChange={(value) => setAchievementOpen(value)}>
        <DialogContent className="border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {achievement.draft?.id ? 'Edit achievement' : 'Add achievement'}
            </DialogTitle>
          </DialogHeader>
          {achievement.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="achievementTitle">Title</Label>
                <Input
                  id="achievementTitle"
                  value={achievement.draft.title}
                  onChange={(event) =>
                    setAchievementDraft({
                      ...achievement.draft!,
                      title: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="achievementDescription">Description</Label>
                <Textarea
                  id="achievementDescription"
                  rows={3}
                  value={achievement.draft.description}
                  onChange={(event) =>
                    setAchievementDraft({
                      ...achievement.draft!,
                      description: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="What makes this achievement special?"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select
                    value={achievement.draft.level}
                    onValueChange={(value) =>
                      setAchievementDraft({ ...achievement.draft!, level: value })
                    }
                  >
                    <SelectTrigger className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                      {Object.entries(ACHIEVEMENT_LEVEL_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="achievementYear">Year</Label>
                  <Input
                    id="achievementYear"
                    value={achievement.draft.year}
                    onChange={(event) =>
                      setAchievementDraft({ ...achievement.draft!, year: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="achievementCertificate">Certificate link</Label>
                <Input
                  id="achievementCertificate"
                  value={achievement.draft.certificateUrl}
                  onChange={(event) =>
                    setAchievementDraft({
                      ...achievement.draft!,
                      certificateUrl: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="https://…"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="achievementTags">Tags (comma separated)</Label>
                <Input
                  id="achievementTags"
                  value={achievement.draft.tags}
                  onChange={(event) =>
                    setAchievementDraft({ ...achievement.draft!, tags: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="STEM, Leadership"
                />
              </div>
              {achievement.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {achievement.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setAchievementOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAchievement}
              disabled={pendingAction === 'achievement'}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-foreground dark:text-white hover:from-orange-600 hover:to-pink-600"
            >
              {pendingAction === 'achievement' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="mr-2 h-4 w-4" />
              )}
              Save achievement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={academic.open} onOpenChange={(value) => setAcademicOpen(value)}>
        <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border-slate-200 dark:border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {academic.draft?.id ? 'Edit academic year' : 'Add academic year'}
            </DialogTitle>
          </DialogHeader>
          {academic.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="session">Session</Label>
                  <Input
                    id="session"
                    value={academic.draft.session}
                    onChange={(event) =>
                      setAcademicDraft({ ...academic.draft!, session: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Class / Grade</Label>
                  <Input
                    id="grade"
                    value={academic.draft.grade}
                    onChange={(event) =>
                      setAcademicDraft({ ...academic.draft!, grade: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="board">Board</Label>
                  <Input
                    id="board"
                    value={academic.draft.board}
                    onChange={(event) =>
                      setAcademicDraft({ ...academic.draft!, board: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={academic.draft.schoolName}
                    onChange={(event) =>
                      setAcademicDraft({ ...academic.draft!, schoolName: event.target.value })
                    }
                    className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="summary">Highlights</Label>
                <Textarea
                  id="summary"
                  rows={3}
                  value={academic.draft.summary}
                  onChange={(event) =>
                    setAcademicDraft({ ...academic.draft!, summary: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherComments">Teacher comments</Label>
                <Textarea
                  id="teacherComments"
                  rows={3}
                  value={academic.draft.teacherComments}
                  onChange={(event) =>
                    setAcademicDraft({
                      ...academic.draft!,
                      teacherComments: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <Separator className="bg-card/70 dark:bg-white/10" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground dark:text-white">Subjects</h3>
                <Button
                  variant="outline"
                  className="border-white/20 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
                  onClick={() =>
                    setAcademicDraft({
                      ...academic.draft!,
                      subjects: [
                        ...academic.draft!.subjects,
                        {
                          id: crypto.randomUUID(),
                          name: '',
                          marks: '',
                          maxMarks: '',
                          grade: '',
                          teacherComment: '',
                        },
                      ].slice(0, MAX_SUBJECTS_PER_YEAR),
                    })
                  }
                  disabled={academic.draft.subjects.length >= MAX_SUBJECTS_PER_YEAR}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add subject
                </Button>
              </div>
              <div className="space-y-4">
                {academic.draft.subjects.map((subject, index) => (
                  <div
                    key={subject.id}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground dark:text-white">Subject {index + 1}</h4>
                      <Button
                        variant="ghost"
                        className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-red-500/10 hover:text-red-100"
                        onClick={() =>
                          setAcademicDraft({
                            ...academic.draft!,
                            subjects: academic.draft!.subjects.filter((item) => item.id !== subject.id),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input
                          value={subject.name}
                          onChange={(event) =>
                            setAcademicDraft({
                              ...academic.draft!,
                              subjects: academic.draft!.subjects.map((item) =>
                                item.id === subject.id ? { ...item, name: event.target.value } : item,
                              ),
                            })
                          }
                          className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Marks obtained</Label>
                        <Input
                          value={subject.marks}
                          onChange={(event) =>
                            setAcademicDraft({
                              ...academic.draft!,
                              subjects: academic.draft!.subjects.map((item) =>
                                item.id === subject.id ? { ...item, marks: event.target.value } : item,
                              ),
                            })
                          }
                          className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                          placeholder="90"
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Max marks</Label>
                        <Input
                          value={subject.maxMarks}
                          onChange={(event) =>
                            setAcademicDraft({
                              ...academic.draft!,
                              subjects: academic.draft!.subjects.map((item) =>
                                item.id === subject.id ? { ...item, maxMarks: event.target.value } : item,
                              ),
                            })
                          }
                          className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                          placeholder="100"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Grade</Label>
                        <Input
                          value={subject.grade}
                          onChange={(event) =>
                            setAcademicDraft({
                              ...academic.draft!,
                              subjects: academic.draft!.subjects.map((item) =>
                                item.id === subject.id ? { ...item, grade: event.target.value } : item,
                              ),
                            })
                          }
                          className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                          placeholder="A+"
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <Label>Teacher comment</Label>
                      <Textarea
                        rows={2}
                        value={subject.teacherComment}
                        onChange={(event) =>
                          setAcademicDraft({
                            ...academic.draft!,
                            subjects: academic.draft!.subjects.map((item) =>
                              item.id === subject.id ? { ...item, teacherComment: event.target.value } : item,
                            ),
                          })
                        }
                        className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                        placeholder="Student demonstrates excellent problem-solving skills."
                      />
                    </div>
                  </div>
                ))}
              </div>
              {academic.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {academic.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setAcademicOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAcademic}
              disabled={pendingAction === 'academic'}
              className="bg-gradient-to-r from-sky-500 to-violet-500 text-foreground dark:text-white hover:from-sky-600 hover:to-violet-600"
            >
              {pendingAction === 'academic' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Save academic year
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={school.open} onOpenChange={(value) => setSchoolOpen(value)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-200 dark:border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>School information</DialogTitle>
          </DialogHeader>
          {school.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="schoolName">School name</Label>
                <Input
                  id="schoolName"
                  value={school.draft.schoolName}
                  onChange={(event) =>
                    setSchoolDraft({ ...school.draft!, schoolName: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Mumbai International School"
                />
              </div>
              <div className="grid gap-2">
                <Label>Board</Label>
                <Select
                  value={school.draft.board}
                  onValueChange={(value) =>
                    setSchoolDraft({
                      ...school.draft!,
                      board: value === 'other' ? '' : value,
                      otherBoard: value === 'other' ? school.draft!.otherBoard : '',
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-white/90 dark:bg-white/5 text-foreground dark:text-white">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                    {DEFAULT_BOARDS.map((boardName) => (
                      <SelectItem key={boardName} value={boardName === 'Other' ? 'other' : boardName}>
                        {boardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {school.draft.board === '' && (
                  <Input
                    value={school.draft.otherBoard}
                    onChange={(event) =>
                      setSchoolDraft({ ...school.draft!, otherBoard: event.target.value })
                    }
                    className="mt-2 bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                    placeholder="Your board"
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label>Class / Grade</Label>
                <Select
                  value={school.draft.className}
                  onValueChange={(value) =>
                    setSchoolDraft({ ...school.draft!, className: value })
                  }
                >
                  <SelectTrigger className="w-full bg-white/90 dark:bg-white/5 text-foreground dark:text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                    {DEFAULT_CLASSES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otherSchoolName">Previous / Alternate school</Label>
                <Input
                  id="otherSchoolName"
                  value={school.draft.otherSchoolName}
                  onChange={(event) =>
                    setSchoolDraft({
                      ...school.draft!,
                      otherSchoolName: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="Optional"
                />
              </div>
              {school.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {school.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setSchoolOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitSchool}
              disabled={pendingAction === 'school'}
              className="bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-900 hover:from-emerald-400 hover:to-lime-400"
            >
              {pendingAction === 'school' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Save school info
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={stats.open} onOpenChange={(value) => setStatsOpen(value)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-200 dark:border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>Academic stats</DialogTitle>
          </DialogHeader>
          {stats.draft && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentClass">Current class</Label>
                <Input
                  id="currentClass"
                  value={stats.draft.currentClass}
                  onChange={(event) =>
                    setStatsDraft({ ...stats.draft!, currentClass: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gpa">GPA / Average grade</Label>
                <Input
                  id="gpa"
                  value={stats.draft.gpa}
                  onChange={(event) =>
                    setStatsDraft({ ...stats.draft!, gpa: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="averageScore">Average score (%)</Label>
                <Input
                  id="averageScore"
                  value={stats.draft.averageScore}
                  onChange={(event) =>
                    setStatsDraft({ ...stats.draft!, averageScore: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalAwards">Total awards</Label>
                <Input
                  id="totalAwards"
                  value={stats.draft.totalAwards}
                  onChange={(event) =>
                    setStatsDraft({ ...stats.draft!, totalAwards: event.target.value })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitions">Competitions participated</Label>
                <Input
                  id="competitions"
                  value={stats.draft.competitionsParticipated}
                  onChange={(event) =>
                    setStatsDraft({
                      ...stats.draft!,
                      competitionsParticipated: event.target.value,
                    })
                  }
                  className="bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              {stats.error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {stats.error}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setStatsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitStats}
              disabled={pendingAction === 'stats'}
              className="bg-gradient-to-r from-sky-500 to-violet-500 text-foreground dark:text-white hover:from-sky-600 hover:to-violet-600"
            >
              {pendingAction === 'stats' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Save stats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={settings.open} onOpenChange={(value) => setSettingsOpen(value)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-200 dark:border-white/10 bg-slate-950 text-foreground dark:text-white">
          <DialogHeader>
            <DialogTitle>Visibility & sharing</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-white/70">
                Control who can view your portfolio and personalise your shareable link.
              </p>
              <div className="space-y-3">
                {(Object.keys(VISIBILITY_LABELS) as StudentProfileVisibility[]).map((key) => {
                  const option = VISIBILITY_LABELS[key];
                  const Icon =
                    key === 'public' ? Globe2 : key === 'teachers' ? Users2 : (Lock as typeof Lock);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleVisibilityChange(key)}
                      className={cn(
                        'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors',
                        profile.visibility === key
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                          : 'border-white/10 bg-white/90 dark:bg-white/5 text-foreground dark:text-white/80 hover:bg-card/70 dark:bg-white/10',
                      )}
                    >
                      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-card/70 dark:bg-white/10" />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground dark:text-white">Public profile link</h3>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  value={settings.slug}
                  onChange={(event) => setSlugDraft(event.target.value.toLowerCase())}
                  className="flex-1 bg-white/90 dark:bg-white/5 text-foreground dark:text-white"
                  placeholder="mahi-kumar"
                />
                <Button
                  variant="outline"
                  className="border-white/20 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
                  onClick={handleSlugSave}
                  disabled={pendingAction === 'slug'}
                >
                  {pendingAction === 'slug' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Save link
                </Button>
              </div>
              <p className="text-xs text-slate-600 dark:text-white/60">
                Your public profile will be available at{' '}
                <code className="rounded bg-card/70 dark:bg-white/10 px-2 py-1">
                  myark.in/student/{settings.slug || 'your-name'}
                </code>
              </p>
            </div>

            <Separator className="bg-card/70 dark:bg-white/10" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-white">Profile preferences</h3>
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-4">
                <div>
                  <p className="font-medium text-foreground dark:text-white">Enable résumé download</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                    Allow Myark to generate a PDF of your profile when you choose download.
                  </p>
                </div>
                <Switch
                  checked={profile.settings.allowDownload}
                  onCheckedChange={toggleDownloadSetting}
                  disabled={pendingAction?.startsWith('settings-')}
                />
              </div>
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-4">
                <div>
                  <p className="font-medium text-foreground dark:text-white">Show progress tracker</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                    Display the completion percentage and guidance checklist on your dashboard.
                  </p>
                </div>
                <Switch
                  checked={profile.settings.showProgressBar}
                  onCheckedChange={toggleProgressSetting}
                  disabled={pendingAction?.startsWith('settings-')}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              variant="ghost"
              className="border border-slate-200 dark:border-white/10 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10"
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}





