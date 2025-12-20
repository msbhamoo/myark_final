import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { hasAdminSessionFromRequest } from '@/lib/adminSession';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Career } from '@/constants/careers';

const COLLECTION = 'careers';

const serializeDoc = (doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
        ...data,
        slug: doc.id,
    } as Career;
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = await params;
        const db = getDb();
        const doc = await db.collection(COLLECTION).doc(slug).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Career not found' }, { status: 404 });
        }

        return NextResponse.json({ item: serializeDoc(doc as QueryDocumentSnapshot) });
    } catch (error) {
        console.error('Failed to get career', error);
        return NextResponse.json({ error: 'Failed to get career' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = await params;
        const payload = (await request.json().catch(() => null)) as Partial<Career> | null;
        if (!payload) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const db = getDb();
        const docRef = db.collection(COLLECTION).doc(slug);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Career not found' }, { status: 404 });
        }

        // Debug logging - check salary data
        console.log('[Career Update] Slug:', slug);
        console.log('[Career Update] Salary in payload:', JSON.stringify(payload.salary));

        await docRef.set({
            ...payload,
            updatedAt: new Date(),
        }, { merge: true });

        const docSnapshot = await docRef.get();
        return NextResponse.json({ item: serializeDoc(docSnapshot as QueryDocumentSnapshot) });
    } catch (error) {
        console.error('Failed to update career', error);
        return NextResponse.json({ error: 'Failed to update career' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!hasAdminSessionFromRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = await params;
        const db = getDb();
        const docRef = db.collection(COLLECTION).doc(slug);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Career not found' }, { status: 404 });
        }

        await docRef.delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete career', error);
        return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 });
    }
}
