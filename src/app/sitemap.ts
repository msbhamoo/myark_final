import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  const baseUrl = 'https://myark.in';

  // ── Static routes ─────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/opportunities`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/olympiads`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/for-schools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/for-organisers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/campus-ambassador`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/submit-opportunity`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // ── Class filter pages ────────────────────────────────────────────
  const classRoutes: MetadataRoute.Sitemap = [
    'class-1-5', 'class-6-8', 'class-9-10', 'class-11-12',
  ].map((range) => ({
    url: `${baseUrl}/opportunities/class/${range}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ── Olympiad subject pages ────────────────────────────────────────
  const olympiadSubjectRoutes: MetadataRoute.Sitemap = [
    'mathematics', 'science', 'english', 'computer-science', 'astronomy', 'general-knowledge',
  ].map((subject) => ({
    url: `${baseUrl}/olympiads/${subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ── HBCSE page ────────────────────────────────────────────────────
  const hbcseRoute: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/olympiads/hbcse`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }];

  // ── Dynamic routes from Supabase ──────────────────────────────────
  let opportunityRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let olympiadRoutes: MetadataRoute.Sitemap = [];
  let careerRoutes: MetadataRoute.Sitemap = [];

  try {
    // Opportunities
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (opportunities) {
      opportunityRoutes = opportunities.map((opp) => ({
        url: `${baseUrl}/opportunities/${opp.slug}`,
        lastModified: new Date(opp.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    // Categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (categories) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/opportunities/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    // Olympiads
    const { data: olympiads } = await supabase
      .from('olympiad_directory')
      .select('slug')
      .eq('is_published', true);

    if (olympiads) {
      olympiadRoutes = olympiads.map((o) => ({
        url: `${baseUrl}/olympiads/${o.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }

    // Careers
    const { data: careers } = await supabase
      .from('career_directory')
      .select('slug')
      .eq('is_published', true);

    if (careers) {
      careerRoutes = careers.map((c) => ({
        url: `${baseUrl}/careers/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Sitemap fetch error:', error);
  }

  return [
    ...staticRoutes,
    ...classRoutes,
    ...olympiadSubjectRoutes,
    ...hbcseRoute,
    ...categoryRoutes,
    ...opportunityRoutes,
    ...olympiadRoutes,
    ...careerRoutes,
  ];
}
