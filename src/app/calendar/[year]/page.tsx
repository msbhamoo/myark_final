import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { getOpportunities } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';
import OpportunityCalendar from './_components/OpportunityCalendar';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myark.in';

// Parse academic year from URL param (e.g., "2025-26")
const parseAcademicYear = (yearParam: string) => {
    const match = yearParam.match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    const startYear = parseInt(match[1], 10);
    const endYear = parseInt(`20${match[2]}`, 10);
    if (endYear !== startYear + 1) return null;
    return { startYear, endYear, formatted: yearParam };
};

// Generate months for academic year (April to March)
const getAcademicYearMonths = (startYear: number) => {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const monthIndex = (3 + i) % 12; // Start from April (index 3)
        const year = monthIndex >= 3 ? startYear : startYear + 1;
        months.push({ month: monthIndex, year });
    }
    return months;
};

type PageProps = {
    params: Promise<{ year: string }>;
    searchParams: Promise<{ category?: string; month?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { year: yearParam } = await params;
    const parsed = parseAcademicYear(yearParam);

    if (!parsed) {
        return { title: 'Invalid Year | Myark' };
    }

    const title = `Opportunity Calendar ${parsed.formatted} | Scholarships, Olympiads & Exam Deadlines - Myark`;
    const description = `Never miss a deadline! Complete academic calendar for ${parsed.formatted} with all scholarship deadlines, olympiad exam dates, and competition schedules for Indian students. Plan your success!`;

    return {
        title,
        description,
        keywords: [
            `scholarship deadlines ${parsed.startYear}`,
            `olympiad schedule ${parsed.formatted}`,
            `student competitions ${parsed.formatted}`,
            `exam calendar ${parsed.startYear}`,
            `NTSE ${parsed.startYear}`,
            `science olympiad ${parsed.formatted}`,
            `academic calendar india ${parsed.formatted}`,
        ],
        alternates: {
            canonical: `${SITE_URL}/calendar/${parsed.formatted}`,
        },
        openGraph: {
            title: `Opportunity Calendar ${parsed.formatted} - Myark`,
            description,
            url: `${SITE_URL}/calendar/${parsed.formatted}`,
            siteName: 'Myark',
            type: 'website',
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Opportunity Calendar ${parsed.formatted} - Myark`,
            description,
        },
    };
}

// Group opportunities by month
const groupOpportunitiesByDate = (opportunities: Opportunity[]) => {
    const grouped: Record<string, Opportunity[]> = {};

    opportunities.forEach(opp => {
        // Use registration deadline as the primary date
        const dateStr = opp.registrationDeadline;
        if (!dateStr) return;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;

        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(opp);
    });

    return grouped;
};

export default async function CalendarYearPage({ params, searchParams }: PageProps) {
    const { year: yearParam } = await params;
    const { category, month } = await searchParams;

    const parsed = parseAcademicYear(yearParam);
    if (!parsed) {
        notFound();
    }

    // Fetch all opportunities
    let opportunities: Opportunity[] = [];
    let availableCategories: string[] = [];

    try {
        const result = await getOpportunities({
            category: category || '',
            limit: 500, // Get more opportunities for the calendar
        });
        opportunities = result.opportunities;

        // Extract unique categories
        availableCategories = Array.from(
            new Set(
                opportunities
                    .map(opp => opp.category)
                    .filter((cat): cat is string => Boolean(cat))
            )
        ).sort();
    } catch (error) {
        console.error('Failed to fetch opportunities for calendar:', error);
    }

    const academicMonths = getAcademicYearMonths(parsed.startYear);
    const groupedOpportunities = groupOpportunitiesByDate(opportunities);

    // Generate schema markup
    const calendarSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Opportunity Calendar ${parsed.formatted}`,
        description: `Academic calendar with scholarship deadlines and exam dates for ${parsed.formatted}`,
        url: `${SITE_URL}/calendar/${parsed.formatted}`,
        itemListElement: opportunities.slice(0, 50).map((opp, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
                '@type': 'Event',
                name: opp.title,
                startDate: opp.registrationDeadline || opp.startDate,
                url: `${SITE_URL}/opportunity/${opp.slug || opp.id}`,
                organizer: {
                    '@type': 'Organization',
                    name: opp.organizerName || opp.organizer,
                },
            },
        })),
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            <Script
                id="calendar-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(calendarSchema) }}
            />

            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-10 md:py-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                                📅 Academic Year {parsed.formatted}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                                Opportunity Calendar
                            </h1>
                            <p className="text-slate-600 dark:text-slate-300">
                                Never miss a deadline! Plan your academic year with all scholarship deadlines,
                                olympiad exam dates, and competition schedules.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Calendar Component */}
                <section className="pb-16">
                    <div className="container mx-auto max-w-7xl px-4 md:px-6">
                        <OpportunityCalendar
                            academicYear={parsed.formatted}
                            academicMonths={academicMonths}
                            groupedOpportunities={groupedOpportunities}
                            opportunities={opportunities}
                            availableCategories={availableCategories}
                            selectedCategory={category}
                            selectedMonth={month}
                        />
                    </div>
                </section>
            </main>

            <Footer />
            <BottomNavigation />
        </div>
    );
}
