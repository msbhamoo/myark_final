import { MetadataRoute } from 'next';
// Temporarily disabled server-side fetching due to Firebase Admin SDK setup
// import { serverOpportunitiesService } from '@/lib/server-opportunities';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Temporarily return static sitemap until Firebase Admin SDK is properly configured
    // let opportunityUrls: MetadataRoute.Sitemap = [];

    // try {
    //     const opportunities = await serverOpportunitiesService.getAll({ status: 'published' });
    //     opportunityUrls = opportunities.map((opp) => ({
    //         url: `https://myark.in/opportunity/${opp.id}`,
    //         lastModified: opp.updatedAt,
    //         changeFrequency: 'daily' as const,
    //         priority: 0.8,
    //     }));
    // } catch (error) {
    //     console.warn("Sitemap generation failed to fetch opportunities. Using static fallback.", error);
    // }

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
    ];
}
