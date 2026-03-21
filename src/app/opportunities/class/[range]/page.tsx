import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Opportunity } from '@/lib/types';
import { classPageTitle } from '@/lib/seo';
import { SITE_NAME, CLASS_RANGES } from '@/lib/constants';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: { range: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const rangeConfig = CLASS_RANGES.find(r => r.slug === params.range);
  
  if (!rangeConfig) return { title: 'Not Found' };

  return {
    title: classPageTitle(rangeConfig.label),
    description: `Find all competitions, scholarships, and exchange programs open to ${rangeConfig.label} students in India. Verified K-12 opportunities on ${SITE_NAME}.`,
  };
}

export default async function ClassRangePage({ params }: { params: { range: string } }) {
  const rangeConfig = CLASS_RANGES.find(r => r.slug === params.range);
  
  if (!rangeConfig) {
    notFound();
  }

  const supabase = createServerClient();

  // Fetch opportunities filtering by overlaps array
  const { data: oppsData } = await supabase
    .from('opportunities')
    .select('*, category:categories(*), organiser:organisers(*)')
    .overlaps('eligibility_classes', rangeConfig.classes)
    .eq('is_published', true)
    .order('deadline', { ascending: true }); // Prioritize active deadlines

  const opportunities: Opportunity[] = (oppsData as Opportunity[]) || [];

  return (
    <div className="min-h-[80vh] bg-bg py-12 md:py-20">
      <div className="container-main">
        <div className="flex items-center gap-2 mb-6 text-sm text-[rgba(17,17,16,0.6)]">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link>
          <span>/</span>
          <span className="text-dark font-medium">{rangeConfig.label}</span>
        </div>

        <header className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          </div>
          <h1 className="text-display mb-4 tracking-tight text-heading">
            Opportunities for {rangeConfig.label}
          </h1>
          <p className="text-lg text-muted font-body">
            Showing {opportunities.length} verified opportunities open to {rangeConfig.label} students right now.
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
            <h3 className="text-h2 mb-2">No opportunities found</h3>
            <p className="text-muted mb-6">
              We update our database daily. Check back soon for new additions.
            </p>
            <Link href="/opportunities" className="btn btn-primary">
              Browse All Opportunities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
