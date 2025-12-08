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
                    "https://whatsapp.com/channel/0029VbBdZ5O545uvzvZf5V1A",
                    "https://twitter.com/myark_in"
                ],
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": "+91-9876543210",
                        "contactType": "customer service",
                        "email": "support@myark.in",
                        "areaServed": "IN",
                        "availableLanguage": ["en", "hi"]
                    }
                ],
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
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
            },
            {
                "@type": "FAQPage",
                "@id": "https://myark.in/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What types of opportunities are available on Myark?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Myark offers scholarships, olympiads, entrance exams, talent search exams, competitions, and workshops for school students from grades 4 to 12 across India."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I find scholarships for my child?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Browse our opportunities page and filter by 'Scholarships' category. You can also filter by grade level and deadline to find the most relevant opportunities."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are the opportunities on Myark verified?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all opportunities on Myark are verified by our team. We ensure accurate information about eligibility, deadlines, and application processes."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How can I prepare for olympiads?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Check our blog for preparation tips and resources. Each olympiad listing also includes exam patterns, syllabus, and useful preparation materials."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is Myark free to use?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, Myark is completely free for students and parents. You can browse all opportunities, read our blog, and access preparation resources at no cost."
                        }
                    }
                ]
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
