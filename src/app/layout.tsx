import type { Metadata } from 'next';
import { syne, inter } from './fonts';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

// Provide absolute URL for metadata images
let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
if (!siteUrl.startsWith('http')) {
  siteUrl = `https://${siteUrl}`;
}

export const metadata: Metadata = {
  title: {
    default: "Myark — Find Scholarships, Olympiads & Competitions for School Students India",
    template: `%s | ${SITE_NAME}`,
  },
  description: "India's most complete opportunity platform for K-12 students. Discover scholarships, olympiads, coding competitions, robotics challenges and exchange programs — all verified and updated daily. Free for all students.",
  metadataBase: new URL(siteUrl),
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    title: "Myark — Find Scholarships, Olympiads & Competitions for School Students India",
    description: "India's most complete opportunity platform for K-12 students. Verified and updated daily. Free for all students.",
    url: siteUrl,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Myark — Make your Mark. Find every opportunity for school students in India.",
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: "@myarkin",
    creator: "@myarkin",
    title: "Myark — Scholarships, Olympiads & Competitions for School Students India",
    description: "India's most complete opportunity platform for K-12 students. Verified daily. Free for all students.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Myark",
  "alternateName": "Make your Mark",
  "url": "https://myark.in",
  "description": "India's most complete opportunity discovery platform for K-12 school students.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://myark.in/opportunities?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Myark",
    "url": "https://myark.in",
    "logo": {
      "@type": "ImageObject",
      "url": "https://myark.in/logo.png",
      "width": 200,
      "height": 60
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@myark.in",
      "areaServed": "IN",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://instagram.com/myarkin",
      "https://linkedin.com/company/myarkin",
      "https://twitter.com/myarkin"
    ]
  }
};

const educationalSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Myark",
  "url": "https://myark.in",
  "description": "K-12 student opportunity discovery platform for India",
  "educationalLevel": "K-12",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "student",
    "audienceType": "School students Class 1 to Class 12"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen pb-[64px] md:pb-0">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
