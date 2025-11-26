import * as XLSX from 'xlsx';
import { ParsedOpportunity } from '../types';
import { OpportunityTimelineEvent } from '@/types/opportunity';

/**
 * Parse uploaded Excel or CSV file into ParsedOpportunity objects
 */
export async function parseUploadedFile(file: File): Promise<ParsedOpportunity[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                // Get first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON with header row
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false
                });

                if (jsonData.length === 0) {
                    reject(new Error('The uploaded file is empty or has no data rows.'));
                    return;
                }

                const parsedOpportunities: ParsedOpportunity[] = jsonData.map((row: any, index: number) => {
                    const tempId = `temp_${Date.now()}_${index}`;

                    return {
                        tempId,
                        rowNumber: index + 2, // +2 because: +1 for 0-index, +1 for header row
                        rawData: row,

                        // Basic fields
                        title: normalizeString(row.title || row.Title),
                        category: normalizeString(row.category || row.Category),
                        organizer: normalizeString(row.organizer || row.Organizer),

                        // Eligibility
                        gradeEligibility: normalizeString(row.gradeEligibility || row.GradeEligibility || row.grade_eligibility),
                        eligibilityType: normalizeEligibilityType(row.eligibilityType || row.EligibilityType),
                        ageEligibility: normalizeString(row.ageEligibility || row.AgeEligibility),

                        // Mode and location
                        mode: normalizeMode(row.mode || row.Mode),
                        state: normalizeString(row.state || row.State),

                        // Dates
                        startDate: parseDate(row.startDate || row.StartDate || row.start_date),
                        endDate: parseDate(row.endDate || row.EndDate || row.end_date),
                        registrationDeadline: parseDate(row.registrationDeadline || row.RegistrationDeadline || row.registration_deadline),
                        startDateTBD: parseBoolean(row.startDateTBD || row.StartDateTBD),
                        endDateTBD: parseBoolean(row.endDateTBD || row.EndDateTBD),
                        registrationDeadlineTBD: parseBoolean(row.registrationDeadlineTBD || row.RegistrationDeadlineTBD),

                        // Fee
                        fee: normalizeString(row.fee || row.Fee),
                        currency: 'INR',

                        // Rich content
                        description: normalizeString(row.description || row.Description),
                        image: normalizeString(row.image || row.Image || row.imageUrl),
                        applicationUrl: normalizeString(row.applicationUrl || row.ApplicationUrl || row.application_url),

                        // Array fields - parse from delimited strings
                        eligibility: parseArrayField(row.eligibility || row.Eligibility),
                        benefits: parseArrayField(row.benefits || row.Benefits),
                        registrationProcess: parseArrayField(row.registrationProcess || row.RegistrationProcess || row.registration_process),
                        segments: parseArrayField(row.segments || row.Segments),
                        searchKeywords: parseArrayField(row.searchKeywords || row.SearchKeywords || row.search_keywords),

                        // Timeline - special parsing
                        timeline: parseTimeline(row.timeline || row.Timeline),

                        // Default values
                        status: 'draft',
                        registrationMode: 'external',
                        registrationCount: 0,
                    };
                });

                resolve(parsedOpportunities);
            } catch (error) {
                reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsBinaryString(file);
    });
}

/**
 * Normalize string values - trim whitespace
 */
function normalizeString(value: any): string | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    const str = String(value).trim();
    return str.length > 0 ? str : undefined;
}

/**
 * Parse array fields from delimited string (comma, semicolon, pipe)
 */
function parseArrayField(value: any): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.filter(v => v && String(v).trim()).map(v => String(v).trim());
    }

    const str = String(value);
    // Split by comma, semicolon, or pipe
    const delimiters = /[,;|]/;
    return str
        .split(delimiters)
        .map(v => v.trim())
        .filter(v => v.length > 0);
}

/**
 * Parse timeline from string format
 * Expected format: "2025-01-15|Event Name|upcoming; 2025-02-20|Another Event|active"
 * Each timeline entry separated by semicolon, fields within entry separated by pipe
 */
function parseTimeline(value: any): OpportunityTimelineEvent[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    const str = String(value);
    const entries = str.split(';').map(e => e.trim()).filter(e => e.length > 0);

    return entries
        .map(entry => {
            const parts = entry.split('|').map(p => p.trim());
            if (parts.length < 2) return null;

            return {
                date: parts[0] || '',
                event: parts[1] || '',
                status: (parts[2] || 'upcoming') as 'completed' | 'active' | 'upcoming',
            };
        })
        .filter((e): e is OpportunityTimelineEvent => e !== null && !!e.date && !!e.event);
}

/**
 * Parse date string to ISO format
 */
function parseDate(value: any): string | undefined {
    if (!value) return undefined;

    const str = String(value).trim();
    if (!str) return undefined;

    try {
        // Try to parse as date
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            return undefined;
        }
        return date.toISOString();
    } catch {
        return undefined;
    }
}

/**
 * Parse boolean values
 */
function parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (!value) return false;

    const str = String(value).toLowerCase().trim();
    return str === 'true' || str === '1' || str === 'yes';
}

/**
 * Normalize mode field
 */
function normalizeMode(value: any): 'online' | 'offline' | 'hybrid' {
    if (!value) return 'online';

    const str = String(value).toLowerCase().trim();
    if (str === 'offline' || str === 'hybrid') {
        return str;
    }
    return 'online';
}

/**
 * Normalize eligibility type
 */
function normalizeEligibilityType(value: any): 'grade' | 'age' | 'both' | undefined {
    if (!value) return undefined;

    const str = String(value).toLowerCase().trim();
    if (str === 'age' || str === 'both') {
        return str;
    }
    if (str === 'grade') {
        return 'grade';
    }
    return undefined;
}
