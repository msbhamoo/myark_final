import { ParsedOpportunity, ValidationResult, ValidationError } from '../types';
import { OpportunityCategory, Organizer } from '@/types/masters';

interface ValidationContext {
    categories: OpportunityCategory[];
    organizers: Organizer[];
}

/**
 * Validate a parsed opportunity
 */
export async function validateOpportunity(
    opportunity: ParsedOpportunity,
    context: ValidationContext
): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const autoCorrections: string[] = [];

    // Required field validations
    validateRequiredField('title', opportunity.title, errors);
    validateRequiredField('category', opportunity.category, errors);
    validateRequiredField('organizer', opportunity.organizer, errors);
    validateRequiredField('gradeEligibility', opportunity.gradeEligibility, errors);
    validateRequiredField('mode', opportunity.mode, errors);

    // Category validation (warning only - can be fixed during manual approval)
    if (opportunity.category) {
        const categoryExists = context.categories.some(
            cat => cat.name?.toLowerCase() === opportunity.category?.toLowerCase()
        );

        if (!categoryExists) {
            warnings.push({
                field: 'category',
                message: `Category "${opportunity.category}" not found in database. Can be added during manual approval.`,
                severity: 'warning',
                value: opportunity.category,
            });
        }
    }

    // Organizer validation (warning only - can be fixed during manual approval)
    if (opportunity.organizer) {
        const organizerExists = context.organizers.some(
            org => org.name?.toLowerCase() === opportunity.organizer?.toLowerCase()
        );

        if (!organizerExists) {
            warnings.push({
                field: 'organizer',
                message: `Organizer "${opportunity.organizer}" not found in database. Can be added during manual approval.`,
                severity: 'warning',
                value: opportunity.organizer,
            });
        }
    }

    // Date validations
    if (opportunity.startDate && opportunity.endDate) {
        const startDate = new Date(opportunity.startDate);
        const endDate = new Date(opportunity.endDate);

        if (endDate < startDate) {
            errors.push({
                field: 'dates',
                message: 'End date cannot be before start date',
                severity: 'error',
            });
        }
    }

    // Registration deadline validation
    if (opportunity.registrationDeadline && opportunity.startDate) {
        const regDeadline = new Date(opportunity.registrationDeadline);
        const startDate = new Date(opportunity.startDate);

        if (regDeadline > startDate) {
            warnings.push({
                field: 'registrationDeadline',
                message: 'Registration deadline is after the start date',
                severity: 'warning',
            });
        }
    }

    // TBD flags validation
    if (opportunity.startDateTBD && opportunity.startDate) {
        warnings.push({
            field: 'startDate',
            message: 'Start date marked as TBD but a date is provided. The TBD flag will be ignored.',
            severity: 'warning',
        });
    }

    if (opportunity.endDateTBD && opportunity.endDate) {
        warnings.push({
            field: 'endDate',
            message: 'End date marked as TBD but a date is provided. The TBD flag will be ignored.',
            severity: 'warning',
        });
    }

    if (opportunity.registrationDeadlineTBD && opportunity.registrationDeadline) {
        warnings.push({
            field: 'registrationDeadline',
            message: 'Registration deadline marked as TBD but a date is provided. The TBD flag will be ignored.',
            severity: 'warning',
        });
    }

    // Timeline validation
    if (opportunity.timeline?.length) {
        opportunity.timeline.forEach((event, index) => {
            if (!event.date) {
                errors.push({
                    field: `timeline[${index}]`,
                    message: `Timeline event "${event.event}" is missing a date`,
                    severity: 'error',
                });
            }
            if (!event.event) {
                errors.push({
                    field: `timeline[${index}]`,
                    message: `Timeline entry ${index + 1} is missing an event description`,
                    severity: 'error',
                });
            }

            // Validate status
            const validStatuses = ['completed', 'active', 'upcoming'];
            if (!validStatuses.includes(event.status)) {
                warnings.push({
                    field: `timeline[${index}]`,
                    message: `Timeline event "${event.event}" has invalid status "${event.status}". Using "upcoming" instead.`,
                    severity: 'warning',
                });
                event.status = 'upcoming';
                autoCorrections.push(`Timeline event "${event.event}" status auto-corrected to "upcoming"`);
            }
        });
    }

    // URL validations
    if (opportunity.applicationUrl && !isValidUrl(opportunity.applicationUrl)) {
        errors.push({
            field: 'applicationUrl',
            message: 'Application URL is not a valid URL',
            severity: 'error',
            value: opportunity.applicationUrl,
        });
    }

    if (opportunity.image && !isValidUrl(opportunity.image)) {
        warnings.push({
            field: 'image',
            message: 'Image URL may not be valid',
            severity: 'warning',
            value: opportunity.image,
        });
    }

    // Mode validation
    const validModes = ['online', 'offline', 'hybrid'];
    if (opportunity.mode && !validModes.includes(opportunity.mode)) {
        errors.push({
            field: 'mode',
            message: `Mode must be one of: ${validModes.join(', ')}`,
            severity: 'error',
            value: opportunity.mode,
        });
    }

    // State validation for offline/hybrid
    if ((opportunity.mode === 'offline' || opportunity.mode === 'hybrid') && !opportunity.state) {
        warnings.push({
            field: 'state',
            message: 'State is recommended for offline/hybrid opportunities',
            severity: 'warning',
        });
    }

    // Eligibility type validation
    if (opportunity.eligibilityType) {
        const validTypes = ['grade', 'age', 'both'];
        if (!validTypes.includes(opportunity.eligibilityType)) {
            errors.push({
                field: 'eligibilityType',
                message: `Eligibility type must be one of: ${validTypes.join(', ')}`,
                severity: 'error',
                value: opportunity.eligibilityType,
            });
        }
    }

    // Check for empty arrays that should have content
    if (opportunity.benefits?.length === 0) {
        warnings.push({
            field: 'benefits',
            message: 'No benefits listed. Consider adding benefits to make the opportunity more appealing.',
            severity: 'info',
        });
    }

    if (opportunity.eligibility?.length === 0) {
        warnings.push({
            field: 'eligibility',
            message: 'No eligibility criteria listed.',
            severity: 'info',
        });
    }

    const isValid = errors.length === 0;

    return {
        isValid,
        errors,
        warnings,
        autoCorrections,
    };
}

/**
 * Validate required field
 */
function validateRequiredField(
    fieldName: string,
    value: any,
    errors: ValidationError[]
): void {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            severity: 'error',
        });
    }
}

/**
 * Check if URL is valid
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Batch validate opportunities
 */
export async function validateOpportunities(
    opportunities: ParsedOpportunity[],
    context: ValidationContext
): Promise<ValidationResult[]> {
    return Promise.all(opportunities.map(opp => validateOpportunity(opp, context)));
}
