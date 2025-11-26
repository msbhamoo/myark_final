import { INDIAN_STATES_SET } from '@/constants/india';
import { TimelineItem, ExamSection, OpportunityFormState } from './types';
import { Organizer } from '@/types/masters';

export const formatDate = (value: string | null | undefined) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const joinLines = (values: string[]) => values.join('\n');

export const timelineToText = (timeline: TimelineItem[]) =>
  timeline
    .map((item) => `${item.date ?? ''}|${item.event}|${item.status}`)
    .join('\n');

export const textToTimeline = (text: string): TimelineItem[] =>
  splitLines(text).map((line) => {
    const [date = '', event = '', status = 'upcoming'] = line.split('|').map((token) => token.trim());
    return {
      date: date || null,
      event,
      status: status || 'upcoming',
    };
  });

export const sectionsToText = (sections: ExamSection[]) =>
  sections
    .map((section) => `${section.name}|${section.questions ?? ''}|${section.marks ?? ''}`)
    .join('\n');

export const textToSections = (text: string): ExamSection[] =>
  splitLines(text).map((line) => {
    const [name = '', questions = '', marks = ''] = line.split('|').map((token) => token.trim());
    const parsedQuestions = Number.parseInt(questions, 10);
    const parsedMarks = Number.parseInt(marks, 10);
    return {
      name,
      questions: Number.isFinite(parsedQuestions) ? parsedQuestions : null,
      marks: Number.isFinite(parsedMarks) ? parsedMarks : null,
    };
  });

export const toNumberOrNull = (value: string) => {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const isValidState = (value: string): value is OpportunityFormState['state'] => {
  return INDIAN_STATES_SET.has(value as any) || value === '';
};

export const normalizeOrganizer = (entry: Record<string, unknown>): Organizer => {
  const id = typeof entry.id === 'string' ? entry.id : '';
  const name = typeof entry.name === 'string' ? entry.name : '';
  const logoUrl = typeof entry.logoUrl === 'string' ? entry.logoUrl : '';
  const contactEmail = typeof entry.contactEmail === 'string' ? entry.contactEmail : '';
  const contactPhone = typeof entry.contactPhone === 'string' ? entry.contactPhone : '';
  const contactWebsite = typeof entry.contactWebsite === 'string' ? entry.contactWebsite : '';
  const visibility =
    entry.visibility === 'public' || entry.visibility === 'private'
      ? entry.visibility
      : 'public';
  const isVerified = Boolean(entry.isVerified);

  return {
    id,
    name,
    logoUrl,
    contactEmail,
    contactPhone,
    contactWebsite,
    visibility,
    isVerified,
    // Add other required fields with defaults if missing
    type: 'other',
    description: '',
    opportunityTypeIds: [],
    country: '',
    state: '',
    city: '',
    address: '',
    website: '',
    contactUrl: '',
    schoolLogoUrl: '',
    foundationYear: null,
  };
};

export const defaultForm: OpportunityFormState = {
  title: '',
  categoryId: '',
  organizerId: '',
  organizerLogo: '',
  gradeEligibility: '',
  eligibilityType: 'grade', // Default to grade-based
  ageEligibility: '',
  mode: 'online',
  state: '',
  status: 'draft',
  fee: '',
  currency: 'INR',
  registrationDeadline: '',
  registrationDeadlineTBD: false,
  startDate: '',
  startDateTBD: false,
  endDate: '',
  endDateTBD: false,
  selectedSegments: [],
  image: '',
  description: '',
  eligibilityText: '',
  benefitsText: '',
  registrationProcessText: '',
  timelineText: '',
  examPatterns: [
    {
      id: 'default',
      classSelection: { type: 'single', selectedClasses: [] },
      totalQuestions: '',
      durationMinutes: '',
      negativeMarking: false,
      negativeMarksPerQuestion: '',
      sectionsText: '',
    },
  ],
  contactEmail: '',
  contactPhone: '',
  contactWebsite: '',
  registrationMode: 'internal',
  applicationUrl: '',
  customTabs: [],
};
