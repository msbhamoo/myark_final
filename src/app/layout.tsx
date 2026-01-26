import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
    title: "Myark – Discover Scholarships, Olympiads & Student Opportunities (Classes 4–12)",
    description: "Explore scholarships, competitions, olympiads, and career opportunities for students. Apply smart, don't miss out on your future!",
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐧</text></svg>',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body suppressHydrationWarning>
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
