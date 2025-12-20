import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

const COLLECTION = 'schools';

interface SchoolRow {
    name: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    email?: string;
    phone?: string;
    website?: string;
    foundationYear?: string;
    numberOfStudents?: string;
    principalName?: string;
    principalContact?: string;
    affiliationNumber?: string;
    facilities?: string;
}

function parseCSV(text: string): SchoolRow[] {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
    const rows: SchoolRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });

        if (row.name) {
            rows.push({
                name: row.name,
                type: row.type || row.schooltype,
                address: row.address,
                city: row.city,
                state: row.state,
                country: row.country || 'India',
                pincode: row.pincode || row.pin,
                email: row.email,
                phone: row.phone || row.contact,
                website: row.website,
                foundationYear: row.foundationyear || row.year,
                numberOfStudents: row.numberofstudents || row.students,
                principalName: row.principalname || row.principal,
                principalContact: row.principalcontact,
                affiliationNumber: row.affiliationnumber || row.affiliation,
                facilities: row.facilities,
            });
        }
    }

    return rows;
}

export async function POST(request: Request) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const text = await file.text();
        const rows = parseCSV(text);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'No valid rows found in CSV' }, { status: 400 });
        }

        const db = getDb();
        const batch = db.batch();
        const now = new Date();
        const errors: { row: number; error: string }[] = [];
        let imported = 0;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            if (!row.name) {
                errors.push({ row: i + 2, error: 'Name is required' });
                continue;
            }

            try {
                const docRef = db.collection(COLLECTION).doc();
                batch.set(docRef, {
                    name: row.name,
                    type: row.type || '',
                    address: row.address || '',
                    cityId: '', // Would need lookup from city name
                    stateId: '', // Would need lookup from state name
                    countryId: '', // Would need lookup from country name
                    pincode: row.pincode || '',
                    email: row.email || '',
                    phone: row.phone || '',
                    website: row.website || '',
                    foundationYear: row.foundationYear ? parseInt(row.foundationYear, 10) : null,
                    numberOfStudents: row.numberOfStudents ? parseInt(row.numberOfStudents, 10) : null,
                    principalName: row.principalName || '',
                    principalContact: row.principalContact || '',
                    affiliationNumber: row.affiliationNumber || '',
                    facilities: row.facilities ? row.facilities.split(';').map(f => f.trim()) : [],
                    schoolLogoUrl: '',
                    isVerified: false,
                    loginEnabled: false,
                    linkedUserId: null,
                    createdAt: now,
                    updatedAt: now,
                });
                imported++;
            } catch (err) {
                errors.push({ row: i + 2, error: (err as Error).message });
            }
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            imported,
            total: rows.length,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Failed to bulk import schools', error);
        return NextResponse.json({ error: 'Failed to import schools' }, { status: 500 });
    }
}
