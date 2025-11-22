/**
 * Authentication Helper Utilities
 * 
 * Provides validation, type detection, and helper functions for the unified
 * email/phone authentication flow.
 */

// Auth flow states
export type AuthFlowState =
    | 'initial'           // User enters email/phone
    | 'existing-user'     // Account found, waiting for password
    | 'new-user'          // No account found, collecting signup details
    | 'forgot-password'   // Password recovery flow
    | 'success';          // Authentication successful

// Unified auth input interface
export interface UnifiedAuthInput {
    identifier: string;  // Email or phone
    identifierType: 'email' | 'phone';
    password?: string;
    fullName?: string;
    confirmPassword?: string;
    email?: string;  // For phone accounts that want to add email
}

// Account check response
export interface AccountCheckResponse {
    exists: boolean;
    identifierType: 'email' | 'phone';
    authEmail?: string;  // The email to use for Firebase auth (actual or synthetic)
    error?: string;  // Error message if request fails
}

/**
 * Validates an email address
 */
export const validateEmail = (value: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(value.trim());
};

/**
 * Validates an Indian mobile number (10 digits starting with 6-9)
 */
export const validatePhone = (value: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(value.trim());
};

/**
 * Validates password (minimum 8 characters)
 */
export const validatePassword = (value: string): boolean => {
    return value.length >= 8;
};

/**
 * Detects whether the input is an email or phone number
 */
export const detectIdentifierType = (value: string): 'email' | 'phone' | null => {
    const trimmed = value.trim();

    if (validateEmail(trimmed)) {
        return 'email';
    }

    if (validatePhone(trimmed)) {
        return 'phone';
    }

    return null;
};

/**
 * Generates a synthetic email address for phone-only accounts
 * Format: {phoneNumber}@myark.temp
 */
export const generateSyntheticEmail = (phoneNumber: string): string => {
    const cleaned = phoneNumber.trim().replace(/\D/g, '');
    return `${cleaned}@myark.temp`;
};

/**
 * Checks if an email is a synthetic email
 */
export const isSyntheticEmail = (email: string): boolean => {
    return email.endsWith('@myark.temp');
};

/**
 * Extracts phone number from synthetic email
 */
export const extractPhoneFromSyntheticEmail = (email: string): string | null => {
    if (!isSyntheticEmail(email)) {
        return null;
    }
    return email.replace('@myark.temp', '');
};

/**
 * Formats phone number for display (adds spaces for readability)
 * Example: 9876543210 -> +91 98765 43210
 */
export const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.trim().replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
};

/**
 * Gets a user-friendly label for the identifier type
 */
export const getIdentifierLabel = (type: 'email' | 'phone'): string => {
    return type === 'email' ? 'Email Address' : 'Mobile Number';
};

/**
 * Gets placeholder text for the identifier input
 */
export const getIdentifierPlaceholder = (type: 'email' | 'phone' | null): string => {
    if (type === 'email') return 'you@example.com';
    if (type === 'phone') return '9876543210';
    return 'Email or mobile number';
};
