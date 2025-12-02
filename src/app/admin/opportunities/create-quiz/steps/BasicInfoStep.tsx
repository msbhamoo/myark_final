'use client';

import { useState, useEffect } from 'react';
import { QuizCreatorFormState } from '@/types/quiz';

interface BasicInfoStepProps {
    formState: QuizCreatorFormState;
    updateFormState: (updates: Partial<QuizCreatorFormState>) => void;
}

export default function BasicInfoStep({ formState, updateFormState }: BasicInfoStepProps) {
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [homeSegments, setHomeSegments] = useState<Array<{ id: string; title: string }>>([]);
    const [loadingSegments, setLoadingSegments] = useState(true);

    useEffect(() => {
        // Fetch categories from API
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.categories || []);
            })
            .catch((err) => console.error('Failed to fetch categories', err))
            .finally(() => setLoadingCategories(false));

        // Fetch home segments from API
        fetch('/api/admin/home-segments')
            .then((res) => res.json())
            .then((data) => {
                setHomeSegments(data.items || []);
            })
            .catch((err) => console.error('Failed to fetch home segments', err))
            .finally(() => setLoadingSegments(false));
    }, []);

    const handleChange = (field: keyof QuizCreatorFormState, value: any) => {
        updateFormState({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Basic Information
            </h2>

            {/* Quiz Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quiz Title *
                </label>
                <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., National Science Quiz Championship 2024"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                </label>
                <textarea
                    value={formState.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe the quiz, its objectives, and what participants will learn..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                </label>
                {loadingCategories ? (
                    <div className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500">
                        Loading categories...
                    </div>
                ) : (
                    <select
                        value={formState.categoryId}
                        onChange={(e) => handleChange('categoryId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Thumbnail URL */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail URL
                </label>
                <input
                    type="url"
                    value={formState.thumbnailUrl}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://example.com/quiz-image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {formState.thumbnailUrl && (
                    <div className="mt-3">
                        <img
                            src={formState.thumbnailUrl}
                            alt="Thumbnail preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            {/* Home Page Segment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display on Home Page (Optional)
                </label>
                {loadingSegments ? (
                    <div className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500">
                        Loading segments...
                    </div>
                ) : (
                    <select
                        value={formState.homeSegmentId || ''}
                        onChange={(e) => handleChange('homeSegmentId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">Don't show on homepage</option>
                        {homeSegments
                            .filter((seg: any) => seg.isVisible !== false)
                            .map((seg: any) => (
                                <option key={seg.id || seg.segmentKey} value={seg.segmentKey || seg.id}>
                                    {seg.title}
                                </option>
                            ))}
                    </select>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose which homepage section should display this quiz
                </p>
            </div>

            {/* Start Date & Time */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date & Time *
                </label>
                <input
                    type="datetime-local"
                    value={formState.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date & Time *
                </label>
                <input
                    type="datetime-local"
                    value={formState.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Deadline
                </label>
                <input
                    type="datetime-local"
                    value={formState.registrationDeadline}
                    onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* Attempt Limit */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Attempts Allowed
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={formState.attemptLimit}
                        onChange={(e) => handleChange('attemptLimit', parseInt(e.target.value))}
                        className="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Set to 1 for single attempt, higher for multiple attempts
                    </span>
                </div>
            </div>

            {/* Eligibility (Optional for now) */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                    Eligibility (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Minimum Age
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={formState.eligibility.ageRange?.min || ''}
                            onChange={(e) =>
                                handleChange('eligibility', {
                                    ...formState.eligibility,
                                    ageRange: {
                                        ...formState.eligibility.ageRange,
                                        min: parseInt(e.target.value) || undefined,
                                        max: formState.eligibility.ageRange?.max,
                                    },
                                })
                            }
                            placeholder="e.g., 10"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Maximum Age
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={formState.eligibility.ageRange?.max || ''}
                            onChange={(e) =>
                                handleChange('eligibility', {
                                    ...formState.eligibility,
                                    ageRange: {
                                        ...formState.eligibility.ageRange,
                                        min: formState.eligibility.ageRange?.min,
                                        max: parseInt(e.target.value) || undefined,
                                    },
                                })
                            }
                            placeholder="e.g., 18"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
