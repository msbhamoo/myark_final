'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpportunitiesFiltersProps {
    availableCategories: string[];
}

const GRADE_OPTIONS = [
    { label: 'Grades 4-6', value: '4-6' },
    { label: 'Grades 7-9', value: '7-9' },
    { label: 'Grades 10-12', value: '10-12' },
    { label: 'Grade 4', value: '4' },
    { label: 'Grade 5', value: '5' },
    { label: 'Grade 6', value: '6' },
    { label: 'Grade 7', value: '7' },
    { label: 'Grade 8', value: '8' },
    { label: 'Grade 9', value: '9' },
    { label: 'Grade 10', value: '10' },
    { label: 'Grade 11', value: '11' },
    { label: 'Grade 12', value: '12' },
];

export default function OpportunitiesFilters({ availableCategories }: OpportunitiesFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Initialize from URL params
    useEffect(() => {
        const status = searchParams.get('status') as 'all' | 'open' | 'closed' | null;
        if (status) setStatusFilter(status);

        const grades = searchParams.get('grades');
        if (grades) setSelectedGrades(grades.split(','));

        const categories = searchParams.get('categories');
        if (categories) setSelectedCategories(categories.split(','));
    }, []);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Add filter params
        if (statusFilter && statusFilter !== 'all') {
            params.set('status', statusFilter);
        } else {
            params.delete('status');
        }

        if (selectedGrades.length > 0) {
            params.set('grades', selectedGrades.join(','));
        } else {
            params.delete('grades');
        }

        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        } else {
            params.delete('categories');
        }

        const newUrl = params.toString() ? `/opportunities?${params.toString()}` : '/opportunities';
        router.push(newUrl, { scroll: false });
    }, [statusFilter, selectedGrades, selectedCategories, router, searchParams]);

    const toggleGrade = (grade: string) => {
        setSelectedGrades(prev =>
            prev.includes(grade)
                ? prev.filter(g => g !== grade)
                : [...prev, grade]
        );
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearAllFilters = () => {
        setStatusFilter('all');
        setSelectedGrades([]);
        setSelectedCategories([]);
    };

    const hasActiveFilters = statusFilter !== 'all' || selectedGrades.length > 0 || selectedCategories.length > 0;

    return (
        <div className="mb-8 space-y-4">
            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status:</span>
                <div className="flex gap-2">
                    {(['all', 'open', 'closed'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                statusFilter === status
                                    ? 'bg-primary text-white shadow-md dark:bg-accent'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            )}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grade & Category Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Grade Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowGradeDropdown(!showGradeDropdown);
                            setShowCategoryDropdown(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <Filter className="h-4 w-4" />
                        Grades {selectedGrades.length > 0 && `(${selectedGrades.length})`}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {showGradeDropdown && (
                        <div className="absolute left-0 top-full mt-2 z-10 w-56 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                            <div className="max-h-64 overflow-y-auto p-2">
                                {GRADE_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedGrades.includes(option.value)}
                                            onChange={() => toggleGrade(option.value)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Filter Dropdown */}
                {availableCategories.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowCategoryDropdown(!showCategoryDropdown);
                                setShowGradeDropdown(false);
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <Filter className="h-4 w-4" />
                            Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute left-0 top-full mt-2 z-10 w-64 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {availableCategories.map((category) => (
                                        <label
                                            key={category}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <X className="h-4 w-4" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {statusFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-accent/20 dark:text-accent">
                            Status: {statusFilter}
                            <button onClick={() => setStatusFilter('all')} className="hover:text-primary-dark">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {selectedGrades.map((grade) => (
                        <span
                            key={grade}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                        >
                            Grade: {grade}
                            <button onClick={() => toggleGrade(grade)} className="hover:text-blue-900 dark:hover:text-blue-100">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    {selectedCategories.map((category) => (
                        <span
                            key={category}
                            className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
                        >
                            {category}
                            <button onClick={() => toggleCategory(category)} className="hover:text-purple-900 dark:hover:text-purple-100">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Click outside to close dropdowns */}
            {(showGradeDropdown || showCategoryDropdown) && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => {
                        setShowGradeDropdown(false);
                        setShowCategoryDropdown(false);
                    }}
                />
            )}
        </div>
    );
}
