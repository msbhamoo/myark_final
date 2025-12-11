/**
 * Firebase Cloud Messaging (FCM) Types
 */

export interface NotificationPreferences {
    // Notification categories
    newOpportunities: boolean;        // New opportunities matching interests
    deadlineReminders: boolean;       // Approaching deadline alerts
    weeklyDigest: boolean;            // Weekly "Discover Weekly" email
    schoolActivity: boolean;          // Activity from your school
    applicationUpdates: boolean;      // Updates on applications/registrations

    // Delivery preferences
    pushEnabled: boolean;             // Browser push notifications
    emailEnabled: boolean;            // Email notifications
    emailFrequency: 'instant' | 'daily' | 'weekly';
}

export interface UserNotificationToken {
    token: string;
    platform: 'web' | 'android' | 'ios';
    createdAt: string;
    lastUsedAt: string;
    userAgent?: string;
}

export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    badge?: string;
    tag?: string;
    data?: Record<string, string>;
    clickAction?: string;
    requireInteraction?: boolean;
}

export interface ScheduledNotification {
    id: string;
    userId: string;
    type: 'deadline_reminder' | 'weekly_digest' | 'new_opportunity' | 'school_activity';
    payload: NotificationPayload;
    scheduledFor: string;
    sent: boolean;
    sentAt?: string;
    createdAt: string;
}

export interface NotificationLog {
    id: string;
    userId: string;
    type: string;
    payload: NotificationPayload;
    success: boolean;
    error?: string;
    sentAt: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    newOpportunities: true,
    deadlineReminders: true,
    weeklyDigest: true,
    schoolActivity: true,
    applicationUpdates: true,
    pushEnabled: false,
    emailEnabled: true,
    emailFrequency: 'weekly',
};
