import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeClient } from "@/components/ThemeClient";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";

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
    default: "Myark: Scholarships, Olympiads & Competitions for School Students!",
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/myark-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.png',
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Myark",
    title: "Myark: Scholarships, Olympiads & Competitions for School Students!",
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
    title: "Myark: Scholarships, Olympiads & Competitions for School Students!",
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Myark",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "geo.region": "IN",
    "referrer": "strict-origin-when-cross-origin",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming on mobile for app-like feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preconnect to Firebase and Google APIs for improved LCP */}
        <link rel="preconnect" href="https://myark-dbbee.firebaseapp.com" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />

        {/* Preload critical font */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          as="style"
        />

        {/* Inline theme script - must be first to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Apply dark/light mode
                const themeMode = localStorage.getItem('theme-preference') || 'light';
                const isDark = themeMode === 'dark' || (!themeMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Apply cached custom theme colors immediately to prevent FOUC
                const THEME_CACHE_KEY = 'myark_theme';
                const THEME_CACHE_DURATION = 1000 * 60 * 60; // 1 hour
                const cached = localStorage.getItem(THEME_CACHE_KEY);
                
                if (cached) {
                  try {
                    const { theme, timestamp } = JSON.parse(cached);
                    
                    // Check if cache is still valid
                    if (Date.now() - timestamp <= THEME_CACHE_DURATION && theme && theme.colors) {
                      const root = document.documentElement;
                      
                      // Apply brand colors (source of truth for theme)
                      if (theme.colors.primary) root.style.setProperty('--brand-primary', theme.colors.primary);
                      if (theme.colors.primaryDark) root.style.setProperty('--brand-primary-dark', theme.colors.primaryDark);
                      if (theme.colors.primaryDarker) root.style.setProperty('--brand-primary-darker', theme.colors.primaryDarker);
                      if (theme.colors.accent) root.style.setProperty('--brand-accent', theme.colors.accent);
                      
                      // Also set chart colors for gradients
                      if (theme.colors.primary) root.style.setProperty('--chart-1', theme.colors.primary);
                      if (theme.colors.primaryDark) root.style.setProperty('--chart-2', theme.colors.primaryDark);
                      if (theme.colors.primaryDarker) root.style.setProperty('--chart-3', theme.colors.primaryDarker);
                    }
                  } catch (e) {
                    console.warn('Failed to apply cached theme:', e);
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeClient />
        <ErrorReporter />
        {/* Google Analytics - loaded lazily to not block initial render */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: false,
                  });
                `,
              }}
            />
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
          </>
        )}
        {/* Route messenger - non-critical, load lazily */}
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="lazyOnload"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <AppProviders>{children}</AppProviders>
        <VisualEditsMessenger />
        <JsonLd />
      </body>
    </html>
  );
}
