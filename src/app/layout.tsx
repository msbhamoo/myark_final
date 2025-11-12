import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AppProviders } from "@/components/providers/AppProviders";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myark.in";
const metadataBase = (() => {
  try {
    return new URL(RAW_SITE_URL);
  } catch {
    return new URL("https://myark.in");
  }
})();

const DEFAULT_OG_IMAGE_PATH = "/images/scholarship-girl.png";

export const metadata: Metadata = {
  metadataBase,
  applicationName: "Myark",
  title: {
    default: "Myark | Scholarships, Olympiads & Exams for Indian Students",
    template: "%s | Myark",
  },
  description:
    "Discover verified scholarships, olympiads, entrance exams, and student workshops across India. Myark curates every opportunity with detailed eligibility, dates, and preparation resources.",
  keywords: [
    "Myark",
    "scholarships in India",
    "student olympiads",
    "school entrance exams",
    "student workshops",
    "education opportunities",
    "student competitions",
    "Indian students",
  ],
  authors: [{ name: "Myark Team" }],
  creator: "Myark",
  publisher: "Myark",
  category: "education",
  openGraph: {
    type: "website",
    siteName: "Myark",
    title: "Myark | Scholarships, Olympiads & Exams for Indian Students",
    description:
      "Browse curated competitions, scholarships, and exams tailored for learners across India. Stay ahead with deadlines, eligibility, and preparation tips on Myark.",
    url: metadataBase.href,
    locale: "en_IN",
    images: [
      {
        url: `${metadataBase.origin}${DEFAULT_OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "Myark - Opportunities for Indian Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@myark_in",
    creator: "@myark_in",
    title: "Myark | Scholarships, Olympiads & Exams for Indian Students",
    description:
      "Find the best scholarships, competitions, and entrance exams for students across India on Myark.",
    images: [`${metadataBase.origin}${DEFAULT_OG_IMAGE_PATH}`],
  },
  alternates: {
    canonical: metadataBase.href,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "IN",
    "referrer": "strict-origin-when-cross-origin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <AppProviders>{children}</AppProviders>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
