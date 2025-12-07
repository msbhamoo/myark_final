import { ParsedOrganizer, ValidationResult, ValidationError } from '../types';
import { OpportunityCategory } from '@/types/masters';

interface ValidationContext {
    categories: OpportunityCategory[];
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        // Allow URLs without protocol
        if (url.includes('.') && !url.includes(' ')) {
            return true;
        }
        return false;
    }
}

function validatePhone(phone: string): boolean {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    return phoneRegex.test(phone);
}

export async function validateOrganizers(
    organizers: ParsedOrganizer[],
    context: ValidationContext
): Promise<ValidationResult[]> {
    return organizers.map((organizer) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationError[] = [];
        const autoCorrections: string[] = [];

        // Required: Name
        if (!organizer.name || organizer.name.trim().length === 0) {
            errors.push({
                field: 'name',
                message: 'Name is required',
                severity: 'error',
            });
        } else if (organizer.name.length < 2) {
            errors.push({
                field: 'name',
                message: 'Name must be at least 2 characters',
                severity: 'error',
                value: organizer.name,
            });
        }

        // Optional: Website validation
        if (organizer.website && !validateUrl(organizer.website)) {
            warnings.push({
                field: 'website',
                message: 'Website URL format may be invalid',
                severity: 'warning',
                value: organizer.website,
            });
        }

        // Optional: Contact Email validation
        if (organizer.contactEmail && !validateEmail(organizer.contactEmail)) {
            errors.push({
                field: 'contactEmail',
                message: 'Invalid email format',
                severity: 'error',
                value: organizer.contactEmail,
            });
        }

        // Optional: Contact Phone validation
        if (organizer.contactPhone && !validatePhone(organizer.contactPhone)) {
            warnings.push({
                field: 'contactPhone',
                message: 'Phone format may be invalid',
                severity: 'warning',
                value: organizer.contactPhone,
            });
        }

        // Optional: Contact URL validation
        if (organizer.contactUrl && !validateUrl(organizer.contactUrl)) {
            warnings.push({
                field: 'contactUrl',
                message: 'Contact URL format may be invalid',
                severity: 'warning',
                value: organizer.contactUrl,
            });
        }

        // Optional: Logo URL validation
        if (organizer.logoUrl && !validateUrl(organizer.logoUrl)) {
            warnings.push({
                field: 'logoUrl',
                message: 'Logo URL format may be invalid',
                severity: 'warning',
                value: organizer.logoUrl,
            });
        }

        // Type validation - auto-correct to 'other' if invalid
        const validTypes = ['government', 'private', 'ngo', 'international', 'other'];
        if (organizer.type && !validTypes.includes(organizer.type)) {
            organizer.type = 'other';
            autoCorrections.push(`Type corrected to 'other'`);
        }

        // Map opportunity types to IDs
        if (organizer.opportunityTypes && context.categories.length > 0) {
            const typeNames = organizer.opportunityTypes.split(',').map(t => t.trim().toLowerCase());
            const matchedIds: string[] = [];

            typeNames.forEach(typeName => {
                const match = context.categories.find(cat =>
                    cat.name.toLowerCase() === typeName ||
                    cat.name.toLowerCase().includes(typeName) ||
                    typeName.includes(cat.name.toLowerCase())
                );
                if (match) {
                    matchedIds.push(match.id);
                }
            });

            organizer.opportunityTypeIds = matchedIds;

            if (matchedIds.length < typeNames.length) {
                warnings.push({
                    field: 'opportunityTypes',
                    message: `Some opportunity types could not be matched: ${organizer.opportunityTypes}`,
                    severity: 'warning',
                    value: organizer.opportunityTypes,
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            autoCorrections,
        };
    });
}
