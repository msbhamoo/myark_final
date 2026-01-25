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
    description = "The ultimate RPG for your real-life success. Discover scholarships, competitions, olympiads, and career opportunities tailored for Gen Z students.",
    image = "https://myark.in/og-image.png",
    url = "https://myark.in",
    type = "website",
    keywords = ["scholarships", "competitions", "olympiads", "internships", "students", "Gen Z", "career guide", "education"],
    noIndex = false,
    publishedTime,
    authors,
}: SEOConfig): Metadata {
    const fullTitle = title.includes('Myark') ? title : `${title} | Myark`;

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
