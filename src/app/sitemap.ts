import { MetadataRoute } from 'next';
import { opportunitiesService, blogsService, careersService } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://myark.in';

    // Static Pages
    const staticUrls: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${baseUrl}/schools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/rewards`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${baseUrl}/quest-master`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ];

    try {
        // Dynamic Opportunities
        const opportunities = await opportunitiesService.getAll({ status: 'published' });
        const opportunityUrls = (opportunities || []).map(opp => ({
            url: `${baseUrl}/opportunity/${opp.id}`,
            lastModified: opp.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        // Dynamic Blogs
        const blogs = await blogsService.getAll({ status: 'published' });
        const blogUrls = (blogs || []).map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        // Dynamic Careers
        const careers = await careersService.getAll();
        const careerUrls = (careers || []).map(career => ({
            url: `${baseUrl}/careers/${career.slug}`,
            lastModified: career.updatedAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        return [...staticUrls, ...opportunityUrls, ...blogUrls, ...careerUrls];
    } catch (error) {
        console.error('Sitemap Generation Error:', error);
        return staticUrls;
    }
}
