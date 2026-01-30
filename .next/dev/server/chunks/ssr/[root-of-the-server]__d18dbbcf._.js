module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/seo.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constructMetadata",
    ()=>constructMetadata
]);
function constructMetadata({ title, description = "Discover scholarships, competitions, olympiads, and career opportunities tailored for students. Apply smart, don't miss out!", image = "https://myark.in/og-image.png", url = "https://myark.in", type = "website", keywords = [
    "scholarships",
    "competitions",
    "olympiads",
    "internships",
    "students",
    "career guide",
    "education"
], noIndex = false, publishedTime, modifiedTime, authors }) {
    // Generate Myark-branded title following Gen Z strategy
    const generateMyarkTitle = (baseTitle)=>{
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
                    alt: fullTitle
                }
            ],
            type,
            locale: 'en_US',
            ...publishedTime && {
                publishedTime
            },
            ...modifiedTime && {
                modifiedTime
            },
            ...authors && {
                authors
            }
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [
                image
            ],
            creator: '@myark_in'
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        },
        alternates: {
            canonical: url
        },
        metadataBase: new URL('https://myark.in')
    };
}
}),
"[project]/src/app/beta/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BetaPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seo.ts [app-rsc] (ecmascript)");
;
;
;
;
;
// Dynamic import for client component
const InshortsFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/inshorts/InshortsFeed.tsx [app-rsc] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/inshorts/InshortsFeed.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/beta/page.tsx",
                        lineNumber: 14,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground font-medium",
                        children: "Loading the vibes..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/beta/page.tsx",
                        lineNumber: 15,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/beta/page.tsx",
                lineNumber: 13,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/beta/page.tsx",
            lineNumber: 12,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
});
const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructMetadata"])({
    title: "Myark Beta | Swipe Through Opportunities – Fast, Fun & Fire 🔥",
    description: "Experience opportunities in a whole new way! Swipe through scholarships, competitions, and more. No cap, this is the future of discovering your next big W.",
    url: "https://myark.in/beta",
    keywords: [
        "opportunities",
        "students",
        "scholarships",
        "competitions",
        "swipe",
        "beta",
        "gen z"
    ],
    type: "website"
});
function BetaPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/beta/page.tsx",
                        lineNumber: 36,
                        columnNumber: 25
                    }, void 0),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground font-medium",
                        children: "Almost there fam..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/beta/page.tsx",
                        lineNumber: 37,
                        columnNumber: 25
                    }, void 0)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/beta/page.tsx",
                lineNumber: 35,
                columnNumber: 21
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/src/app/beta/page.tsx",
            lineNumber: 34,
            columnNumber: 17
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(InshortsFeed, {}, void 0, false, {
            fileName: "[project]/src/app/beta/page.tsx",
            lineNumber: 42,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/beta/page.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/app/beta/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/beta/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d18dbbcf._.js.map