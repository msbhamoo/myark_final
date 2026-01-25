import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface AdminUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: "admin" | "super-admin";
}

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Check if user is an admin
                try {
                    const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));

                    if (adminDoc.exists()) {
                        const adminData = adminDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || adminData.name || "Admin",
                            role: adminData.role || "admin",
                        });
                    } else {
                        // User is authenticated but not an admin
                        setUser(null);
                        await firebaseSignOut(auth);
                    }
                } catch (err) {
                    console.error("Error checking admin status:", err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<boolean> => {
        setError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Check if user is an admin
            const adminDoc = await getDoc(doc(db, "admins", userCredential.user.uid));

            if (!adminDoc.exists()) {
                await firebaseSignOut(auth);
                setError("You do not have admin access.");
                setLoading(false);
                return false;
            }

            const adminData = adminDoc.data();
            setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName || adminData.name || "Admin",
                role: adminData.role || "admin",
            });

            setLoading(false);
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to sign in";
            setError(errorMessage);
            setLoading(false);
            return false;
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        signIn,
        signOut,
        isAdmin: !!user,
    };

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
};

export default AuthContext;
