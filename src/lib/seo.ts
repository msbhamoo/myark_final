import { Metadata } from 'next';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

interface SEOConfig {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'book' | 'profile';
    keywords?: string[];
    noIndex?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
}

export function constructMetadata({
    title,
    description = "Discover scholarships, competitions, olympiads, and career opportunities tailored for students. Apply smart, don't miss out!",
    image = "https://myark.in/og-image.png",
    url = "https://myark.in",
    type = "website",
    keywords = ["scholarships", "competitions", "olympiads", "internships", "students", "career guide", "education"],
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors,
}: SEOConfig): Metadata {
    // Generate Myark-branded title following Gen Z strategy
    const generateMyarkTitle = (baseTitle: string): string => {
        // If it's the default/homepage title or "Myark"
        const cleanBase = baseTitle.trim();
        if (cleanBase === 'Myark' || cleanBase === 'Home' || cleanBase === 'Homepage') {
            return 'Myark – Discover Scholarships, Olympiads & Student Opportunities (Classes 4–12)';
        }

        // Handle specific categories with Gen Z twist
        const normalizedTitle = cleanBase.toLowerCase();

        if (normalizedTitle.includes('scholarship')) {
            return `Myark | Scholarships for Students – Apply Smart, Don't Miss Out`;
        }
        if (normalizedTitle.includes('olympiad')) {
            return `Myark | Olympiads for Students – Prep, Apply & Level Up`;
        }
        if (normalizedTitle.includes('competition')) {
            return `Myark | Student Competitions – Win, Learn & Build Your Profile`;
        }
        if (normalizedTitle.includes('workshop')) {
            return `Myark | Workshops for Students – Discover, Learn & Level Up`;
        }
        if (normalizedTitle.includes('ai') || normalizedTitle.includes('coding') || normalizedTitle.includes('robotics')) {
            return `Myark | AI, Coding & Robotics – Opportunities for Curious Students`;
        }
        if (normalizedTitle.includes('india')) {
            return `Myark | Student Opportunities in India – Classes 4–12`;
        }

        // If it's an opportunity detail page, it might already have "Myark |" prefixed
        if (cleanBase.startsWith('Myark')) return cleanBase;

        // Default: Ensure it starts with Myark
        return `Myark | ${cleanBase}`;
    };

    const fullTitle = generateMyarkTitle(title);

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: 'Myark',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
            type,
            locale: 'en_US',
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(authors && { authors }),
        } as OpenGraph,
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
            creator: '@myark_in',
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: url,
        },
        metadataBase: new URL('https://myark.in'),
    };
}
