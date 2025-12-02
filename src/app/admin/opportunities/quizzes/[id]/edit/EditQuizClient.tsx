'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizCreatorFormState, QuizOpportunity } from '@/types/quiz';
import StepIndicator from '../../../create-quiz/components/StepIndicator';
import BasicInfoStep from '../../../create-quiz/steps/BasicInfoStep';
import QuizBuilderStep from '../../../create-quiz/steps/QuizBuilderStep';
import LeaderboardSettingsStep from '../../../create-quiz/steps/LeaderboardSettingsStep';
import PreviewStep from '../../../create-quiz/steps/PreviewStep';

const STEPS = [
    { id: 1, name: 'Basic Info', description: 'Title, dates, and settings' },
    { id: 2, name: 'Quiz Builder', description: 'Questions and quiz settings' },
    { id: 3, name: 'Leaderboard', description: 'Visibility settings' },
    { id: 4, name: 'Preview', description: 'Review and update' },
];

interface EditQuizClientProps {
    quizId: string;
    initialData: QuizOpportunity;
}

export default function EditQuizClient({ quizId, initialData }: EditQuizClientProps) {
    const router = useRouter();
    const [formState, setFormState] = useState<QuizCreatorFormState>({
        title: initialData.title,
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
        thumbnailUrl: initialData.thumbnailUrl || '',
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        registrationDeadline: initialData.registrationDeadline || '',
        attemptLimit: initialData.attemptLimit,
        homeSegmentId: initialData.homeSegmentId || '',
        questions: initialData.quizConfig.questions || [],
        settings: initialData.quizConfig.settings || {
            totalDuration: 60,
            shuffleQuestions: false,
            shuffleOptions: false,
            showInstantResults: true,
            allowReview: true,
            showExplanations: true,
            enableNegativeMarking: false,
        },
        leaderboardSettings: initialData.quizConfig.leaderboardSettings || {
            type: 'instant',
            showInstantly: true,
            showToParticipantsOnly: false,
        },
        eligibility: initialData.eligibility || {},
        currentStep: 1,
        isDraft: false,
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateFormState = (updates: Partial<QuizCreatorFormState>) => {
        setFormState((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (formState.currentStep < STEPS.length) {
            updateFormState({ currentStep: formState.currentStep + 1 });
        }
    };

    const handleBack = () => {
        if (formState.currentStep > 1) {
            updateFormState({ currentStep: formState.currentStep - 1 });
        }
    };

    const handleStepClick = (stepId: number) => {
        updateFormState({ currentStep: stepId });
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        setError(null);
        try {
            const response = await fetch(`/api/quiz/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formState.title,
                    description: formState.description,
                    categoryId: formState.categoryId,
                    thumbnailUrl: formState.thumbnailUrl,
                    startDate: formState.startDate,
                    endDate: formState.endDate,
                    registrationDeadline: formState.registrationDeadline,
                    attemptLimit: formState.attemptLimit,
                    homeSegmentId: formState.homeSegmentId,
                    questions: formState.questions,
                    settings: formState.settings,
                    leaderboardSettings: formState.leaderboardSettings,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update quiz');
            }

            alert('Quiz updated successfully!');
            router.push('/admin/opportunities/quizzes');
        } catch (err) {
            setError('Failed to update quiz');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStep = () => {
        switch (formState.currentStep) {
            case 1:
                return <BasicInfoStep formState={formState} updateFormState={updateFormState} />;
            case 2:
                return <QuizBuilderStep formState={formState} updateFormState={updateFormState} />;
            case 3:
                return <LeaderboardSettingsStep formState={formState} updateFormState={updateFormState} />;
            case 4:
                return <PreviewStep formState={formState} />;
            default:
                return null;
        }
    };

    const isStepValid = () => {
        switch (formState.currentStep) {
            case 1:
                return formState.title && formState.categoryId && formState.startDate && formState.endDate;
            case 2:
                return formState.questions.length > 0;
            case 3:
                return true;
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Edit Quiz
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Update quiz details, questions, and settings
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push(`/admin/opportunities/quizzes/${quizId}/registrations`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Registrations
                            </button>
                            <button
                                onClick={() => router.push(`/admin/opportunities/quizzes/${quizId}/submissions`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submissions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                <StepIndicator
                    steps={STEPS}
                    currentStep={formState.currentStep}
                    onStepClick={handleStepClick}
                />

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                {/* Form Step */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={formState.currentStep === 1}
                        className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/admin/opportunities/quizzes')}
                            className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>

                        {formState.currentStep === STEPS.length ? (
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating || !isStepValid()}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                {isUpdating ? 'Updating...' : 'Update Quiz'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                Next Step
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
