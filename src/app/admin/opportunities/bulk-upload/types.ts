export type BulkUploadStep = 'upload' | 'validation' | 'preview' | 'success';

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    value?: any;
}

export interface ParsedOpportunity {
    tempId: string;
    rowNumber: number;
    rawData: any;

    // Basic fields
    title?: string;
    category?: string;
    organizer?: string;

    // Eligibility
    gradeEligibility?: string;
    eligibilityType?: 'grade' | 'age' | 'both';
    ageEligibility?: string;

    // Mode and location
    mode?: 'online' | 'offline' | 'hybrid';
    state?: string;

    // Dates
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    startDateTBD?: boolean;
    endDateTBD?: boolean;
    registrationDeadlineTBD?: boolean;

    // Fee
    fee?: string;
    currency?: string;

    // Rich content
    description?: string;
    image?: string;
    applicationUrl?: string;

    // Array fields
    eligibility?: string[];
    benefits?: string[];
    registrationProcess?: string[];
    segments?: string[];
    searchKeywords?: string[];

    // Timeline
    timeline?: {
        date: string;
        event: string;
        status: 'completed' | 'active' | 'upcoming';
    }[];

    // Mapped IDs (after validation)
    categoryId?: string;
    categoryName?: string;
    organizerId?: string;
    organizerName?: string;
    organizerLogo?: string;

    // Other fields
    registrationMode?: 'internal' | 'external';
    registrationCount?: number;
    examPattern?: string;
    examPatterns?: any[];
    contactInfo?: any;
    resources?: any[];
    customTabs?: any[];

    // Default status
    status: 'draft' | 'published' | 'archived';
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    autoCorrections: string[];
}

export interface OpportunityWithValidation {
    opportunity: ParsedOpportunity;
    validation: ValidationResult;
}

export interface UploadState {
    currentStep: BulkUploadStep;
    file: File | null;
    fileName: string | null;
    parsedData: ParsedOpportunity[];
    validatedData: OpportunityWithValidation[];
    isProcessing: boolean;
    error: string | null;
    uploadStats: {
        totalRows: number;
        validRows: number;
        invalidRows: number;
        warningRows: number;
    };
}

export interface BulkUploadResult {
    success: boolean;
    createdCount: number;
    errors: { rowNumber: number; error: string }[];
    ids: string[];
}
