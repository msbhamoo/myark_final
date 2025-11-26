import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { randomUUID } from 'crypto';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { INDIAN_STATES_SET } from '@/constants/india';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'opportunities';

const toIsoString = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'object' && value && 'toDate' in value) {
    return (value as any).toDate().toISOString();
  }
  return null;
};

const toDateValue = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (typeof value === 'object' && value && 'toDate' in value) {
    const parsed = (value as any).toDate?.();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
  }
  return null;
};

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter((entry) => entry.length > 0);
  }
  return [];
};

const sanitizeTimelineForResponse = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return null;
      const record = entry as Record<string, unknown>;
      const date = toIsoString(record.date);
      const event = typeof record.event === 'string' ? record.event : '';
      const status = typeof record.status === 'string' ? record.status : 'upcoming';
      if (!event) return null;
      return { date, event, status };
    })
    .filter((entry): entry is { date: string | null; event: string; status: string } => Boolean(entry));
};

const parseTimelineForStore = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return null;
      const record = entry as Record<string, unknown>;
      const event = typeof record.event === 'string' ? record.event.trim() : '';
      if (!event) return null;
      const date = toDateValue(record.date);
      const status = typeof record.status === 'string' ? record.status.trim() : 'upcoming';
      return { date, event, status };
    })
    .filter(
      (entry): entry is { date: Date | null; event: string; status: string } =>
        entry !== null && entry.event.length > 0,
    );
};

const sanitizeExamSectionsForResponse = (value: unknown): Array<{ name: string; questions: number | null; marks: number | null }> => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return null;
      const record = entry as Record<string, unknown>;
      const name = typeof record.name === 'string' ? record.name : '';
      if (!name) return null;
      const questions = toNumber(record.questions);
      const marks = toNumber(record.marks);
      return { name, questions, marks };
    })
    .filter((entry): entry is { name: string; questions: number | null; marks: number | null } => Boolean(entry));
};

const parseExamSectionsForStore = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return null;
      const record = entry as Record<string, unknown>;
      const name = typeof record.name === 'string' ? record.name.trim() : '';
      if (!name) return null;
      return {
        name,
        questions: toNumber(record.questions),
        marks: toNumber(record.marks),
      };
    })
    .filter((entry): entry is { name: string; questions: number | null; marks: number | null } => Boolean(entry));
};

const sanitizeExamPatternForResponse = (value: unknown): ExamPattern => {
  if (typeof value !== 'object' || value === null) {
    return {
      totalQuestions: null,
      durationMinutes: null,
      negativeMarking: false,
      negativeMarksPerQuestion: null,
      sections: [],
    };
  }
  const record = value as Record<string, unknown>;
  return {
    totalQuestions: toNumber(record.totalQuestions ?? record.total_questions),
    durationMinutes: toNumber(record.durationMinutes ?? record.duration_minutes),
    negativeMarking: Boolean(record.negativeMarking ?? record.negative_marking ?? false),
    negativeMarksPerQuestion: toNumber(
      record.negativeMarksPerQuestion ?? record.negative_marks_per_question,
    ),
    sections: sanitizeExamSectionsForResponse(record.sections),
  };
};

const parseExamPatternForStore = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    return {
      totalQuestions: null,
      durationMinutes: null,
      negativeMarking: false,
      negativeMarksPerQuestion: null,
      sections: [],
    };
  }
  const record = value as Record<string, unknown>;
  return {
    totalQuestions: toNumber(record.totalQuestions ?? record.total_questions),
    durationMinutes: toNumber(record.durationMinutes ?? record.duration_minutes),
    negativeMarking: Boolean(record.negativeMarking ?? record.negative_marking ?? false),
    negativeMarksPerQuestion: toNumber(
      record.negativeMarksPerQuestion ?? record.negative_marks_per_question,
    ),
    sections: parseExamSectionsForStore(record.sections),
  };
};

const sanitizeContactInfoForResponse = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    return { email: '', phone: '', website: '' };
  }
  const record = value as Record<string, unknown>;
  return {
    email: typeof record.email === 'string' ? record.email : '',
    phone: typeof record.phone === 'string' ? record.phone : '',
    website: typeof record.website === 'string' ? record.website : '',
  };
};

const parseContactInfoForStore = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    return { email: '', phone: '', website: '' };
  }
  const record = value as Record<string, unknown>;
  return {
    email: typeof record.email === 'string' ? record.email.trim() : '',
    phone: typeof record.phone === 'string' ? record.phone.trim() : '',
    website: typeof record.website === 'string' ? record.website.trim() : '',
  };
};

const normalizeResourceType = (value: unknown): 'pdf' | 'video' | 'link' => {
  if (typeof value !== 'string') {
    return 'link';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'pdf' || normalized === 'video' || normalized === 'link') {
    return normalized;
  }
  return 'link';
};

const sanitizeResourcesForResponse = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id : '';
      const title = typeof record.title === 'string' ? record.title : '';
      const url = typeof record.url === 'string' ? record.url : '';
      if (!id || !title || !url) {
        return null;
      }
      const description =
        typeof record.description === 'string' ? record.description : '';
      return {
        id,
        title,
        url,
        type: normalizeResourceType(record.type),
        description,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        id: string;
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'link';
        description: string;
      } => Boolean(entry),
    );
};

const parseResourcesForStore = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const title = typeof record.title === 'string' ? record.title.trim() : '';
      const url = typeof record.url === 'string' ? record.url.trim() : '';
      if (!title || !url) {
        return null;
      }
      const idCandidate = typeof record.id === 'string' ? record.id.trim() : '';
      const description =
        typeof record.description === 'string' ? record.description.trim() : '';
      return {
        id: idCandidate || randomUUID(),
        title,
        url,
        type: normalizeResourceType(record.type),
        description,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        id: string;
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'link';
        description: string;
      } => Boolean(entry),
    );
};

const parseCustomTabsForStore = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id.trim() : randomUUID();
      const label = typeof record.label === 'string' ? record.label.trim() : '';
      const type = typeof record.type === 'string' ? record.type.trim() : '';
      const order = toNumber(record.order) ?? 0;
      const required = Boolean(record.required);

      if (!label || !['rich-text', 'list', 'structured-data', 'custom-json'].includes(type)) {
        return null;
      }

      let content;
      if (typeof record.content !== 'object' || record.content === null) {
        return null;
      }

      const contentRecord = record.content as Record<string, unknown>;
      const contentType = contentRecord.type;

      if (contentType === 'rich-text') {
        content = {
          type: 'rich-text' as const,
          html: typeof contentRecord.html === 'string' ? contentRecord.html : '',
        };
      } else if (contentType === 'list') {
        content = {
          type: 'list' as const,
          items: sanitizeStringArray(contentRecord.items),
        };
      } else if (contentType === 'structured-data') {
        content = {
          type: 'structured-data' as const,
          schema: typeof contentRecord.schema === 'object' && contentRecord.schema !== null
            ? (contentRecord.schema as Record<string, any>)
            : {},
        };
      } else if (contentType === 'custom-json') {
        content = {
          type: 'custom-json' as const,
          data: typeof contentRecord.data === 'object' && contentRecord.data !== null
            ? (contentRecord.data as Record<string, any>)
            : {},
        };
      } else {
        return null;
      }

      return {
        id,
        label,
        type: type as 'rich-text' | 'list' | 'structured-data' | 'custom-json',
        order,
        required,
        content,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
};

const sanitizeCustomTabsForResponse = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return parseCustomTabsForStore(value);
};

type ExamPattern = {
  totalQuestions: number | null;
  durationMinutes: number | null;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number | null;
  sections: Array<{ name: string; questions: number | null; marks: number | null }>;
};

type ClassSelection = {
  type: 'single' | 'multiple' | 'range';
  selectedClasses: string[];
  rangeStart?: string | null;
  rangeEnd?: string | null;
};

type ExamPatternBlock = ExamPattern & {
  id: string;
  classSelection: ClassSelection;
};

const sanitizeClassSelection = (value: unknown): ClassSelection => {
  if (typeof value !== 'object' || value === null) {
    return { type: 'single', selectedClasses: [] };
  }
  const record = value as Record<string, unknown>;
  const type = (typeof record.type === 'string' && ['single', 'multiple', 'range'].includes(record.type))
    ? (record.type as ClassSelection['type'])
    : 'single';

  return {
    type,
    selectedClasses: sanitizeStringArray(record.selectedClasses),
    rangeStart: typeof record.rangeStart === 'string' ? record.rangeStart : null,
    rangeEnd: typeof record.rangeEnd === 'string' ? record.rangeEnd : null,
  };
};

const sanitizeExamPatternsForResponse = (value: unknown): ExamPatternBlock[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    if (typeof entry !== 'object' || entry === null) return null;
    const record = entry as Record<string, unknown>;
    const pattern = sanitizeExamPatternForResponse(record);
    const id = typeof record.id === 'string' ? record.id : randomUUID();
    const classSelection = sanitizeClassSelection(record.classSelection);
    return { ...pattern, id, classSelection };
  }).filter((entry): entry is ExamPatternBlock => Boolean(entry));
};

const parseExamPatternsForStore = (value: unknown): ExamPatternBlock[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    if (typeof entry !== 'object' || entry === null) return null;
    const record = entry as Record<string, unknown>;
    const pattern = parseExamPatternForStore(record);
    const id = typeof record.id === 'string' ? record.id : randomUUID();
    const classSelection = sanitizeClassSelection(record.classSelection);
    return { ...pattern, id, classSelection };
  }).filter((entry): entry is ExamPatternBlock => Boolean(entry));
};

const serializeDoc = (doc: QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? '',
    categoryId: data.categoryId ?? null,
    category: data.category ?? '',
    categoryName: data.categoryName ?? '',
    organizerId: data.organizerId ?? null,
    organizerName: data.organizerName ?? '',
    organizer: data.organizer ?? '',
    organizerLogo: data.organizerLogo ?? '',
    gradeEligibility: data.gradeEligibility ?? '',
    eligibilityType: data.eligibilityType ?? null,
    ageEligibility: data.ageEligibility ?? null,
    mode: data.mode ?? 'online',
    state: (() => {
      const rawState = typeof data.state === 'string' ? data.state.trim() : '';
      return INDIAN_STATES_SET.has(rawState as any) ? (rawState as any) : '';
    })(),
    status: data.status ?? 'draft',
    fee: data.fee ?? '',
    currency: data.currency ?? 'INR',
    registrationDeadline: toIsoString(data.registrationDeadline),
    registrationDeadlineTBD: Boolean(data.registrationDeadlineTBD),
    startDate: toIsoString(data.startDate),
    startDateTBD: Boolean(data.startDateTBD),
    endDate: toIsoString(data.endDate),
    endDateTBD: Boolean(data.endDateTBD),
    segments: sanitizeStringArray(data.segments),
    image: data.image ?? '',
    description: data.description ?? '',
    eligibility: sanitizeStringArray(data.eligibility),
    benefits: sanitizeStringArray(data.benefits),
    registrationProcess: sanitizeStringArray(data.registrationProcess),
    timeline: sanitizeTimelineForResponse(data.timeline),
    examPattern: sanitizeExamPatternForResponse(data.examPattern),
    examPatterns: sanitizeExamPatternsForResponse(data.examPatterns),
    contactInfo: sanitizeContactInfoForResponse(data.contactInfo),
    resources: sanitizeResourcesForResponse(data.resources),
    submittedBy: data.submittedBy ?? null,
    source: data.source ?? '',
    approval: data.approval ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    registrationMode: data.registrationMode ?? 'internal',
    applicationUrl: data.applicationUrl ?? '',
    registrationCount: data.registrationCount ?? 0,
    externalRegistrationClickCount: data.externalRegistrationClickCount ?? 0,
    customTabs: sanitizeCustomTabsForResponse(data.customTabs),
  };
};

export async function GET(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('updatedAt', 'desc').limit(200).get();
    const items = snapshot.docs.map((doc) => serializeDoc(doc as QueryDocumentSnapshot));
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to list opportunities', error);
    return NextResponse.json({ error: 'Failed to list opportunities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!hasAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = new Date();
    const docData = {
      title,
      categoryId: typeof payload.categoryId === 'string' ? payload.categoryId.trim() : null,
      categoryName: typeof payload.categoryName === 'string' ? payload.categoryName.trim() : '',
      category: typeof payload.category === 'string' ? payload.category.trim() : '',
      organizerId: typeof payload.organizerId === 'string' ? payload.organizerId.trim() : null,
      organizerName: typeof payload.organizerName === 'string' ? payload.organizerName.trim() : '',
      organizer: typeof payload.organizer === 'string' ? payload.organizer.trim() : '',
      organizerLogo: typeof payload.organizerLogo === 'string' ? payload.organizerLogo.trim() : '',
      gradeEligibility: typeof payload.gradeEligibility === 'string' ? payload.gradeEligibility.trim() : '',
      eligibilityType: typeof payload.eligibilityType === 'string' ? payload.eligibilityType.trim() : null,
      ageEligibility: typeof payload.ageEligibility === 'string' ? payload.ageEligibility.trim() : null,
      mode: typeof payload.mode === 'string' ? payload.mode : 'online',
      state:
        typeof payload.state === 'string' && INDIAN_STATES_SET.has(payload.state.trim() as any)
          ? (payload.state.trim() as any)
          : '',
      status: typeof payload.status === 'string' ? payload.status : 'draft',
      fee: typeof payload.fee === 'string' ? payload.fee.trim() : '',
      currency: 'INR',
      registrationDeadline: toDateValue(payload.registrationDeadline),
      registrationDeadlineTBD: Boolean(payload.registrationDeadlineTBD),
      startDate: toDateValue(payload.startDate),
      startDateTBD: Boolean(payload.startDateTBD),
      endDate: toDateValue(payload.endDate),
      endDateTBD: Boolean(payload.endDateTBD),
      segments: sanitizeStringArray(payload.segments),
      image: typeof payload.image === 'string' ? payload.image.trim() : '',
      description: typeof payload.description === 'string' ? payload.description : '',
      eligibility: sanitizeStringArray(payload.eligibility),
      benefits: sanitizeStringArray(payload.benefits),
      registrationProcess: sanitizeStringArray(payload.registrationProcess),
      timeline: parseTimelineForStore(payload.timeline),
      examPattern: parseExamPatternForStore(payload.examPattern),
      examPatterns: parseExamPatternsForStore(payload.examPatterns),
      contactInfo: parseContactInfoForStore(payload.contactInfo),
      resources: parseResourcesForStore(payload.resources),
      registrationMode: payload.registrationMode === 'external' ? 'external' : 'internal',
      applicationUrl: payload.registrationMode === 'external' && typeof payload.applicationUrl === 'string' ? payload.applicationUrl.trim() : '',
      customTabs: parseCustomTabsForStore(payload.customTabs),
      registrationCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const db = getDb();
    const docRef = await db.collection(COLLECTION).add(docData);
    const docSnapshot = await docRef.get();
    revalidateTag('opportunities');
    return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create opportunity', error);
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 });
  }
}
