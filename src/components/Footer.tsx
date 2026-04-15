import Link from 'next/link';
import { CURRENT_YEAR, SITE_NAME } from '@/lib/constants';
import { Logo } from './Logo';
import { createServerClient } from '@/lib/supabase-server';

export async function Footer() {
  const supabase = createServerClient();

  // Fetch up to 12 popular/recent opportunities for the dynamic SEO tag cloud
  const { data: popularOpps } = await supabase
    .from('opportunities')
    .select('title, slug')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  // Fallback if none exist
  const popularSearches = popularOpps && popularOpps.length > 0
    ? popularOpps.map(opp => ({ label: opp.title, href: `/opportunities/${opp.slug}` }))
    : [
      { label: "NTSE Scholarship", href: "/opportunities?q=NTSE" },
      { label: "SOF Olympiad", href: "/opportunities?q=SOF" },
      { label: "Coding Competition Class 8", href: "/opportunities?q=Coding" },
    ];

  return (
    <footer className="w-full bg-surface border-t border-default pt-12 pb-24 md:pb-12">
      <div className="container-main">

        {/* SEO Tag Cloud Row */}
        <div className="mb-14 pb-8 border-b border-default">
          <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Popular Searches:</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-2 items-center text-[13px] leading-relaxed">
            {popularSearches.map((tag, index) => (
              <span key={tag.label} className="flex items-center text-muted">
                <Link href={tag.href} className="hover:text-primary transition-colors hover:underline">
                  {tag.label}
                </Link>
                {index < popularSearches.length - 1 && <span className="mx-2 text-default">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Main 6-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-16">

          {/* Brand & SEO Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
              <Logo size="md" />
            </Link>
            <p className="text-[13px] text-muted leading-relaxed mb-6">
              India&apos;s most complete educational directory. Discover verified <strong className="font-medium text-heading">scholarships</strong>, <strong className="font-medium text-heading">olympiads</strong>, <strong className="font-medium text-heading">careers</strong>, and more. A free discovery platform for K-12 school students.
            </p>
          </div>

          {/* Opportunities Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Opportunities</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/opportunities" className="text-muted hover:text-primary transition-colors">All Opportunities</Link></li>
              <li><Link href="/opportunities/category/scholarship" className="text-muted hover:text-primary transition-colors">Scholarships</Link></li>
              <li><Link href="/opportunities/category/coding-ai" className="text-muted hover:text-primary transition-colors">Coding &amp; AI</Link></li>
              <li><Link href="/opportunities/category/robotics" className="text-muted hover:text-primary transition-colors">Robotics</Link></li>
              <li><Link href="/opportunities/category/innovation" className="text-muted hover:text-primary transition-colors">Innovation</Link></li>
            </ul>
          </div>

          {/* Olympiads Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Olympiads</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/olympiads" className="text-muted hover:text-primary transition-colors">All Olympiads</Link></li>
              <li><Link href="/olympiads/science" className="text-muted hover:text-primary transition-colors">Science</Link></li>
              <li><Link href="/olympiads/mathematics" className="text-muted hover:text-primary transition-colors">Maths</Link></li>
              <li><Link href="/olympiads/hbcse" className="text-muted hover:text-primary transition-colors font-bold text-primary">HBCSE</Link></li>
            </ul>
          </div>

          {/* Careers Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Careers</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/careers" className="text-muted hover:text-primary transition-colors">All Careers</Link></li>
              <li><Link href="/careers/stream/science-pcm" className="text-muted hover:text-primary transition-colors">After Science</Link></li>
              <li><Link href="/careers/stream/commerce" className="text-muted hover:text-primary transition-colors">After Commerce</Link></li>
              <li><Link href="/careers/stream/arts" className="text-muted hover:text-primary transition-colors">After Arts</Link></li>
              <li><Link href="/careers/category/unusual-careers" className="text-muted hover:text-primary transition-colors font-bold text-[#70A5FF]">Unusual Careers</Link></li>
            </ul>
          </div>

          {/* By Class Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">By Class</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/opportunities/class/class-1-5" className="text-muted hover:text-primary transition-colors">Class 1–5</Link></li>
              <li><Link href="/opportunities/class/class-6-8" className="text-muted hover:text-primary transition-colors">Class 6–8</Link></li>
              <li><Link href="/opportunities/class/class-9-10" className="text-muted hover:text-primary transition-colors">Class 9–10</Link></li>
              <li><Link href="/opportunities/class/class-11-12" className="text-muted hover:text-primary transition-colors">Class 11–12</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/about" className="text-muted hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-muted hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/submit-opportunity" className="text-muted hover:text-primary transition-colors font-medium">Submit</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Footer Bar */}
        <div className="pt-8 border-t border-default flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <p className="text-[13px] text-muted font-medium">
            &copy; {CURRENT_YEAR} {SITE_NAME} <span className="mx-1.5 hidden sm:inline">•</span><br className="sm:hidden" /> Free for all students
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-[13px] text-muted font-medium">
            <span>Made with <span className="text-red-500">♥</span> in India</span>
            <span className="hidden sm:inline mx-1.5 text-default">•</span>
            <div className="flex gap-3">
              <a href="https://instagram.com/myark.in" target="_blank" rel="noopener noreferrer" className="hover:text-heading transition-colors">Instagram</a>
              <a href="https://linkedin.com/company/getmyark" target="_blank" rel="noopener noreferrer" className="hover:text-heading transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
