import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';
import type {
  StudentProfileAcademicYear,
  StudentProfileAchievement,
  StudentProfileCompetition,
  StudentProfileExtracurricular,
  StudentProfileSettings,
  StudentProfileStats,
  StudentProfileUpdatePayload,
} from '@/types/studentProfile';
import {
  STUDENT_PROFILE_COLLECTION,
  SLUG_REGEX,
  MAX_ACHIEVEMENTS,
  MAX_COMPETITIONS,
  MAX_EXTRACURRICULARS,
  MAX_HISTORY_ITEMS,
  MAX_INTERESTS,
  academicYearSchema,
  achievementSchema,
  buildStudentProfileResponse,
  competitionSchema,
  ensureArray,
  extracurricularSchema,
  toStudentProfileAchievement,
  toStudentProfileCompetition,
  toStudentProfileExtracurricular,
  toStudentProfileYear,
} from '@/lib/studentProfileServer';

const COLLECTION = STUDENT_PROFILE_COLLECTION;

const getBearerToken = (request: NextRequest): string | null => {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
};

const statsSchema = z
  .object({
    currentClass: z.string().trim().min(1).max(80).nullable().optional(),
    gpa: z.number().min(0).max(10).nullable().optional(),
    averageScore: z.number().min(0).max(100).nullable().optional(),
    totalAwards: z.number().int().min(0).max(1000).nullable().optional(),
    competitionsParticipated: z.number().int().min(0).max(1000).nullable().optional(),
  })
  .partial();

const schoolInfoSchema = z
  .object({
    schoolName: z.string().trim().min(1).max(160).nullable().optional(),
    board: z.string().trim().min(1).max(120).nullable().optional(),
    className: z.string().trim().min(1).max(40).nullable().optional(),
    otherSchoolName: z.string().trim().min(1).max(160).nullable().optional(),
    otherBoard: z.string().trim().min(1).max(120).nullable().optional(),
  })
  .partial();

const settingsSchema = z
  .object({
    allowDownload: z.boolean().optional(),
    showProgressBar: z.boolean().optional(),
  })
  .partial();

const updateSchema = z
  .object({
    displayName: z.string().trim().min(1).max(160).optional(),
    tagline: z.string().trim().min(1).max(180).nullable().optional(),
    bio: z.string().trim().min(1).max(2000).nullable().optional(),
    photoUrl: z.string().trim().max(2048).nullable().optional(),
    bannerUrl: z.string().trim().max(2048).nullable().optional(),
    location: z.string().trim().min(1).max(160).nullable().optional(),
    interests: z.array(z.string().trim().min(1).max(40)).max(MAX_INTERESTS).optional(),
    visibility: z.enum(['private', 'teachers', 'public']).optional(),
    slug: z
      .union([z.string().trim().min(3).max(60), z.literal(''), z.null()])
      .optional()
      .transform((value) => {
        if (value === '') {
          return null;
        }
        return value;
      }),
    stats: statsSchema.optional(),
    schoolInfo: schoolInfoSchema.optional(),
    academicHistory: z.array(academicYearSchema).max(MAX_HISTORY_ITEMS).optional(),
    achievements: z.array(achievementSchema).max(MAX_ACHIEVEMENTS).optional(),
    competitions: z.array(competitionSchema).max(MAX_COMPETITIONS).optional(),
    extracurriculars: z.array(extracurricularSchema).max(MAX_EXTRACURRICULARS).optional(),
    settings: settingsSchema.optional(),
  })
  .strict();

const ensureProfileDocument = async (
  uid: string,
  displayName: string,
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> => {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(uid);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    return snapshot;
  }

  const now = new Date();
  await ref.set({
    uid,
    displayName,
    visibility: 'private',
    stats: {},
    schoolInfo: {},
    academicHistory: [],
    achievements: [],
    competitions: [],
    extracurriculars: [],
    interests: [],
    settings: {
      allowDownload: false,
      showProgressBar: true,
    },
    createdAt: now,
    updatedAt: now,
  });

  return await ref.get();
};

const sanitizeSlug = (slug: string | null | undefined): string | null => {
  if (!slug) {
    return null;
  }
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (!SLUG_REGEX.test(normalized)) {
    throw new Error('Invalid slug format');
  }
  return normalized;
};

const applyUpdate = async (
  uid: string,
  payload: StudentProfileUpdatePayload,
  currentDoc: FirebaseFirestore.DocumentData,
) => {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(uid);
  const updates: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (payload.displayName !== undefined) {
    updates.displayName = payload.displayName.trim();
  }
  if (payload.tagline !== undefined) {
    updates.tagline = payload.tagline ? payload.tagline.trim() : null;
  }
  if (payload.bio !== undefined) {
    updates.bio = payload.bio ? payload.bio.trim() : null;
  }
  if (payload.photoUrl !== undefined) {
    updates.photoUrl = payload.photoUrl ? payload.photoUrl.trim() : null;
  }
  if (payload.bannerUrl !== undefined) {
    updates.bannerUrl = payload.bannerUrl ? payload.bannerUrl.trim() : null;
  }
  if (payload.location !== undefined) {
    updates.location = payload.location ? payload.location.trim() : null;
  }
  if (payload.visibility !== undefined) {
    updates.visibility = payload.visibility;
  }

  if (payload.slug !== undefined) {
    const nextSlug = sanitizeSlug(payload.slug);

    if (nextSlug) {
      const conflict = await db
        .collection(COLLECTION)
        .where('slug', '==', nextSlug)
        .limit(1)
        .get();
      const hasConflict = !conflict.empty && conflict.docs[0]!.id !== uid;
      if (hasConflict) {
        const existingName =
          typeof conflict.docs[0]?.data()?.displayName === 'string'
            ? conflict.docs[0]!.data()!.displayName
            : 'Another student';
        throw new Error(`This profile link is already used by ${existingName}. Try another link.`);
      }
      updates.slug = nextSlug;
    } else {
      updates.slug = FieldValue.delete();
    }
  }

  if (payload.interests !== undefined) {
    const cleaned = payload.interests
      .map((interest) => interest.trim())
      .filter(Boolean)
      .slice(0, MAX_INTERESTS);
    updates.interests = [...new Set(cleaned)];
  }

  if (payload.stats !== undefined) {
    const nextStats: StudentProfileStats = {
      currentClass: payload.stats.currentClass ?? null,
      gpa:
        typeof payload.stats.gpa === 'number'
          ? Number(payload.stats.gpa.toFixed(2))
          : null,
      averageScore:
        typeof payload.stats.averageScore === 'number'
          ? Number(payload.stats.averageScore.toFixed(2))
          : null,
      totalAwards:
        typeof payload.stats.totalAwards === 'number'
          ? payload.stats.totalAwards
          : null,
      competitionsParticipated:
        typeof payload.stats.competitionsParticipated === 'number'
          ? payload.stats.competitionsParticipated
          : null,
    };
    updates.stats = nextStats;
  }

  if (payload.schoolInfo !== undefined) {
    updates.schoolInfo = {
      schoolName: payload.schoolInfo.schoolName ?? null,
      board: payload.schoolInfo.board ?? null,
      className: payload.schoolInfo.className ?? null,
      otherSchoolName: payload.schoolInfo.otherSchoolName ?? null,
      otherBoard: payload.schoolInfo.otherBoard ?? null,
    };
  }

  if (payload.academicHistory !== undefined) {
    const history = ensureArray(payload.academicHistory)
      .map(toStudentProfileYear)
      .filter((item): item is StudentProfileAcademicYear => Boolean(item));
    updates.academicHistory = history.slice(0, MAX_HISTORY_ITEMS);
  }

  if (payload.achievements !== undefined) {
    const achievements = ensureArray(payload.achievements)
      .map(toStudentProfileAchievement)
      .filter((item): item is StudentProfileAchievement => Boolean(item));
    updates.achievements = achievements.slice(0, MAX_ACHIEVEMENTS);
  }

  if (payload.competitions !== undefined) {
    const competitions = ensureArray(payload.competitions)
      .map(toStudentProfileCompetition)
      .filter((item): item is StudentProfileCompetition => Boolean(item));
    updates.competitions = competitions.slice(0, MAX_COMPETITIONS);
  }

  if (payload.extracurriculars !== undefined) {
    const extracurriculars = ensureArray(payload.extracurriculars)
      .map(toStudentProfileExtracurricular)
      .filter((item): item is StudentProfileExtracurricular => Boolean(item));
    updates.extracurriculars = extracurriculars.slice(0, MAX_EXTRACURRICULARS);
  }

  if (payload.settings !== undefined) {
    const previous = currentDoc?.settings ?? {};
    const next: StudentProfileSettings = {
      allowDownload:
        typeof payload.settings.allowDownload === 'boolean'
          ? payload.settings.allowDownload
          : typeof previous.allowDownload === 'boolean'
            ? previous.allowDownload
            : false,
      showProgressBar:
        typeof payload.settings.showProgressBar === 'boolean'
          ? payload.settings.showProgressBar
          : typeof previous.showProgressBar === 'boolean'
            ? previous.showProgressBar
            : true,
    };
    updates.settings = next;
  }

  await ref.set(updates, { merge: true });
};

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const displayName = decoded.name ?? decoded.email ?? 'Student';

    const snapshot = await ensureProfileDocument(decoded.uid, displayName);
    const data = snapshot.data() ?? {};

    const profile = buildStudentProfileResponse(data, decoded.uid, displayName);

    return NextResponse.json({ item: profile });
  } catch (error) {
    console.error('Failed to fetch student profile', error);
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json({ error: issues.join(', ') }, { status: 400 });
    }

    const displayName = decoded.name ?? decoded.email ?? 'Student';
    const snapshot = await ensureProfileDocument(decoded.uid, displayName);
    const existingData = snapshot.data() ?? {};

    try {
      await applyUpdate(decoded.uid, parsed.data as StudentProfileUpdatePayload, existingData);
    } catch (updateError) {
      if (updateError instanceof Error && updateError.message.includes('profile link')) {
        return NextResponse.json({ error: updateError.message }, { status: 409 });
      }
      if (updateError instanceof Error && updateError.message === 'Invalid slug format') {
        return NextResponse.json(
          { error: 'Profile link can only contain lowercase letters, numbers, and hyphens.' },
          { status: 400 },
        );
      }
      throw updateError;
    }

    const updatedSnapshot = await getDb().collection(COLLECTION).doc(decoded.uid).get();
    const updatedData = updatedSnapshot.data() ?? existingData;
    const profile = buildStudentProfileResponse(updatedData, decoded.uid, displayName);

    return NextResponse.json({ item: profile });
  } catch (error) {
    console.error('Failed to update student profile', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
  }
}
