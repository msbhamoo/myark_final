'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    isPushSupported,
    getNotificationPermission,
    requestNotificationPermission,
    getFCMToken,
    subscribeToPush,
    onForegroundMessage,
    showLocalNotification,
} from '@/lib/firebaseMessaging';
import type { NotificationPreferences } from '@/types/notifications';

interface UseNotificationsReturn {
    // State
    isSupported: boolean;
    permission: NotificationPermission | null;
    isSubscribed: boolean;
    preferences: NotificationPreferences | null;
    loading: boolean;
    error: string | null;

    // Actions
    requestPermission: () => Promise<boolean>;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
    updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<boolean>;
    refreshPreferences: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
    const { user, getIdToken } = useAuth();

    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check support and initial state
    useEffect(() => {
        if (typeof window === 'undefined') return;

        setIsSupported(isPushSupported());
        setPermission(getNotificationPermission());
        setLoading(false);
    }, []);

    // Fetch subscription status and preferences
    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) {
                setPreferences(null);
                setIsSubscribed(false);
                return;
            }

            try {
                const token = await getIdToken();
                if (!token) return;

                // Fetch subscription status
                const subResponse = await fetch('/api/notifications/subscribe', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (subResponse.ok) {
                    const data = await subResponse.json();
                    setIsSubscribed(data.subscribed);
                }

                // Fetch preferences
                const prefResponse = await fetch('/api/notifications/preferences', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (prefResponse.ok) {
                    const prefs = await prefResponse.json();
                    setPreferences(prefs);
                }
            } catch (err) {
                console.error('Failed to fetch notification status:', err);
            }
        };

        fetchStatus();
    }, [user, getIdToken]);

    // Set up foreground message handler
    useEffect(() => {
        if (!user || !isSubscribed) return;

        const unsubscribe = onForegroundMessage((payload) => {
            // Show local notification for foreground messages
            const title = payload.notification?.title || 'New Notification';
            showLocalNotification(title, {
                body: payload.notification?.body,
                icon: payload.notification?.icon,
                data: payload.data,
            });
        });

        return unsubscribe;
    }, [user, isSubscribed]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const result = await requestNotificationPermission();
            setPermission(result);

            return result === 'granted';
        } catch (err) {
            setError('Failed to request permission');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!user) {
            setError('Please log in to enable notifications');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            // Request permission if not granted
            if (permission !== 'granted') {
                const granted = await requestPermission();
                if (!granted) {
                    setError('Notification permission denied');
                    return false;
                }
            }

            const token = await getIdToken();
            if (!token) {
                setError('Not authenticated');
                return false;
            }

            const success = await subscribeToPush(token);
            if (success) {
                setIsSubscribed(true);

                // Update preferences
                await fetch('/api/notifications/preferences', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ pushEnabled: true }),
                });
            }

            return success;
        } catch (err) {
            setError('Failed to subscribe to notifications');
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, permission, getIdToken, requestPermission]);

    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!user) return false;

        try {
            setLoading(true);
            setError(null);

            const token = await getIdToken();
            if (!token) return false;

            const fcmToken = await getFCMToken();
            if (fcmToken) {
                await fetch(`/api/notifications/subscribe?token=${encodeURIComponent(fcmToken)}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
            }

            // Update preferences
            await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ pushEnabled: false }),
            });

            setIsSubscribed(false);
            return true;
        } catch (err) {
            setError('Failed to unsubscribe');
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    const updatePreferences = useCallback(async (
        updates: Partial<NotificationPreferences>
    ): Promise<boolean> => {
        if (!user) return false;

        try {
            setLoading(true);
            setError(null);

            const token = await getIdToken();
            if (!token) return false;

            const response = await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                const updated = await response.json();
                setPreferences(updated);
                return true;
            }

            return false;
        } catch (err) {
            setError('Failed to update preferences');
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    const refreshPreferences = useCallback(async (): Promise<void> => {
        if (!user) return;

        try {
            const token = await getIdToken();
            if (!token) return;

            const response = await fetch('/api/notifications/preferences', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const prefs = await response.json();
                setPreferences(prefs);
            }
        } catch (err) {
            console.error('Failed to refresh preferences:', err);
        }
    }, [user, getIdToken]);

    return {
        isSupported,
        permission,
        isSubscribed,
        preferences,
        loading,
        error,
        requestPermission,
        subscribe,
        unsubscribe,
        updatePreferences,
        refreshPreferences,
    };
}
