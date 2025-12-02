'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizCreatorFormState } from '@/types/quiz';
import StepIndicator from './components/StepIndicator';
import BasicInfoStep from './steps/BasicInfoStep';
import QuizBuilderStep from './steps/QuizBuilderStep';
import LeaderboardSettingsStep from './steps/LeaderboardSettingsStep';
import PreviewStep from './steps/PreviewStep';
import { createQuiz, saveDraft } from './actions';

const STEPS = [
    { id: 1, name: 'Basic Info', description: 'Title, dates, and settings' },
    { id: 2, name: 'Quiz Builder', description: 'Questions and quiz settings' },
    { id: 3, name: 'Leaderboard', description: 'Visibility settings' },
    { id: 4, name: 'Preview', description: 'Review and publish' },
];

const initialFormState: QuizCreatorFormState = {
    title: '',
    description: '',
    categoryId: '',
    thumbnailUrl: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    attemptLimit: 1,
    questions: [],
    settings: {
        totalDuration: 60,
        shuffleQuestions: false,
        shuffleOptions: false,
        showInstantResults: true,
        allowReview: true,
        showExplanations: true,
        enableNegativeMarking: false,
    },
    leaderboardSettings: {
        type: 'instant',
        showInstantly: true,
        showToParticipantsOnly: false,
    },
    eligibility: {},
    currentStep: 1,
    isDraft: true,
};

export default function QuizCreatorPage() {
    const router = useRouter();
    const [formState, setFormState] = useState<QuizCreatorFormState>(initialFormState);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
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
        // Allow jumping to any step
        updateFormState({ currentStep: stepId });
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await saveDraft(formState);
            alert('Draft saved successfully!');
        } catch (err) {
            setError('Failed to save draft');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        setError(null);
        try {
            const quizId = await createQuiz(formState);
            alert('Quiz published successfully!');
            router.push(`/admin/opportunities`);
        } catch (err) {
            setError('Failed to publish quiz');
            console.error(err);
        } finally {
            setIsPublishing(false);
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
                return true; // Leaderboard settings have defaults
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Create Quiz
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Build an engaging quiz with questions, settings, and leaderboard
                    </p>
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
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="px-6 py-3 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </button>

                        {formState.currentStep === STEPS.length ? (
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing || !isStepValid()}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                {isPublishing ? 'Publishing...' : 'Publish Quiz'}
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
