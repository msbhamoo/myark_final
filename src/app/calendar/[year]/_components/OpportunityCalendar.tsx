'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Filter,
    Download,
    Share2,
    Clock,
    GraduationCap,
    Trophy,
    BookOpen,
    Zap,
    Printer,
    Check,
    Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/types/opportunity';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Category colors and icons
const CATEGORY_CONFIG: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
    scholarships: {
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30',
        icon: <GraduationCap className="w-3 h-3" />
    },
    olympiad: {
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30',
        icon: <BookOpen className="w-3 h-3" />
    },
    olympiads: {
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30',
        icon: <BookOpen className="w-3 h-3" />
    },
    competition: {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30',
        icon: <Trophy className="w-3 h-3" />
    },
    competitions: {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30',
        icon: <Trophy className="w-3 h-3" />
    },
    bootcamp: {
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30',
        icon: <Zap className="w-3 h-3" />
    },
    bootcamps: {
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30',
        icon: <Zap className="w-3 h-3" />
    },
};

const getCategoryConfig = (category: string) => {
    const normalized = category?.toLowerCase().trim() || '';
    return CATEGORY_CONFIG[normalized] || {
        color: 'text-primary dark:text-primary',
        bgColor: 'bg-primary/10 dark:bg-primary/20 border-primary/20',
        icon: <CalendarIcon className="w-3 h-3" />
    };
};

interface OpportunityCalendarProps {
    academicYear: string;
    academicMonths: { month: number; year: number }[];
    groupedOpportunities: Record<string, Opportunity[]>;
    opportunities: Opportunity[];
    availableCategories: string[];
    selectedCategory?: string;
    selectedMonth?: string;
}

export default function OpportunityCalendar({
    academicYear,
    academicMonths,
    groupedOpportunities,
    opportunities,
    availableCategories,
    selectedCategory,
    selectedMonth,
}: OpportunityCalendarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current date
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Find initial month index (current month or first month of academic year)
    const initialMonthIdx = useMemo(() => {
        if (selectedMonth) {
            const [y, m] = selectedMonth.split('-').map(Number);
            const idx = academicMonths.findIndex(am => am.year === y && am.month === m - 1);
            return idx >= 0 ? idx : 0;
        }
        const idx = academicMonths.findIndex(am => am.year === today.getFullYear() && am.month === today.getMonth());
        return idx >= 0 ? idx : 0;
    }, [academicMonths, selectedMonth, today]);

    const [currentMonthIdx, setCurrentMonthIdx] = useState(initialMonthIdx);
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    const currentMonthData = academicMonths[currentMonthIdx];
    const currentMonth = currentMonthData.month;
    const currentYear = currentMonthData.year;

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: { date: number | null; key: string; isToday: boolean; opportunities: Opportunity[] }[] = [];

        // Add empty cells for days before the first
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ date: null, key: `empty-${i}`, isToday: false, opportunities: [] });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayOpportunities = groupedOpportunities[key] || [];

            // Filter by category if selected
            const filteredOpportunities = selectedCategory
                ? dayOpportunities.filter(opp => opp.category?.toLowerCase() === selectedCategory.toLowerCase())
                : dayOpportunities;

            days.push({
                date: day,
                key,
                isToday: key === todayKey,
                opportunities: filteredOpportunities,
            });
        }

        return days;
    }, [currentYear, currentMonth, groupedOpportunities, selectedCategory, todayKey]);

    // Navigation handlers
    const goToPrevMonth = () => {
        if (currentMonthIdx > 0) {
            setCurrentMonthIdx(currentMonthIdx - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonthIdx < academicMonths.length - 1) {
            setCurrentMonthIdx(currentMonthIdx + 1);
        }
    };

    const handleCategoryFilter = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Count opportunities per day for highlighting
    const maxOpportunitiesPerDay = useMemo(() => {
        return Math.max(...calendarDays.map(d => d.opportunities.length), 1);
    }, [calendarDays]);

    // Generate ICS file content
    const generateICS = useCallback(() => {
        const events = opportunities
            .filter(opp => opp.registrationDeadline)
            .map(opp => {
                const deadline = new Date(opp.registrationDeadline!);
                const dateStr = deadline.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const uid = `${opp.id}@myark.in`;
                return `BEGIN:VEVENT
UID:${uid}
DTSTART:${dateStr}
DTEND:${dateStr}
SUMMARY:${opp.title} - Registration Deadline
DESCRIPTION:${opp.category || 'Opportunity'} - ${opp.organizerName || opp.organizer}\nVisit: https://myark.in/opportunity/${opp.slug || opp.id}
URL:https://myark.in/opportunity/${opp.slug || opp.id}
STATUS:CONFIRMED
END:VEVENT`;
            });

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Myark//Opportunity Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Myark Opportunity Calendar ${academicYear}
${events.join('\n')}
END:VCALENDAR`;

        return icsContent;
    }, [opportunities, academicYear]);

    // Download ICS file
    const handleDownloadICS = useCallback(() => {
        const icsContent = generateICS();
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `myark-calendar-${academicYear}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [generateICS, academicYear]);

    // Print calendar
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Share calendar
    const [copied, setCopied] = useState(false);
    const handleShare = useCallback(async () => {
        const shareUrl = `https://myark.in/calendar/${academicYear}`;
        const shareData = {
            title: `Opportunity Calendar ${academicYear} - Myark`,
            text: 'Check out the academic calendar with all scholarship deadlines and olympiad dates!',
            url: shareUrl,
        };

        if (navigator.share && navigator.canShare?.(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or share failed
            }
        } else {
            // Fallback to copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [academicYear]);

    return (
        <div className="space-y-6">
            {/* Month Navigation & Filters Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Month Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevMonth}
                        disabled={currentMonthIdx === 0}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 min-w-[200px] justify-center">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-lg text-slate-900 dark:text-white">
                            {MONTH_NAMES[currentMonth]} {currentYear}
                        </span>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        disabled={currentMonthIdx === academicMonths.length - 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Month Selector (Desktop) */}
                <div className="hidden lg:flex items-center gap-1 flex-wrap">
                    {academicMonths.map((am, idx) => (
                        <button
                            key={`${am.year}-${am.month}`}
                            onClick={() => setCurrentMonthIdx(idx)}
                            className={cn(
                                'px-2 py-1 text-xs font-medium rounded transition-colors',
                                idx === currentMonthIdx
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                        >
                            {MONTH_NAMES[am.month].slice(0, 3)}
                        </button>
                    ))}
                </div>

                {/* Filter Toggle & Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                            showFilters
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Filters</span>
                    </button>

                    <button
                        onClick={handleDownloadICS}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Download Calendar (ICS)"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Download</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors print:hidden"
                        title="Print Calendar"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Print</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Share Calendar"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                        <span className="text-sm font-medium hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            {showFilters && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryFilter('')}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                                !selectedCategory
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                            )}
                        >
                            All Categories
                        </button>
                        {availableCategories.map(cat => {
                            const config = getCategoryConfig(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryFilter(cat)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5',
                                        selectedCategory?.toLowerCase() === cat.toLowerCase()
                                            ? 'bg-primary text-white border-primary'
                                            : `${config.bgColor} ${config.color} hover:opacity-80`
                                    )}
                                >
                                    {config.icon}
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Legend:</span>
                {Object.entries(CATEGORY_CONFIG).slice(0, 4).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <div className={cn('w-3 h-3 rounded-sm border', config.bgColor)} />
                        <span className="capitalize">{key}</span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    {WEEKDAYS.map(day => (
                        <div
                            key={day}
                            className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const hasOpportunities = day.opportunities.length > 0;
                        const opportunityIntensity = day.opportunities.length / maxOpportunitiesPerDay;

                        return (
                            <div
                                key={day.key}
                                className={cn(
                                    'min-h-[100px] md:min-h-[120px] p-1.5 md:p-2 border-b border-r border-slate-100 dark:border-slate-700 relative transition-colors',
                                    day.date === null && 'bg-slate-50 dark:bg-slate-900/50',
                                    day.isToday && 'bg-primary/5 dark:bg-primary/10',
                                    hoveredDate === day.key && hasOpportunities && 'bg-slate-50 dark:bg-slate-700/50'
                                )}
                                onMouseEnter={() => setHoveredDate(day.key)}
                                onMouseLeave={() => setHoveredDate(null)}
                            >
                                {day.date !== null && (
                                    <>
                                        {/* Date Number */}
                                        <div className={cn(
                                            'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1',
                                            day.isToday
                                                ? 'bg-primary text-white'
                                                : 'text-slate-700 dark:text-slate-300'
                                        )}>
                                            {day.date}
                                        </div>

                                        {/* Opportunity Badges */}
                                        <div className="space-y-0.5 overflow-hidden max-h-[60px] md:max-h-[80px]">
                                            {day.opportunities.slice(0, 3).map((opp, i) => {
                                                const config = getCategoryConfig(opp.category || '');
                                                return (
                                                    <Link
                                                        key={opp.id}
                                                        href={`/opportunity/${opp.slug || opp.id}`}
                                                        className={cn(
                                                            'block px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium truncate border transition-all hover:scale-[1.02]',
                                                            config.bgColor,
                                                            config.color
                                                        )}
                                                        title={opp.title}
                                                    >
                                                        {opp.title}
                                                    </Link>
                                                );
                                            })}
                                            {day.opportunities.length > 3 && (
                                                <div className="px-1.5 py-0.5 text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    +{day.opportunities.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Opportunities List for Current Month */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Upcoming Deadlines in {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>

                <div className="grid gap-3">
                    {calendarDays
                        .filter(d => d.opportunities.length > 0)
                        .flatMap(d => d.opportunities.map(opp => ({ ...opp, dateKey: d.key, date: d.date })))
                        .slice(0, 10)
                        .map(opp => {
                            const config = getCategoryConfig(opp.category || '');
                            const deadline = new Date(opp.registrationDeadline || '');
                            const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <Link
                                    key={opp.id}
                                    href={`/opportunity/${opp.slug || opp.id}`}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                                >
                                    <div className={cn(
                                        'w-14 h-14 rounded-lg flex flex-col items-center justify-center border flex-shrink-0',
                                        config.bgColor
                                    )}>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{opp.date}</span>
                                        <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                                            {MONTH_NAMES[currentMonth].slice(0, 3)}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{opp.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className={cn('flex items-center gap-1', config.color)}>
                                                {config.icon}
                                                {opp.category}
                                            </span>
                                            <span>•</span>
                                            <span>{opp.organizerName || opp.organizer}</span>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        'px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0',
                                        daysLeft <= 3
                                            ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                            : daysLeft <= 7
                                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                                                : 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                                    )}>
                                        {daysLeft <= 0 ? 'Closed' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                                    </div>
                                </Link>
                            );
                        })}

                    {calendarDays.filter(d => d.opportunities.length > 0).length === 0 && (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No deadlines in {MONTH_NAMES[currentMonth]} {currentYear}</p>
                            {selectedCategory && (
                                <p className="text-sm mt-1">Try removing the category filter</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
