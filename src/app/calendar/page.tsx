import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Get current academic year (April to March in India)
const getCurrentAcademicYear = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const startYear = month >= 3 ? year : year - 1;
    return `${startYear}-${String(startYear + 1).slice(-2)}`;
};

export const metadata: Metadata = {
    title: 'Opportunity Calendar | Myark',
    description: 'Academic calendar with scholarship deadlines, olympiad dates, and competition schedules.',
};

export default function CalendarPage() {
    // Redirect to current academic year
    redirect(`/calendar/${getCurrentAcademicYear()}`);
}
