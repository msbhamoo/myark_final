import * as XLSX from 'xlsx';
import { ParsedOrganizer } from '../types';

// Column mapping from Excel headers to organizer fields
const COLUMN_MAPPING: Record<string, keyof ParsedOrganizer> = {
    'name': 'name',
    'organizer name': 'name',
    'organization name': 'name',
    'short name': 'shortName',
    'abbreviation': 'shortName',
    'description': 'description',
    'website': 'website',
    'website url': 'website',
    'address': 'address',
    'foundation year': 'foundationYear',
    'year established': 'foundationYear',
    'year': 'foundationYear',
    'type': 'type',
    'organization type': 'type',
    'org type': 'type',
    'logo url': 'logoUrl',
    'logo': 'logoUrl',
    'contact url': 'contactUrl',
    'contact/support url': 'contactUrl',
    'support url': 'contactUrl',
    'contact email': 'contactEmail',
    'email': 'contactEmail',
    'contact phone': 'contactPhone',
    'phone': 'contactPhone',
    'opportunity types': 'opportunityTypes',
    'categories': 'opportunityTypes',
};

function normalizeColumnName(header: string): string {
    return header.toLowerCase().trim().replace(/[_-]/g, ' ');
}

function parseTypeValue(value: string): ParsedOrganizer['type'] {
    const normalized = value.toLowerCase().trim();
    const typeMap: Record<string, ParsedOrganizer['type']> = {
        'government': 'government',
        'govt': 'government',
        'gov': 'government',
        'private': 'private',
        'pvt': 'private',
        'ngo': 'ngo',
        'non-profit': 'ngo',
        'nonprofit': 'ngo',
        'international': 'international',
        'intl': 'international',
        'other': 'other',
    };
    return typeMap[normalized] || 'other';
}

function parseYear(value: any): number | null {
    if (value === undefined || value === null || value === '') return null;
    const year = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (Number.isFinite(year) && year > 1800 && year <= new Date().getFullYear()) {
        return year;
    }
    return null;
}

export async function parseUploadedFile(file: File): Promise<ParsedOrganizer[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                if (jsonData.length < 2) {
                    reject(new Error('File must have at least a header row and one data row'));
                    return;
                }

                const headers = jsonData[0].map((h: any) => normalizeColumnName(String(h || '')));
                const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

                const parsedOrganizers: ParsedOrganizer[] = dataRows.map((row, index) => {
                    const rawData: Record<string, any> = {};
                    headers.forEach((header, colIndex) => {
                        rawData[header] = row[colIndex];
                    });

                    const organizer: ParsedOrganizer = {
                        tempId: `temp-${Date.now()}-${index}`,
                        rowNumber: index + 2, // +2 because of header row and 0-indexing
                        rawData,
                        visibility: 'public',
                        isVerified: true,
                    };

                    // Map columns to fields
                    headers.forEach((header, colIndex) => {
                        const fieldName = COLUMN_MAPPING[header];
                        const value = row[colIndex];

                        if (fieldName && value !== undefined && value !== null && value !== '') {
                            switch (fieldName) {
                                case 'foundationYear':
                                    organizer.foundationYear = parseYear(value);
                                    break;
                                case 'type':
                                    organizer.type = parseTypeValue(String(value));
                                    break;
                                default:
                                    (organizer as any)[fieldName] = String(value).trim();
                            }
                        }
                    });

                    return organizer;
                });

                resolve(parsedOrganizers);
            } catch (error) {
                reject(new Error('Failed to parse file. Please ensure it is a valid Excel or CSV file.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsBinaryString(file);
    });
}
