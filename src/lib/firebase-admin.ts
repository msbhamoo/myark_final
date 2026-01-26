// Firebase Admin SDK configuration for server-side operations
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
}

export const adminDb = admin.firestore();

// Helper functions for server-side data conversion
export const toDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
    return new Date(timestamp);
};

export const toTimestamp = (date: Date): admin.firestore.Timestamp => {
    return admin.firestore.Timestamp.fromDate(date);
};