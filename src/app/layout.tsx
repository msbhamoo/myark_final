import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";
import Schema from "@/components/Schema";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Myark – Opportunities for Students (Classes 4–12)",
        template: "%s | Myark"
    },
    description: "The #1 platform for students to discover scholarships, olympiads, competitions, and build their early-stage career profile.",
    keywords: ["Student Opportunities", "Scholarships", "Olympiads", "Competitions", "Extracurriculars", "Student Profile", "Education", "India"],
    authors: [{ name: "Myark Team" }],
    category: "Education",
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐧</text></svg>',
    },
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://myark.in",
        title: "Myark – Where Students Build Their Future",
        description: "Discover scholarships, win competitions, and build a profile that stands out. Join thousands of students on Myark.",
        siteName: "Myark",
        images: [
            {
                url: "https://myark.in/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Myark Student Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Myark – Student Opportunity Platform",
        description: "Scholarships, Olympiads, and Competitions for students in India.",
        creator: "@myark_in",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("dark", inter.variable, spaceGrotesk.variable)} suppressHydrationWarning>
            <body className="font-sans" suppressHydrationWarning>
                <Schema />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                var findDOMNodePolyfill = function(instance) {
                                    if (!instance) return null;
                                    if (instance instanceof HTMLElement) return instance;
                                    return instance.getDOMNode ? instance.getDOMNode() : null;
                                };
                                try {
                                    window.ReactDOM = window.ReactDOM || {};
                                    var rd = window.ReactDOM;
                                    if (!rd.findDOMNode && Object.isExtensible(rd)) {
                                        Object.defineProperty(rd, 'findDOMNode', {
                                            value: findDOMNodePolyfill,
                                            configurable: true,
                                            writable: true
                                        });
                                    }
                                } catch (e) {
                                    console.warn('Myark: Global findDOMNode polyfill failed.');
                                }
                            })();
                        `,
                    }}
                />
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
