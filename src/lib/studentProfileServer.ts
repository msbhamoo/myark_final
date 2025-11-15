import { randomUUID } from 'crypto';
import { z } from 'zod';
import type {
  PublicStudentProfile,
  StudentProfile,
  StudentProfileAcademicSubject,
  StudentProfileAcademicYear,
  StudentProfileAchievement,
  StudentProfileCompletion,
  StudentProfileCompetition,
  StudentProfileExtracurricular,
  StudentProfileSettings,
  StudentProfileStats,
} from '@/types/studentProfile';
import { getDb } from '@/lib/firebaseAdmin';

export const STUDENT_PROFILE_COLLECTION = 'studentProfiles';

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_HISTORY_ITEMS = 12;
export const MAX_SUBJECTS_PER_YEAR = 16;
export const MAX_ACHIEVEMENTS = 60;
export const MAX_COMPETITIONS = 60;
export const MAX_EXTRACURRICULARS = 60;
export const MAX_INTERESTS = 20;

export const subjectSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(80),
    marks: z.number().min(0).max(1000).nullable().optional(),
    maxMarks: z.number().min(0).max(1000).nullable().optional(),
    grade: z.string().trim().min(1).max(10).nullable().optional(),
    teacherComment: z.string().trim().min(1).max(240).nullable().optional(),
  })
  .strict();

export const academicYearSchema = z
  .object({
    id: z.string().uuid().optional(),
    session: z.string().trim().min(1).max(40).nullable().optional(),
    grade: z.string().trim().min(1).max(40).nullable().optional(),
    board: z.string().trim().min(1).max(80).nullable().optional(),
    schoolName: z.string().trim().min(1).max(160).nullable().optional(),
    summary: z.string().trim().min(1).max(400).nullable().optional(),
    teacherComments: z.string().trim().min(1).max(400).nullable().optional(),
    subjects: z.array(subjectSchema).max(MAX_SUBJECTS_PER_YEAR).default([]),
  })
  .strict();

export const achievementSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(600).nullable().optional(),
    level: z
      .enum(['school', 'district', 'state', 'national', 'international', 'other'])
      .nullable()
      .optional(),
    year: z.string().trim().min(1).max(12).nullable().optional(),
    certificateUrl: z.string().trim().max(512).nullable().optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(8).nullable().optional(),
    approved: z.boolean().nullable().optional(),
  })
  .strict();

export const competitionSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(160),
    category: z.string().trim().min(1).max(120).nullable().optional(),
    result: z.string().trim().min(1).max(160).nullable().optional(),
    date: z.string().trim().min(1).max(30).nullable().optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed']).nullable().optional(),
    description: z.string().trim().min(1).max(400).nullable().optional(),
    location: z.string().trim().min(1).max(160).nullable().optional(),
  })
  .strict();

export const extracurricularSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(160),
    role: z.string().trim().min(1).max(160).nullable().optional(),
    description: z.string().trim().min(1).max(400).nullable().optional(),
    startDate: z.string().trim().min(1).max(30).nullable().optional(),
    endDate: z.string().trim().min(1).max(30).nullable().optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed']).nullable().optional(),
  })
  .strict();

export const ensureArray = <T>(value: readonly T[] | undefined | null): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : [];
};

export const toIsoString = (value: unknown): string | null => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      const dateValue = (value as { toDate?: () => Date | null }).toDate?.();
      if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
        return dateValue.toISOString();
      }
    } catch {
      return null;
    }
  }
  return null;
};

export const toStudentProfileSubject = (subject: unknown): StudentProfileAcademicSubject | null => {
  if (!subject || typeof subject !== 'object') {
    return null;
  }
  const id: string = (() => {
    const extractedId = (subject as { id?: unknown }).id;
    if (typeof extractedId === 'string' && extractedId) {
      return extractedId;
    }
    return randomUUID();
  })();
  const name =
    typeof (subject as { name?: unknown }).name === 'string'
      ? ((subject as { name: string }).name || '').trim()
      : '';
  if (!name) {
    return null;
  }
  return {
    id,
    name,
    marks:
      typeof (subject as { marks?: unknown }).marks === 'number'
        ? (subject as { marks: number }).marks
        : null,
    maxMarks:
      typeof (subject as { maxMarks?: unknown }).maxMarks === 'number'
        ? (subject as { maxMarks: number }).maxMarks
        : null,
    grade:
      typeof (subject as { grade?: unknown }).grade === 'string'
        ? ((subject as { grade: string }).grade || '').trim() || null
        : null,
    teacherComment:
      typeof (subject as { teacherComment?: unknown }).teacherComment === 'string'
        ? ((subject as { teacherComment: string }).teacherComment || '').trim() || null
        : null,
  };
};

export const toStudentProfileYear = (item: unknown): StudentProfileAcademicYear | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const parsed = academicYearSchema.safeParse(item);
  if (!parsed.success) {
    return null;
  }

  const subjects = ensureArray(parsed.data.subjects)
    .map(toStudentProfileSubject)
    .filter((subject): subject is StudentProfileAcademicSubject => Boolean(subject));

  return {
    id: parsed.data.id ?? randomUUID(),
    session: parsed.data.session ?? null,
    grade: parsed.data.grade ?? null,
    board: parsed.data.board ?? null,
    schoolName: parsed.data.schoolName ?? null,
    summary: parsed.data.summary ?? null,
    teacherComments: parsed.data.teacherComments ?? null,
    subjects,
  };
};

export const toStudentProfileAchievement = (item: unknown): StudentProfileAchievement | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const parsed = achievementSchema.safeParse(item);
  if (!parsed.success) {
    return null;
  }
  return {
    id: parsed.data.id ?? randomUUID(),
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    level: parsed.data.level ?? null,
    year: parsed.data.year ?? null,
    certificateUrl: parsed.data.certificateUrl ?? null,
    tags: parsed.data.tags ?? null,
    approved: parsed.data.approved ?? null,
  };
};

export const toStudentProfileCompetition = (item: unknown): StudentProfileCompetition | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const parsed = competitionSchema.safeParse(item);
  if (!parsed.success) {
    return null;
  }
  return {
    id: parsed.data.id ?? randomUUID(),
    name: parsed.data.name,
    category: parsed.data.category ?? null,
    result: parsed.data.result ?? null,
    date: parsed.data.date ?? null,
    status: parsed.data.status ?? null,
    description: parsed.data.description ?? null,
    location: parsed.data.location ?? null,
  };
};

export const toStudentProfileExtracurricular = (
  item: unknown,
): StudentProfileExtracurricular | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const parsed = extracurricularSchema.safeParse(item);
  if (!parsed.success) {
    return null;
  }
  return {
    id: parsed.data.id ?? randomUUID(),
    name: parsed.data.name,
    role: parsed.data.role ?? null,
    description: parsed.data.description ?? null,
    startDate: parsed.data.startDate ?? null,
    endDate: parsed.data.endDate ?? null,
    status: parsed.data.status ?? null,
  };
};

export const computeCompletion = (
  doc: FirebaseFirestore.DocumentData | undefined,
): StudentProfileCompletion => {
  const steps: Array<{ key: StudentProfileCompletion['completedSteps'][number]; completed: boolean }> = [
    {
      key: 'profile',
      completed: Boolean(
        doc?.photoUrl ||
          doc?.tagline ||
          doc?.bio ||
          (Array.isArray(doc?.interests) && (doc?.interests?.length ?? 0) > 0),
      ),
    },
    {
      key: 'school',
      completed: Boolean(doc?.schoolInfo?.schoolName && doc?.schoolInfo?.className),
    },
    {
      key: 'academicHistory',
      completed: Array.isArray(doc?.academicHistory) && doc.academicHistory.length > 0,
    },
    {
      key: 'achievements',
      completed: Array.isArray(doc?.achievements) && doc.achievements.length > 0,
    },
    {
      key: 'competitions',
      completed:
        (Array.isArray(doc?.competitions) && doc.competitions.length > 0) ||
        (Array.isArray(doc?.extracurriculars) && doc.extracurriculars.length > 0),
    },
    {
      key: 'visibility',
      completed: Boolean(doc?.slug) && doc?.visibility !== 'private',
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).map((step) => step.key);
  const percent = Math.round((completedSteps.length / steps.length) * 100);

  return {
    percent,
    completedSteps,
    totalSteps: steps.length,
  };
};

export const buildStudentProfileResponse = (
  doc: FirebaseFirestore.DocumentData,
  uid: string,
  fallbackName: string,
): StudentProfile => {
  const stats: StudentProfileStats = {
    currentClass: doc?.stats?.currentClass ?? null,
    gpa: typeof doc?.stats?.gpa === 'number' ? doc.stats.gpa : null,
    averageScore: typeof doc?.stats?.averageScore === 'number' ? doc.stats.averageScore : null,
    totalAwards: typeof doc?.stats?.totalAwards === 'number' ? doc.stats.totalAwards : null,
    competitionsParticipated:
      typeof doc?.stats?.competitionsParticipated === 'number'
        ? doc.stats.competitionsParticipated
        : null,
  };

  const interests = Array.isArray(doc?.interests)
    ? [...new Set(doc.interests.filter((item: unknown): item is string => typeof item === 'string'))].slice(
        0,
        MAX_INTERESTS,
      )
    : [];

  const academicHistory = ensureArray(doc?.academicHistory)
    .map(toStudentProfileYear)
    .filter((item): item is StudentProfileAcademicYear => Boolean(item));

  const achievements = ensureArray(doc?.achievements)
    .map(toStudentProfileAchievement)
    .filter((item): item is StudentProfileAchievement => Boolean(item));

  const competitions = ensureArray(doc?.competitions)
    .map(toStudentProfileCompetition)
    .filter((item): item is StudentProfileCompetition => Boolean(item));

  const extracurriculars = ensureArray(doc?.extracurriculars)
    .map(toStudentProfileExtracurricular)
    .filter((item): item is StudentProfileExtracurricular => Boolean(item));

  const settings: StudentProfileSettings = {
    allowDownload:
      typeof doc?.settings?.allowDownload === 'boolean' ? doc.settings.allowDownload : false,
    showProgressBar:
      typeof doc?.settings?.showProgressBar === 'boolean' ? doc.settings.showProgressBar : true,
  };

  const completion = computeCompletion(doc);

  const shareablePath =
    typeof doc?.slug === 'string' && doc.slug ? `/student/${doc.slug.toLowerCase()}` : null;

  return {
    uid,
    displayName:
      (typeof doc?.displayName === 'string' && doc.displayName ? doc.displayName : fallbackName) as string,
    photoUrl: typeof doc?.photoUrl === 'string' && doc.photoUrl ? doc.photoUrl : null,
    tagline: typeof doc?.tagline === 'string' && doc.tagline ? doc.tagline : null,
    bio: typeof doc?.bio === 'string' && doc.bio ? doc.bio : null,
    location: typeof doc?.location === 'string' && doc.location ? doc.location : null,
    interests,
    visibility:
      doc?.visibility === 'public' || doc?.visibility === 'teachers' || doc?.visibility === 'private'
        ? doc.visibility
        : 'private',
    slug: typeof doc?.slug === 'string' && doc.slug ? doc.slug.toLowerCase() : null,
    shareablePath,
    stats,
    schoolInfo: {
      schoolName:
        typeof doc?.schoolInfo?.schoolName === 'string' ? doc.schoolInfo.schoolName : null,
      board: typeof doc?.schoolInfo?.board === 'string' ? doc.schoolInfo.board : null,
      className:
        typeof doc?.schoolInfo?.className === 'string' ? doc.schoolInfo.className : null,
      otherSchoolName:
        typeof doc?.schoolInfo?.otherSchoolName === 'string'
          ? doc.schoolInfo.otherSchoolName
          : null,
      otherBoard:
        typeof doc?.schoolInfo?.otherBoard === 'string' ? doc.schoolInfo.otherBoard : null,
    },
    academicHistory,
    achievements,
    competitions,
    extracurriculars,
    settings,
    completion,
    createdAt: toIsoString(doc?.createdAt),
    updatedAt: toIsoString(doc?.updatedAt),
  };
};

export const buildPublicStudentProfile = (
  doc: FirebaseFirestore.DocumentData,
  fallbackName: string,
): PublicStudentProfile | null => {
  const visibility =
    doc?.visibility === 'public' || doc?.visibility === 'teachers' || doc?.visibility === 'private'
      ? doc.visibility
      : 'private';

  if (visibility !== 'public') {
    return null;
  }

  const slug = typeof doc?.slug === 'string' && doc.slug ? doc.slug.toLowerCase() : null;
  if (!slug) {
    return null;
  }

  const stats: StudentProfileStats = {
    currentClass: doc?.stats?.currentClass ?? null,
    gpa: typeof doc?.stats?.gpa === 'number' ? doc.stats.gpa : null,
    averageScore: typeof doc?.stats?.averageScore === 'number' ? doc.stats.averageScore : null,
    totalAwards: typeof doc?.stats?.totalAwards === 'number' ? doc.stats.totalAwards : null,
    competitionsParticipated:
      typeof doc?.stats?.competitionsParticipated === 'number'
        ? doc.stats.competitionsParticipated
        : null,
  };

  const interests = Array.isArray(doc?.interests)
    ? doc.interests.filter((interest: unknown): interest is string => typeof interest === 'string')
    : [];

  const academicHighlights = ensureArray(doc?.academicHistory)
    .map(toStudentProfileYear)
    .filter((item): item is StudentProfileAcademicYear => Boolean(item));

  const achievements = ensureArray(doc?.achievements)
    .map(toStudentProfileAchievement)
    .filter((item): item is StudentProfileAchievement => Boolean(item));

  const competitions = ensureArray(doc?.competitions)
    .map(toStudentProfileCompetition)
    .filter((item): item is StudentProfileCompetition => Boolean(item));

  const extracurriculars = ensureArray(doc?.extracurriculars)
    .map(toStudentProfileExtracurricular)
    .filter((item): item is StudentProfileExtracurricular => Boolean(item));

  return {
    displayName:
      (typeof doc?.displayName === 'string' && doc.displayName ? doc.displayName : fallbackName) as string,
    slug: slug as string,
    tagline: typeof doc?.tagline === 'string' && doc.tagline ? doc.tagline : null,
    bio: typeof doc?.bio === 'string' && doc.bio ? doc.bio : null,
    photoUrl: typeof doc?.photoUrl === 'string' && doc.photoUrl ? doc.photoUrl : null,
    stats,
    schoolInfo: {
      schoolName:
        typeof doc?.schoolInfo?.schoolName === 'string' ? doc.schoolInfo.schoolName : null,
      board: typeof doc?.schoolInfo?.board === 'string' ? doc.schoolInfo.board : null,
      className:
        typeof doc?.schoolInfo?.className === 'string' ? doc.schoolInfo.className : null,
      otherSchoolName:
        typeof doc?.schoolInfo?.otherSchoolName === 'string'
          ? doc.schoolInfo.otherSchoolName
          : null,
      otherBoard:
        typeof doc?.schoolInfo?.otherBoard === 'string' ? doc.schoolInfo.otherBoard : null,
    },
    academicHighlights,
    achievements,
    competitions,
    extracurriculars,
    interests,
    createdAt: toIsoString(doc?.createdAt),
    updatedAt: toIsoString(doc?.updatedAt),
  };
};

export async function getStudentProfileFromUid(
  uid: string,
  fallbackName = 'Anonymous',
): Promise<StudentProfile | null> {
  try {
    const db = getDb();
    const doc = await db.collection(STUDENT_PROFILE_COLLECTION).doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return buildStudentProfileResponse(doc.data()!, uid, fallbackName);
  } catch (error) {
    console.error(`Failed to get student profile for UID: ${uid}`, error);
    return null;
  }
}
