/**
 * Firebase Cloud Messaging Client
 * Handles browser push notification subscriptions
 */

import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { getFirebaseApp } from './firebaseClient';

let messaging: Messaging | null = null;

/**
 * Initialize Firebase Messaging (only in browser)
 */
export const getFirebaseMessaging = (): Messaging | null => {
    if (typeof window === 'undefined') return null;

    if (messaging) return messaging;

    try {
        const app = getFirebaseApp();
        messaging = getMessaging(app);
        return messaging;
    } catch (error) {
        console.error('Failed to initialize Firebase Messaging:', error);
        return null;
    }
};

/**
 * Check if push notifications are supported
 */
export const isPushSupported = (): boolean => {
    return typeof window !== 'undefined' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;
};

/**
 * Check current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission | null => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return null;
    }
    return Notification.permission;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!isPushSupported()) {
        throw new Error('Push notifications are not supported in this browser');
    }

    const permission = await Notification.requestPermission();
    return permission;
};

/**
 * Register service worker and get FCM token
 */
export const getFCMToken = async (): Promise<string | null> => {
    if (!isPushSupported()) {
        console.warn('Push notifications not supported');
        return null;
    }

    const permission = getNotificationPermission();
    if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
    }

    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;

        const messaging = getFirebaseMessaging();
        if (!messaging) {
            throw new Error('Failed to initialize messaging');
        }

        // Get VAPID key from environment
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error('Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY');
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        return token;
    } catch (error) {
        console.error('Failed to get FCM token:', error);
        return null;
    }
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPush = async (authToken: string): Promise<boolean> => {
    try {
        const fcmToken = await getFCMToken();
        if (!fcmToken) {
            throw new Error('Failed to get FCM token');
        }

        const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ fcmToken, platform: 'web' }),
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe on server');
        }

        return true;
    } catch (error) {
        console.error('Failed to subscribe to push:', error);
        return false;
    }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async (authToken: string, fcmToken: string): Promise<boolean> => {
    try {
        const response = await fetch(`/api/notifications/subscribe?token=${encodeURIComponent(fcmToken)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to unsubscribe from push:', error);
        return false;
    }
};

/**
 * Set up foreground message handler
 */
export const onForegroundMessage = (callback: (payload: any) => void): (() => void) => {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
        return () => { };
    }

    return onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        callback(payload);
    });
};

/**
 * Show a local notification (for foreground messages)
 */
export const showLocalNotification = (
    title: string,
    options?: NotificationOptions
): void => {
    if (getNotificationPermission() !== 'granted') return;

    const notification = new Notification(title, {
        icon: '/icon.png',
        badge: '/icon.png',
        ...options,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();

        // Navigate to URL if provided
        const url = (options?.data as any)?.url;
        if (url) {
            window.location.href = url;
        }
    };
};
