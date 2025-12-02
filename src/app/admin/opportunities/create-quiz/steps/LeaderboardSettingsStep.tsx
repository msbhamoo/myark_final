'use client';

import { QuizCreatorFormState, LeaderboardVisibilitySettings, LeaderboardVisibilityType } from '@/types/quiz';

interface LeaderboardSettingsStepProps {
    formState: QuizCreatorFormState;
    updateFormState: (updates: Partial<QuizCreatorFormState>) => void;
}

export default function LeaderboardSettingsStep({
    formState,
    updateFormState,
}: LeaderboardSettingsStepProps) {
    const handleSettingChange = (field: keyof LeaderboardVisibilitySettings, value: any) => {
        updateFormState({
            leaderboardSettings: {
                ...formState.leaderboardSettings,
                [field]: value,
            },
        });
    };

    const handleVisibilityTypeChange = (type: LeaderboardVisibilityType) => {
        let newSettings: LeaderboardVisibilitySettings = {
            type,
            showToParticipantsOnly: formState.leaderboardSettings.showToParticipantsOnly,
        };

        if (type === 'instant') {
            newSettings.showInstantly = true;
        } else if (type === 'scheduled') {
            newSettings.scheduledDate = '';
        } else if (type === 'delayed') {
            newSettings.delayHours = 24;
        }

        updateFormState({ leaderboardSettings: newSettings });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Leaderboard Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Configure when and how participants can view the leaderboard
                </p>
            </div>

            {/* Visibility Type Selection */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-indigo-200 dark:border-gray-500">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                    When should the leaderboard be visible?
                </label>

                <div className="space-y-4">
                    {/* Instant Option */}
                    <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${
            formState.leaderboardSettings.type === 'instant'
              ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800/50'
              : 'border-gray-200 dark:border-gray-600'
          }">
                        <input
                            type="radio"
                            name="visibilityType"
                            checked={formState.leaderboardSettings.type === 'instant'}
                            onChange={() => handleVisibilityTypeChange('instant')}
                            className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <svg
                                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Show Instantly
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Leaderboard is visible immediately after each participant submits their quiz
                            </p>
                        </div>
                    </label>

                    {/* Scheduled Option */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${formState.leaderboardSettings.type === 'scheduled'
                            ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800/50'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}>
                        <input
                            type="radio"
                            name="visibilityType"
                            checked={formState.leaderboardSettings.type === 'scheduled'}
                            onChange={() => handleVisibilityTypeChange('scheduled')}
                            className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <svg
                                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Show on Specific Date
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Leaderboard becomes visible on a specific date and time you set
                            </p>

                            {formState.leaderboardSettings.type === 'scheduled' && (
                                <div className="mt-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Scheduled Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formState.leaderboardSettings.scheduledDate || ''}
                                        onChange={(e) => handleSettingChange('scheduledDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </label>

                    {/* Delayed Option */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${formState.leaderboardSettings.type === 'delayed'
                            ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800/50'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}>
                        <input
                            type="radio"
                            name="visibilityType"
                            checked={formState.leaderboardSettings.type === 'delayed'}
                            onChange={() => handleVisibilityTypeChange('delayed')}
                            className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <svg
                                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Show After Delay
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Leaderboard becomes visible X hours after the quiz end date
                            </p>

                            {formState.leaderboardSettings.type === 'delayed' && (
                                <div className="mt-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Delay (in hours)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="1"
                                            max="720"
                                            value={formState.leaderboardSettings.delayHours || 24}
                                            onChange={(e) => handleSettingChange('delayHours', parseInt(e.target.value))}
                                            className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            hours after quiz ends
                                        </span>
                                    </div>
                                    {formState.endDate && formState.leaderboardSettings.delayHours && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Leaderboard will be visible approximately on:{' '}
                                            {new Date(
                                                new Date(formState.endDate).getTime() +
                                                formState.leaderboardSettings.delayHours * 60 * 60 * 1000
                                            ).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Privacy Settings
                </h3>

                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={formState.leaderboardSettings.showToParticipantsOnly || false}
                        onChange={(e) => handleSettingChange('showToParticipantsOnly', e.target.checked)}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Show to participants only
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Only users who have attempted the quiz can view the leaderboard. Non-participants won't have access.
                        </p>
                    </div>
                </label>
            </div>

            {/* Preview Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Leaderboard Configuration Summary
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            {formState.leaderboardSettings.type === 'instant' && (
                                <>Leaderboard will be <strong>visible immediately</strong> after submission.</>
                            )}
                            {formState.leaderboardSettings.type === 'scheduled' && (
                                <>
                                    Leaderboard will be visible on{' '}
                                    <strong>
                                        {formState.leaderboardSettings.scheduledDate
                                            ? new Date(formState.leaderboardSettings.scheduledDate).toLocaleString()
                                            : '[select a date]'}
                                    </strong>
                                    .
                                </>
                            )}
                            {formState.leaderboardSettings.type === 'delayed' && (
                                <>
                                    Leaderboard will be visible{' '}
                                    <strong>{formState.leaderboardSettings.delayHours || 24} hours</strong> after quiz ends.
                                </>
                            )}
                            {formState.leaderboardSettings.showToParticipantsOnly && (
                                <> Only participants can view it.</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
