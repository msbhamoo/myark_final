import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FALLBACK_HOME_SEGMENTS } from '@/constants/homeSegments';
import { INDIAN_STATES_SET } from '@/constants/india';
import type { BulkEntity } from '@/types/bulk';
import { stringifyCsv, parseCsvWithHeaders } from './csv';

const MAX_IMPORT_ROWS = 500;

const allowedOpportunityModes = new Set(['online', 'offline', 'hybrid']);
const allowedOpportunityStatuses = new Set(['draft', 'approved', 'published']);
const allowedOrganizerTypes = new Set(['government', 'private', 'other']);
const allowedVisibility = new Set(['public', 'private']);

const templateDefinitions: Record<
  BulkEntity,
  {
    headers: string[];
    sample: string[];
  }
> = {
  opportunities: {
    headers: [
      'id',
      'title',
      'organizerId',
      'organizerName',
      'organizerLogo',
      'categoryId',
      'categoryName',
      'mode',
      'status',
      'gradeEligibility',
      'registrationDeadline',
      'startDate',
      'endDate',
      'fee',
      'state',
      'currency',
      'segments',
      'description',
      'eligibility',
      'benefits',
      'registrationProcess',
      'image',
      'contactEmail',
      'contactPhone',
      'contactWebsite',
    ],
    sample: [
      '',
      'National Science Olympiad',
      '',
      'Science Foundation',
      'https://example.org/logo.png',
      '',
      'Science & STEM',
      'online',
      'published',
      'Grades 6-10',
      '2025-01-15',
      '2025-02-01',
      '2025-02-05',
      '50',
      'Karnataka',
      'INR',
      'featured;scholarships',
      'Explore science concepts and compete nationwide.',
      'Grade 6;Grade 7;Grade 8',
      'Cash awards;Certificates',
      'Register online;Prepare documents',
      'https://example.org/hero.png',
      'contact@example.org',
      '+1-555-1234',
      'https://example.org',
    ],
  },
  schools: {
    headers: ['id', 'name', 'city', 'state', 'country', 'isVerified'],
    sample: ['', 'Springfield High School', 'Springfield', 'Illinois', 'USA', 'true'],
  },
  organizers: {
    headers: [
      'id',
      'name',
      'address',
      'website',
      'foundationYear',
      'type',
      'visibility',
      'isVerified',
    ],
    sample: ['', 'STEM Foundation', '123 Main Street, Springfield', 'https://stem.org', '2001', 'private', 'public', 'true'],
  },
};

export const createTemplateCsv = (entity: BulkEntity): string => {
  const definition = templateDefinitions[entity];
  return stringifyCsv(definition.headers, [definition.sample]);
};

export interface ParsedCsvRow {
  index: number;
  raw: Record<string, string>;
}

export interface ParsedCsvResult {
  headers: string[];
  rows: ParsedCsvRow[];
}

export const parseCsvToRecords = (text: string): ParsedCsvResult => {
  const { headers, records } = parseCsvWithHeaders(text);
  const trimmedHeaders = headers.map((header) => header.trim());
  const rows: ParsedCsvRow[] = records.map(({ index, row }) => {
    const expandedRow =
      row.length < trimmedHeaders.length
        ? [...row, ...Array(trimmedHeaders.length - row.length).fill('')]
        : row.slice(0, trimmedHeaders.length);
    const raw: Record<string, string> = {};
    trimmedHeaders.forEach((header, idx) => {
      raw[header] = (expandedRow[idx] ?? '').trim();
    });
    return { index, raw };
  });

  const filteredRows = rows.filter((entry) =>
    Object.values(entry.raw).some((value) => value.trim().length > 0),
  );

  return {
    headers: trimmedHeaders,
    rows: filteredRows,
  };
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
};

const parseNumber = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
};

const splitList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }
  return value
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const normalizeDateString = (value: string | undefined, errors: string[], fieldName: string): string | null => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${fieldName} must be a valid date (use YYYY-MM-DD).`);
    return null;
  }
  return trimmed;
};

const normalizeEmail = (value: string | undefined, errors: string[], fieldName: string): string | null => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (!trimmed.includes('@')) {
    errors.push(`${fieldName} appears to be invalid.`);
  }
  return trimmed;
};

type OpportunityValidationContext = {
  segmentMap: Map<string, string>;
};

const buildOpportunityValidationContext = async (db: Firestore): Promise<OpportunityValidationContext> => {
  const segmentMap = new Map<string, string>();

  FALLBACK_HOME_SEGMENTS.forEach((segment) => {
    const key = segment.segmentKey.trim();
    if (key) {
      segmentMap.set(key.toLowerCase(), key);
    }
  });

  try {
    const snapshot = await db.collection('homeSegments').get();
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      const rawKey = typeof data.segmentKey === 'string' ? data.segmentKey.trim() : '';
      if (rawKey) {
        segmentMap.set(rawKey.toLowerCase(), rawKey);
      }
    });
  } catch (error) {
    console.warn('Failed to load home segment definitions for bulk upload validation', error);
  }

  return { segmentMap };
};

export interface OpportunityImportRecord {
  id?: string;
  title: string;
  organizerId?: string;
  organizerName?: string;
  organizerLogo?: string;
  categoryId?: string;
  categoryName?: string;
  mode: 'online' | 'offline' | 'hybrid';
  status: 'draft' | 'approved' | 'published';
  gradeEligibility?: string;
  registrationDeadline?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  fee?: string;
  currency?: string;
  segments: string[];
  description?: string;
  eligibility: string[];
  benefits: string[];
  registrationProcess: string[];
  image?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
}

export interface SchoolImportRecord {
  id?: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  isVerified: boolean;
}

export interface OrganizerImportRecord {
  id?: string;
  name: string;
  address?: string;
  website?: string;
  foundationYear?: number | null;
  type: 'government' | 'private' | 'other';
  visibility: 'public' | 'private';
  isVerified: boolean;
}

type ImportRecordMap = {
  opportunities: OpportunityImportRecord;
  schools: SchoolImportRecord;
  organizers: OrganizerImportRecord;
};

type ValidationContextMap = {
  opportunities: OpportunityValidationContext;
  schools: undefined;
  organizers: undefined;
};

type ValidationResult<T> = {
  data: T;
  errors: string[];
};

const sanitizeId = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toOptionalString = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const validateOpportunityRow = (
  raw: Record<string, string>,
  context: OpportunityValidationContext,
): ValidationResult<OpportunityImportRecord> => {
  const errors: string[] = [];

  const title = (raw.title ?? '').trim();
  if (!title) {
    errors.push('Title is required.');
  }

  const modeRaw = (raw.mode ?? '').trim().toLowerCase();
  const mode = modeRaw ? modeRaw : 'online';
  if (!allowedOpportunityModes.has(mode)) {
    errors.push('Mode must be one of: online, offline, hybrid.');
  }

  const statusRaw = (raw.status ?? '').trim().toLowerCase();
  const status = statusRaw ? statusRaw : 'draft';
  if (!allowedOpportunityStatuses.has(status)) {
    errors.push('Status must be one of: draft, approved, published.');
  }

  const registrationDeadline = normalizeDateString(raw.registrationDeadline, errors, 'Registration deadline');
  const startDate = normalizeDateString(raw.startDate, errors, 'Start date');
  const endDate = normalizeDateString(raw.endDate, errors, 'End date');

  const segmentValues = splitList(raw.segments);
  const segments: string[] = [];
  const seenSegments = new Set<string>();
  segmentValues.forEach((segment) => {
    const canonical = context.segmentMap.get(segment.toLowerCase());
    if (!canonical) {
      errors.push(`Segment "${segment}" is not recognised. Update the home layout first if this is a new segment.`);
      return;
    }
    if (!seenSegments.has(canonical)) {
      seenSegments.add(canonical);
      segments.push(canonical);
    }
  });

  const eligibility = splitList(raw.eligibility);
  const benefits = splitList(raw.benefits);
  const registrationProcess = splitList(raw.registrationProcess);

  const contactEmail = normalizeEmail(raw.contactEmail, errors, 'Contact email');
  const contactWebsite = toOptionalString(raw.contactWebsite);

  const data: OpportunityImportRecord = {
    id: sanitizeId(raw.id),
    title,
    organizerId: toOptionalString(raw.organizerId),
    organizerName: toOptionalString(raw.organizerName),
    organizerLogo: toOptionalString(raw.organizerLogo),
    categoryId: toOptionalString(raw.categoryId),
    categoryName: toOptionalString(raw.categoryName),
    mode: (allowedOpportunityModes.has(mode) ? mode : 'online') as 'online' | 'offline' | 'hybrid',
    status: (allowedOpportunityStatuses.has(status) ? status : 'draft') as 'draft' | 'approved' | 'published',
    gradeEligibility: toOptionalString(raw.gradeEligibility),
    registrationDeadline,
    startDate,
    endDate,
    fee: toOptionalString(raw.fee),
    currency: toOptionalString(raw.currency)?.toUpperCase(),
    segments,
    description: toOptionalString(raw.description),
    eligibility,
    benefits,
    registrationProcess,
    image: toOptionalString(raw.image),
    contactEmail: contactEmail ?? undefined,
    contactPhone: toOptionalString(raw.contactPhone),
    contactWebsite,
  };

  return { data, errors };
};

const validateSchoolRow = (raw: Record<string, string>): ValidationResult<SchoolImportRecord> => {
  const errors: string[] = [];
  const name = (raw.name ?? '').trim();
  if (!name) {
    errors.push('Name is required.');
  }
  const data: SchoolImportRecord = {
    id: sanitizeId(raw.id),
    name,
    city: toOptionalString(raw.city),
    state: toOptionalString(raw.state),
    country: toOptionalString(raw.country),
    isVerified: parseBoolean(raw.isVerified),
  };
  return { data, errors };
};

const validateOrganizerRow = (raw: Record<string, string>): ValidationResult<OrganizerImportRecord> => {
  const errors: string[] = [];
  const name = (raw.name ?? '').trim();
  if (!name) {
    errors.push('Name is required.');
  }

  const typeRaw = (raw.type ?? '').trim().toLowerCase();
  const type = typeRaw ? typeRaw : 'other';
  if (!allowedOrganizerTypes.has(type)) {
    errors.push('Type must be one of: government, private, other.');
  }

  const visibilityRaw = (raw.visibility ?? '').trim().toLowerCase();
  const visibility = visibilityRaw ? visibilityRaw : 'public';
  if (!allowedVisibility.has(visibility)) {
    errors.push('Visibility must be either public or private.');
  }

  const foundationYearRaw = toOptionalString(raw.foundationYear);
  let foundationYear: number | null = null;
  if (foundationYearRaw) {
    foundationYear = parseNumber(foundationYearRaw);
    if (foundationYear === null) {
      errors.push('Foundation year must be a number.');
    }
  }

  const data: OrganizerImportRecord = {
    id: sanitizeId(raw.id),
    name,
    address: toOptionalString(raw.address),
    website: toOptionalString(raw.website),
    foundationYear,
    type: (allowedOrganizerTypes.has(type) ? type : 'other') as 'government' | 'private' | 'other',
    visibility: (allowedVisibility.has(visibility) ? visibility : 'public') as 'public' | 'private',
    isVerified: parseBoolean(raw.isVerified),
  };

  return { data, errors };
};

export const buildValidationContext = async <T extends BulkEntity>(
  entity: T,
  db: Firestore,
): Promise<ValidationContextMap[T]> => {
  if (entity === 'opportunities') {
    return (await buildOpportunityValidationContext(db)) as ValidationContextMap[T];
  }
  return undefined as ValidationContextMap[T];
};

export const validateImportRow = <T extends BulkEntity>(
  entity: T,
  raw: Record<string, string>,
  context: ValidationContextMap[T],
): ValidationResult<ImportRecordMap[T]> => {
  switch (entity) {
    case 'opportunities':
      return validateOpportunityRow(raw, context as OpportunityValidationContext) as ValidationResult<ImportRecordMap[T]>;
    case 'schools':
      return validateSchoolRow(raw) as ValidationResult<ImportRecordMap[T]>;
    case 'organizers':
      return validateOrganizerRow(raw) as ValidationResult<ImportRecordMap[T]>;
    default:
      throw new Error(`Unsupported bulk entity "${entity}"`);
  }
};

const toDateValue = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const saveOpportunityRecord = async (
  db: Firestore,
  record: OpportunityImportRecord,
): Promise<'created' | 'updated'> => {
  const now = new Date();
  const data = {
    title: record.title,
    categoryId: record.categoryId ?? null,
    categoryName: record.categoryName ?? '',
    category: record.categoryName ?? '',
    organizerId: record.organizerId ?? null,
    organizerName: record.organizerName ?? '',
    organizer: record.organizerName ?? '',
    organizerLogo: record.organizerLogo ?? '',
    gradeEligibility: record.gradeEligibility ?? '',
    mode: record.mode,
    status: record.status,
    fee: record.fee ?? '',
    currency: record.currency ?? '',
    registrationDeadline: toDateValue(record.registrationDeadline),
    startDate: toDateValue(record.startDate),
    endDate: toDateValue(record.endDate),
    segments: record.segments,
    image: record.image ?? '',
    description: record.description ?? '',
    eligibility: record.eligibility,
    benefits: record.benefits,
    registrationProcess: record.registrationProcess,
    timeline: [],
    contactInfo: {
      email: record.contactEmail ?? '',
      phone: record.contactPhone ?? '',
      website: record.contactWebsite ?? '',
    },
    createdAt: now,
    updatedAt: now,
  };

  if (record.id) {
    const docRef = db.collection('opportunities').doc(record.id);
    const existing = await docRef.get();
    const existingData = existing.exists ? existing.data() ?? {} : {};
    const createdAt = existingData.createdAt ?? now;
    await docRef.set(
      {
        ...data,
        createdAt,
      },
      { merge: false },
    );
    return existing.exists ? 'updated' : 'created';
  }

  await db.collection('opportunities').add(data);
  return 'created';
};

const saveSchoolRecord = async (db: Firestore, record: SchoolImportRecord): Promise<'created' | 'updated'> => {
  const now = new Date();
  const data = {
    name: record.name,
    city: record.city ?? '',
    state: (() => {
      const value = record.state?.trim() ?? '';
      return INDIAN_STATES_SET.has(value) ? value : '';
    })(),
    country: record.country ?? '',
    isVerified: record.isVerified,
    createdAt: now,
    updatedAt: now,
  };

  if (record.id) {
    const docRef = db.collection('schools').doc(record.id);
    const existing = await docRef.get();
    const existingData = existing.exists ? existing.data() ?? {} : {};
    const createdAt = existingData.createdAt ?? now;
    await docRef.set(
      {
        ...data,
        createdAt,
      },
      { merge: false },
    );
    return existing.exists ? 'updated' : 'created';
  }

  await db.collection('schools').add(data);
  return 'created';
};

const saveOrganizerRecord = async (
  db: Firestore,
  record: OrganizerImportRecord,
): Promise<'created' | 'updated'> => {
  const now = new Date();
  const data = {
    name: record.name,
    address: record.address ?? '',
    website: record.website ?? '',
    foundationYear: record.foundationYear ?? null,
    type: record.type,
    visibility: record.visibility,
    isVerified: record.isVerified,
    createdAt: now,
    updatedAt: now,
  };

  if (record.id) {
    const docRef = db.collection('organizers').doc(record.id);
    const existing = await docRef.get();
    const existingData = existing.exists ? existing.data() ?? {} : {};
    const createdAt = existingData.createdAt ?? now;
    await docRef.set(
      {
        ...data,
        createdAt,
      },
      { merge: false },
    );
    return existing.exists ? 'updated' : 'created';
  }

  await db.collection('organizers').add(data);
  return 'created';
};

export const persistImportRecord = async <T extends BulkEntity>(
  entity: T,
  db: Firestore,
  record: ImportRecordMap[T],
): Promise<'created' | 'updated'> => {
  switch (entity) {
    case 'opportunities':
      return saveOpportunityRecord(db, record as OpportunityImportRecord);
    case 'schools':
      return saveSchoolRecord(db, record as SchoolImportRecord);
    case 'organizers':
      return saveOrganizerRecord(db, record as OrganizerImportRecord);
    default:
      throw new Error(`Unsupported bulk entity "${entity}"`);
  }
};

export const ensureRowLimit = (rowsCount: number) => {
  if (rowsCount > MAX_IMPORT_ROWS) {
    throw new Error(`The uploaded file contains ${rowsCount} rows. The maximum supported per import is ${MAX_IMPORT_ROWS}. Please split the file and try again.`);
  }
};
