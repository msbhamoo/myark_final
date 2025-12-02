'use client';

import { QuizCreatorFormState } from '@/types/quiz';

interface PreviewStepProps {
    formState: QuizCreatorFormState;
}

export default function PreviewStep({ formState }: PreviewStepProps) {
    const totalMarks = formState.questions.reduce((sum, q) => sum + q.marks, 0);
    const totalNegativeMarks = formState.questions.reduce((sum, q) => sum + (q.negativeMarks || 0), 0);

    // Validation checks
    const validationIssues = [];
    if (!formState.title) validationIssues.push('Quiz title is missing');
    if (!formState.categoryId) validationIssues.push('Category not selected');
    if (!formState.startDate) validationIssues.push('Start date not set');
    if (!formState.endDate) validationIssues.push('End date not set');
    if (formState.questions.length === 0) validationIssues.push('No questions added');
    if (formState.leaderboardSettings.type === 'scheduled' && !formState.leaderboardSettings.scheduledDate) {
        validationIssues.push('Scheduled leaderboard date not set');
    }

    const hasErrors = validationIssues.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Preview & Publish
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Review all quiz details before publishing
                </p>
            </div>

            {/* Validation Status */}
            {hasErrors ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                                Please fix the following issues:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                                {validationIssues.map((issue, index) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <svg
                            className="w-6 h-6 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                            All required fields are complete. Ready to publish!
                        </p>
                    </div>
                </div>
            )}

            {/* Basic Info Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Basic Information
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Title:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{formState.title || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{formState.categoryId || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {formState.startDate ? new Date(formState.startDate).toLocaleString() : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {formState.endDate ? new Date(formState.endDate).toLocaleString() : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Attempt Limit:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {formState.attemptLimit} {formState.attemptLimit === 1 ? 'attempt' : 'attempts'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quiz Stats Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    Quiz Statistics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {formState.questions.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Questions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {totalMarks}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Marks</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {formState.settings.totalDuration}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {formState.settings.enableNegativeMarking ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Negative Marking</div>
                    </div>
                </div>
            </div>

            {/* Quiz Settings Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    Quiz Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <SettingItem
                        label="Shuffle Questions"
                        value={formState.settings.shuffleQuestions}
                    />
                    <SettingItem
                        label="Shuffle Options"
                        value={formState.settings.shuffleOptions}
                    />
                    <SettingItem
                        label="Instant Results"
                        value={formState.settings.showInstantResults}
                    />
                    <SettingItem
                        label="Allow Review"
                        value={formState.settings.allowReview}
                    />
                    <SettingItem
                        label="Show Explanations"
                        value={formState.settings.showExplanations}
                    />
                </div>
            </div>

            {/* Leaderboard Settings Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    Leaderboard Settings
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                        <span className="text-gray-900 dark:text-white font-medium capitalize">
                            {formState.leaderboardSettings.type}
                        </span>
                    </div>

                    {formState.leaderboardSettings.type === 'scheduled' && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Show on:</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {formState.leaderboardSettings.scheduledDate
                                    ? new Date(formState.leaderboardSettings.scheduledDate).toLocaleString()
                                    : '—'}
                            </span>
                        </div>
                    )}

                    {formState.leaderboardSettings.type === 'delayed' && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Delay:</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {formState.leaderboardSettings.delayHours} hours after quiz ends
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Participants Only:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {formState.leaderboardSettings.showToParticipantsOnly ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Questions Preview */}
            {formState.questions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Questions Preview
                    </h3>

                    <div className="space-y-4">
                        {formState.questions.slice(0, 3).map((question, index) => (
                            <div
                                key={question.id}
                                className="border-l-4 border-indigo-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700/50"
                            >
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    {index + 1}. {question.questionText}
                                </p>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {question.type} • {question.marks} marks
                                    {question.negativeMarks > 0 && ` • -${question.negativeMarks} negative`}
                                </div>
                            </div>
                        ))}

                        {formState.questions.length > 3 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                ... and {formState.questions.length - 3} more questions
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SettingItem({ label, value }: { label: string; value: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">{label}:</span>
            <div className="flex items-center gap-2">
                {value ? (
                    <>
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-600 dark:text-green-400 font-medium">Enabled</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-500 dark:text-gray-400">Disabled</span>
                    </>
                )}
            </div>
        </div>
    );
}
