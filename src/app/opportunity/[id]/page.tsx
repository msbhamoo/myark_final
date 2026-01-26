import OpportunityDetail from "@/components/modules/OpportunityDetail";
import type { Metadata } from "next";
import { opportunitiesService } from "@/lib/firestore";
import { constructMetadata } from "@/lib/seo";
import { generateSchema } from "@/lib/schema-generator";
import { notFound } from "next/navigation";

// Generate metadata on the server
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const opportunity = await opportunitiesService.getById(id);

        if (!opportunity) {
            return constructMetadata({
                title: "Opportunity Not Found",
                description: "This opportunity may have expired or been removed.",
                noIndex: true,
            });
        }

        // Dynamic metadata based on opportunity data with Gen Z excitement
        let dynamicTitle = opportunity?.title || 'Opportunity';

        // Add class context if available
        if (opportunity?.class) {
            dynamicTitle = `${opportunity.title} for Class ${opportunity.class} Students`;
        }

        // Make it Gen Z-friendly and action-oriented
        if (opportunity?.type === 'scholarship') {
            dynamicTitle = `${dynamicTitle} – Apply Smart, Don't Miss Out`;
        } else if (opportunity?.type === 'olympiad') {
            dynamicTitle = `${dynamicTitle} – Prep, Apply & Level Up`;
        } else if (opportunity?.type === 'competition') {
            dynamicTitle = `${dynamicTitle} – Win, Learn & Build Your Profile`;
        } else if (opportunity?.type === 'workshop') {
            dynamicTitle = `${dynamicTitle} – Discover, Learn & Level Up`;
        } else {
            dynamicTitle = `${dynamicTitle} – Discover & Apply Now`;
        }

        const title = `Myark | ${dynamicTitle}`;

        const description = opportunity?.seoConfig?.metaDescription ||
            `${opportunity?.shortDescription || 'Discover this amazing opportunity'} Apply now for ${opportunity?.category || 'student'} opportunities. ${opportunity?.location ? `Location: ${opportunity.location}.` : ''} Deadline: ${opportunity?.dates?.registrationEnd ? new Date(opportunity.dates.registrationEnd).toLocaleDateString() : 'TBD'}.`;

        return constructMetadata({
            title,
            description,
            image: opportunity?.image,
            url: `https://myark.in/opportunity/${opportunity?.id || id}`,
            keywords: opportunity?.seoConfig?.keywords || [opportunity?.category || 'opportunities', 'students', 'scholarships', opportunity?.class ? `class ${opportunity.class}` : ''].filter(Boolean),
            type: 'article',
            publishedTime: opportunity?.createdAt?.toISOString(),
            modifiedTime: opportunity?.updatedAt?.toISOString(),
            noIndex: opportunity?.seoConfig?.noIndex || false,
        });
    } catch (error) {
        console.error('Error generating metadata:', error);
        return constructMetadata({
            title: "Myark Opportunities",
            description: "Discover scholarships, olympiads, and competitions for students.",
        });
    }
}

// Server component for SEO
export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const opportunity = await opportunitiesService.getById(id);

        if (!opportunity) {
            notFound();
        }

        // Generate schema markup
        const schemaType = opportunity.seoConfig?.schemaType || 'EducationEvent';
        const jsonLd = generateSchema(
            opportunity,
            schemaType as any,
            `https://myark.in/opportunity/${id}`
        );

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <OpportunityDetail />
            </>
        );
    } catch (error) {
        console.error('Error loading opportunity:', error);
        notFound();
    }
}
