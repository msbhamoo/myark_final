import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const { organizers } = await req.json();

        if (!Array.isArray(organizers) || organizers.length === 0) {
            return NextResponse.json(
                { error: 'No organizers provided' },
                { status: 400 }
            );
        }

        const db = getDb();
        const batch = db.batch();
        const createdIds: string[] = [];
        const errors: { rowNumber: number; error: string }[] = [];

        for (const org of organizers) {
            try {
                // Validate required field
                if (!org.name || org.name.trim().length === 0) {
                    errors.push({
                        rowNumber: org.rowNumber || 0,
                        error: 'Name is required',
                    });
                    continue;
                }

                // Prepare organizer data
                const organizerData = {
                    name: org.name.trim(),
                    shortName: org.shortName?.trim() || '',
                    description: org.description?.trim() || '',
                    website: org.website?.trim() || '',
                    address: org.address?.trim() || '',
                    foundationYear: org.foundationYear || null,
                    type: org.type || 'other',
                    logoUrl: org.logoUrl?.trim() || '',
                    contactUrl: org.contactUrl?.trim() || '',
                    contactEmail: org.contactEmail?.trim() || '',
                    contactPhone: org.contactPhone?.trim() || '',
                    opportunityTypeIds: org.opportunityTypeIds || [],
                    visibility: org.visibility || 'public',
                    isVerified: org.isVerified !== false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                const docRef = db.collection('organizers').doc();
                batch.set(docRef, organizerData);
                createdIds.push(docRef.id);
            } catch (err) {
                errors.push({
                    rowNumber: org.rowNumber || 0,
                    error: err instanceof Error ? err.message : 'Failed to create organizer',
                });
            }
        }

        // Commit the batch
        await batch.commit();

        return NextResponse.json({
            success: true,
            createdCount: createdIds.length,
            errors,
            ids: createdIds,
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process bulk upload' },
            { status: 500 }
        );
    }
}
