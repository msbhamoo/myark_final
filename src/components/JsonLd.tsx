export default function JsonLd() {
    // Dynamic year for SEO
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${String(currentYear + 1).slice(-2)}`;

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
                "description": `Scholarships, Olympiads & Competitions for School Students ${academicYear}`,
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
                        "name": `What are the best scholarships for students in ${currentYear}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `In ${academicYear}, popular scholarships include NTSE, KVPY, SOF scholarships, and various state-level merit scholarships. Visit Myark to find updated deadlines and eligibility criteria.`
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
                        "name": `When are the olympiad deadlines for ${academicYear}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Olympiad deadlines for ${academicYear} vary by exam. SOF olympiads typically have deadlines in September-October, while IMO and NSO have multiple rounds. Check Myark for exact dates.`
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
