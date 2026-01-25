import { MetadataRoute } from 'next';
import { opportunitiesService } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let opportunityUrls: MetadataRoute.Sitemap = [];

    try {
        const opportunities = await opportunitiesService.getAll({ status: 'published' });

        opportunityUrls = opportunities.map((opp) => ({
            url: `https://myark.in/opportunity/${opp.id}`,
            lastModified: opp.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.warn("Sitemap generation failed to fetch opportunities (likely permissions). Using static fallback.", error);
    }

    return [
        {
            url: 'https://myark.in',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://myark.in/about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...opportunityUrls,
    ];
}
