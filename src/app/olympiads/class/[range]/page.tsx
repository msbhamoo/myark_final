import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
import { OlympiadCard } from '@/components/OlympiadCard';
import { Olympiad } from '@/lib/types';
import { generateBreadcrumbJsonLd } from '@/lib/seo';
import { CLASS_RANGES, SITE_URL, SITE_NAME } from '@/lib/constants';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

export async function generateStaticParams() {
  return CLASS_RANGES.map((range) => ({
    range: range.slug,
  }));
}

interface ClassFilterPageProps {
  params: {
    range: string;
  };
}

export async function generateMetadata({ params }: ClassFilterPageProps): Promise<Metadata> {
  const rangeConfig = CLASS_RANGES.find(r => r.slug === params.range);
  const label = rangeConfig?.label || params.range.replace('-', '–');
  const path = `/olympiads/class/${params.range}`;

  return {
    title: `Olympiads for Class ${label} Students India 2025–26 | Complete List`,
    description: `Browse every competitive olympiad for Class ${label} students in India. Filters for science, maths, astronomy and english olympiads. Verified dates and guide.`,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Olympiads for Class ${label} Students | ${SITE_NAME}`,
      description: `Complete list of olympiads for school students. Register and prepare for exams.`,
      url: `${SITE_URL}${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Olympiads for Class ${label} | ${SITE_NAME}`,
      description: `Complete list of olympiads for schools students.`,
    }
  };
}

export default async function ClassFilterPage({ params }: ClassFilterPageProps) {
  const supabase = createServerClient();
  const rangeLabel = params.range.replace('-', '–');

  const { data: olympiadsData } = await supabase
    .from('olympiad_directory')
    .select('*')
    .eq('is_published', true);

  let olympiads: Olympiad[] = olympiadsData || [];

  // Filter by class range
  olympiads = olympiads.filter(o => 
    o.eligibility_classes.includes(rangeLabel) || 
    o.eligibility_classes.includes('1–12') || 
    o.eligibility_classes.includes('8–12')
  );

  // Sorting: Free first, then paid; Individual registration first
  olympiads.sort((a, b) => {
    if (a.is_free !== b.is_free) return a.is_free ? -1 : 1;
    if (a.is_individual_registration !== b.is_individual_registration) return a.is_individual_registration ? -1 : 1;
    return 0;
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": olympiads.map((o, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://myark.in/olympiads/${o.slug}`,
      "name": o.name
    }))
  };

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', href: '/' },
    { name: 'Olympiads', href: '/olympiads' },
    { name: `Class ${rangeLabel}`, href: `/olympiads/class/${params.range}` },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="bg-[#111110] text-white py-16 md:py-24">
        <div className="container-main max-w-[1200px] px-4">
          <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold leading-tight mb-4 text-[#f0ede5]">
            Olympiads for Class {rangeLabel} Students in India
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#8a8a84] font-medium">
            {olympiads.length} competitive olympiads that help you build a global student profile.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] py-12 md:py-20">
        <div className="container-main max-w-[1200px] px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {olympiads.map(olympiad => (
              <OlympiadCard key={olympiad.id} olympiad={olympiad} />
            ))}
          </div>

          {olympiads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-bold text-heading">No olympiads found for this class range</h3>
              <Link href="/olympiads" className="mt-6 text-primary font-bold hover:underline">
                View all olympiads
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
