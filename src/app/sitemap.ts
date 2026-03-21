import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  // 1. Fetch published opportunities
  const { data: opps } = await supabase
    .from('opportunities')
    .select('slug, updated_at, deadline')
    .eq('is_published', true);

  // 2. Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static: Homepage
  sitemapEntries.push({
    url: `${siteUrl}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // Static: Master Directory
  sitemapEntries.push({
    url: `${siteUrl}/opportunities`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Dynamic: Category Pages
  if (categories) {
    categories.forEach((cat) => {
      sitemapEntries.push({
        url: `${siteUrl}/opportunities/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    });
  }

  // Static: Class Pages
  const classRanges = ['class-1-5', 'class-6-8', 'class-9-10', 'class-11-12'];
  classRanges.forEach((range) => {
    sitemapEntries.push({
      url: `${siteUrl}/opportunities/class/${range}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Dynamic: Detail Pages
  if (opps) {
    opps.forEach((opp) => {
      // Determine update frequency based on deadline urgency
      let freq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = 'weekly';
      
      if (opp.deadline) {
        const daysUntilDeadline = Math.ceil((new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDeadline > 0 && daysUntilDeadline <= 14) {
          freq = 'daily'; // Update daily if deadline approaching
        }
      }

      sitemapEntries.push({
        url: `${siteUrl}/opportunities/${opp.slug}`,
        lastModified: opp.updated_at ? new Date(opp.updated_at) : new Date(),
        changeFrequency: freq,
        priority: 0.7,
      });
    });
  }

  return sitemapEntries;
}
