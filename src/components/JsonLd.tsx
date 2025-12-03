export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://myark.in/#organization",
                "name": "Myark",
                "url": "https://myark.in",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://myark.in/myark-logo.png",
                    "width": 512,
                    "height": 512
                },
                "sameAs": [
                    "https://www.facebook.com/getmyark",
                    "https://www.instagram.com/getmyark/",
                    "https://www.linkedin.com/company/getmyark",
                    "https://whatsapp.com/channel/0029VbBdZ5O545uvzvZf5V1A"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "",
                    "contactType": "customer service",
                    "email": "support@myark.in",
                    "areaServed": "IN",
                    "availableLanguage": "en"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://myark.in/#website",
                "url": "https://myark.in",
                "name": "Myark",
                "description": "Scholarships, Olympiads & Competitions for School Students",
                "publisher": {
                    "@id": "https://myark.in/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://myark.in/opportunities?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
