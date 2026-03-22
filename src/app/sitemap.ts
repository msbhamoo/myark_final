import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  const baseUrl = 'https://myark.in';

  // Core static routes
  const staticRoutes = [
    '',
    '/opportunities',
    '/opportunities/category/scholarship',
    '/opportunities/category/olympiad',
    '/opportunities/category/coding-ai',
    '/opportunities/category/robotics',
    '/about',
    '/how-it-works',
    '/for-schools',
    '/for-organisers',
    '/campus-ambassador',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic opportunity routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (opportunities) {
      dynamicRoutes = opportunities.map((opp) => ({
        url: `${baseUrl}/opportunities/${opp.slug}`,
        lastModified: new Date(opp.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error('Sitemap generic fetch error:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
