import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getDb } from '@/lib/firebaseAdmin';
import { INDIAN_STATES_SET } from '@/constants/india';

const COLLECTION = 'opportunities';
const USERS_COLLECTION = 'users';

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

type SubmissionPayload = {
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  categoryId?: unknown;
  categoryName?: unknown;
  eligibility?: unknown;
  benefits?: unknown;
  registrationProcess?: unknown;
  mode?: unknown;
  fee?: unknown;
  state?: unknown;
  currency?: unknown;
  registrationDeadline?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  segments?: unknown;
  contactEmail?: unknown;
  contactPhone?: unknown;
  contactWebsite?: unknown;
  applicationUrl?: unknown;
};

const toDateValue = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter((entry) => entry.length > 0);
  }
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
  return [];
};

const sanitizeSegments = (value: unknown): string[] =>
  sanitizeStringArray(value).map((segment) => segment.toLowerCase());

const slugFromTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96);

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const db = getDb();
    const userDoc = await db.collection(USERS_COLLECTION).doc(decoded.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Account profile not found' }, { status: 403 });
    }

    const profile = userDoc.data() as Record<string, unknown>;
    if (profile.accountType !== 'organization') {
      return NextResponse.json(
        { error: 'Only organization accounts can submit opportunities' },
        { status: 403 },
      );
    }

    const payload = (await request.json().catch(() => null)) as SubmissionPayload | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const description =
      typeof payload.description === 'string' ? payload.description.trim() : '';
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const mode =
      payload.mode === 'online' || payload.mode === 'offline' || payload.mode === 'hybrid'
        ? payload.mode
        : 'online';

    const eligibility = sanitizeStringArray(payload.eligibility);
    if (eligibility.length === 0) {
      return NextResponse.json({ error: 'At least one eligibility item is required' }, { status: 400 });
    }

    const registrationDeadline = toDateValue(payload.registrationDeadline);
    if (!registrationDeadline) {
      return NextResponse.json({ error: 'A valid registration deadline is required' }, { status: 400 });
    }

    const now = new Date();
    const organizerName =
      (typeof profile.organizationName === 'string' && profile.organizationName) ||
      (typeof profile.displayName === 'string' ? profile.displayName : '') ||
      'Organization';

    const docData = {
      title,
      slug: slugFromTitle(title),
      summary: typeof payload.summary === 'string' ? payload.summary.trim() : '',
      description,
      categoryId: typeof payload.categoryId === 'string' ? payload.categoryId.trim() : null,
      categoryName: typeof payload.categoryName === 'string' ? payload.categoryName.trim() : '',
      category: typeof payload.categoryName === 'string' ? payload.categoryName.trim() : '',
      organizerId: decoded.uid,
      organizerName,
      organizer: organizerName,
      organizerLogo: '',
      gradeEligibility: eligibility.join(', '),
      mode,
      status: 'pending',
      fee: typeof payload.fee === 'string' ? payload.fee.trim() : '',
      state:
        typeof payload.state === 'string' && INDIAN_STATES_SET.has(payload.state.trim())
          ? payload.state.trim()
          : '',
      currency: 'INR',
      registrationDeadline,
      startDate: toDateValue(payload.startDate),
      endDate: toDateValue(payload.endDate),
      segments: sanitizeSegments(payload.segments),
      image: '',
      descriptionHtml: '',
      eligibility,
      benefits: sanitizeStringArray(payload.benefits),
      registrationProcess: sanitizeStringArray(payload.registrationProcess),
      contactInfo: {
        email:
          typeof payload.contactEmail === 'string' ? payload.contactEmail.trim() : profile.email ?? '',
        phone: typeof payload.contactPhone === 'string' ? payload.contactPhone.trim() : '',
        website: typeof payload.contactWebsite === 'string' ? payload.contactWebsite.trim() : '',
      },
      applicationUrl:
        typeof payload.applicationUrl === 'string' ? payload.applicationUrl.trim() : '',
      source: 'organization-submission',
      submittedBy: decoded.uid,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
      approval: {
        status: 'pending',
        reviewedAt: null,
        reviewedBy: null,
      },
    };

    const docRef = await db.collection(COLLECTION).add(docData);
    return NextResponse.json({ id: docRef.id, status: 'pending' }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit opportunity', error);
    return NextResponse.json({ error: 'Failed to submit opportunity' }, { status: 500 });
  }
}
