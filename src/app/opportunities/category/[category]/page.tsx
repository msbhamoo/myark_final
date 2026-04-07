import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { supabase as supabaseAnon } from '@/lib/supabase';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Category, Opportunity } from '@/lib/types';
import { categoryPageTitle, generateBreadcrumbJsonLd } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const { data } = await supabaseAnon
    .from('categories')
    .select('slug, label')
    .eq('slug', params.category)
    .single();

  if (!data) return { title: 'Not Found' };

  const isScholarship = data.slug === 'scholarship';
  const path = `/opportunities/category/${data.slug}`;

  return {
    title: isScholarship 
      ? `Scholarships for School Students in India 2025–26 — Private & Govt | Myark`
      : categoryPageTitle(data.label),
    description: isScholarship
      ? `Discover 50+ verified private and government scholarships for Indian school students (Class 1-12). Find eligibility, registration dates, and application links.`
      : `Browse all verified K-12 ${data.label} opportunities for Indian students. Discover your eligibility and apply on ${SITE_NAME}.`,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
       title: isScholarship ? "Scholarships for Students India | Myark" : `${data.label} Opportunities | Myark`,
       description: isScholarship ? "Verified scholarships for K-12 Indian students." : `Discover verified ${data.label} programs.`,
       url: `${SITE_URL}${path}`,
       type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = createServerClient();

  // 1. Fetch the category
  const { data: catData } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.category)
    .single();

  if (!catData) {
    notFound();
  }
  
  const category = catData as Category;

  // 2. Fetch opportunities in this category
  const { data: oppsData } = await supabase
    .from('opportunities')
    .select('*, category:categories(*), organiser:organisers(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('deadline', { ascending: true }); // Prioritize chronological deadlines

  const opportunities: Opportunity[] = (oppsData as Opportunity[]) || [];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', href: '/' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: category.label, href: `/opportunities/category/${category.slug}` },
  ]);

  return (
    <div className="min-h-[80vh] bg-bg py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="container-main">
        <div className="flex items-center gap-2 mb-6 text-sm text-[rgba(17,17,16,0.6)]">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link>
          <span>/</span>
          <span className="text-dark font-medium">{category.label}</span>
        </div>

        <header className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="text-6xl mb-6">{category.icon_name}</div>
          <h1 className="text-display mb-4 tracking-tight">{category.label}</h1>
          <p className="text-lg text-muted font-body">
            Discover {opportunities.length} verified {category.label.toLowerCase()} opportunities available for Indian students.
          </p>
        </header>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-default rounded-xl p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-h2 mb-2">No opportunities currently open</h3>
            <p className="text-muted mb-6">
              We update our database daily. Check back soon or browse other categories.
            </p>
            <Link href="/opportunities" className="btn btn-outline">
              Browse All Opportunities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
