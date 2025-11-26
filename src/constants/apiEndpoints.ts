/**
 * Centralized API endpoint constants
 * Use these instead of hardcoded strings to prevent typos and make refactoring easier
 */

export const API_ENDPOINTS = {
    // Admin API endpoints
    admin: {
        // Authentication
        auth: '/api/admin/auth',

        // Opportunities
        opportunities: '/api/admin/opportunities',
        opportunityById: (id: string) => `/api/admin/opportunities/${id}`,

        // Master data
        opportunityCategories: '/api/admin/opportunity-categories',
        opportunityCategoryById: (id: string) => `/api/admin/opportunity-categories/${id}`,
        organizers: '/api/admin/organizers',
        organizerById: (id: string) => `/api/admin/organizers/${id}`,

        // Home segments
        homeSegments: '/api/admin/home-segments',
        homeSegmentById: (id: string) => `/api/admin/home-segments/${id}`,
        homeStats: '/api/admin/home-stats',

        // Geography
        countries: '/api/admin/countries',
        countryById: (id: string) => `/api/admin/countries/${id}`,
        states: '/api/admin/states',
        stateById: (id: string) => `/api/admin/states/${id}`,
        cities: '/api/admin/cities',
        cityById: (id: string) => `/api/admin/cities/${id}`,

        // Schools
        schools: '/api/admin/schools',
        schoolById: (id: string) => `/api/admin/schools/${id}`,

        // Users
        users: '/api/admin/users',
        userById: (id: string) => `/api/admin/users/${id}`,
        resetPassword: '/api/admin/users/reset-password',
        backfillRegistrations: '/api/admin/users/backfill-registrations',

        // Blogs
        blogs: '/api/admin/blogs',
        blogById: (id: string) => `/api/admin/blogs/${id}`,

        // Hosts
        hosts: '/api/admin/hosts',

        // Uploads
        upload: '/api/admin/upload',
        uploads: '/api/admin/uploads',
        uploadsByEntity: (entity: string) => `/api/admin/uploads/${entity}`,
        uploadTemplates: '/api/admin/uploads/templates',
    },

    // Public API endpoints
    opportunities: {
        list: '/api/opportunities',
        search: '/api/opportunities/search',
        byId: (id: string) => `/api/opportunities/${id}`,
        trackView: (id: string) => `/api/opportunities/${id}/track-view`,
        register: (id: string) => `/api/opportunities/${id}/register`,
        registerExternal: (id: string) => `/api/opportunities/${id}/register/external`,
        bookmark: (id: string) => `/api/opportunities/${id}/bookmark`,
        applied: '/api/opportunities/applied',
        saved: '/api/opportunities/saved',
        mine: '/api/opportunities/mine',
        submit: '/api/opportunities/submit',
    },

    // Theme
    theme: '/api/theme',

    // Home
    home: '/api/home',
    homeSegments: '/api/home-segments',

    // Blogs
    blogs: '/api/blogs',
    blogById: (id: string) => `/api/blogs/${id}`,
} as const;

/**
 * Helper function to build URLs with query parameters
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    if (!params) return endpoint;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
}
