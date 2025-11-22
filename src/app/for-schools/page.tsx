import type { Metadata } from 'next';
import ForSchoolsClient from '@/app/for-schools/ForSchoolsClient';

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myark.in';
const metadataBase = (() => {
    try {
        return new URL(RAW_SITE_URL);
    } catch {
        return new URL('https://myark.in');
    }
})();

export const metadata: Metadata = {
    metadataBase,
    title: 'Myark for Schools | Empower Student Success & Engagement',
    description:
        'Transform your school with Myark. Simplify opportunity management, create digital student profiles, track achievements automatically, and boost parent-student engagement.',
    keywords: [
        'school management',
        'student opportunities',
        'digital portfolios',
        'school technology',
        'student engagement',
        'achievement tracking',
        'school platform',
        'education management',
    ],
    alternates: {
        canonical: `${metadataBase.href}for-schools`,
    },
    openGraph: {
        type: 'website',
        url: `${metadataBase.href}for-schools`,
        title: 'Myark for Schools | Empower Student Success',
        description:
            'Join hundreds of schools using Myark to manage opportunities, track student achievements, and engage parents.',
        siteName: 'Myark',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Myark for Schools | Empower Student Success',
        description:
            'Transform your school with automated achievement tracking, digital portfolios, and comprehensive opportunity management.',
    },
};

export default function ForSchoolsPage() {
    return <ForSchoolsClient />;
}
