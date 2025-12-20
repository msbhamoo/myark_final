import { getDb } from './firebaseAdmin';
import { Career } from '@/constants/careers';
import { Firestore, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'careers';

/**
 * Serialize Firestore document to plain object
 * Removes Timestamps, DocumentReferences, and other non-serializable data
 */
const mapCareer = (doc: QueryDocumentSnapshot): Career => {
    const data = doc.data();

    // Convert Timestamps to ISO strings and strip non-serializable data
    const serialized = JSON.parse(JSON.stringify({
        ...data,
        slug: doc.id,
        // Convert any Timestamp fields to ISO strings
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
    }));

    return serialized as Career;
};

export async function getCareersFromFirestore(): Promise<Career[]> {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).orderBy('title').get();
    return snapshot.docs.map(mapCareer);
}

export async function getCareerBySlugFromFirestore(slug: string): Promise<Career | null> {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(slug).get();
    if (!doc.exists) return null;
    return mapCareer(doc as QueryDocumentSnapshot);
}

export async function saveCareerToFirestore(career: Partial<Career> & { slug: string }): Promise<void> {
    const db = getDb();
    await db.collection(COLLECTION).doc(career.slug).set({
        ...career,
        updatedAt: new Date(),
    }, { merge: true });
}

export async function deleteCareerFromFirestore(slug: string): Promise<void> {
    const db = getDb();
    await db.collection(COLLECTION).doc(slug).delete();
}
