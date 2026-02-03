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
        "name": "Myark",
        "url": "https://myark.in",
        "logo": "https://myark.in/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-800-123-4567",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": "en"
        },
        "sameAs": [
            "https://twitter.com/myark_in",
            "https://www.linkedin.com/company/myark",
            "https://www.instagram.com/myark.in"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
};

export default Schema;
