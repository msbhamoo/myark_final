"use client";

import Script from "next/script";

const Schema = () => {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Myark",
        "alternateName": "Myark Student Opportunities",
        "url": "https://myark.in",
        "description": "India's largest discovery platform for student scholarships, olympiads, and competitions.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://myark.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "   GetMyark",
        "url": "https://getmyark.in",
        "logo": "https://getmyark.in/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-800-123-4567",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": "en"
        },
        "sameAs": [
            "https://twitter.com/getmyark",
            "https://www.linkedin.com/company/getmyark",
            "https://www.instagram.com/getmyark"
        ]
    };

    return (
        <>
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
};

export default Schema;
