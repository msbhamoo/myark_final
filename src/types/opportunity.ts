export type OpportunityMode = 'online' | 'offline' | 'hybrid';
export type OpportunityRegistrationMode = 'external' | 'internal';

export type OpportunityTimelineStatus = 'completed' | 'active' | 'upcoming';

export interface OpportunityTimelineEvent {
  date: string;
  event: string;
  status: OpportunityTimelineStatus;
}

export interface OpportunityRegistrationRecord {
  studentUid: string;
  studentName: string;
  studentEmail: string | null;
  className: string | null;
  schoolName: string | null;
  profileSlug: string | null;
  registeredAt: string;
}

export interface OpportunityExamSection {
  name: string;
  questions?: number | null;
  marks?: number | null;
}

export interface OpportunityExamPattern {
  totalQuestions?: number;
  durationMinutes?: number;
  negativeMarking?: boolean;
  negativeMarksPerQuestion?: number;
  sections?: OpportunityExamSection[];
}

export interface OpportunityContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

export type OpportunityResourceType = 'pdf' | 'video' | 'link';

export interface OpportunityResource {
  id: string;
  title: string;
  url: string;
  type: OpportunityResourceType;
  description?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  slug?: string;
  category: string;
  categoryId?: string;
  categoryName?: string;
  organizer: string;
  organizerId?: string;
  organizerName?: string;
  organizerLogo?: string;
  gradeEligibility: string;
  mode: OpportunityMode;
  state?: string;
  status?: string;
  savedAt?: string | null;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  fee?: string;
  currency?: string;
  image?: string;
  description?: string;
  eligibility?: string[];
  benefits?: string[];
  timeline?: OpportunityTimelineEvent[];
  registrationProcess?: string[];
  examPattern?: OpportunityExamPattern;
  contactInfo?: OpportunityContactInfo;
  resources?: OpportunityResource[];
  segments?: string[];
  searchKeywords?: string[];
  applicationUrl?: string;
  registrationMode?: OpportunityRegistrationMode;
  registrationCount?: number;
}

export interface OpportunityListResponse {
  opportunities: Opportunity[];
  segments: Record<string, Opportunity[]>;
}

export interface OpportunityRegistrationList {
  items: OpportunityRegistrationRecord[];
  total: number;
  registrationMode: OpportunityRegistrationMode;
  registrationCount: number;
}
