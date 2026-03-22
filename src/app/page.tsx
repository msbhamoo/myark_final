import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { OpportunityCard } from '@/components/OpportunityCard';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroFloatingCards } from '@/components/HeroFloatingCards';
import { Logo } from '@/components/Logo';
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
    <div className="flex flex-col items-center">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Split layout with floating cards
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0f0a] relative overflow-hidden">
        {/* Aurora gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] left-[50%] w-[700px] h-[700px] rounded-full bg-[#22c55e]/[0.07] blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#4ade80]/[0.05] blur-[100px]"></div>
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-600/[0.04] blur-[80px]"></div>
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}></div>

        <div className="relative container-main max-w-[1200px] px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[420px] md:min-h-[520px] py-12 md:py-16 lg:py-20">
            
            {/* ─── LEFT: Text + Search ────────────────────── */}
            <div className="flex flex-col items-start text-left max-w-xl">
              {/* Eyebrow pill */}
              <div className="hidden md:inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-3.5 py-1 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                <span className="text-[11px] font-medium text-[#a8a8a0] tracking-wide uppercase">Updated daily — {activeOppCount} active opportunities</span>
              </div>

              {/* Headline */}
              <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-heading font-extrabold leading-[1.1] text-[#f0ede5] tracking-tight mb-4 md:mb-5">
                Every scholarship.
                <br />
                Every olympiad.
                <br />
                <span className="text-[#4ade80]">One platform.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-[14px] md:text-[17px] text-[#8a8a84] max-w-md mb-6 md:mb-8 leading-relaxed">
                India&apos;s most trusted directory of scholarships, olympiads &amp; competitions for school students. Verified. Free. Always.
              </p>

              {/* Search Bar */}
              <div className="w-full max-w-lg mb-5">
                <HeroSearch />
              </div>

              {/* Floating Category Ticker */}
              <div className="w-full max-w-lg overflow-hidden mb-5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0f0a] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0f0a] to-transparent z-10"></div>
                <div className="flex gap-2.5 animate-marquee hover:[animation-play-state:paused]">
                  {[...categories, ...categories].map((cat, i) => (
                    <Link
                      key={`${cat.id}-${i}`}
                      href={`/opportunities/category/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-medium text-[#8a8a84] hover:bg-white/[0.1] hover:border-[#4ade80]/30 hover:text-[#f0ede5] transition-all whitespace-nowrap shrink-0"
                    >
                      <span className="text-[13px]">{cat.icon_name}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[12px] text-[#a8a8a0] font-semibold">100% Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[12px] text-[#a8a8a0] font-semibold">Verified Daily</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[12px] text-[#a8a8a0] font-semibold">Parent Trusted</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 md:gap-10 mt-8 pt-6 border-t border-white/[0.06] w-full max-w-md">
                <div>
                  <p className="text-[24px] md:text-[32px] font-heading font-extrabold text-[#f0ede5] leading-none mb-1">{activeOppCount}+</p>
                  <p className="text-[10px] text-[#6a6a64] font-bold uppercase tracking-[0.08em]">Programs</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]"></div>
                <div>
                  <p className="text-[24px] md:text-[32px] font-heading font-extrabold text-[#f0ede5] leading-none mb-1">{activeCatCount}+</p>
                  <p className="text-[10px] text-[#6a6a64] font-bold uppercase tracking-[0.08em]">Categories</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]"></div>
                <div>
                  <p className="text-[24px] md:text-[32px] font-heading font-extrabold text-[#4ade80] leading-none mb-1">FREE</p>
                  <p className="text-[10px] text-[#6a6a64] font-bold uppercase tracking-[0.08em]">Forever</p>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Floating Cards ──────────────────── */}
            <div className="hidden lg:block">
              <HeroFloatingCards />
            </div>

          </div>
        </div>
      </section>

      {/* MOBILE CATEGORY PILLS (Mockup) */}
      <section className="w-full md:hidden bg-[var(--color-bg)] pt-6 pb-2 border-b border-[var(--color-border-default)]">
        <div className="container-main px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <Link href="/opportunities" className="shrink-0 px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] text-[13px] font-bold shadow-sm">
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/opportunities/category/${cat.slug}`}
                className="shrink-0 px-4 py-1.5 rounded-full bg-surface border border-[var(--color-border-default)] text-heading text-[13px] font-medium"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING SOON STRIP (Card Layout matching mobile mockup) */}
      {closingSoon.length > 0 && (
        <section className="relative z-10 w-full pt-6 md:pt-12 bg-[var(--color-bg)]">
          <div className="container-main max-w-[1000px] px-4 mb-4 md:mb-10">
            <div className="bg-[#fffbeb] border border-[#fde68a] dark:bg-amber-900/10 dark:border-amber-700/40 rounded-xl p-4 md:p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#b45309] dark:text-amber-500 mb-4 tracking-normal">Closing soon — don&apos;t miss these</h3>
              <div className="flex flex-col gap-0">
                {closingSoon.slice(0, 4).map((item, i) => {
                  const daysLeft = getDaysUntilDeadline(item.deadline as string);
                  let badgeValue = '';
                  let badgeColors = 'bg-white text-heading border-[var(--color-border-default)]';

                  if (daysLeft !== null) {
                    badgeValue = `${daysLeft} days`;
                    if (daysLeft <= 7) {
                      badgeColors = 'bg-[#fce7f3] text-[#be185d] dark:bg-pink-900/30 dark:text-pink-400';
                    } else if (daysLeft <= 21) {
                      badgeColors = 'bg-[#fef3c7] text-[#b45309] dark:bg-amber-900/30 dark:text-amber-400';
                    } else {
                      badgeColors = 'bg-[#dcfce7] text-[#166534] dark:bg-green-900/30 dark:text-green-400';
                    }
                  }

                  return (
                    <Link key={i} href={`/opportunities/${item.slug}`} className={`flex justify-between items-center py-2.5 sm:py-3 ${i !== closingSoon.slice(0, 4).length - 1 ? 'border-b border-[#fde68a]/50 dark:border-amber-700/30' : ''} group`}>
                      <span className="text-[13px] font-bold text-[#451a03] dark:text-amber-100 group-hover:underline truncate pr-4">{item.title}</span>
                      {daysLeft !== null && (
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColors}`}>
                          {badgeValue}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BROWSE BY CATEGORY (Desktop only, hidden on mobile)
         ═══════════════════════════════════════════════════════════ */}
      <section className="hidden md:block w-full bg-surface py-16 md:py-20">
        <div className="container-main max-w-[1200px] px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase mb-2">Explore</p>
              <h2 className="text-[22px] md:text-[28px] font-heading font-extrabold text-heading">Browse by category</h2>
            </div>
            <Link href="/opportunities" className="text-[13px] font-medium text-primary hover:underline hidden md:block">
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/opportunities/category/${cat.slug}`}
                className="group flex flex-col items-center justify-center text-center p-4 md:p-5 rounded-2xl border border-[var(--color-border-default)] bg-surface hover:border-primary hover:shadow-lg transition-all"
              >
                <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{cat.icon_name}</span>
                <span className="text-[12px] md:text-[13px] font-bold text-body group-hover:text-primary">{cat.label}</span>
              </Link>
            ))}
          </div>

          <Link href="/opportunities" className="block text-center text-[13px] font-medium text-primary hover:underline mt-6 md:hidden">
            View all categories &rarr;
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LATEST OPPORTUNITIES
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[var(--color-bg)] py-8 md:py-20">
        <div className="container-main max-w-[1000px] px-4">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-[16px] md:text-[28px] font-heading font-extrabold text-heading">Latest opportunities</h2>
            <Link href="/opportunities" className="text-[12px] md:text-[13px] font-bold text-[#1b5e28] hover:text-[#15803d] dark:text-green-500 transition-colors flex items-center gap-0.5">
              See all <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 19 12"></polyline><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {latest.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/opportunities" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-surface border border-[var(--color-border-default)] font-medium text-heading shadow-sm hover:border-[var(--color-border-hover)] hover:shadow-md transition-all text-[15px]">
              Explore all {activeOppCount} opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 3-step visual
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-surface py-16 md:py-24 border-t border-[var(--color-border-default)]">
        <div className="container-main max-w-[900px] px-4">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase mb-2">Simple</p>
            <h2 className="text-[22px] md:text-[32px] font-heading font-extrabold text-heading mb-3">How Myark works</h2>
            <p className="text-[15px] text-muted max-w-lg mx-auto">Three steps to never miss an opportunity again.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-default)] flex items-center justify-center mx-auto mb-5 group-hover:border-primary group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <div className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Step 1</div>
              <h3 className="text-[16px] font-heading font-extrabold text-heading mb-2">Search &amp; Discover</h3>
              <p className="text-[13px] text-muted leading-relaxed">Browse by category, class, or keyword. Every opportunity is verified and updated daily.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-default)] flex items-center justify-center mx-auto mb-5 group-hover:border-primary group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <div className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Step 2</div>
              <h3 className="text-[16px] font-heading font-extrabold text-heading mb-2">Register &amp; Apply</h3>
              <p className="text-[13px] text-muted leading-relaxed">One click to the official registration. We link you directly — no middlemen, no hidden fees.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-default)] flex items-center justify-center mx-auto mb-5 group-hover:border-primary group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Step 3</div>
              <h3 className="text-[16px] font-heading font-extrabold text-heading mb-2">Track &amp; Build</h3>
              <p className="text-[13px] text-muted leading-relaxed">Save opportunities, track applications, and build your student profile — all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY PARENTS TRUST MYARK
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[var(--color-bg)] py-16 md:py-24">
        <div className="container-main max-w-[1000px] px-4">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase mb-2">Trust</p>
            <h2 className="text-[22px] md:text-[32px] font-heading font-extrabold text-heading mb-3">Why parents trust Myark</h2>
            <p className="text-[15px] text-muted max-w-lg mx-auto">Built with safety, transparency, and your child&apos;s future in mind.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#dcfce7] dark:bg-[rgba(34,197,94,0.15)] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-[14px] font-bold text-heading mb-2">Verified Sources</h3>
              <p className="text-[13px] text-muted leading-relaxed">Every opportunity links to official organiser websites. No fake listings, ever.</p>
            </div>

            <div className="bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#dbeafe] dark:bg-[rgba(59,130,246,0.15)] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-[14px] font-bold text-heading mb-2">No Data Selling</h3>
              <p className="text-[13px] text-muted leading-relaxed">Student data stays private. We never sell or share personal information.</p>
            </div>

            <div className="bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] dark:bg-[rgba(245,158,11,0.15)] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3 className="text-[14px] font-bold text-heading mb-2">100% Free</h3>
              <p className="text-[13px] text-muted leading-relaxed">No hidden charges, no premium tiers. Myark is free for every student in India.</p>
            </div>

            <div className="bg-surface border border-[var(--color-border-default)] rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] dark:bg-[rgba(126,34,206,0.15)] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="text-[14px] font-bold text-heading mb-2">Updated Daily</h3>
              <p className="text-[13px] text-muted leading-relaxed">Deadlines, eligibility, and new programs are checked and refreshed every single day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0f0a] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.12), transparent)'
        }}></div>
        <div className="relative container-main max-w-[700px] px-4 text-center">
          <Logo size="lg" variant="dark" className="mx-auto mb-6" />
          <h2 className="text-[24px] md:text-[36px] font-heading font-extrabold text-[#f0ede5] mb-4 tracking-tight">
            Start exploring — it&apos;s free
          </h2>
          <p className="text-[15px] md:text-[17px] text-[#a8a8a0] max-w-md mx-auto mb-10 leading-relaxed">
            Join thousands of students discovering scholarships, competitions, and programs they never knew existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/opportunities" className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-[#22c55e] text-[#0a0f0a] font-bold text-[16px] hover:bg-[#16a34a] transition-colors shadow-lg shadow-[#22c55e]/20">
              Browse Opportunities
            </Link>
            <Link href="/student/dashboard" className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-[#f0ede5] font-medium text-[16px] hover:bg-white/[0.1] transition-colors">
              My Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
