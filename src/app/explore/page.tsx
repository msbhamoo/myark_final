import { Suspense } from "react";
import Explore from "@/components/modules/Explore";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

interface ExplorePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
    const params = await searchParams;
    const category = params.category as string;
    const classFilter = params.class as string;
    const location = params.location as string;
    const online = params.online as string;

    // Build dynamic title and description based on filters with Gen Z energy
    let title = "Myark | Explore Student Opportunities – Discover, Apply & Level Up";
    let description = "Browse scholarships, competitions, olympiads, and workshops for students. Apply smart, don't miss out!";

    const filters = [];
    if (category && category !== 'all') {
        filters.push(`${category}s`);
        if (category === 'scholarship') {
            title = `Myark | Scholarships for Students – Apply Smart, Don't Miss Out`;
            description = `Find scholarships for students. Eligibility, deadlines & how to apply. ${classFilter ? `Class ${classFilter} students welcome.` : ''} ${location ? `Available in ${location}.` : ''}`;
        } else if (category === 'olympiad') {
            title = `Myark | Olympiads for Students – Prep, Apply & Level Up`;
            description = `Discover olympiads for students. National & international exams. ${classFilter ? `Perfect for Class ${classFilter}.` : ''} ${location ? `Events in ${location}.` : ''}`;
        } else if (category === 'competition') {
            title = `Myark | Student Competitions – Win, Learn & Build Your Profile`;
            description = `Join competitions for students. Win prizes, gain experience. ${classFilter ? `Great for Class ${classFilter} students.` : ''} ${location ? `Happening in ${location}.` : ''}`;
        } else {
            title = `Myark | ${category.charAt(0).toUpperCase() + category.slice(1)}s for Students – Discover & Apply`;
        }
    }

    if (classFilter && classFilter !== 'all' && !title.includes('Class')) {
        title = title.replace('Students', `Class ${classFilter} Students`);
    }

    if (location && location !== 'all') {
        title = title.replace('Students', `Students in ${location}`);
    }

    if (online === 'true') {
        title = title.replace('Students', 'Students Online');
        description += ' Online opportunities available.';
    }

    return constructMetadata({
        title,
        description,
        url: `https://myark.in/explore${Object.keys(params).length > 0 ? '?' + new URLSearchParams(params as any).toString() : ''}`,
        keywords: ['opportunities', 'students', 'scholarships', 'competitions', 'olympiads', ...filters],
        type: 'website',
    });
}

export default function ExplorePage({ searchParams }: ExplorePageProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>}>
            <Explore />
        </Suspense>
    );
}

