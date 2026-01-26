// Firestore service for admin operations
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
    increment,
    type DocumentData,
    type QueryConstraint,
    arrayUnion,
    arrayRemove,
    documentId,
} from "firebase/firestore";
import { db } from "./firebase";
export { db };

import type {
    Opportunity,
    BlogPost,
    Career,
    Student,
    SchoolDemo,
    Notification,
    OpportunityTypeConfig,
    Organizer,
    Badge,
    RedemptionReward,
    RedemptionPartner
} from "@/types/admin";

// Collection names
export const COLLECTIONS = {
    opportunities: "opportunities",
    blogs: "blogs",
    careers: "careers",
    students: "studentUsers",
    schoolDemos: "schoolDemos",
    notifications: "notifications",
    badges: "badges",
    settings: "settings",
    organizers: "organizers",
    leads: "studentLeads",
} as const;

// Helper to convert Firestore timestamp to Date
export const toDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
    if (!timestamp) return undefined;
    if (timestamp instanceof Timestamp) return timestamp.toDate();
    return timestamp;
};

// Helper to convert Date to Firestore timestamp
const toTimestamp = (date: any): Timestamp | null => {
    if (!date) return null;
    if (date instanceof Timestamp) return date;
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
    } catch (e) {
        return null;
    }
};

// Sanitization helper to remove undefined values
const sanitizeData = (data: any) => {
    const result: any = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            result[key] = data[key];
        }
    });
    return result;
};

// ============================================
// OPPORTUNITIES
// ============================================

export const opportunitiesService = {
    async getAll(filters?: { type?: string; status?: string; limit?: number }) {
        const constraints: QueryConstraint[] = [];

        if (filters?.type && filters.type !== "all") {
            constraints.push(where("type", "==", filters.type));
        }
        if (filters?.status && filters.status !== "all") {
            constraints.push(where("status", "==", filters.status));
        }
        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(collection(db, COLLECTIONS.opportunities), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dates: {
                registrationStart: toDate(doc.data().dates?.registrationStart),
                registrationEnd: toDate(doc.data().dates?.registrationEnd),
                eventDate: toDate(doc.data().dates?.eventDate),
            },
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as Opportunity[];
    },

    async getById(id: string) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
            dates: {
                registrationStart: toDate(snapshot.data().dates?.registrationStart),
                registrationEnd: toDate(snapshot.data().dates?.registrationEnd),
                eventDate: toDate(snapshot.data().dates?.eventDate),
            },
            createdAt: toDate(snapshot.data().createdAt),
            updatedAt: toDate(snapshot.data().updatedAt),
        } as Opportunity;
    },

    async create(data: Omit<Opportunity, "id" | "createdAt" | "updatedAt">) {
        const sanitizedData = sanitizeData(data);
        const docRef = await addDoc(collection(db, COLLECTIONS.opportunities), {
            ...sanitizedData,
            dates: {
                registrationStart: toTimestamp(data.dates.registrationStart),
                registrationEnd: toTimestamp(data.dates.registrationEnd),
                eventDate: toTimestamp(data.dates.eventDate),
            },
            hypeCount: 0,
            applicationCount: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Opportunity>) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        const updateData: any = sanitizeData({
            ...data,
            updatedAt: Timestamp.now(),
        });

        if (data.dates) {
            updateData.dates = {
                registrationStart: toTimestamp(data.dates.registrationStart),
                registrationEnd: toTimestamp(data.dates.registrationEnd),
                eventDate: toTimestamp(data.dates.eventDate),
            };
        }

        await updateDoc(docRef, updateData);
    },

    async hypeOpportunity(id: string) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        await updateDoc(docRef, {
            hypeCount: increment(1)
        });
    },

    async shareOpportunity(id: string) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        await updateDoc(docRef, {
            shareCount: increment(1)
        });
    },

    async incrementView(id: string) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        await updateDoc(docRef, {
            viewCount: increment(1)
        });
    },

    async incrementApplication(id: string) {
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        await updateDoc(docRef, {
            applicationCount: increment(1)
        });
    },

    async syncApplicationCount(id: string) {
        // Query all students who applied to this opportunity
        const q = query(
            collection(db, "studentUsers"),
            where("appliedOpportunities", "array-contains", id)
        );
        const snapshot = await getDocs(q);
        const count = snapshot.size;

        // Update the opportunity with the true count
        const docRef = doc(db, COLLECTIONS.opportunities, id);
        await updateDoc(docRef, {
            applicationCount: count
        });

        return count;
    },

    async delete(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.opportunities, id));
    },

    // Real-time listener
    subscribe(callback: (opportunities: Opportunity[]) => void) {
        const q = query(
            collection(db, COLLECTIONS.opportunities),
            where("status", "==", "published"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const opportunities = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dates: {
                    registrationStart: toDate(doc.data().dates?.registrationStart),
                    registrationEnd: toDate(doc.data().dates?.registrationEnd),
                    eventDate: toDate(doc.data().dates?.eventDate),
                },
                createdAt: toDate(doc.data().createdAt),
                updatedAt: toDate(doc.data().updatedAt),
            })) as Opportunity[];
            callback(opportunities);
        });
    },
};

// ============================================
// BLOGS
// ============================================

export const blogsService = {
    async getAll(filters?: { status?: string; limit?: number }) {
        const constraints: QueryConstraint[] = [];

        if (filters?.status && filters.status !== "all") {
            constraints.push(where("status", "==", filters.status));
        }
        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(collection(db, COLLECTIONS.blogs), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: toDate(doc.data().publishedAt),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as BlogPost[];
    },

    async getById(id: string) {
        const docRef = doc(db, COLLECTIONS.blogs, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
            publishedAt: toDate(snapshot.data().publishedAt),
            createdAt: toDate(snapshot.data().createdAt),
            updatedAt: toDate(snapshot.data().updatedAt),
        } as BlogPost;
    },

    async getBySlug(slug: string) {
        const q = query(collection(db, COLLECTIONS.blogs), where("slug", "==", slug), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            publishedAt: toDate(doc.data().publishedAt),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        } as BlogPost;
    },

    async create(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) {
        const docRef = await addDoc(collection(db, COLLECTIONS.blogs), {
            ...data,
            viewCount: 0,
            publishedAt: data.status === "published" ? Timestamp.now() : null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<BlogPost>) {
        const docRef = doc(db, COLLECTIONS.blogs, id);
        await updateDoc(docRef, sanitizeData({
            ...data,
            updatedAt: Timestamp.now(),
        }));
    },

    async delete(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.blogs, id));
    },
};

// ============================================
// CAREERS
// ============================================

export const careersService = {
    async getAll(filters?: { status?: string; limit?: number }) {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (filters?.status && filters.status !== "all") {
            constraints.push(where("status", "==", filters.status));
        }
        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(collection(db, COLLECTIONS.careers), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            postedAt: toDate(doc.data().postedAt),
            expiresAt: toDate(doc.data().expiresAt),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as unknown as Career[];
    },

    async getById(id: string) {
        const docRef = doc(db, COLLECTIONS.careers, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
            postedAt: toDate(snapshot.data().postedAt),
            expiresAt: toDate(snapshot.data().expiresAt),
            createdAt: toDate(snapshot.data().createdAt),
            updatedAt: toDate(snapshot.data().updatedAt),
        } as unknown as Career;
    },

    async getBySlug(slug: string) {
        const q = query(collection(db, COLLECTIONS.careers), where("slug", "==", slug), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            postedAt: toDate(doc.data().postedAt),
            expiresAt: toDate(doc.data().expiresAt),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        } as unknown as Career;
    },

    async create(data: Omit<Career, "id" | "createdAt" | "updatedAt">) {
        const docRef = await addDoc(collection(db, COLLECTIONS.careers), {
            ...data,
            applicationCount: 0,
            postedAt: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Career>) {
        const docRef = doc(db, COLLECTIONS.careers, id);
        await updateDoc(docRef, sanitizeData({
            ...data,
            updatedAt: Timestamp.now(),
        }));
    },

    async delete(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.careers, id));
    },
};

// ============================================
// STUDENTS
// ============================================

export const studentsService = {
    async getAll(filters?: { grade?: number; limit?: number }) {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (filters?.grade) {
            constraints.push(where("grade", "==", filters.grade));
        }
        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(collection(db, COLLECTIONS.students), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: toDate(data.createdAt),
                lastActiveAt: toDate(data.lastActiveAt || data.lastLoginAt),
            };
        }) as Student[];
    },

    async getById(id: string) {
        const docRef = doc(db, COLLECTIONS.students, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: toDate(snapshot.data().createdAt),
            lastActiveAt: toDate(snapshot.data().lastActiveAt),
        } as Student;
    },

    async getStats() {
        const snapshot = await getDocs(collection(db, COLLECTIONS.students));
        const students = snapshot.docs.map(doc => doc.data());

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            total: students.length,
            activeThisWeek: students.filter(s => {
                const lastActive = toDate(s.lastActiveAt);
                return lastActive && lastActive >= sevenDaysAgo;
            }).length,
            avgStreak: students.length > 0
                ? Math.round(students.reduce((sum, s) => sum + (s.streakDays || 0), 0) / students.length)
                : 0,
        };
    },

    async assignBadge(studentId: string, badgeId: string) {
        const docRef = doc(db, COLLECTIONS.students, studentId);
        await updateDoc(docRef, {
            badges: arrayUnion(badgeId),
            updatedAt: Timestamp.now(),
        });
    },

    async removeBadge(studentId: string, badgeId: string) {
        const docRef = doc(db, COLLECTIONS.students, studentId);
        await updateDoc(docRef, {
            badges: arrayRemove(badgeId),
            updatedAt: Timestamp.now(),
        });
    },
};

export const leadsService = {
    async getAll(filters?: { converted?: boolean; limit?: number }) {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (filters?.converted !== undefined) {
            constraints.push(where("converted", "==", filters.converted));
        }
        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(collection(db, COLLECTIONS.leads), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: toDate(data.createdAt),
                convertedAt: toDate(data.convertedAt),
            };
        });
    },

    async getStats() {
        const snapshot = await getDocs(collection(db, COLLECTIONS.leads));
        const leads = snapshot.docs.map(doc => doc.data());

        return {
            total: leads.length,
            converted: leads.filter(l => l.converted).length,
            abandoned: leads.filter(l => !l.converted).length,
        };
    },

    async delete(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.leads, id));
    },
};

// ============================================
// SCHOOL DEMOS
// ============================================

export const schoolDemosService = {
    async getAll(filters?: { status?: string }) {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (filters?.status && filters.status !== "all") {
            constraints.push(where("status", "==", filters.status));
        }

        const q = query(collection(db, COLLECTIONS.schoolDemos), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledDate: toDate(doc.data().scheduledDate),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as SchoolDemo[];
    },

    async create(data: Omit<SchoolDemo, "id" | "createdAt" | "updatedAt">) {
        const docRef = await addDoc(collection(db, COLLECTIONS.schoolDemos), {
            ...data,
            status: data.status || 'pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    },

    async updateStatus(id: string, status: string, notes?: string) {
        const docRef = doc(db, COLLECTIONS.schoolDemos, id);
        await updateDoc(docRef, {
            status,
            notes: notes || null,
            updatedAt: Timestamp.now(),
        });
    },

    async getCountByStatus() {
        const snapshot = await getDocs(collection(db, COLLECTIONS.schoolDemos));
        const counts: Record<string, number> = {
            pending: 0,
            contacted: 0,
            scheduled: 0,
            completed: 0,
            rejected: 0,
        };

        snapshot.docs.forEach(doc => {
            const status = doc.data().status;
            if (counts[status] !== undefined) {
                counts[status]++;
            }
        });

        return counts;
    },
};

// ============================================
// NOTIFICATIONS
// ============================================

export const notificationsService = {
    async getAll() {
        const q = query(
            collection(db, COLLECTIONS.notifications),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledFor: toDate(doc.data().scheduledFor),
            sentAt: toDate(doc.data().sentAt),
            createdAt: toDate(doc.data().createdAt),
        })) as Notification[];
    },

    async send(data: Omit<Notification, "id" | "createdAt" | "sentAt">) {
        const docRef = await addDoc(collection(db, COLLECTIONS.notifications), sanitizeData({
            ...data,
            sentAt: Timestamp.now(),
            createdAt: Timestamp.now(),
        }));
        return docRef.id;
    },
};

// ============================================
// SETTINGS
// ============================================

export const settingsService = {
    async getOpportunityTypes(): Promise<OpportunityTypeConfig[]> {
        const docRef = doc(db, COLLECTIONS.settings, "opportunityTypes");
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            // Return defaults if not set
            return [];
        }

        return snapshot.data().types || [];
    },

    async saveOpportunityTypes(types: OpportunityTypeConfig[]) {
        const docRef = doc(db, COLLECTIONS.settings, "opportunityTypes");
        await updateDoc(docRef, { types });
    },

    async getGrades(): Promise<number[]> {
        const docRef = doc(db, COLLECTIONS.settings, "grades");
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return [6, 7, 8, 9, 10, 11, 12]; // defaults
        }

        return snapshot.data().grades || [];
    },

    async saveGrades(grades: number[]) {
        const docRef = doc(db, COLLECTIONS.settings, "grades");
        await updateDoc(docRef, { grades });
    },

    async getTags(): Promise<string[]> {
        const docRef = doc(db, COLLECTIONS.settings, "tags");
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return [];
        }

        return snapshot.data().tags || [];
    },

    async saveTags(tags: string[]) {
        const docRef = doc(db, COLLECTIONS.settings, "tags");
        await updateDoc(docRef, { tags });
    },

    async getOrganizers(): Promise<Organizer[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.organizers));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as Organizer[];
    },

    async saveOrganizer(data: Omit<Organizer, "id" | "createdAt" | "updatedAt">) {
        const docRef = await addDoc(collection(db, COLLECTIONS.organizers), sanitizeData({
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }));
        return docRef.id;
    },

    async deleteOrganizer(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.organizers, id));
    },
};

// ============================================
// DASHBOARD STATS
// ============================================

export const dashboardService = {
    async getStats() {
        const [opportunities, students, demos] = await Promise.all([
            getDocs(collection(db, COLLECTIONS.opportunities)),
            studentsService.getStats(),
            schoolDemosService.getCountByStatus(),
        ]);

        const publishedOpportunities = opportunities.docs.filter(
            doc => doc.data().status === "published"
        ).length;

        return {
            totalOpportunities: opportunities.size,
            publishedOpportunities,
            totalStudents: students.total,
            activeStudents: students.activeThisWeek,
            pendingDemos: demos.pending,
        };
    },
};

// ============================================
// BADGES
// ============================================

export const badgesService = {
    async getAll(): Promise<Badge[]> {
        const q = query(collection(db, COLLECTIONS.badges), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt),
            updatedAt: toDate(doc.data().updatedAt),
        })) as Badge[];
    },

    async getById(id: string): Promise<Badge | null> {
        const docRef = doc(db, COLLECTIONS.badges, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: toDate(snapshot.data().createdAt),
            updatedAt: toDate(snapshot.data().updatedAt),
        } as Badge;
    },

    async create(data: Omit<Badge, "id" | "createdAt" | "updatedAt">) {
        const sanitizedData = sanitizeData(data);
        const docRef = await addDoc(collection(db, COLLECTIONS.badges), {
            ...sanitizedData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Badge>) {
        const docRef = doc(db, COLLECTIONS.badges, id);
        await updateDoc(docRef, {
            ...sanitizeData(data),
            updatedAt: Timestamp.now(),
        });
    },

    async delete(id: string) {
        await deleteDoc(doc(db, COLLECTIONS.badges, id));
    },
};
// ============================================
// REDEMPTION
// ============================================

export const rewardsService = {
    async getAll() {
        // Fetch all active rewards
        // REMOVED orderBy to avoid "Missing Index" error. Sorting client-side instead.
        const q = query(collection(db, "rewards"), where("isActive", "==", true));
        const snapshot = await getDocs(q);

        const rewards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            expiresAt: toDate(doc.data().expiresAt),
            createdAt: toDate(doc.data().createdAt),
        })) as RedemptionReward[];

        return rewards.sort((a, b) => a.xpCost - b.xpCost);
    },

    async getPartners() {
        const snapshot = await getDocs(collection(db, "partners"));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt),
        })) as RedemptionPartner[];
    },

    async redeem(rewardId: string, studentId: string, xpCost: number) {
        // 1. Deduct XP (handled by cloud function usually, but client-side for demo)
        // 2. Add claim record
        // This logic is ideally transactional

        // Simulating claim:
        const claimRef = await addDoc(collection(db, "claims"), {
            rewardId,
            studentId,
            xpCost,
            claimedAt: Timestamp.now(),
            status: "active"
        });

        // Increment claim count on reward
        const rewardRef = doc(db, "rewards", rewardId);
        await updateDoc(rewardRef, {
            claimCount: increment(1)
        });

        return claimRef.id;
    }
};
