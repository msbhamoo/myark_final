import {
    db,
    COLLECTIONS,
    toDate
} from "./firestore";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    Timestamp,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    arrayUnion
} from "firebase/firestore";
import {
    XPActionType,
    XPActionConfig,
    GamificationConfig,
    CommunitySignal
} from "@/types/admin";

const DEFAULT_CONFIG: GamificationConfig = {
    id: 'global_config',
    xpActions: {
        explore: { id: 'explore', label: 'Explore Opportunity', xpValue: 5, cooldownHours: 24 },
        heart: { id: 'heart', label: 'Heart Opportunity', xpValue: 2, cooldownHours: 0 },
        save: { id: 'save', label: 'Save Opportunity', xpValue: 5 },
        apply: { id: 'apply', label: 'Apply / Mark Done', xpValue: 40 },
        checklist: { id: 'checklist', label: 'Complete Checklist', xpValue: 20 },
        streak: { id: 'streak', label: 'Daily Streak', xpValue: 10 },
        profile_complete: { id: 'profile_complete', label: 'Profile 100%', xpValue: 100 },
    },
    trendingHeartThreshold: 50,
    sessionCooldownMinutes: 60,
    milestoneInterval: 1000
};

export const gamificationService = {
    async getConfig(): Promise<GamificationConfig> {
        const docRef = doc(db, COLLECTIONS.settings, "gamification");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { ...DEFAULT_CONFIG, ...snapshot.data() } as GamificationConfig;
        }
        await setDoc(docRef, DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
    },

    async updateConfig(config: GamificationConfig) {
        const docRef = doc(db, COLLECTIONS.settings, "gamification");
        await setDoc(docRef, config);
    },

    async logSignal(type: 'badge' | 'xp' | 'redemption' | 'hype', studentId: string, content: string, metadata?: any) {
        try {
            await addDoc(collection(db, "community_signals"), {
                type,
                studentName: "A MyArk Student", // Placeholder until profile fetch
                content,
                timestamp: Timestamp.now(),
                metadata: metadata || {},
            });
        } catch (error) {
            console.error("Error logging signal:", error);
        }
    },

    async processAction(userId: string, actionKey: string, targetId?: string): Promise<{ xpEarned: number; milestoneReached: boolean }> {
        const config = await this.getConfig();
        const actionConfig = config.xpActions[actionKey];

        if (!actionConfig) return { xpEarned: 0, milestoneReached: false };

        // Atomic Updates for XP
        const studentRef = doc(db, COLLECTIONS.students, userId);
        const xpToAdd = actionConfig.xpValue;

        await updateDoc(studentRef, {
            xpPoints: increment(xpToAdd),
            updatedAt: Timestamp.now(),
            lastActiveAt: Timestamp.now()
        });

        // Fetch current XP for milestone check
        const studentSnap = await getDoc(studentRef);
        const totalXp = studentSnap.data()?.xpPoints || 0;

        const milestoneReached = totalXp >= (config.milestoneInterval || 1000) &&
            (totalXp % (config.milestoneInterval || 1000) < xpToAdd);

        if (milestoneReached) {
            await this.logSignal('xp', userId, `reached ${totalXp} XP milestone!`);
        }

        if (actionKey === 'heart') {
            await this.logSignal('hype', userId, `hyped an opportunity!`);
            if (targetId) {
                const oppRef = doc(db, COLLECTIONS.opportunities, targetId);
                await updateDoc(oppRef, {
                    hypeCount: increment(1),
                    updatedAt: Timestamp.now()
                });
            }
        }

        return { xpEarned: xpToAdd, milestoneReached };
    },

    async getSignals(limitCount: number = 5): Promise<any[]> {
        const q = query(
            collection(db, "community_signals"),
            orderBy("timestamp", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
};
