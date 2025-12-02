// Quiz Question Types
export type QuestionType = 'single-choice' | 'multiple-choice' | 'true-false';

export interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    type: QuestionType;
    options: QuizOption[];
    marks: number;
    negativeMarks: number;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    imageUrl?: string;
    order: number;
}

// Quiz Settings
export interface QuizSettings {
    totalDuration: number; // in minutes
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showInstantResults: boolean;
    allowReview: boolean; // Allow reviewing answers before submit
    showExplanations: boolean; // Show explanations after submission
    enableNegativeMarking: boolean;
    passingPercentage?: number;
}

// Leaderboard Visibility Settings
export type LeaderboardVisibilityType = 'instant' | 'scheduled' | 'delayed';

export interface LeaderboardVisibilitySettings {
    type: LeaderboardVisibilityType;
    showInstantly?: boolean; // For 'instant' type
    scheduledDate?: string; // ISO date string for 'scheduled' type
    delayHours?: number; // Number of hours after quiz end for 'delayed' type
    showToParticipantsOnly?: boolean; // Only show to those who attempted
}

// Quiz Configuration (stored in opportunity document)
export interface QuizConfiguration {
    questions: QuizQuestion[];
    settings: QuizSettings;
    leaderboardSettings: LeaderboardVisibilitySettings;
    totalMarks: number;
    totalQuestions: number;
}

// Quiz Attempt (subcollection document)
export interface QuizAttempt {
    id: string;
    userId: string;
    userName: string;
    userEmail: string | null;
    quizId: string; // Opportunity ID
    attemptNumber: number; // 1, 2, 3 if multiple attempts allowed
    startedAt: string; // ISO date string
    submittedAt: string | null;
    timeSpent: number; // in seconds
    responses: QuizResponse[];
    score: number | null;
    maxScore: number;
    percentage: number | null;
    passed?: boolean;
    evaluated: boolean;
    evaluatedAt: string | null;
}

export interface QuizResponse {
    questionId: string;
    selectedOptions: string[]; // Option IDs
    markedForReview: boolean;
    isCorrect?: boolean;
    marksAwarded?: number;
    timeSpent?: number; // Time spent on this question in seconds
}

// Leaderboard Entry
export interface LeaderboardEntry {
    userId: string;
    userName: string;
    userAvatar?: string;
    userSlug?: string;
    score: number;
    maxScore: number;
    percentage: number;
    rank: number;
    timeTaken: number; // in seconds
    submittedAt: string; // ISO date string
    attemptId: string;
}

// Quiz Result Summary
export interface QuizResultSummary {
    attemptId?: string;
    attempt?: QuizAttempt;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    totalQuestions: number;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    rank?: number;
    totalParticipants?: number;
    timeTaken: number;
    submittedAt?: string;
}

// Extended Opportunity type for Quiz
export interface QuizOpportunity {
    id: string;
    type: 'quiz';
    title: string;
    slug: string;
    description: string;
    categoryId: string;
    categoryName?: string;
    organizerId?: string;
    organizerName?: string;
    thumbnailUrl?: string;

    // Dates
    createdAt: string;
    updatedAt: string;
    startDate: string;
    endDate: string;
    registrationDeadline?: string;
    publishedAt: string | null;

    // Eligibility
    eligibility: {
        ageRange?: { min: number; max: number };
        classes?: string[];
        locations?: { countries?: string[]; states?: string[] };
    };

    // Settings
    attemptLimit: number; // 1 for single attempt, 0 for unlimited
    visibility: 'draft' | 'scheduled' | 'published';

    // Quiz Configuration
    quizConfig: QuizConfiguration;
    leaderboardSettings?: LeaderboardVisibilitySettings;

    // Home Page Visibility
    homeSegmentId?: string; // Which home segment to display quiz in

    // Stats
    registrationCount: number;
    submissionCount: number;
    views: number;
    registeredUsers?: string[]; // Array of user IDs who registered

    // SEO
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
}

// Form State for Admin
export interface QuizCreatorFormState {
    // Step 1: Basic Info
    title: string;
    description: string;
    categoryId: string;
    thumbnailUrl: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    attemptLimit: number;
    homeSegmentId?: string;

    // Step 2: Quiz Builder
    questions: QuizQuestion[];
    settings: QuizSettings;

    // Step 3: Leaderboard Settings
    leaderboardSettings: LeaderboardVisibilitySettings;

    // Step 4: Eligibility (optional for now)
    eligibility: {
        ageRange?: { min: number; max: number };
        classes?: string[];
    };

    // Meta
    currentStep: number;
    isDraft: boolean;
}
