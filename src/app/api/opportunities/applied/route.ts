import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
    let user;
    try {
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const auth = getAdminAuth();
        user = await auth.verifyIdToken(token);
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = getDb();
        const registrationsSnapshot = await db
            .collection('opportunity_registrations')
            .where('studentUid', '==', user.uid)
            .get();

        const registrations = registrationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort by registeredAt on the server side
        registrations.sort((a: any, b: any) => {
            const dateA = new Date(a.registeredAt || 0).getTime();
            const dateB = new Date(b.registeredAt || 0).getTime();
            return dateB - dateA; // Descending order (newest first)
        });

        return NextResponse.json({ items: registrations });
    } catch (error) {
        console.error('Error fetching applied opportunities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch applied opportunities' },
            { status: 500 }
        );
    }
}
