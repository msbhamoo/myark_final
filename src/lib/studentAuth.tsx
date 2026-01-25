/**
 * Student Authentication Context
 * Provides auth state and methods throughout the app
 */

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { studentAuthService, type StudentUser, type AuthResult } from "./studentAuthService";

// ============================================
// TYPES
// ============================================

export interface AuthModalOptions {
    mode?: 'login' | 'register';
    trigger?: 'heart' | 'save' | 'apply' | 'profile' | 'manual';
    message?: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

interface StudentAuthContextType {
    // State
    student: StudentUser | null;
    loading: boolean;
    isAuthenticated: boolean;

    // Auth Modal
    authModalOpen: boolean;
    authModalOptions: AuthModalOptions | null;
    showAuthModal: (options?: AuthModalOptions) => void;
    hideAuthModal: () => void;

    // Auth Actions
    login: (phone: string, pin: string) => Promise<AuthResult>;
    register: (phone: string, pin: string) => Promise<AuthResult>;
    logout: () => Promise<void>;

    // User Updates
    refreshUser: () => Promise<void>;
    addXP: (amount: number) => void;
    updateStudent: (updates: Partial<StudentUser>) => Promise<void>;

    // Opportunity Actions
    saveOpportunity: (opportunityId: string) => Promise<void>;
    unsaveOpportunity: (opportunityId: string) => Promise<void>;
    applyToOpportunity: (opportunityId: string) => Promise<void>;
    addXPWithPersist: (amount: number) => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const useStudentAuth = () => {
    const context = useContext(StudentAuthContext);
    if (!context) {
        throw new Error("useStudentAuth must be used within a StudentAuthProvider");
    }
    return context;
};

// ============================================
// PROVIDER
// ============================================

interface StudentAuthProviderProps {
    children: ReactNode;
}

export const StudentAuthProvider = ({ children }: StudentAuthProviderProps) => {
    const [student, setStudent] = useState<StudentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalOptions, setAuthModalOptions] = useState<AuthModalOptions | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkExistingSession = async () => {
            try {
                const sessionId = localStorage.getItem('myark_session');
                if (sessionId) {
                    const user = await studentAuthService.validateSession(sessionId);
                    if (user) {
                        setStudent(user);
                    } else {
                        // Clear invalid session
                        localStorage.removeItem('myark_session');
                        localStorage.removeItem('myark_user_id');
                    }
                }
            } catch (error) {
                console.error("Session check error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkExistingSession();
    }, []);

    // Auth Modal Controls
    const showAuthModal = useCallback((options?: AuthModalOptions) => {
        setAuthModalOptions(options || { mode: 'login' });
        setAuthModalOpen(true);
    }, []);

    const hideAuthModal = useCallback(() => {
        setAuthModalOpen(false);
        authModalOptions?.onClose?.();
        // Small delay before clearing options to prevent flash
        setTimeout(() => setAuthModalOptions(null), 300);
    }, [authModalOptions]);

    // Login
    const login = useCallback(async (phone: string, pin: string): Promise<AuthResult> => {
        const result = await studentAuthService.login(phone, pin);
        if (result.success && result.user) {
            setStudent(result.user);
            hideAuthModal();
            authModalOptions?.onSuccess?.();
        }
        return result;
    }, [hideAuthModal, authModalOptions]);

    // Register
    const register = useCallback(async (phone: string, pin: string): Promise<AuthResult> => {
        const result = await studentAuthService.register(phone, pin);
        if (result.success && result.user) {
            setStudent(result.user);
            hideAuthModal();
            authModalOptions?.onSuccess?.();
        }
        return result;
    }, [hideAuthModal, authModalOptions]);

    // Logout
    const logout = useCallback(async () => {
        await studentAuthService.logout();
        setStudent(null);
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        const sessionId = localStorage.getItem('myark_session');
        if (sessionId) {
            const user = await studentAuthService.validateSession(sessionId);
            if (user) {
                setStudent(user);
            }
        }
    }, []);

    // Add XP (optimistic update)
    const addXP = useCallback((amount: number) => {
        if (student) {
            setStudent(prev => prev ? { ...prev, xpPoints: prev.xpPoints + amount } : null);
        }
    }, [student]);

    // Update student profile (optimistic update + persist)
    const updateStudent = useCallback(async (updates: Partial<StudentUser>) => {
        if (!student) return;

        // Optimistic update
        setStudent(prev => prev ? { ...prev, ...updates } : null);

        // Persist to backend
        try {
            await studentAuthService.updateProfile(student.id, updates);
        } catch (error) {
            console.error("Failed to update profile:", error);
            // Revert on error
            await refreshUser();
            throw error;
        }
    }, [student, refreshUser]);

    // Save opportunity (with XP)
    const saveOpportunity = useCallback(async (opportunityId: string) => {
        if (!student) return;
        // Optimistic update
        setStudent(prev => prev ? {
            ...prev,
            savedOpportunities: [...(prev.savedOpportunities || []), opportunityId],
            xpPoints: prev.xpPoints + 5
        } : null);
        try {
            await studentAuthService.saveOpportunity(student.id, opportunityId);
        } catch (error) {
            console.error("Failed to save opportunity:", error);
            await refreshUser();
        }
    }, [student, refreshUser]);

    // Unsave opportunity
    const unsaveOpportunity = useCallback(async (opportunityId: string) => {
        if (!student) return;
        // Optimistic update
        setStudent(prev => prev ? {
            ...prev,
            savedOpportunities: (prev.savedOpportunities || []).filter(id => id !== opportunityId)
        } : null);
        try {
            await studentAuthService.unsaveOpportunity(student.id, opportunityId);
        } catch (error) {
            console.error("Failed to unsave opportunity:", error);
            await refreshUser();
        }
    }, [student, refreshUser]);

    // Apply to opportunity (with XP)
    const applyToOpportunity = useCallback(async (opportunityId: string) => {
        if (!student) return;
        // Optimistic update
        setStudent(prev => prev ? {
            ...prev,
            appliedOpportunities: [...(prev.appliedOpportunities || []), opportunityId],
            xpPoints: prev.xpPoints + 40
        } : null);
        try {
            await studentAuthService.applyToOpportunity(student.id, opportunityId);
        } catch (error) {
            console.error("Failed to apply to opportunity:", error);
            await refreshUser();
        }
    }, [student, refreshUser]);

    // Add XP with persistence
    const addXPWithPersist = useCallback(async (amount: number) => {
        if (!student) return;
        // Optimistic update
        setStudent(prev => prev ? { ...prev, xpPoints: prev.xpPoints + amount } : null);
        try {
            await studentAuthService.addProfileXP(student.id, amount);
        } catch (error) {
            console.error("Failed to add XP:", error);
            await refreshUser();
        }
    }, [student, refreshUser]);

    const value: StudentAuthContextType = {
        student,
        loading,
        isAuthenticated: !!student,
        authModalOpen,
        authModalOptions,
        showAuthModal,
        hideAuthModal,
        login,
        register,
        logout,
        refreshUser,
        addXP,
        updateStudent,
        saveOpportunity,
        unsaveOpportunity,
        applyToOpportunity,
        addXPWithPersist,
    };

    return (
        <StudentAuthContext.Provider value={value}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export default StudentAuthContext;
