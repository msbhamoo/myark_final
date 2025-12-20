import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Career } from '@/constants/careers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'careers';

const serializeDoc = (doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
        ...data,
        slug: doc.id,
    } as Career;
};

export async function GET(request: Request) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = getDb();
        const snapshot = await db.collection(COLLECTION).orderBy('title').get();
        const items = snapshot.docs.map((doc) => serializeDoc(doc as QueryDocumentSnapshot));
        return NextResponse.json({ items });
    } catch (error) {
        console.error('Failed to list careers', error);
        return NextResponse.json({ error: 'Failed to list careers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = (await request.json().catch(() => null)) as Career | null;
        if (!payload || !payload.slug) {
            return NextResponse.json({ error: 'Invalid payload or missing slug' }, { status: 400 });
        }

        const db = getDb();
        const docRef = db.collection(COLLECTION).doc(payload.slug);
        const doc = await docRef.get();

        if (doc.exists) {
            return NextResponse.json({ error: 'Career with this slug already exists' }, { status: 400 });
        }

        await docRef.set({
            ...payload,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const docSnapshot = await docRef.get();
        return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) }, { status: 201 });
    } catch (error) {
        console.error('Failed to create career', error);
        return NextResponse.json({ error: 'Failed to create career' }, { status: 500 });
    }
}
