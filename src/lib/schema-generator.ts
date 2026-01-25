import { Opportunity } from '@/types/admin';

type SchemaType = 'Scholarship' | 'EducationEvent' | 'Course' | 'Article' | 'BreadcrumbList';

export function generateSchema(match: Opportunity | any, type: SchemaType, url: string) {
    const base = {
        "@context": "https://schema.org",
    };

    if (type === 'BreadcrumbList') {
        return {
            ...base,
            "@type": "BreadcrumbList",
            "itemListElement": match.map((item: { name: string; item: string }, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.item
            }))
        };
    }

    // Common Opportunity Fields
    const common = {
        "name": match.seoConfig?.metaTitle || match.title,
        "description": match.seoConfig?.metaDescription || match.shortDescription,
        "image": match.image || "https://myark.in/og-image.png",
        "url": url,
        "provider": {
            "@type": "Organization",
            "name": match.organizer || "Myark",
            "url": "https://myark.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://myark.in/logo.png"
            }
        },
        "offers": {
            "@type": "Offer",
            "price": match.fees || "0",
            "priceCurrency": "INR",
            "url": url,
            "availability": match.status === 'published' ? "https://schema.org/InStock" : "https://schema.org/Discontinued"
        }
    };

    if (type === 'Scholarship') {
        return {
            ...base,
            "@type": "FinancialProduct",
            ...common,
            "financialAidEligible": {
                "@type": "DefinedTerm",
                "name": "Eligible Students",
                "description": match.eligibility?.description || `Students in grades ${match.eligibility?.grades?.join(', ')}`
            },
            "amount": {
                "@type": "MonetaryAmount",
                "currency": "INR",
                "value": match.prizes?.first || "See Details"
            }
        };
    }

    if (type === 'EducationEvent') {
        return {
            ...base,
            "@type": "EducationEvent",
            ...common,
            "startDate": match.dates?.eventDate || match.dates?.registrationStart,
            "endDate": match.dates?.eventDate || match.dates?.registrationEnd,
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
                "@type": match.location === "Online" ? "VirtualLocation" : "Place",
                "name": match.location || "Online",
                ...(match.location !== "Online" && { "address": { "@type": "PostalAddress", "addressLocality": match.location } })
            },
            "organizer": {
                "@type": "Organization",
                "name": match.organizer || "Myark",
                "url": match.link
            }
        };
    }

    if (type === 'Course') {
        return {
            ...base,
            "@type": "Course",
            ...common,
            "provider": {
                "@type": "Organization",
                "name": match.organizer || "Myark"
            },
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": match.location === "Online" ? "online" : "onsite",
                "startDate": match.dates?.eventDate,
            }
        };
    }

    return base;
}
