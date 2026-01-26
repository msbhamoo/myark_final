// Server-side opportunities service using Firebase Admin SDK
import { adminDb, toDate } from './firebase-admin';
import type { Opportunity } from '@/types/admin';

export const serverOpportunitiesService = {
    async getById(id: string): Promise<Opportunity | null> {
        try {
            const docRef = adminDb.collection('opportunities').doc(id);
            const snapshot = await docRef.get();

            if (!snapshot.exists) return null;

            const data = snapshot.data();

            return {
                id: snapshot.id,
                ...data,
                dates: {
                    registrationStart: toDate(data?.dates?.registrationStart),
                    registrationEnd: toDate(data?.dates?.registrationEnd),
                    eventDate: toDate(data?.dates?.eventDate),
                },
                createdAt: toDate(data?.createdAt),
                updatedAt: toDate(data?.updatedAt),
            } as Opportunity;
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            return null;
        }
    },

    async getAll(filters?: { type?: string; status?: string; limit?: number }): Promise<Opportunity[]> {
        try {
            let query = adminDb.collection('opportunities');

            if (filters?.type && filters.type !== "all") {
                query = query.where("type", "==", filters.type);
            }
            if (filters?.status && filters.status !== "all") {
                query = query.where("status", "==", filters.status);
            }
            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const snapshot = await query.get();

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dates: {
                        registrationStart: toDate(data.dates?.registrationStart),
                        registrationEnd: toDate(data.dates?.registrationEnd),
                        eventDate: toDate(data.dates?.eventDate),
                    },
                    createdAt: toDate(data.createdAt),
                    updatedAt: toDate(data.updatedAt),
                } as Opportunity;
            });
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            return [];
        }
    },
};