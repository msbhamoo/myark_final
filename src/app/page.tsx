import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { OpportunityCard } from '@/components/OpportunityCard';
import { HeroSearch } from '@/components/HeroSearch';
import { Category, Opportunity } from '@/lib/types';
import { getDaysUntilDeadline } from '@/lib/utils';

export const revalidate = 3600;

export default async function Home() {
  const supabase = createServerClient();

  // Fetch data
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  
  const categories: Category[] = categoriesData || [];

  const { data: latestData } = await supabase
    .from('opportunities')
    .select('*, category:categories(*), organiser:organisers(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);
    
  const latest: Opportunity[] = latestData || [];

  const today = new Date().toISOString().split('T')[0];
  const threeWeeksFromNow = new Date();
  threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
  const closingDate = threeWeeksFromNow.toISOString().split('T')[0];

  const { data: closingSoonData } = await supabase
    .from('opportunities')
    .select('title, slug, deadline')
    .eq('is_published', true)
    .eq('is_ongoing', false)
    .gte('deadline', today)
    .lte('deadline', closingDate)
    .order('deadline', { ascending: true })
    .limit(3);
    
  const closingSoon = closingSoonData || [];

  const { count: oppCount } = await supabase
    .from('opportunities')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true);

  const { count: catCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true });

  const activeOppCount = oppCount || 0;
  const activeCatCount = catCount || 0;

  return (
    <div className="bg-surface flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full bg-[#fdfdfc] border-b border-[#e5e5e5] pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container-main max-w-[1000px] text-center px-4">
          <p className="text-[12px] md:text-[13px] font-bold tracking-[0.2em] text-[#1b5e28] uppercase mb-6">Make your mark</p>
          
          <h1 className="text-4xl md:text-6xl font-heading font-medium leading-[1.1] text-heading tracking-tight mb-6">
            Find every opportunity.<br className="hidden md:block" />
            <span className="text-[#1b5e28] font-bold"> Build your profile</span> and record.
          </h1>
          
          <p className="text-base md:text-[19px] text-[#4b5563] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Scholarships, olympiads, coding competitions, exchange programs — all in one place for school students across India.
          </p>

          <HeroSearch />

          {/* Quick Stats Horizon */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 mt-12 pt-10 border-t border-[#f3f4f6]">
            <div className="text-center">
              <p className="text-[28px] md:text-[32px] font-heading font-bold text-heading mb-1">{activeOppCount}+</p>
              <p className="text-[12px] md:text-[13px] text-[#6b7280] font-medium uppercase tracking-[0.05em]">Active Programs</p>
            </div>
            <div className="text-center">
              <p className="text-[28px] md:text-[32px] font-heading font-bold text-heading mb-1">{activeCatCount}+</p>
              <p className="text-[12px] md:text-[13px] text-[#6b7280] font-medium uppercase tracking-[0.05em]">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-[28px] md:text-[32px] font-heading font-bold text-[#1b5e28] mb-1">Free</p>
              <p className="text-[12px] md:text-[13px] text-[#6b7280] font-medium uppercase tracking-[0.05em]">Always for students</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="container-main max-w-[1200px] py-16 md:py-24 px-4 w-full">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Sticky Sidebar on Desktop) */}
          <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24">
            
            {/* Closing Soon Block */}
            {closingSoon.length > 0 && (
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full animate-pulse"></span>
                  <h2 className="text-[14px] font-bold text-[#b45309] uppercase tracking-wider">Closing soon</h2>
                </div>
                <div className="space-y-4">
                  {closingSoon.map((item, i) => {
                    const daysLeft = getDaysUntilDeadline(item.deadline as string);
                    const isUrgent = daysLeft !== null && daysLeft <= 7;
                    return (
                      <Link key={i} href={`/opportunities/${item.slug}`} className="flex flex-col gap-1.5 group border-b border-[#fde68a]/50 pb-4 last:border-0 last:pb-0">
                        <span className="text-[14px] font-medium text-heading group-hover:underline leading-snug">{item.title}</span>
                        {daysLeft !== null && (
                          <span className={`self-start text-[11px] font-medium px-2 py-0.5 rounded-md ${isUrgent ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                            {daysLeft} days left
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explore by Category Desktop Grid */}
            <div>
              <h2 className="text-[14px] font-bold text-heading uppercase tracking-wider mb-5">Browse categories</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/opportunities/category/${cat.slug}`}
                    className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0 sm:text-center p-3 sm:p-4 rounded-xl border border-[#e5e5e5] bg-surface hover:border-[#1b5e28] hover:shadow-md transition-all group"
                  >
                    <span className="text-xl sm:text-2xl sm:mb-2 group-hover:scale-110 transition-transform">{cat.icon_name}</span>
                    <span className="text-[12px] sm:text-[13px] font-medium text-body group-hover:text-[#1b5e28] truncate">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Cards Grid) */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex justify-between items-end mb-8 border-b border-[#e5e5e5] pb-4">
              <h2 className="text-[24px] font-heading font-medium text-heading">Latest opportunities</h2>
              <Link href="/opportunities" className="text-[14px] font-medium text-[#1b5e28] hover:underline flex items-center gap-1 pb-1">
                View directory &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {latest.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/opportunities" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white border border-[#d1d5db] font-medium text-heading shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:border-[#9ca3af] hover:bg-[#f9fafb] transition-all text-[15px]">
                Explore all {activeOppCount} opportunities
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
