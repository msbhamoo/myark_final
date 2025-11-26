import { OpportunityCategory, Organizer } from '@/types/masters';
import { OpportunityResource } from '@/types/opportunity';
import { CustomTab } from '@/types/customTab';

export type TimelineItem = {
    date: string | null;
    event: string;
    status: string;
};

export type ExamSection = {
    name: string;
    questions: number | null;
    marks: number | null;
};

export type ExamPattern = {
    totalQuestions: number | null;
    durationMinutes: number | null;
    negativeMarking: boolean;
    negativeMarksPerQuestion: number | null;
    sections: ExamSection[];
};

export type ClassSelection = {
    type: 'single' | 'multiple' | 'range';
    selectedClasses: string[];
    rangeStart?: string;
    rangeEnd?: string;
};

export type ExamPatternBlock = ExamPattern & {
    id: string;
    classSelection: ClassSelection;
};

export type HomeSegmentOption = {
    id: string | null;
    segmentKey: string;
    title: string;
    isVisible: boolean;
    order: number;
};

export type OpportunityItem = {
    id: string;
    title: string;
    categoryId: string;
    categoryName?: string;
    organizerId: string;
    organizerName?: string;
    category?: {
        id: string;
        name: string;
    };
    organizer?: {
        id: string;
        name: string;
    };
    organizerLogo: string;
    gradeEligibility: string;
    eligibilityType?: 'grade' | 'age' | 'both';
    ageEligibility?: string;
    targetAudience?: 'students' | 'schools' | 'both';
    participationType?: 'individual' | 'team';
    minTeamSize?: number | null;
    maxTeamSize?: number | null;
    mode: string;
    state?: string;
    status: string;
    fee: string;
    currency: string;
    registrationDeadline: string | null;
    registrationDeadlineTBD?: boolean;
    startDate: string | null;
    startDateTBD?: boolean;
    endDate: string | null;
    endDateTBD?: boolean;
    segments: string[];
    image: string;
    description: string;
    eligibility: string[];
    benefits: string[];
    registrationProcess: string[];
    timeline: TimelineItem[];
    examPattern: ExamPattern; // Legacy support
    examPatterns?: ExamPatternBlock[]; // New support
    contactInfo: {
        email: string;
        phone: string;
        website: string;
    };
    resources: OpportunityResource[];
    source?: string;
    submittedBy?: string | null;
    approval?: {
        status?: string;
        reviewedAt?: string | null;
        reviewedBy?: string | null;
    } | null;
    registrationMode?: 'internal' | 'external';
    applicationUrl?: string;
    registrationCount?: number;
    externalRegistrationClickCount?: number;
    customTabs?: CustomTab[];
};

export type OpportunityFormState = {
    title: string;
    categoryId: string;
    organizerId: string;
    organizerLogo: string;
    gradeEligibility: string;
    eligibilityType: 'grade' | 'age' | 'both';
    ageEligibility: string;
    targetAudience: 'students' | 'schools' | 'both';
    participationType: 'individual' | 'team';
    minTeamSize: string;
    maxTeamSize: string;
    customTabs: CustomTab[];
    mode: string;
    state: '' | 'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar' | 'Chhattisgarh' | 'Goa' | 'Gujarat' | 'Haryana' | 'Himachal Pradesh' | 'Jharkhand' | 'Karnataka' | 'Kerala' | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab' | 'Rajasthan' | 'Sikkim' | 'Tamil Nadu' | 'Telangana' | 'Tripura' | 'Uttar Pradesh' | 'Uttarakhand' | 'West Bengal' | 'Andaman and Nicobar Islands' | 'Chandigarh' | 'Dadra and Nagar Haveli and Daman and Diu' | 'Lakshadweep' | 'Delhi' | 'Puducherry';
    status: string;
    fee: string;
    currency: string;
    registrationDeadline: string;
    registrationDeadlineTBD: boolean;
    startDate: string;
    startDateTBD: boolean;
    endDate: string;
    endDateTBD: boolean;
    selectedSegments: string[];
    image: string;
    description: string;
    eligibilityText: string;
    benefitsText: string;
    registrationProcessText: string;
    timelineText: string;
    examPatterns: {
        id: string;
        classSelection: ClassSelection;
        totalQuestions: string;
        durationMinutes: string;
        negativeMarking: boolean;
        negativeMarksPerQuestion: string;
        sectionsText: string;
    }[];
    contactEmail: string;
    contactPhone: string;
    contactWebsite: string;
    registrationMode: 'internal' | 'external';
    applicationUrl: string;
};

export type ResourceDraft = {
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'official';
    description: string;
};
