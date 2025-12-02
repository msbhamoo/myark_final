'use client';

import Link from 'next/link';
import { Calendar, Clock, Users, Award } from 'lucide-react';

interface QuizCardProps {
    id: string;
    title: string;
    description?: string;
    categoryName?: string;
    thumbnailUrl?: string;
    totalQuestions: number;
    totalMarks: number;
    duration: number;
    startDate: string;
    endDate: string;
    submissionCount?: number;
    className?: string;
}

export default function QuizCard({
    id,
    title,
    description,
    categoryName,
    thumbnailUrl,
    totalQuestions,
    totalMarks,
    duration,
    startDate,
    endDate,
    submissionCount = 0,
    className = '',
}: QuizCardProps) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isActive = now >= start && now <= end;
    const hasEnded = now > end;
    const notStarted = now < start;

    const statusBadge = hasEnded ? (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            Ended
        </span>
    ) : notStarted ? (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
            Upcoming
        </span>
    ) : (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            Active
        </span>
    );

    return (
        <Link href={`/quiz/${id}`}>
            <div className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
                {/* Thumbnail */}
                {thumbnailUrl && (
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                            {statusBadge}
                        </div>
                    </div>
                )}

                <div className="p-5">
                    {/* Category */}
                    {categoryName && (
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
                            📝 {categoryName}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {description}
                        </p>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{totalQuestions} Qs</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Award className="w-4 h-4" />
                            <span>{totalMarks} Marks</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{submissionCount} taken</span>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
