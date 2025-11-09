'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';

type AccountType = 'organization' | 'user';

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  accountType: AccountType;
  organizationName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface AuthContextValue {
  loading: boolean;
  user: AppUserProfile | null;
  ready: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildProfile = (firebaseUser: User, data: Partial<AppUserProfile>): AppUserProfile => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: data.displayName ?? firebaseUser.displayName,
  accountType: data.accountType ?? 'user',
  organizationName: data.organizationName ?? null,
  createdAt: data.createdAt ?? null,
  updatedAt: data.updatedAt ?? null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const initializingRef = useRef(true);

  const loadProfile = useCallback(
    async (nextUser: User) => {
      try {
        const token = await nextUser.getIdToken();
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setUserProfile(
            buildProfile(nextUser, {
              accountType: 'user',
              displayName: nextUser.displayName,
            }),
          );
          return;
        }

        const data = (await response.json()) as Partial<AppUserProfile>;
        setUserProfile(buildProfile(nextUser, data));
      } catch (error) {
        console.error('Failed to load user profile', error);
        setUserProfile(
          buildProfile(nextUser, {
            accountType: 'user',
            displayName: nextUser.displayName,
          }),
        );
      }
    },
    [],
  );

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(authInstance, async (nextUser) => {
      setFirebaseUser(nextUser);
      if (!nextUser) {
        setUserProfile(null);
        setLoading(false);
        initializingRef.current = false;
        return;
      }

      setLoading(true);
      await loadProfile(nextUser);
      setLoading(false);
      initializingRef.current = false;
    });

    return () => unsubscribe();
  }, [loadProfile]);

  const getIdToken = useCallback(
    async (forceRefresh = false): Promise<string | null> => {
      if (!firebaseUser) {
        return null;
      }
      return firebaseUser.getIdToken(forceRefresh);
    },
    [firebaseUser],
  );

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) {
      return;
    }
    await loadProfile(firebaseUser);
  }, [firebaseUser, loadProfile]);

  const signOut = useCallback(async () => {
    const authInstance = getFirebaseAuth();
    await firebaseSignOut(authInstance);
    setUserProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      ready: !initializingRef.current,
      user: userProfile,
      getIdToken,
      refreshProfile,
      signOut,
    }),
    [getIdToken, loading, refreshProfile, signOut, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
