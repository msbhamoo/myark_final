import { unstable_cache as cache } from 'next/cache';
import type {
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { getDb } from './firebaseAdmin';
import type {
  Opportunity,
  OpportunityExamPattern,
  OpportunityExamPatternBlock,
  ClassSelection,
  OpportunityExamSection,
  OpportunityListResponse,
  OpportunityTimelineEvent,
  OpportunityContactInfo,
  OpportunityResource,
} from '@/types/opportunity';
import { CustomTab } from '@/types/customTab';
import { INDIAN_STATES_SET } from '@/constants/india';

const COLLECTION = 'opportunities';

const toIsoString = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  // Firestore Timestamp represented as plain object
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    return (value as any).toDate().toISOString();
  }

  return undefined;
};

const normalizeArray = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && !!item.trim());
  }

  return [];
};

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const mapTimeline = (value: unknown): OpportunityTimelineEvent[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return undefined;
      }

      const rawDate = (entry as Record<string, unknown>).date;

      return {
        date: toIsoString(rawDate) ?? '',
        event: String((entry as Record<string, unknown>).event ?? ''),
        status: String((entry as Record<string, unknown>).status ?? 'upcoming'),
      };
    })
    .filter((item) => item && item.event && item.date) as OpportunityTimelineEvent[];
};

const mapExamSections = (value: unknown): OpportunityExamSection[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const sections: OpportunityExamSection[] = [];

  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name : '';
    if (!name) {
      continue;
    }
    sections.push({
      name,
      questions: toNumber(record.questions),
      marks: toNumber(record.marks),
    });
  }

  return sections;
};

const mapExamPattern = (value: unknown): OpportunityExamPattern | undefined => {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const sections = mapExamSections(record.sections);

  return {
    totalQuestions: toNumber(record.totalQuestions ?? record.total_questions),
    durationMinutes: toNumber(record.durationMinutes ?? record.duration_minutes),
    negativeMarking: Boolean(record.negativeMarking ?? record.negative_marking ?? false),
    negativeMarksPerQuestion: toNumber(
      record.negativeMarksPerQuestion ?? record.negative_marks_per_question,
    ),
    sections,
  };
};

const mapClassSelection = (value: unknown): ClassSelection => {
  if (typeof value !== 'object' || value === null) {
    return { type: 'single', selectedClasses: [] };
  }
  const record = value as Record<string, unknown>;
  const type = (typeof record.type === 'string' && ['single', 'multiple', 'range'].includes(record.type))
    ? (record.type as ClassSelection['type'])
    : 'single';

  return {
    type,
    selectedClasses: normalizeArray(record.selectedClasses),
    rangeStart: typeof record.rangeStart === 'string' ? record.rangeStart : undefined,
    rangeEnd: typeof record.rangeEnd === 'string' ? record.rangeEnd : undefined,
  };
};

const mapExamPatterns = (value: unknown): OpportunityExamPatternBlock[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return undefined;
    }
    const record = entry as Record<string, unknown>;
    const pattern = mapExamPattern(record);
    if (!pattern) return undefined;

    const id = typeof record.id === 'string' ? record.id : crypto.randomUUID();
    const classSelection = mapClassSelection(record.classSelection);

    return {
      ...pattern,
      id,
      classSelection,
    };
  }).filter((item): item is OpportunityExamPatternBlock => Boolean(item));
};

const mapResourceType = (value: unknown): OpportunityResource['type'] => {
  if (typeof value !== 'string') {
    return 'link';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'pdf' || normalized === 'video' || normalized === 'link') {
    return normalized;
  }
  return 'link';
};

const mapResources = (value: unknown): OpportunityResource[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return undefined;
      }
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id.trim() : '';
      const title = typeof record.title === 'string' ? record.title.trim() : '';
      const url = typeof record.url === 'string' ? record.url.trim() : '';
      if (!id || !title || !url) {
        return undefined;
      }
      const description =
        typeof record.description === 'string' ? record.description.trim() || undefined : undefined;

      return {
        id,
        title,
        url,
        type: mapResourceType(record.type),
        description,
      } as OpportunityResource;
    })
    .filter((item): item is OpportunityResource => Boolean(item));
};

const mapContactInfo = (value: unknown): OpportunityContactInfo | undefined => {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const email = typeof record.email === 'string' ? record.email : undefined;
  const phone = typeof record.phone === 'string' ? record.phone : undefined;
  const website = typeof record.website === 'string' ? record.website : undefined;

  if (!email && !phone && !website) {
    return undefined;
  }

  return { email, phone, website };
};

const mapCustomTabs = (value: unknown): CustomTab[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) {
        return undefined;
      }
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id : '';
      const label = typeof record.label === 'string' ? record.label : '';
      const type = typeof record.type === 'string' ? record.type : 'rich-text';

      if (!id || !label) {
        return undefined;
      }

      return {
        id,
        label,
        type: type as CustomTab['type'],
        order: typeof record.order === 'number' ? record.order : 0,
        required: Boolean(record.required),
        content: record.content as CustomTab['content'],
      };
    })
    .filter((item): item is CustomTab => Boolean(item));
};

const mapOpportunity = (doc: QueryDocumentSnapshot): Opportunity => {
  const data = doc.data();

  return {
    id: doc.id,
    title: String(data.title ?? ''),
    slug: data.slug ? String(data.slug) : undefined,
    categoryId: data.categoryId ? String(data.categoryId) : undefined,
    categoryName: data.categoryName ? String(data.categoryName) : undefined,
    organizerId: data.organizerId ? String(data.organizerId) : undefined,
    organizerName: data.organizerName ? String(data.organizerName) : undefined,
    organizerLogo: data.organizerLogo ? String(data.organizerLogo) : undefined,
    category: String(data.category ?? ''),
    organizer: String(data.organizer ?? ''),
    gradeEligibility: String(data.gradeEligibility ?? ''),
    eligibilityType: data.eligibilityType ? (String(data.eligibilityType) as 'grade' | 'age' | 'both') : undefined,
    ageEligibility: data.ageEligibility ? String(data.ageEligibility) : undefined,
    mode: (data.mode ?? 'online') as Opportunity['mode'],
    state: (() => {
      const rawState = typeof data.state === 'string' ? data.state.trim() : '';
      return INDIAN_STATES_SET.has(rawState as any) ? (rawState as any) : undefined;
    })(),
    status: typeof data.status === 'string' ? data.status : undefined,
    startDate: toIsoString(data.startDate),
    endDate: toIsoString(data.endDate),
    registrationDeadline: toIsoString(data.registrationDeadline),
    registrationDeadlineTBD: Boolean(data.registrationDeadlineTBD),
    startDateTBD: Boolean(data.startDateTBD),
    endDateTBD: Boolean(data.endDateTBD),
    fee: data.fee ? String(data.fee) : undefined,
    currency: 'INR',
    image: data.image ? String(data.image) : undefined,
    description: data.description ? String(data.description) : undefined,
    eligibility: normalizeArray(data.eligibility),
    benefits: normalizeArray(data.benefits),
    timeline: mapTimeline(data.timeline),
    registrationProcess: normalizeArray(data.registrationProcess),
    examPattern: mapExamPattern(data.examPattern),
    examPatterns: mapExamPatterns(data.examPatterns),
    contactInfo: mapContactInfo(data.contactInfo),
    resources: mapResources(data.resources),
    segments: normalizeArray(data.segments),
    searchKeywords: normalizeArray(data.searchKeywords),
    applicationUrl: typeof data.applicationUrl === 'string' && data.applicationUrl.trim()
      ? data.applicationUrl.trim()
      : undefined,
    registrationMode: data.registrationMode === 'internal' ? 'internal' : 'external',
    registrationCount:
      typeof data.registrationCount === 'number' && Number.isFinite(data.registrationCount)
        ? data.registrationCount
        : 0,
    customTabs: mapCustomTabs(data.customTabs),
    views: typeof data.views === 'number' ? data.views : 0,
    targetAudience:
      typeof data.targetAudience === 'string' &&
        ['students', 'schools', 'both'].includes(data.targetAudience)
        ? (data.targetAudience as 'students' | 'schools' | 'both')
        : undefined,
    participationType:
      typeof data.participationType === 'string' &&
        ['individual', 'team'].includes(data.participationType)
        ? (data.participationType as 'individual' | 'team')
        : undefined,
    minTeamSize: toNumber(data.minTeamSize),
    maxTeamSize: toNumber(data.maxTeamSize),
  };
};

interface ListOptions {
  segment?: string;
  limit?: number;
  search?: string;
  category?: string;
}

type NormalizedListOptions = {
  segment?: string;
  limit: number;
  search?: string;
  category?: string;
};

const normalizeString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
};

const normalizeOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeLimit = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }
  return 24;
};

const normalizeListOptions = (options: ListOptions = {}): NormalizedListOptions => ({
  segment: normalizeOptionalString(options.segment),
  limit: normalizeLimit(options.limit),
  search: normalizeOptionalString(options.search),
  category: normalizeOptionalString(options.category),
});

const buildOpportunitiesCacheKey = (options: NormalizedListOptions) =>
  JSON.stringify([
    options.segment ?? '',
    options.limit,
    options.search ?? '',
    options.category ?? '',
  ]);

const slugify = (value: unknown): string => {
  const normalized = normalizeString(value);
  if (!normalized) {
    return '';
  }
  return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const isActiveStatus = (status: unknown): boolean => {
  if (typeof status !== 'string') {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized === 'approved' || normalized === 'published';
};

const matchesCategoryData = (data: DocumentData, targets: Set<string>): boolean => {
  const candidates = [
    normalizeString(data.category),
    normalizeString(data.categoryName ?? data.category_name),
    normalizeString(data.categoryLabel ?? data.category_label),
    normalizeString(data.categoryId ?? data.category_id),
    slugify(data.category),
    slugify(data.categoryName ?? data.category_name),
  ].filter(Boolean);

  return candidates.some((value) => targets.has(value));
};

const asNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const fetchDocsByIds = async (
  db: Firestore,
  collectionName: string,
  ids: Set<string>,
): Promise<DocumentSnapshot<DocumentData>[]> => {
  if (ids.size === 0) {
    return [];
  }

  const refs = Array.from(ids, (id) => db.collection(collectionName).doc(id));
  return db.getAll(...refs);
};

const enrichOpportunitiesWithLookups = async (
  db: Firestore,
  opportunities: Opportunity[],
): Promise<void> => {
  if (opportunities.length === 0) {
    return;
  }

  const categoryIds = new Set<string>();
  const organizerIds = new Set<string>();

  for (const opportunity of opportunities) {
    if (opportunity.categoryId) {
      categoryIds.add(opportunity.categoryId);
    }
    if (opportunity.organizerId) {
      organizerIds.add(opportunity.organizerId);
    }
  }

  if (categoryIds.size === 0 && organizerIds.size === 0) {
    return;
  }

  const [categoryDocs, organizerDocs] = await Promise.all([
    fetchDocsByIds(db, 'opportunityCategories', categoryIds),
    fetchDocsByIds(db, 'organizers', organizerIds),
  ]);

  const categoryMap = new Map<string, DocumentData>();
  for (const doc of categoryDocs) {
    if (doc.exists) {
      categoryMap.set(doc.id, doc.data() ?? {});
    }
  }

  const organizerMap = new Map<string, DocumentData>();
  for (const doc of organizerDocs) {
    if (doc.exists) {
      organizerMap.set(doc.id, doc.data() ?? {});
    }
  }

  for (const opportunity of opportunities) {
    if (opportunity.categoryId && categoryMap.has(opportunity.categoryId)) {
      const categoryData = categoryMap.get(opportunity.categoryId);
      const categoryName = asNonEmptyString(categoryData?.name);
      if (categoryName) {
        opportunity.category = categoryName;
        opportunity.categoryName = categoryName;
      } else if (!opportunity.category && !opportunity.categoryName) {
        opportunity.category = 'Unknown Category';
        opportunity.categoryName = 'Unknown Category';
      }
    }

    if (opportunity.organizerId && organizerMap.has(opportunity.organizerId)) {
      const organizerData = organizerMap.get(opportunity.organizerId);
      const organizerName = asNonEmptyString(organizerData?.name);
      if (organizerName) {
        opportunity.organizer = organizerName;
        opportunity.organizerName = organizerName;
      } else if (!opportunity.organizer && !opportunity.organizerName) {
        opportunity.organizer = 'Unknown Organizer';
        opportunity.organizerName = 'Unknown Organizer';
      }

      const organizerLogo =
        asNonEmptyString(organizerData?.logo) ??
        asNonEmptyString(organizerData?.logoUrl) ??
        asNonEmptyString(organizerData?.logoURL);

      if (!opportunity.organizerLogo && organizerLogo) {
        opportunity.organizerLogo = organizerLogo;
      }
    }
  }
};

const getOpportunitiesInternal = async (
  _cacheKey: string,
  options: NormalizedListOptions,
): Promise<OpportunityListResponse> => {
  const db = getDb();
  const { segment, limit, search, category } = options;

  const collection = db.collection(COLLECTION);
  const maxFetch = Math.max(limit * 4, 40);

  const docsMap = new Map<string, QueryDocumentSnapshot>();
  const activeStatuses: Array<'approved' | 'published'> = ['approved', 'published'];

  const appendDocs = (
    snapshots: QueryDocumentSnapshot[],
    predicate?: (data: DocumentData) => boolean,
  ) => {
    snapshots.forEach((doc) => {
      const data = doc.data();
      if (!isActiveStatus(data.status)) {
        return;
      }
      if (predicate && !predicate(data)) {
        return;
      }
      if (!docsMap.has(doc.id)) {
        docsMap.set(doc.id, doc);
      }
    });
  };

  if (segment) {
    try {
      const segmentSnapshot = await collection
        .where('segments', 'array-contains', segment)
        .limit(maxFetch)
        .get();
      appendDocs(segmentSnapshot.docs as QueryDocumentSnapshot[]);
    } catch (error) {
      console.error(`Failed to fetch opportunities for segment "${segment}"`, error);
    }
  } else if (category) {
    const rawCategory = category.trim();
    const normalizedCategory = normalizeString(rawCategory);
    const slugCategory = slugify(rawCategory);
    const spacedCategory = normalizeString(rawCategory.replace(/-/g, ' '));

    const targetValues = new Set<string>(
      [normalizedCategory, slugCategory, spacedCategory].filter(Boolean),
    );

    const titleCase = rawCategory
      .split(/[\s-_]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    if (titleCase) {
      targetValues.add(normalizeString(titleCase));
      targetValues.add(slugify(titleCase));
    }

    const categoryPredicate = (data: DocumentData) =>
      matchesCategoryData(data, targetValues);

    const candidateFields: Array<{ field: string; value: string }> = [];

    [rawCategory, titleCase, rawCategory.replace(/-/g, ' ')].forEach((value) => {
      const trimmed = value.trim();
      if (trimmed) {
        candidateFields.push({ field: 'category', value: trimmed });
        candidateFields.push({ field: 'categoryName', value: trimmed });
      }
    });

    candidateFields.push({ field: 'categoryId', value: rawCategory });

    for (const candidate of candidateFields) {
      try {
        const snapshot = await collection.where(candidate.field, '==', candidate.value).limit(maxFetch).get();
        appendDocs(snapshot.docs as QueryDocumentSnapshot[], categoryPredicate);
        if (docsMap.size >= limit * 2) {
          break;
        }
      } catch (error) {
        console.warn(
          `Failed to query opportunities by ${candidate.field}=\"${candidate.value}\"`,
          error,
        );
      }
    }

    if (docsMap.size < limit) {
      for (const status of activeStatuses) {
        if (docsMap.size >= limit * 2) {
          break;
        }
        try {
          const snapshot = await collection.where('status', '==', status).limit(maxFetch).get();
          appendDocs(snapshot.docs as QueryDocumentSnapshot[], categoryPredicate);
        } catch (error) {
          console.error(
            `Failed to load fallback ${status} opportunities for category filter`,
            error,
          );
        }
      }
    }
  } else {
    for (const status of activeStatuses) {
      if (docsMap.size >= limit) {
        break;
      }
      try {
        const snapshot = await collection.where('status', '==', status).limit(limit).get();
        appendDocs(snapshot.docs as QueryDocumentSnapshot[]);
      } catch (error) {
        console.error(`Failed to load ${status} opportunities`, error);
      }
    }
  }

  const docs = Array.from(docsMap.values()).slice(0, Math.max(limit, 0));

  const opportunities = docs.map((doc) => mapOpportunity(doc));
  await enrichOpportunitiesWithLookups(db, opportunities);

  let filteredOpportunities = opportunities;
  if (search) {
    const needle = search.toLowerCase();
    filteredOpportunities = opportunities.filter((opportunity) => {
      const pool = [
        opportunity.title,
        opportunity.organizer,
        opportunity.category,
        ...(opportunity.searchKeywords ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return pool.includes(needle);
    });
  }

  const segments: Record<string, Opportunity[]> = {};

  const opportunitiesToSegment = segment
    ? filteredOpportunities.filter((op) => op.segments?.includes(segment))
    : filteredOpportunities;

  opportunitiesToSegment.forEach((opportunity) => {
    opportunity.segments?.forEach((tag) => {
      if (!segments[tag]) {
        segments[tag] = [];
      }
      segments[tag].push(opportunity);
    });
  });

  if (segment) {
    return {
      opportunities: opportunitiesToSegment,
      segments,
    };
  }

  return { opportunities: filteredOpportunities, segments };
};

const cachedGetOpportunities = cache(getOpportunitiesInternal, ['get-opportunities'], {
  revalidate: 3600,
  tags: ['opportunities'],
});

export const getOpportunities = async (
  options: ListOptions = {},
): Promise<OpportunityListResponse> => {
  const normalized = normalizeListOptions(options);
  const cacheKey = buildOpportunitiesCacheKey(normalized);
  return cachedGetOpportunities(cacheKey, normalized);
};

export const getOpportunityByIdOrSlug = cache(
  async (idOrSlug: string): Promise<Opportunity | null> => {
    const db = getDb();

    const docRef = db.collection(COLLECTION).doc(idOrSlug);
    const doc = await docRef.get();

    let opportunityDoc = doc;
    if (!doc.exists) {
      const slugQuery = await db.collection(COLLECTION).where('slug', '==', idOrSlug).limit(1).get();
      if (slugQuery.empty) {
        return null;
      }
      opportunityDoc = slugQuery.docs[0];
    }

    const opportunity = mapOpportunity(opportunityDoc as QueryDocumentSnapshot);
    await enrichOpportunitiesWithLookups(db, [opportunity]);

    return opportunity;
  },

  ['get-opportunity-v2'],
  {
    revalidate: 3600,
    tags: ['opportunities'],
  },
);

export const getOpportunitiesByIds = async (ids: string[]): Promise<Opportunity[]> => {
  const uniqueIds = Array.from(new Set(ids.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)));
  if (uniqueIds.length === 0) {
    return [];
  }

  const db = getDb();
  const snapshots = await Promise.all(uniqueIds.map((id) => db.collection(COLLECTION).doc(id).get()));

  const opportunities: Opportunity[] = [];
  snapshots.forEach((doc) => {
    if (doc.exists) {
      opportunities.push(mapOpportunity(doc as QueryDocumentSnapshot));
    }
  });

  await enrichOpportunitiesWithLookups(db, opportunities);

  return opportunities;
};
