export type OpportunityMode = 'online' | 'offline' | 'hybrid';
export type OpportunityRegistrationMode = 'external' | 'internal';

export type OpportunityTimelineStatus = 'completed' | 'active' | 'upcoming';

export interface OpportunityTimelineEvent {
  date: string;
  event: string;
  title?: string; // Alias for event if needed, or separate title
  description?: string;
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
  durationMinutes?: number;
}

export interface OpportunityExamPattern {
  name?: string;
  totalQuestions?: number;
  totalMarks?: number;
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

export type OpportunityResourceType = 'pdf' | 'video' | 'link' | 'official';

export interface OpportunityResource {
  id: string;
  title: string;
  url: string;
  type: OpportunityResourceType;
  description?: string;
}

export type ClassSelectionType = 'single' | 'multiple' | 'range';

export interface ClassSelection {
  type: ClassSelectionType;
  selectedClasses: string[];
  rangeStart?: string;
  rangeEnd?: string;
}

export interface OpportunityExamPatternBlock extends OpportunityExamPattern {
  id: string;
  classSelection: ClassSelection;
}

// Import CustomTab type
import type { CustomTab } from './customTab';

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

  // Eligibility - flexible support for grade and/or age
  gradeEligibility: string; // Legacy field - kept for backward compatibility
  eligibilityType?: 'grade' | 'age' | 'both'; // New: specifies what type of eligibility
  ageEligibility?: string; // New: e.g., "14-18 years", "Under 21"

  // Audience & Participation
  targetAudience?: 'students' | 'schools' | 'both';
  participationType?: 'individual' | 'team';
  minTeamSize?: number;
  maxTeamSize?: number;

  mode: OpportunityMode;
  state?: string;
  status?: string;
  savedAt?: string | null;

  // Dates - now support TBD (To Be Decided) status
  startDate?: string;
  startDateTBD?: boolean; // New: true if start date is TBD
  endDate?: string;
  endDateTBD?: boolean; // New: true if end date is TBD
  registrationDeadline?: string;
  registrationDeadlineTBD?: boolean; // New: true if registration deadline is TBD

  fee?: string;
  currency?: string;
  image?: string;
  description?: string;
  eligibility?: string[];
  benefits?: string[];
  timeline?: OpportunityTimelineEvent[];
  registrationProcess?: string[];
  examPattern?: OpportunityExamPattern;
  examPatterns?: OpportunityExamPatternBlock[];
  contactInfo?: OpportunityContactInfo;
  resources?: OpportunityResource[];
  segments?: string[];
  searchKeywords?: string[];
  applicationUrl?: string;
  registrationMode?: OpportunityRegistrationMode;
  registrationCount?: number;
  customTabs?: CustomTab[];
  views?: number;
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
