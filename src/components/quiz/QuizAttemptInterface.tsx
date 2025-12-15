'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizQuestion, QuizResponse, QuizSettings, QuizOption } from '@/types/quiz';

interface QuizAttemptInterfaceProps {
    quizId: string;
    questions: QuizQuestion[];
    settings: QuizSettings;
    onSubmit: (responses: QuizResponse[], timeSpent: number) => Promise<void>;
}

// Storage keys for persistence
const getStorageKey = (quizId: string, key: string) => `quiz_${quizId}_${key}`;

export default function QuizAttemptInterface({
    quizId,
    questions,
    settings,
    onSubmit,
}: QuizAttemptInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<QuizResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showExitWarning, setShowExitWarning] = useState(false);
    const hasSubmittedRef = useRef(false);

    // Initialize timer from sessionStorage or default
    const [timeRemaining, setTimeRemaining] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem(getStorageKey(quizId, 'timeRemaining'));
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed > 0) {
                    return parsed;
                }
            }
        }
        return settings.totalDuration * 60; // Convert to seconds
    });

    // Initialize startTime from sessionStorage or now
    const [startTime] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem(getStorageKey(quizId, 'startTime'));
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed)) {
                    return parsed;
                }
            }
            // Save the new start time
            const now = Date.now();
            sessionStorage.setItem(getStorageKey(quizId, 'startTime'), now.toString());
            return now;
        }
        return Date.now();
    });

    // Shuffle questions if enabled (only on first load)
    const [displayQuestions] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedOrder = sessionStorage.getItem(getStorageKey(quizId, 'questionOrder'));
            if (savedOrder) {
                try {
                    const order = JSON.parse(savedOrder) as string[];
                    // Reorder questions based on saved order
                    return order.map(id => questions.find(q => q.id === id)).filter(Boolean) as QuizQuestion[];
                } catch (e) {
                    // Fall through to default
                }
            }
        }

        let orderedQuestions = questions;
        if (settings.shuffleQuestions) {
            orderedQuestions = [...questions].sort(() => Math.random() - 0.5);
        }

        // Save the order
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(getStorageKey(quizId, 'questionOrder'), JSON.stringify(orderedQuestions.map(q => q.id)));
        }

        return orderedQuestions;
    });

    // Shuffle options once and memoize
    const [shuffledOptions] = useState(() => {
        if (!settings.shuffleOptions) return null;

        // Try to restore from sessionStorage
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem(getStorageKey(quizId, 'shuffledOptions'));
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    // Fall through to create new
                }
            }
        }

        // Create shuffled options for each question
        const shuffled: { [questionId: string]: typeof questions[0]['options'] } = {};
        displayQuestions.forEach((q) => {
            shuffled[q.id] = [...q.options].sort(() => Math.random() - 0.5);
        });

        // Save to sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(getStorageKey(quizId, 'shuffledOptions'), JSON.stringify(shuffled));
        }

        return shuffled;
    });

    // Initialize responses from sessionStorage or default
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedResponses = sessionStorage.getItem(getStorageKey(quizId, 'responses'));
            if (savedResponses) {
                try {
                    const parsed = JSON.parse(savedResponses) as QuizResponse[];
                    if (parsed.length === displayQuestions.length) {
                        setResponses(parsed);
                        return;
                    }
                } catch (e) {
                    // Fall through to default
                }
            }
        }

        const initialResponses: QuizResponse[] = displayQuestions.map((q) => ({
            questionId: q.id,
            selectedOptions: [],
            markedForReview: false,
        }));
        setResponses(initialResponses);
    }, [displayQuestions, quizId]);

    // Persist responses to sessionStorage
    useEffect(() => {
        if (responses.length > 0 && typeof window !== 'undefined') {
            sessionStorage.setItem(getStorageKey(quizId, 'responses'), JSON.stringify(responses));
        }
    }, [responses, quizId]);

    // Persist time remaining to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(getStorageKey(quizId, 'timeRemaining'), timeRemaining.toString());
        }
    }, [timeRemaining, quizId]);

    // Clear storage after successful submission
    const clearQuizStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(getStorageKey(quizId, 'timeRemaining'));
            sessionStorage.removeItem(getStorageKey(quizId, 'startTime'));
            sessionStorage.removeItem(getStorageKey(quizId, 'responses'));
            sessionStorage.removeItem(getStorageKey(quizId, 'questionOrder'));
            sessionStorage.removeItem(getStorageKey(quizId, 'shuffledOptions'));
        }
    }, [quizId]);

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

    // Navigation warning - beforeunload event
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!hasSubmittedRef.current) {
                e.preventDefault();
                e.returnValue = 'You have an ongoing quiz. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Handle browser back button
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            if (!hasSubmittedRef.current) {
                e.preventDefault();
                // Push state back to prevent navigation
                window.history.pushState(null, '', window.location.href);
                setShowExitWarning(true);
            }
        };

        // Push initial state
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleAutoSubmit = useCallback(async () => {
        if (isSubmitting || hasSubmittedRef.current) return;

        hasSubmittedRef.current = true;
        setIsSubmitting(true);
        // Calculate time spent as: total duration minus remaining time
        const timeSpent = settings.totalDuration * 60 - timeRemaining;
        clearQuizStorage();
        await onSubmit(responses, timeSpent);
    }, [responses, onSubmit, timeRemaining, isSubmitting, clearQuizStorage, settings.totalDuration]);

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
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        setIsSubmitting(true);
        // Calculate time spent as: total duration minus remaining time
        const timeSpent = settings.totalDuration * 60 - timeRemaining;
        clearQuizStorage();
        await onSubmit(responses, timeSpent);
    };

    // Allow exit ref to bypass popstate handler
    const allowExitRef = useRef(false);

    // Handle exit confirmation
    const handleExitConfirm = () => {
        allowExitRef.current = true;
        clearQuizStorage();
        // Use location to navigate back, bypassing our popstate handler
        window.location.href = document.referrer || '/quizzes';
    };

    const handleExitCancel = () => {
        setShowExitWarning(false);
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
    const displayOptions: QuizOption[] = shuffledOptions
        ? shuffledOptions[currentQuestion?.id] || []
        : currentQuestion?.options || [];

    const [showMobilePalette, setShowMobilePalette] = useState(false);

    if (!currentQuestion || !currentResponse) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 lg:pb-0">
            {/* Mobile Sticky Header with Timer */}
            <div className="lg:hidden sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Q {currentQuestionIndex + 1}/{displayQuestions.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-500">{answeredCount}</span>
                        </div>
                    </div>

                    {/* Timer */}
                    <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-sm font-bold ${timeRemaining < 300
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(timeRemaining)}
                    </div>

                    {/* Question Palette Button */}
                    <button
                        onClick={() => setShowMobilePalette(true)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${(answeredCount / displayQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
                {/* Desktop Header with Timer - Hidden on Mobile */}
                <div className="hidden lg:flex bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 items-center justify-between">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(timeRemaining)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Question Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                            {/* Question Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
                                <div className="flex-1">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {currentQuestion.questionText}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                        <span className="px-2 py-1 sm:px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
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
                                    className={`self-start px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${currentResponse.markedForReview
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                                        }`}
                                >
                                    {currentResponse.markedForReview ? '★ Marked' : '☆ Mark'}
                                </button>
                            </div>

                            {/* Options - Compact on Mobile */}
                            <div className="space-y-2 sm:space-y-3">
                                {displayOptions.map((option, index) => {
                                    const isSelected = currentResponse.selectedOptions.includes(option.id);
                                    const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option.id)}
                                            className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-sm ${isSelected
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {optionLabel}
                                                </div>
                                                <span className="flex-1 text-sm sm:text-base text-gray-900 dark:text-white pt-0.5">
                                                    {option.text}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Desktop Navigation Buttons - Hidden on Mobile */}
                            <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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

                    {/* Desktop Question Navigation Panel - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-1">
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

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between px-4 py-3 safe-area-inset-bottom">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                    </button>

                    <button
                        onClick={handleSubmitClick}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg disabled:opacity-50 transition-all font-semibold text-sm shadow-md"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentQuestionIndex === displayQuestions.length - 1}
                        className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Question Palette Drawer */}
            {showMobilePalette && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowMobilePalette(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[70vh] overflow-auto animate-slide-up">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Question Palette
                            </h3>
                            <button
                                onClick={() => setShowMobilePalette(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 mb-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded bg-green-500" />
                                    <span className="text-gray-600 dark:text-gray-400">Answered ({answeredCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded bg-yellow-500" />
                                    <span className="text-gray-600 dark:text-gray-400">Marked ({markedCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600" />
                                    <span className="text-gray-600 dark:text-gray-400">Unanswered ({unansweredCount})</span>
                                </div>
                            </div>

                            {/* Question Grid */}
                            <div className="grid grid-cols-6 gap-2">
                                {displayQuestions.map((_, index) => {
                                    const response = responses[index];
                                    const isAnswered = response?.selectedOptions.length > 0;
                                    const isMarked = response?.markedForReview;
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                handleQuestionNavigation(index);
                                                setShowMobilePalette(false);
                                            }}
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
                        </div>
                    </div>
                </div>
            )}

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
            )
            }

            {/* Exit Warning Modal */}
            {showExitWarning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Leave Quiz?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                You have an ongoing quiz. If you leave now, your progress will be saved and you can resume later.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Time remaining:</strong> {formatTime(timeRemaining)}
                                <br />
                                <strong>Answered:</strong> {answeredCount} of {displayQuestions.length} questions
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleExitCancel}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                Continue Quiz
                            </button>
                            <button
                                onClick={handleExitConfirm}
                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Leave Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
