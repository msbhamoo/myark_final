import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const db = getDb();
        const snapshot = await db.collection('opportunities')
            .orderBy('updatedAt', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ message: 'No opportunities found' });
        }

        const doc = snapshot.docs[0];
        return NextResponse.json({
            id: doc.id,
            data: doc.data(),
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
