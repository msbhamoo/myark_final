import { createServerClient } from '@/lib/supabase-server';
import { OpportunityCard } from '@/components/OpportunityCard';
import { SidebarFilter } from '@/components/SidebarFilter';
import { Category, Opportunity } from '@/lib/types';
import { CLASS_RANGES, SITE_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Directory — ${SITE_NAME}`,
  description: 'Browse the complete directory of olympiads, scholarships, exchange programs, and competitions for Indian school students.',
};

export const revalidate = 3600;

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { category?: string; class?: string; q?: string };
}) {
  const supabase = createServerClient();

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  
  const categories: Category[] = categoriesData || [];

  // Fetch all minimal opportunities to calculate exact sidebar counts globally
  const { data: allOpps } = await supabase
    .from('opportunities')
    .select('id, category_id')
    .eq('is_published', true);
    
  const categoryCounts = (allOpps || []).reduce((acc: Record<string, number>, curr) => {
    if (curr.category_id) {
      acc[curr.category_id] = (acc[curr.category_id] || 0) + 1;
    }
    return acc;
  }, {});

  let query = supabase
    .from('opportunities')
    .select('*, category:categories(*), organiser:organisers(*)')
    .eq('is_published', true);

  if (searchParams.category && searchParams.category !== 'all') {
    const category = categories.find(c => c.slug === searchParams.category);
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (searchParams.class && searchParams.class !== 'all') {
    const classRange = CLASS_RANGES.find(r => r.slug === searchParams.class);
    if (classRange) {
      query = query.overlaps('eligibility_classes', classRange.classes);
    }
  }

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`);
  }

  const { data: opportunitiesData } = await query.order('deadline', { ascending: true });
  const opportunities: Opportunity[] = opportunitiesData || [];

  return (
    <div className="min-h-[80vh] bg-[#fdfdfc] py-8 border-t border-[#e5e5e5]">
      <div className="container-main max-w-[1200px]">
        
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-[240px] shrink-0 lg:sticky lg:top-24 hidden md:block pt-1">
            <SidebarFilter categories={categories} categoryCounts={categoryCounts} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Header / Active States */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-[14px] font-medium text-body">
                <strong className="text-heading font-bold">{opportunities.length} opportunities</strong> match your filters
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-muted">Sort by</span>
                <select className="input py-2 px-3 text-[13.5px] font-medium bg-surface rounded min-w-[180px] border-none outline-none shadow-none focus:ring-0 cursor-pointer">
                  <option>Deadline (soonest)</option>
                  <option>Recently added</option>
                  <option>Closing latest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {opportunities.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {opportunities.map(opp => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-default rounded-xl p-12 text-center shadow-sm">
                <h3 className="text-h2 mb-2">No opportunities found</h3>
                <p className="text-muted text-sm mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <Link href="/opportunities" className="btn btn-outline text-sm">
                  Clear all filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
