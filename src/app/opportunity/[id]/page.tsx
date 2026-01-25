import OpportunityDetail from "@/components/modules/OpportunityDetail";
import type { Metadata } from "next";
import { opportunitiesService } from "@/lib/firestore";
import { constructMetadata } from "@/lib/seo";
import { generateSchema } from "@/lib/schema-generator";
import { AIContextBlock } from "@/components/ai/AIContextBlock";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const opportunity = await opportunitiesService.getById(params.id);

    if (!opportunity) {
        return constructMetadata({
            title: "Opportunity Not Found",
            description: "This opportunity may have expired or been removed.",
            noIndex: true,
        });
    }

    return constructMetadata({
        title: opportunity.seoConfig?.metaTitle || opportunity.title,
        description: opportunity.seoConfig?.metaDescription || opportunity.shortDescription,
        image: opportunity.image,
        url: `https://myark.in/opportunity/${opportunity.id}`,
        keywords: opportunity.seoConfig?.keywords || opportunity.tags,
        modifiedTime: opportunity.updatedAt?.toISOString(),
        publishedTime: opportunity.createdAt?.toISOString(),
        noIndex: opportunity.seoConfig?.noIndex,
    });
}

export default async function OpportunityDetailPage({ params }: Props) {
    const opportunity = await opportunitiesService.getById(params.id);

    if (!opportunity) return <OpportunityDetail />;

    const jsonLd = generateSchema(
        opportunity,
        (opportunity.seoConfig?.schemaType as any) || 'EducationEvent',
        `https://myark.in/opportunity/${params.id}`
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AIContextBlock opportunity={opportunity} />
            <OpportunityDetail />
        </>
    );
}
