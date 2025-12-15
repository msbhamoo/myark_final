'use server';

import { QuizCreatorFormState, QuizOpportunity } from '@/types/quiz';
import { getDb } from '@/lib/firebaseAdmin';

const db = getDb();

export async function createQuiz(formState: QuizCreatorFormState): Promise<string> {
    try {
        // Generate slug from title
        const slug = formState.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Calculate total marks and questions
        const totalMarks = formState.questions.reduce((sum, q) => sum + q.marks, 0);
        const totalQuestions = formState.questions.length;

        // Create quiz opportunity document
        const quizOpportunity: Omit<QuizOpportunity, 'id'> = {
            type: 'quiz',
            title: formState.title,
            slug,
            description: formState.description,
            categoryId: formState.categoryId,
            thumbnailUrl: formState.thumbnailUrl,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            startDate: formState.startDate,
            endDate: formState.endDate,
            registrationDeadline: formState.registrationDeadline,
            publishedAt: new Date().toISOString(),

            eligibility: formState.eligibility,

            attemptLimit: formState.attemptLimit,
            visibility: 'published',

            // CRITICAL: Add homeSegmentId for homepage display
            homeSegmentId: formState.homeSegmentId || '',

            // Link to parent opportunity (optional)
            opportunityId: formState.opportunityId || undefined,
            opportunityTitle: formState.opportunityTitle || undefined,

            quizConfig: {
                questions: formState.questions,
                settings: formState.settings,
                leaderboardSettings: formState.leaderboardSettings,
                totalMarks,
                totalQuestions,
            },

            registrationCount: 0,
            submissionCount: 0,
            views: 0,

            seoTitle: formState.title,
            seoDescription: formState.description.substring(0, 160),
            seoKeywords: [],
        };

        // Add to Firestore
        const docRef = await db.collection('quizzes').add(quizOpportunity);

        return docRef.id;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw new Error('Failed to create quiz');
    }
}

export async function saveDraft(formState: QuizCreatorFormState): Promise<void> {
    try {
        // TODO: Get current user ID from session
        const userId = 'admin'; // Replace with actual user ID

        const draftData = {
            ...formState,
            userId,
            lastSavedAt: new Date().toISOString(),
        };

        // Save to drafts collection
        await db.collection('quiz_drafts').doc(userId).set(draftData);
    } catch (error) {
        console.error('Error saving draft:', error);
        throw new Error('Failed to save draft');
    }
}

export async function loadDraft(userId: string): Promise<QuizCreatorFormState | null> {
    try {
        const doc = await db.collection('quiz_drafts').doc(userId).get();

        if (!doc.exists) {
            return null;
        }

        return doc.data() as QuizCreatorFormState;
    } catch (error) {
        console.error('Error loading draft:', error);
        return null;
    }
}
