import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export async function GET() {
    try {
        const db = getDb();
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        // Format dates for comparison
        const nowISO = now.toISOString().split('T')[0];
        const futureISO = sevenDaysFromNow.toISOString().split('T')[0];

        // Query opportunities with deadlines in the next 7 days
        const snapshot = await db
            .collection('opportunities')
            .where('status', '==', 'active')
            .where('registrationDeadline', '>=', nowISO)
            .where('registrationDeadline', '<=', futureISO)
            .orderBy('registrationDeadline', 'asc')
            .limit(10)
            .get();

        const opportunities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ opportunities });
    } catch (error) {
        console.error('Failed to fetch deadline approaching opportunities:', error);

        // Return empty array on error to gracefully degrade
        return NextResponse.json({ opportunities: [] });
    }
}
