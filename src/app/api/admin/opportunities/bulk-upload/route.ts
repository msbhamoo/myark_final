import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'opportunities';

interface OpportunityPayload {
    title: string;
    category?: string;
    categoryId?: string;
    categoryName?: string;
    organizer?: string;
    organizerId?: string;
    organizerName?: string;
    organizerLogo?: string;
    gradeEligibility?: string;
    eligibilityType?: 'grade' | 'age' | 'both';
    ageEligibility?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    state?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    startDateTBD?: boolean;
    endDateTBD?: boolean;
    registrationDeadlineTBD?: boolean;
    fee?: string;
    currency?: string;
    image?: string;
    description?: string;
    eligibility?: string[];
    benefits?: string[];
    timeline?: any[];
    registrationProcess?: string[];
    examPattern?: any;
    examPatterns?: any[];
    contactInfo?: any;
    resources?: any[];
    segments?: string[];
    searchKeywords?: string[];
    applicationUrl?: string;
    registrationMode?: 'external' | 'internal';
    registrationCount?: number;
    customTabs?: any[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { opportunities } = body;

        if (!Array.isArray(opportunities) || opportunities.length === 0) {
            return NextResponse.json(
                { error: 'No opportunities provided' },
                { status: 400 }
            );
        }

        const db = getDb();
        const createdIds: string[] = [];
        const errors: Array<{ rowNumber: number; error: string }> = [];

        // Firebase batch limit is 500 operations, so we need to chunk
        const BATCH_SIZE = 500;
        const chunks: typeof opportunities[] = [];

        for (let i = 0; i < opportunities.length; i += BATCH_SIZE) {
            chunks.push(opportunities.slice(i, i + BATCH_SIZE));
        }

        console.log(`Bulk upload: Processing ${opportunities.length} opportunities in ${chunks.length} batches`);

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex];
            const batch = db.batch();
            const batchIds: string[] = [];

            for (const opp of chunk) {
                try {
                    // Generate new document reference
                    const docRef = db.collection(COLLECTION).doc();
                    batchIds.push(docRef.id);

                    // Prepare the opportunity data
                    const opportunityData: any = {
                        ...opp,
                        status: 'draft',
                        registrationCount: 0,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    };

                    // Remove temp fields
                    delete opportunityData.tempId;
                    delete opportunityData.rowNumber;
                    delete opportunityData.rawData;

                    // Convert ISO date strings to Timestamps if needed
                    if (opportunityData.startDate && !opportunityData.startDateTBD) {
                        try {
                            opportunityData.startDate = Timestamp.fromDate(new Date(opportunityData.startDate));
                        } catch (e) {
                            delete opportunityData.startDate;
                        }
                    } else {
                        delete opportunityData.startDate;
                    }

                    if (opportunityData.endDate && !opportunityData.endDateTBD) {
                        try {
                            opportunityData.endDate = Timestamp.fromDate(new Date(opportunityData.endDate));
                        } catch (e) {
                            delete opportunityData.endDate;
                        }
                    } else {
                        delete opportunityData.endDate;
                    }

                    if (opportunityData.registrationDeadline && !opportunityData.registrationDeadlineTBD) {
                        try {
                            opportunityData.registrationDeadline = Timestamp.fromDate(
                                new Date(opportunityData.registrationDeadline)
                            );
                        } catch (e) {
                            delete opportunityData.registrationDeadline;
                        }
                    } else {
                        delete opportunityData.registrationDeadline;
                    }

                    // Convert timeline dates to Timestamps
                    if (opportunityData.timeline?.length) {
                        opportunityData.timeline = opportunityData.timeline.map((event: any) => ({
                            ...event,
                            date: event.date ? Timestamp.fromDate(new Date(event.date)) : null,
                        }));
                    }

                    batch.set(docRef, opportunityData);
                } catch (error) {
                    errors.push({
                        rowNumber: opp.rowNumber || 0,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    });
                }
            }

            // Commit this batch
            try {
                await batch.commit();
                createdIds.push(...batchIds);
                console.log(`Bulk upload: Batch ${chunkIndex + 1}/${chunks.length} committed successfully (${batchIds.length} records)`);
            } catch (batchError) {
                console.error(`Bulk upload: Batch ${chunkIndex + 1}/${chunks.length} failed:`, batchError);
                // Add errors for all items in this batch
                chunk.forEach(opp => {
                    errors.push({
                        rowNumber: opp.rowNumber || 0,
                        error: `Batch commit failed: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`,
                    });
                });
            }
        }

        console.log(`Bulk upload complete: ${createdIds.length} created, ${errors.length} errors`);

        return NextResponse.json({
            success: true,
            createdCount: createdIds.length,
            createdIds,
            errors,
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create opportunities',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
