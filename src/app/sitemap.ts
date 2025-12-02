import { MetadataRoute } from 'next';
import { getDb } from '@/lib/firebaseAdmin';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myark.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Static pages with high priority
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/opportunities`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/categories`,
            lastModified: yesterday,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/schools`,
            lastModified: yesterday,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/scholarships`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/parent-guide`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/resources`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/faq`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/mission`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/community`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/competitions`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/host`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/practice`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/for-schools`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/innovation-labs`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/ai-in-schools`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/career-toolkit`,
            lastModified: yesterday,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/success-stories`,
            lastModified: yesterday,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: yesterday,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified: yesterday,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    try {
        const db = getDb();

        // Fetch all approved AND published opportunities
        const opportunitiesSnapshot = await db
            .collection('opportunities')
            .where('approved', '==', true)
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(1000) // Limit to prevent timeout
            .get();

        const opportunityPages: MetadataRoute.Sitemap = opportunitiesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            const updatedAt = data.updatedAt?.toDate() || data.createdAt?.toDate() || now;

            return {
                url: `${SITE_URL}/opportunity/${doc.id}`,
                lastModified: updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

        // Fetch all published blog posts
        const blogsSnapshot = await db
            .collection('blogs')
            .where('published', '==', true)
            .orderBy('publishedAt', 'desc')
            .limit(500)
            .get();

        const blogPages: MetadataRoute.Sitemap = blogsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            const publishedAt = data.publishedAt?.toDate() || now;

            return {
                url: `${SITE_URL}/blog/${doc.id}`,
                lastModified: publishedAt,
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            };
        });

        // Combine all pages
        return [...staticPages, ...opportunityPages, ...blogPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return static pages only if database fetch fails
        return staticPages;
    }
}
