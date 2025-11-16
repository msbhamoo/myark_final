import type { Metadata } from 'next';
import SchoolsPageClient from '@/app/schools/SchoolsPageClient';

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
  title: 'Find Best Schools in India | Compare Schools - Myark',
  description:
    'Discover and compare schools across India. Find verified schools by location, grades, board, and medium. Get detailed information about facilities, fees, and more.',
  keywords: [
    'schools in india',
    'find schools',
    'school comparison',
    'cbse schools',
    'icse schools',
    'state board schools',
    'school listings',
    'verified schools',
  ],
  alternates: {
    canonical: `${metadataBase.href}schools`,
  },
  openGraph: {
    type: 'website',
    url: `${metadataBase.href}schools`,
    title: 'Find Best Schools in India | Compare Schools - Myark',
    description:
      'Discover and compare verified schools across India with detailed information about grades, boards, fees, and facilities.',
    siteName: 'Myark',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Best Schools in India - Myark',
    description:
      'Compare schools across India and find the best fit for your child. Verified schools with detailed information.',
  },
};

export default function SchoolsPage() {
  return <SchoolsPageClient />;
}
