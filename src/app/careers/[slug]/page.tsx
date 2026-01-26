import CareerDetail from "@/components/modules/CareerDetail";
import type { Metadata } from "next";
import { careersService } from "@/lib/firestore";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const career = await careersService.getBySlug(slug);

        if (!career) {
            return constructMetadata({
                title: "Path Not Found",
                description: "This career path hasn't been unlocked yet.",
                noIndex: true,
            });
        }

        return constructMetadata({
            title: `${career.title} Career Guide`,
            description: career.shortDescription || `Discover how to become a ${career.title}. Salary, exams, and roadmap for students.`,
            image: career.images?.[0],
            url: `https://myark.in/careers/${slug}`,
            keywords: [career.title, career.category, "career guide", "student roadmap"],
            type: 'article',
        });
    } catch (error) {
        return constructMetadata({
            title: "Student Careers",
            description: "Discover futuristic career paths and how to achieve them.",
        });
    }
}

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const career = await careersService.getBySlug(slug);

    if (!career) {
        notFound();
    }

    // Generate schema markup for SSR
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${career.title} Career Guide`,
        "description": career.shortDescription,
        "image": career.images?.[0] || "https://myark.in/og-image.png",
        "author": {
            "@type": "Organization",
            "name": "Myark"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Myark",
            "logo": {
                "@type": "ImageObject",
                "url": "https://myark.in/logo.png"
            }
        },
        "mainEntity": {
            "@type": "Occupation",
            "name": career.title,
            "description": career.shortDescription,
            "occupationalCategory": career.category,
            "estimatedSalary": {
                "@type": "MonetaryAmountDistribution",
                "currency": "INR",
                "duration": "P1Y",
                "median": career.salary?.min
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CareerDetail />
        </>
    );
}
