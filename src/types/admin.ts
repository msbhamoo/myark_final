// Admin Panel Type Definitions

// ============================================
// OPPORTUNITY TYPES
// ============================================

export type OpportunityType =
    | 'scholarship'
    | 'workshop'
    | 'competition'
    | 'olympiad'
    | 'foreign-exam'
    | 'internship'
    | 'program'
    | 'fellowship'
    | 'course'
    | 'other';

export type OpportunityStatus = 'draft' | 'published' | 'closed';

export interface OpportunityTypeConfig {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const OPPORTUNITY_TYPES: OpportunityTypeConfig[] = [
    { id: 'scholarship', name: 'Scholarship', icon: 'GraduationCap', color: 'text-green-500', description: 'Financial aid for education' },
    { id: 'workshop', name: 'Workshop', icon: 'Wrench', color: 'text-blue-500', description: 'Hands-on learning sessions' },
    { id: 'competition', name: 'Competition', icon: 'Trophy', color: 'text-yellow-500', description: 'Contests and challenges' },
    { id: 'olympiad', name: 'Olympiad', icon: 'Medal', color: 'text-purple-500', description: 'Academic olympiads' },
    { id: 'foreign-exam', name: 'Foreign Exam', icon: 'Globe', color: 'text-cyan-500', description: 'International exams (SAT, GRE, etc.)' },
    { id: 'internship', name: 'Internship', icon: 'Briefcase', color: 'text-orange-500', description: 'Work experience opportunities' },
    { id: 'program', name: 'Program', icon: 'BookOpen', color: 'text-pink-500', description: 'Educational programs' },
    { id: 'fellowship', name: 'Fellowship', icon: 'Users', color: 'text-indigo-500', description: 'Fellowship opportunities' },
    { id: 'course', name: 'Course', icon: 'Video', color: 'text-red-500', description: 'Online/offline courses' },
    { id: 'other', name: 'Other', icon: 'Sparkles', color: 'text-gray-500', description: 'Other opportunities' },
];

// ============================================
// ORGANIZER TYPES
// ============================================

export type OrganizerType = 'school' | 'government' | 'ngo' | 'corporate' | 'other';

export interface Organizer {
    id: string;
    name: string;
    type: OrganizerType;
    website?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SEOConfig {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    aiSummary?: string; // Distilled version for LLMs
    noIndex?: boolean;
    canonicalUrl?: string;
    schemaType?: 'Scholarship' | 'EducationEvent' | 'Course' | 'FAQPage';
}

export interface Opportunity {
    id: string;
    title: string;
    type: OpportunityType;
    description: string;
    shortDescription: string;
    eligibility: {
        grades: number[];
        maxAge?: number;
        requirements?: string[];
        description?: string; // Rich text description for "Entrance Rights"
    };
    dates: {
        registrationStart: Date;
        registrationEnd: Date;
        eventDate?: Date;
    };
    prizes?: {
        first?: string;
        second?: string;
        third?: string;
        other?: string;
        certificates?: boolean; // Toggles whether certificates are provided
    };
    fees?: number;
    link?: string;
    image?: string;
    organizer?: string;
    location?: string;
    tags: string[];
    status: OpportunityStatus;
    featured: boolean;
    xpValue?: number; // XP points awarded for participating
    hypeCount?: number; // Dynamic like/hype counter
    applicationCount?: number;
    seoConfig?: SEOConfig; // New SEO & AI visibility settings
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// BLOG TYPES
// ============================================

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    author: string;
    category: string;
    tags: string[];
    status: BlogStatus;
    featured: boolean;
    viewCount: number;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// CAREER TYPES
// ============================================

export type CareerStatus = 'active' | 'closed' | 'draft';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';

export interface Career {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    categoryColor: string;
    challenges: string[];
    collegesGlobal: string[];
    collegesIndia: string[];
    degrees: string[];
    didYouKnow: string[];
    exams: string[];
    goodStuff: string[];
    images: string[];
    keywords: string[];
    relatedCareers: string[];
    roadmap: Array<{ title: string; description: string }>;
    salary: {
        min: number;
        max: number;
        currency: string;
        entry?: string;
        mid?: string;
        senior?: string;
        salaryNote?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// STUDENT TYPES
// ============================================

export interface Student {
    id: string;
    name: string;
    email: string;
    phone?: string;
    grade?: number;
    school?: string;
    city?: string;
    state?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    dateOfBirth?: Date;
    interests: string[];
    streakDays: number;
    xpPoints: number;
    level: number;
    badges: string[];
    appliedOpportunities: string[];
    savedOpportunities: string[];
    profileComplete: number; // percentage
    personaGoal?: string;
    competitiveness?: string;
    weeklyTimeCommitment?: string;
    deliveryPreference?: string;
    createdAt: Date;
    lastActiveAt: Date;
}

// ============================================
// SCHOOL DEMO TYPES
// ============================================

export type DemoStatus = 'pending' | 'contacted' | 'scheduled' | 'completed' | 'rejected';

export interface SchoolDemo {
    id: string;
    schoolName: string;
    contactPerson: string;
    designation?: string;
    email: string;
    phone: string;
    city: string;
    state?: string;
    studentCount: string;
    message?: string;
    status: DemoStatus;
    notes?: string;
    scheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationTarget = 'all' | 'by-grade' | 'by-interest' | 'by-school';

export interface Notification {
    id: string;
    title: string;
    message: string;
    target: NotificationTarget;
    targetCriteria?: {
        grades?: number[];
        interests?: string[];
        schools?: string[];
    };
    sentCount?: number;
    openedCount?: number;
    clickedCount?: number;
    scheduledFor?: Date;
    sentAt?: Date;
    createdAt: Date;
}

// ============================================
// BADGE TYPES
// ============================================

export type BadgeCategory = 'achievement' | 'participation' | 'skill' | 'special';
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'legendary' | 'one-time';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    category: BadgeCategory;
    level: BadgeLevel;
    parentId?: string; // For badge trees (e.g., Bronze -> parent is null, Silver -> parent is Bronze)
    xpRequirement?: number;
    xpReward?: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// GAMIFICATION & XP TYPES
// ============================================

export type XPActionType =
    | 'explore'
    | 'heart'
    | 'save'
    | 'apply'
    | 'checklist'
    | 'streak'
    | 'profile_complete';

export interface XPActionConfig {
    id: XPActionType;
    label: string;
    xpValue: number;
    cooldownHours?: number;
    dailyCap?: number;
    abusePrevention?: boolean;
}

export interface GamificationConfig {
    id: 'global_config';
    xpActions: Record<XPActionType, XPActionConfig>;
    xpDecayRate?: number; // % decay per week of inactivity
    trendingHeartThreshold: number; // hearts required to be "trending"
    sessionCooldownMinutes: number; // for YouTube-style hearting
    milestoneInterval: number; // XP points between milestone broadcasts
}

export interface CommunitySignal {
    id: string;
    type: 'badge_unlock' | 'xp_milestone' | 'trending_now';
    message: string;
    targetId?: string; // User ID or Opportunity ID
    createdAt: Date;
}

// ============================================
// REDEMPTION TYPES
// ============================================

export interface RedemptionPartner {
    id: string;
    name: string;
    logo?: string;
    website?: string;
    description: string;
    isActive: boolean;
    category: string;
    createdAt: Date;
}

export interface RedemptionReward {
    id: string;
    partnerId: string;
    title: string;
    description: string;
    xpCost: number;
    couponCode?: string;
    discountValue?: string;
    stockLimit?: number;
    claimCount: number;
    requiredBadgeId?: string;
    requiredLevel?: number;
    eligibilityCriteria?: string;
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
    totalOpportunities: number;
    publishedOpportunities: number;
    totalStudents: number;
    activeStudents: number; // active in last 7 days
    pendingDemos: number;
    totalApplications: number;
    applicationsToday: number;
    totalBlogPosts: number;
    totalCareers: number;
}

// ============================================
// TABLE & FILTER TYPES
// ============================================

export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, item: T) => React.ReactNode;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}
