import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
import { CareerCard } from '@/components/CareerCard';
import { Career } from '@/lib/types';

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, ' ').replace(/and/g, '&');
  return {
    title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Careers After 12th — The Complete Guide | Myark`,
    description: `Explore every career option in ${categoryName} for school students in India. Find salary, colleges, and entrance exams.`,
  };
}

export default async function CareerCategoryPage({ params }: { params: { category: string } }) {
  const supabase = createServerClient();
  const rawCat = params.category.replace(/-/g, ' ').replace(/and/g, '&');

  const { data: careersData } = await supabase
    .from('career_directory')
    .select('*')
    .ilike('category', `%${rawCat}%`)
    .eq('is_published', true)
    .order('rarity_level', { ascending: false }); // Show rare ones first

  const careers: Career[] = careersData || [];
  if (careers.length === 0) {
      // Try with a more precise match
      const { data: careersDataPrecise } = await supabase
        .from('career_directory')
        .select('*')
        .eq('category', rawCat)
        .eq('is_published', true)
        .order('name', { ascending: true });
      if (careersDataPrecise && careersDataPrecise.length > 0) {
          // Keep these
      } else {
          // notFound();
      }
  }

  // Get related opportunities (heuristic)
  const { data: relatedOpps } = await supabase
    .from('opportunities')
    .select('title, slug')
    .eq('is_published', true)
    .limit(5);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
        <section className="bg-[#0a0f0a] text-white py-20 px-4 md:py-32">
            <div className="container-main max-w-[1240px] px-4">
                <nav className="flex items-center gap-2 mb-8 text-[11px] font-bold text-[#70A5FF] uppercase tracking-widest">
                    <Link href="/careers" className="hover:underline">Careers</Link>
                    <span>/</span>
                    <span className="text-white/40">Category</span>
                </nav>
                <h1 className="text-[36px] md:text-[60px] font-heading font-extrabold text-[#f0ede5] leading-[1.1] mb-6">
                    Careers in <br />
                    <span className="text-[#70A5FF]">{rawCat.charAt(0).toUpperCase() + rawCat.slice(1)}</span>
                </h1>
                <p className="text-[17px] md:text-[20px] text-[#8a8a84] font-medium max-w-2xl leading-relaxed">
                    Explore all {careers.length} career options in {rawCat}. From common mainstream roles to high-paying rare opportunities.
                </p>
            </div>
        </section>

        <section className="py-20">
            <div className="container-main max-w-[1240px] px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {careers.map(c => <CareerCard key={c.id} career={c} />)}
                </div>
                
                {careers.length === 0 && (
                    <div className="text-center py-32 bg-surface rounded-[40px] border-2 border-dashed border-default">
                        <p className="text-muted text-lg font-bold">No careers found in this category yet. Check back soon!</p>
                        <Link href="/careers" className="btn btn-primary mt-6">All Careers</Link>
                    </div>
                )}
            </div>
        </section>
        
        {/* Related Opps Strip */}
        {relatedOpps && relatedOpps.length > 0 && (
            <section className="py-12 bg-surface border-t border-default">
                <div className="container-main max-w-[1240px] px-4">
                    <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6">Active Opportunities in this field:</h3>
                    <div className="flex flex-wrap gap-3">
                        {relatedOpps.map(opp => (
                            <Link key={opp.slug} href={`/opportunities/${opp.slug}`} className="px-4 py-2 bg-white dark:bg-black/20 border border-default rounded-xl text-[13px] font-bold hover:border-primary transition-colors">
                                {opp.title} →
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        )}
    </div>
  );
}
