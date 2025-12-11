/**
 * Firebase Cloud Messaging Service Worker
 * Handles background push notifications
 */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase configuration
// Note: For production, you'll need to inject these values during build
// or create a dynamic service worker
const firebaseConfig = {
    apiKey: "AIzaSyC94blmySHrQjZ9p5KOJKLv4I8mT3mhXVk",
    authDomain: "myark-staging.firebaseapp.com",
    projectId: "myark-staging",
    storageBucket: "myark-staging.firebasestorage.app",
    messagingSenderId: "456815869476",
    appId: "1:456815869476:web:bff9d0dd3d1a05ceaeddab"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'MyArk';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/icon.png',
        badge: '/icon.png',
        image: payload.notification?.image,
        tag: payload.data?.tag || 'myark-notification',
        requireInteraction: payload.data?.requireInteraction === 'true',
        data: {
            url: payload.data?.url || '/',
            type: payload.data?.type,
            opportunityId: payload.data?.opportunityId,
            ...payload.data,
        },
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click:', event);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there's already a tab open with the target URL
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }

            // If no tab is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Cache name for offline support
const CACHE_NAME = 'myark-push-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(clients.claim());
});
