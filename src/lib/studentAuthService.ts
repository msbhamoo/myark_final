/**
 * Student Authentication Service
 * Handles registration, login, session management, and security
 */

import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    Timestamp,
    increment,
} from "firebase/firestore";
import { db } from "./firebase";

// ============================================
// TYPES
// ============================================

export interface StudentUser {
    id: string;
    phone: string;
    name?: string;
    profilePicture?: string;
    grade?: number;
    school?: string;
    city?: string;
    state?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    interests: string[];
    appliedOpportunities: string[];
    savedOpportunities: string[];
    xpPoints: number;
    level: number;
    streakDays: number;
    badges: string[];
    // Discovery Quiz Data
    personaGoal?: 'top_college' | 'skills' | 'recognition' | 'exploring';
    competitiveness?: 'chill' | 'balanced' | 'beast_mode';
    weeklyTimeCommitment?: '1_2_hours' | '3_5_hours' | '5_plus_hours';
    deliveryPreference?: 'online' | 'offline' | 'both';
    isVerified: boolean;
    isBlocked: boolean;
    blockReason?: string;
    failedLoginAttempts: number;
    lastFailedAttempt?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    createdVia: 'web' | 'mobile' | 'admin';
}

export interface SessionInfo {
    id: string;
    userId: string;
    device: string;
    browser: string;
    createdAt: Date;
    lastActiveAt: Date;
    isActive: boolean;
}

export interface AuthResult {
    success: boolean;
    user?: StudentUser;
    session?: SessionInfo;
    error?: string;
    errorCode?: 'INVALID_PHONE' | 'INVALID_PIN' | 'USER_NOT_FOUND' | 'WRONG_PIN' | 'RATE_LIMITED' | 'BLOCKED' | 'PIN_MISMATCH' | 'PHONE_EXISTS';
}

export interface RateLimitResult {
    allowed: boolean;
    remainingAttempts: number;
    lockoutUntil?: Date;
}

export interface StudentLead {
    id: string;
    phone: string;
    createdAt: Date;
    converted: boolean;
    convertedAt?: Date;
    device: string;
    browser: string;
}

// ============================================
// CONSTANTS
// ============================================

const COLLECTIONS = {
    studentUsers: "studentUsers",
    studentSessions: "studentSessions",
    studentLeads: "studentLeads",
    userPhones: "userPhones",
} as const;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_EXPIRY_DAYS = 30;

// ============================================
// CRYPTO HELPERS (PIN Hashing)
// ============================================

async function hashPin(pin: string): Promise<string> {
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'myark_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPin(pin: string, hash: string): Promise<boolean> {
    const inputHash = await hashPin(pin);
    return inputHash === hash;
}

// ============================================
// DEVICE DETECTION
// ============================================

function getDeviceInfo(): { device: string; browser: string } {
    const ua = navigator.userAgent;
    let device = 'Unknown Device';
    let browser = 'Unknown Browser';

    // Detect device
    if (/iPhone/i.test(ua)) device = 'iPhone';
    else if (/iPad/i.test(ua)) device = 'iPad';
    else if (/Android/i.test(ua)) device = 'Android';
    else if (/Windows/i.test(ua)) device = 'Windows';
    else if (/Mac/i.test(ua)) device = 'Mac';
    else if (/Linux/i.test(ua)) device = 'Linux';

    // Detect browser
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edg/i.test(ua)) browser = 'Edge';

    return { device, browser };
}

/**
 * Calculates a new streak based on the last login time and the current streak.
 * @param lastLoginAt Date of the last login
 * @param currentStreak The current streak number
 * @returns The updated streak number
 */
function calculateNewStreak(lastLoginAt: Date | undefined, currentStreak: number): number {
    if (!lastLoginAt) return 1;

    const now = new Date();
    const lastDate = new Date(lastLoginAt);
    lastDate.setHours(0, 0, 0, 0);
    const nowDate = new Date(now);
    nowDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
        // Logged in exactly the next day
        return currentStreak + 1;
    } else if (dayDiff > 1) {
        // Missed at least one day
        return 1;
    } else if (dayDiff === 0) {
        // Already logged in today
        return currentStreak || 1;
    }

    return currentStreak || 1;
}

// ============================================
// STUDENT AUTH SERVICE
// ============================================

export const studentAuthService = {
    // ============================================
    // LEAD CAPTURE
    // ============================================

    async captureLead(phone: string): Promise<void> {
        try {
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length !== 10) return;

            const leadId = `lead_${cleanPhone}`;
            const { device, browser } = getDeviceInfo();
            const now = new Date();

            await setDoc(doc(db, COLLECTIONS.studentLeads, leadId), {
                id: leadId,
                phone: cleanPhone,
                createdAt: Timestamp.fromDate(now),
                converted: false,
                device,
                browser,
            }, { merge: true });
        } catch (error) {
            console.error("Lead capture error:", error);
        }
    },

    async convertLead(phone: string): Promise<void> {
        try {
            const cleanPhone = phone.replace(/\D/g, '');
            const leadId = `lead_${cleanPhone}`;
            await updateDoc(doc(db, COLLECTIONS.studentLeads, leadId), {
                converted: true,
                convertedAt: Timestamp.now(),
            });
        } catch (error) {
            // Might not exist, ignore
        }
    },

    // ============================================
    // REGISTRATION
    // ============================================

    async register(phone: string, pin: string): Promise<AuthResult> {
        try {
            // Validate phone format (Indian mobile)
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                return { success: false, error: "Please enter a valid 10-digit mobile number", errorCode: 'INVALID_PHONE' };
            }

            // Validate PIN format
            if (!/^\d{4}$/.test(pin)) {
                return { success: false, error: "PIN must be 4 digits", errorCode: 'INVALID_PIN' };
            }

            // Check if phone already registered
            const phoneDoc = await getDoc(doc(db, COLLECTIONS.userPhones, cleanPhone));
            if (phoneDoc.exists()) {
                return { success: false, error: "This number is already registered. Try logging in!", errorCode: 'PHONE_EXISTS' };
            }

            // Hash the PIN
            const pinHash = await hashPin(pin);

            // Create user document
            const userId = `user_${cleanPhone}_${Date.now()}`;
            const now = new Date();

            const newUser: StudentUser = {
                id: userId,
                phone: cleanPhone,
                xpPoints: 50, // Welcome bonus!
                level: 1,
                streakDays: 1, // Start the first streak!
                badges: ['early_bird'], // First badge!
                interests: [],
                appliedOpportunities: [],
                savedOpportunities: [],
                isVerified: true,
                isBlocked: false,
                failedLoginAttempts: 0,
                lastLoginAt: now,
                createdAt: now,
                createdVia: 'web',
            };

            // Save to Firestore
            await setDoc(doc(db, COLLECTIONS.studentUsers, userId), {
                ...newUser,
                pinHash,
                createdAt: Timestamp.fromDate(now),
                lastLoginAt: Timestamp.fromDate(now),
            });

            // Create phone lookup for unauthenticated queries
            await setDoc(doc(db, COLLECTIONS.userPhones, cleanPhone), {
                phone: cleanPhone,
                userId: userId,
                createdAt: Timestamp.fromDate(now),
            });

            // Convert lead to customer/user
            await this.convertLead(cleanPhone);

            // Create session
            const session = await this.createSession(userId);

            return { success: true, user: newUser, session };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: "Something went wrong. Please try again!" };
        }
    },

    // ============================================
    // LOGIN
    // ============================================

    async login(phone: string, pin: string): Promise<AuthResult> {
        try {
            // Validate phone format
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                return { success: false, error: "Please enter a valid 10-digit mobile number", errorCode: 'INVALID_PHONE' };
            }

            // Find user by phone using phone lookup
            const phoneDoc = await getDoc(doc(db, COLLECTIONS.userPhones, cleanPhone));
            if (!phoneDoc.exists()) {
                return { success: false, error: "No account found with this number. Want to register?", errorCode: 'USER_NOT_FOUND' };
            }
            const userId = phoneDoc.data().userId;

            // Get user data
            const userDoc = await getDoc(doc(db, COLLECTIONS.studentUsers, userId));
            if (!userDoc.exists()) {
                // Inconsistent state, treat as not found
                return { success: false, error: "No account found with this number. Want to register?", errorCode: 'USER_NOT_FOUND' };
            }
            const userData = userDoc.data();

            // Check if blocked
            if (userData.isBlocked) {
                return { success: false, error: "Your account has been blocked. Contact support for help.", errorCode: 'BLOCKED' };
            }

            // Check rate limiting
            const rateLimit = await this.checkRateLimit(userData);
            if (!rateLimit.allowed) {
                const waitTime = Math.ceil((rateLimit.lockoutUntil!.getTime() - Date.now()) / 60000);
                return {
                    success: false,
                    error: `Too many attempts! Take a break for ${waitTime} min ☕`,
                    errorCode: 'RATE_LIMITED'
                };
            }

            // Verify PIN
            const isValidPin = await verifyPin(pin, userData.pinHash);
            if (!isValidPin) {
                await this.incrementFailedAttempts(userId);
                const remaining = MAX_FAILED_ATTEMPTS - (userData.failedLoginAttempts + 1);
                return {
                    success: false,
                    error: remaining > 0
                        ? `Wrong PIN! ${remaining} attempts left 🎯`
                        : "Wrong PIN! Account locked for 5 minutes.",
                    errorCode: 'WRONG_PIN'
                };
            }

            // Calculate new streak
            const newStreak = calculateNewStreak(userData.lastLoginAt?.toDate(), userData.streakDays || 0);

            // Clear failed attempts and update last login
            await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
                failedLoginAttempts: 0,
                lastLoginAt: Timestamp.now(),
                streakDays: newStreak,
                xpPoints: increment(10), // Daily login bonus!
            });

            // Create session
            const session = await this.createSession(userId);

            // Build user object
            const user: StudentUser = {
                id: userId,
                phone: userData.phone,
                name: userData.name,
                grade: userData.grade,
                school: userData.school,
                city: userData.city,
                state: userData.state,
                profilePicture: userData.profilePicture,
                gender: userData.gender,
                interests: userData.interests || [],
                appliedOpportunities: userData.appliedOpportunities || [],
                savedOpportunities: userData.savedOpportunities || [],
                xpPoints: (userData.xpPoints || 0) + 10,
                level: userData.level || 1,
                streakDays: newStreak,
                badges: userData.badges || [],
                isVerified: userData.isVerified || true,
                isBlocked: false,
                failedLoginAttempts: 0,
                lastLoginAt: new Date(),
                createdAt: userData.createdAt?.toDate() || new Date(),
                createdVia: userData.createdVia || 'web',
            };

            return { success: true, user, session };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Something went wrong. Please try again!" };
        }
    },

    // ============================================
    // SESSION MANAGEMENT
    // ============================================

    async createSession(userId: string): Promise<SessionInfo> {
        const { device, browser } = getDeviceInfo();
        const sessionId = `session_${userId}_${Date.now()}`;
        const now = new Date();

        const session: SessionInfo = {
            id: sessionId,
            userId,
            device,
            browser,
            createdAt: now,
            lastActiveAt: now,
            isActive: true,
        };

        await setDoc(doc(db, COLLECTIONS.studentSessions, sessionId), {
            ...session,
            createdAt: Timestamp.fromDate(now),
            lastActiveAt: Timestamp.fromDate(now),
        });

        // Store session ID in localStorage
        localStorage.setItem('myark_session', sessionId);
        localStorage.setItem('myark_user_id', userId);

        return session;
    },

    async validateSession(sessionId: string): Promise<StudentUser | null> {
        try {
            const sessionDoc = await getDoc(doc(db, COLLECTIONS.studentSessions, sessionId));
            if (!sessionDoc.exists()) return null;

            const sessionData = sessionDoc.data();
            if (!sessionData.isActive) return null;

            // Check session expiry
            const createdAt = sessionData.createdAt?.toDate() || new Date();
            const expiryDate = new Date(createdAt.getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            if (new Date() > expiryDate) {
                await this.terminateSession(sessionId);
                return null;
            }

            // Get user data
            const userDoc = await getDoc(doc(db, COLLECTIONS.studentUsers, sessionData.userId));
            if (!userDoc.exists()) return null;

            const userData = userDoc.data();
            if (userData.isBlocked) return null;

            // Update last active
            await updateDoc(doc(db, COLLECTIONS.studentSessions, sessionId), {
                lastActiveAt: Timestamp.now(),
            });

            return {
                id: userDoc.id,
                phone: userData.phone,
                name: userData.name,
                grade: userData.grade,
                school: userData.school,
                city: userData.city,
                state: userData.state,
                profilePicture: userData.profilePicture,
                gender: userData.gender,
                interests: userData.interests || [],
                appliedOpportunities: userData.appliedOpportunities || [],
                savedOpportunities: userData.savedOpportunities || [],
                xpPoints: userData.xpPoints || 0,
                level: userData.level || 1,
                streakDays: userData.streakDays || 0,
                badges: userData.badges || [],
                isVerified: userData.isVerified || true,
                isBlocked: false,
                failedLoginAttempts: 0,
                lastLoginAt: userData.lastLoginAt?.toDate(),
                createdAt: userData.createdAt?.toDate() || new Date(),
                createdVia: userData.createdVia || 'web',
            };
        } catch (error) {
            console.error("Session validation error:", error);
            return null;
        }
    },

    async terminateSession(sessionId: string): Promise<void> {
        try {
            await updateDoc(doc(db, COLLECTIONS.studentSessions, sessionId), {
                isActive: false,
            });
        } catch (error) {
            console.error("Session termination error:", error);
        }
    },

    async logout(): Promise<void> {
        const sessionId = localStorage.getItem('myark_session');
        if (sessionId) {
            await this.terminateSession(sessionId);
        }
        localStorage.removeItem('myark_session');
        localStorage.removeItem('myark_user_id');
    },

    // ============================================
    // RATE LIMITING
    // ============================================

    async checkRateLimit(userData: any): Promise<RateLimitResult> {
        const failedAttempts = userData.failedLoginAttempts || 0;
        const lastFailed = userData.lastFailedAttempt?.toDate();

        if (failedAttempts >= MAX_FAILED_ATTEMPTS && lastFailed) {
            const lockoutUntil = new Date(lastFailed.getTime() + LOCKOUT_DURATION_MS);
            if (new Date() < lockoutUntil) {
                return {
                    allowed: false,
                    remainingAttempts: 0,
                    lockoutUntil,
                };
            }
        }

        return {
            allowed: true,
            remainingAttempts: MAX_FAILED_ATTEMPTS - failedAttempts,
        };
    },

    async incrementFailedAttempts(userId: string): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            failedLoginAttempts: increment(1),
            lastFailedAttempt: Timestamp.now(),
        });
    },

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    async getAllUsers(filters?: { search?: string; blocked?: boolean }): Promise<StudentUser[]> {
        try {
            let q = collection(db, COLLECTIONS.studentUsers);
            const snapshot = await getDocs(q);

            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    phone: data.phone,
                    name: data.name,
                    grade: data.grade,
                    school: data.school,
                    city: data.city,
                    xpPoints: data.xpPoints || 0,
                    level: data.level || 1,
                    streakDays: data.streakDays || 0,
                    badges: data.badges || [],
                    isVerified: data.isVerified || true,
                    isBlocked: data.isBlocked || false,
                    blockReason: data.blockReason,
                    failedLoginAttempts: data.failedLoginAttempts || 0,
                    lastLoginAt: data.lastLoginAt?.toDate(),
                    lastFailedAttempt: data.lastFailedAttempt?.toDate(),
                    createdAt: data.createdAt?.toDate() || new Date(),
                    createdVia: data.createdVia || 'web',
                    // Discovery Quiz Data
                    personaGoal: data.personaGoal,
                    competitiveness: data.competitiveness,
                    weeklyTimeCommitment: data.weeklyTimeCommitment,
                    deliveryPreference: data.deliveryPreference,
                    interests: data.interests || [],
                    appliedOpportunities: data.appliedOpportunities || [],
                    savedOpportunities: data.savedOpportunities || [],
                    email: data.email,
                } as StudentUser;
            });

            // Apply filters
            if (filters?.search) {
                const search = filters.search.toLowerCase();
                users = users.filter(u =>
                    u.phone.includes(search) ||
                    u.name?.toLowerCase().includes(search)
                );
            }

            if (filters?.blocked !== undefined) {
                users = users.filter(u => u.isBlocked === filters.blocked);
            }

            return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    async getUserSessions(userId: string): Promise<SessionInfo[]> {
        try {
            const q = query(
                collection(db, COLLECTIONS.studentSessions),
                where("userId", "==", userId)
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    device: data.device,
                    browser: data.browser,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
                    isActive: data.isActive,
                };
            }).sort((a, b) => b.lastActiveAt.getTime() - a.lastActiveAt.getTime());
        } catch (error) {
            console.error("Error fetching sessions:", error);
            return [];
        }
    },

    async blockUser(userId: string, reason: string): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            isBlocked: true,
            blockReason: reason,
        });

        // Terminate all sessions
        const sessions = await this.getUserSessions(userId);
        for (const session of sessions) {
            await this.terminateSession(session.id);
        }
    },

    async unblockUser(userId: string): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            isBlocked: false,
            blockReason: null,
            failedLoginAttempts: 0,
        });
    },

    async resetUserPin(userId: string, newPin: string): Promise<void> {
        const pinHash = await hashPin(newPin);
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            pinHash,
            failedLoginAttempts: 0,
        });
    },

    async terminateAllUserSessions(userId: string): Promise<void> {
        const sessions = await this.getUserSessions(userId);
        for (const session of sessions) {
            await this.terminateSession(session.id);
        }
    },

    async updateUserXP(userId: string, xpDelta: number): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            xpPoints: increment(xpDelta),
        });
    },

    // Update student profile
    async updateProfile(userId: string, updates: Partial<StudentUser>): Promise<void> {
        // Filter out undefined values and non-updatable fields
        const allowedFields = [
            'name', 'profilePicture', 'grade', 'school', 'city', 'state', 'gender', 'interests',
            'personaGoal', 'competitiveness', 'weeklyTimeCommitment', 'deliveryPreference', 'badges'
        ];
        const filtered: Record<string, any> = {};

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key) && value !== undefined) {
                filtered[key] = value;
            }
        }

        if (Object.keys(filtered).length > 0) {
            await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), filtered);
        }
    },

    // Save opportunity to user's savedOpportunities array
    async saveOpportunity(userId: string, opportunityId: string): Promise<void> {
        const { arrayUnion } = await import('firebase/firestore');
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            savedOpportunities: arrayUnion(opportunityId),
            xpPoints: increment(5), // +5 XP for saving
        });
    },

    // Unsave opportunity from user's savedOpportunities array
    async unsaveOpportunity(userId: string, opportunityId: string): Promise<void> {
        const { arrayRemove } = await import('firebase/firestore');
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            savedOpportunities: arrayRemove(opportunityId),
        });
    },

    // Apply to opportunity and track it
    async applyToOpportunity(userId: string, opportunityId: string): Promise<void> {
        const { arrayUnion } = await import('firebase/firestore');
        const userRef = doc(db, COLLECTIONS.studentUsers, userId);
        const oppRef = doc(db, "opportunities", opportunityId);

        await updateDoc(userRef, {
            appliedOpportunities: arrayUnion(opportunityId),
            xpPoints: increment(40), // +40 XP for applying
        });

        await updateDoc(oppRef, {
            applicationCount: increment(1)
        });
    },

    // Add XP when completing profile fields
    async addProfileXP(userId: string, xpAmount: number): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.studentUsers, userId), {
            xpPoints: increment(xpAmount),
        });
    },
};

export default studentAuthService;
