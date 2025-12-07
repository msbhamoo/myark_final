export type BulkUploadStep = 'upload' | 'validation' | 'preview' | 'success';

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    value?: any;
}

export interface ParsedOrganizer {
    tempId: string;
    rowNumber: number;
    rawData: any;

    // Required fields
    name?: string;

    // Optional fields
    shortName?: string;
    description?: string;
    website?: string;
    address?: string;
    foundationYear?: number | null;
    type?: 'government' | 'private' | 'ngo' | 'international' | 'other';
    logoUrl?: string;
    contactUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    opportunityTypes?: string; // Comma-separated, will be mapped to IDs

    // Mapped after validation
    opportunityTypeIds?: string[];

    // Default values
    visibility: 'public' | 'private';
    isVerified: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    autoCorrections: string[];
}

export interface OrganizerWithValidation {
    organizer: ParsedOrganizer;
    validation: ValidationResult;
}

export interface UploadState {
    currentStep: BulkUploadStep;
    file: File | null;
    fileName: string | null;
    parsedData: ParsedOrganizer[];
    validatedData: OrganizerWithValidation[];
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
