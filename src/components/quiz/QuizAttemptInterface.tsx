'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, QuizResponse, QuizSettings } from '@/types/quiz';

interface QuizAttemptInterfaceProps {
    quizId: string;
    questions: QuizQuestion[];
    settings: QuizSettings;
    onSubmit: (responses: QuizResponse[], timeSpent: number) => Promise<void>;
}

export default function QuizAttemptInterface({
    quizId,
    questions,
    settings,
    onSubmit,
}: QuizAttemptInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<QuizResponse[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(settings.totalDuration * 60); // Convert to seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [startTime] = useState(Date.now());

    // Shuffle questions if enabled
    const [displayQuestions] = useState(() => {
        if (settings.shuffleQuestions) {
            return [...questions].sort(() => Math.random() - 0.5);
        }
        return questions;
    });

    // Shuffle options once and memoize - IMPORTANT: Don't shuffle on every render!
    const [shuffledOptions] = useState(() => {
        if (!settings.shuffleOptions) return null;

        // Create shuffled options for each question
        const shuffled: { [questionId: string]: typeof questions[0]['options'] } = {};
        displayQuestions.forEach((q) => {
            shuffled[q.id] = [...q.options].sort(() => Math.random() - 0.5);
        });
        return shuffled;
    });

    // Initialize responses
    useEffect(() => {
        const initialResponses: QuizResponse[] = displayQuestions.map((q) => ({
            questionId: q.id,
            selectedOptions: [],
            markedForReview: false,
        }));
        setResponses(initialResponses);
    }, [displayQuestions]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const handleAutoSubmit = useCallback(async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        await onSubmit(responses, timeSpent);
    }, [responses, onSubmit, startTime, isSubmitting]);

    const handleOptionSelect = (optionId: string) => {
        const currentQuestion = displayQuestions[currentQuestionIndex];
        const currentResponse = responses[currentQuestionIndex];

        let newSelectedOptions: string[];

        if (currentQuestion.type === 'single-choice' || currentQuestion.type === 'true-false') {
            // For single choice, replace selection
            newSelectedOptions = [optionId];
        } else {
            // For multiple choice, toggle selection
            if (currentResponse.selectedOptions.includes(optionId)) {
                newSelectedOptions = currentResponse.selectedOptions.filter((id) => id !== optionId);
            } else {
                newSelectedOptions = [...currentResponse.selectedOptions, optionId];
            }
        }

        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = {
            ...currentResponse,
            selectedOptions: newSelectedOptions,
        };
        setResponses(updatedResponses);
    };

    const toggleMarkForReview = () => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = {
            ...updatedResponses[currentQuestionIndex],
            markedForReview: !updatedResponses[currentQuestionIndex].markedForReview,
        };
        setResponses(updatedResponses);
    };

    const handleNext = () => {
        if (currentQuestionIndex < displayQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleQuestionNavigation = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmitClick = () => {
        if (settings.allowReview) {
            setShowReviewModal(true);
        } else {
            handleFinalSubmit();
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        await onSubmit(responses, timeSpent);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = displayQuestions[currentQuestionIndex];
    const currentResponse = responses[currentQuestionIndex];

    const answeredCount = responses.filter((r) => r.selectedOptions.length > 0).length;
    const markedCount = responses.filter((r) => r.markedForReview).length;
    const unansweredCount = displayQuestions.length - answeredCount;

    // Use memoized shuffled options or original options
    const displayOptions = shuffledOptions
        ? shuffledOptions[currentQuestion?.id] || []
        : currentQuestion?.options || [];

    if (!currentQuestion || !currentResponse) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Timer */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Question {currentQuestionIndex + 1} of {displayQuestions.length}
                        </div>
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Answered: {answeredCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Marked: {markedCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Unanswered: {unansweredCount}
                            </span>
                        </div>
                    </div>

                    {/* Timer */}
                    <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeRemaining < 300
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {formatTime(timeRemaining)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Question Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                            {/* Question Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {currentQuestion.questionText}
                                    </h2>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
                                            {currentQuestion.type === 'single-choice'
                                                ? 'Single Choice'
                                                : currentQuestion.type === 'multiple-choice'
                                                    ? 'Multiple Choice'
                                                    : 'True/False'}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            +{currentQuestion.marks} marks
                                        </span>
                                        {currentQuestion.negativeMarks > 0 && (
                                            <span className="text-red-600 dark:text-red-400 font-medium">
                                                -{currentQuestion.negativeMarks} for incorrect
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={toggleMarkForReview}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentResponse.markedForReview
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                                        }`}
                                >
                                    {currentResponse.markedForReview ? '★ Marked' : '☆ Mark for Review'}
                                </button>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {displayOptions.map((option, index) => {
                                    const isSelected = currentResponse.selectedOptions.includes(option.id);
                                    const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option.id)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isSelected
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {optionLabel}
                                                </div>
                                                <span className="flex-1 text-gray-900 dark:text-white pt-1">
                                                    {option.text}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Previous
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleNext}
                                        disabled={currentQuestionIndex === displayQuestions.length - 1}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next →
                                    </button>

                                    {currentQuestionIndex === displayQuestions.length - 1 && (
                                        <button
                                            onClick={handleSubmitClick}
                                            disabled={isSubmitting}
                                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Navigation Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Question Palette
                            </h3>

                            <div className="grid grid-cols-5 gap-2">
                                {displayQuestions.map((_, index) => {
                                    const response = responses[index];
                                    const isAnswered = response?.selectedOptions.length > 0;
                                    const isMarked = response?.markedForReview;
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleQuestionNavigation(index)}
                                            className={`aspect-square rounded-lg font-semibold text-sm transition-all ${isCurrent
                                                ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800'
                                                : ''
                                                } ${isAnswered && isMarked
                                                    ? 'bg-yellow-500 text-white'
                                                    : isAnswered
                                                        ? 'bg-green-500 text-white'
                                                        : isMarked
                                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-500'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleSubmitClick}
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg font-semibold"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Submit Quiz?
                        </h3>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Questions:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {displayQuestions.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Answered:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {answeredCount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Marked for Review:</span>
                                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                                    {markedCount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Unanswered:</span>
                                <span className="font-semibold text-gray-500 dark:text-gray-400">
                                    {unansweredCount}
                                </span>
                            </div>
                        </div>

                        {unansweredCount > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. Are you sure you want to submit?
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Review Again
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
