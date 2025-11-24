export type UserRole = 'student' | 'parent' | 'organizer' | 'business' | 'admin_manager' | 'superadmin';

export type Permission =
    | 'view_users'
    | 'create_users'
    | 'edit_users'
    | 'delete_users'
    | 'view_opportunities'
    | 'create_opportunities'
    | 'edit_opportunities'
    | 'delete_opportunities'
    | 'view_analytics'
    | 'manage_settings';

export interface UserAnalytics {
    lastActiveAt?: Date;
    accountCreatedAt?: Date;
    visitFrequency?: number; // e.g., visits per week
    passwordResetCount?: number;
    opportunitiesViewed?: number;
    opportunitiesApplied?: number;
    profileCompletionPercentage?: number;
}

export interface OrganizerAnalytics {
    accountCreatedAt?: Date;
    lastActiveAt?: Date;
    opportunitiesCreated?: number;
    opportunitiesUpdated?: number;
    applicationsReceived?: number;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    permissions?: Permission[]; // Custom permissions override

    // Analytics Data
    analytics?: UserAnalytics;
    organizerAnalytics?: OrganizerAnalytics;

    createdAt?: Date;
    updatedAt?: Date;
}

export const PERMISSION_MATRIX: Record<UserRole, Permission[]> = {
    superadmin: [
        'view_users', 'create_users', 'edit_users', 'delete_users',
        'view_opportunities', 'create_opportunities', 'edit_opportunities', 'delete_opportunities',
        'view_analytics', 'manage_settings'
    ],
    admin_manager: [
        'view_users', 'view_opportunities', 'view_analytics'
    ],
    organizer: ['create_opportunities', 'edit_opportunities', 'view_analytics'],
    business: ['create_opportunities', 'edit_opportunities', 'view_analytics'],
    student: [],
    parent: []
};

export const hasPermission = (user: User, permission: Permission): boolean => {
    if (user.role === 'superadmin') return true;

    // Check custom permissions first
    if (user.permissions?.includes(permission)) return true;

    // Check role-based permissions
    const rolePermissions = PERMISSION_MATRIX[user.role] || [];
    return rolePermissions.includes(permission);
};
