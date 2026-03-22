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

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Brand & SEO Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
              <Logo size="md" />
            </Link>
            <p className="text-[13px] text-muted leading-relaxed mb-6">
              India&apos;s most complete educational directory. Discover verified <strong className="font-medium text-heading">scholarships</strong>, <strong className="font-medium text-heading">olympiads</strong>, <strong className="font-medium text-heading">coding competitions</strong>, <strong className="font-medium text-heading">robotics challenges</strong>, <strong className="font-medium text-heading">exchange programs</strong>, and more. A free opportunity discovery platform for K-12 school students.
            </p>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider">Connect With Us</h4>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com/myarkin" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted hover:text-[#E1306C] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="https://linkedin.com/company/myarkin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-[#0A66C2] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                <a href="https://t.me/myarkin" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-muted hover:text-[#229ED9] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></a>
              </div>
            </div>
          </div>

          {/* Opportunities Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Opportunities</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/opportunities" className="text-muted hover:text-primary transition-colors">All Opportunities</Link></li>
              <li><Link href="/opportunities/category/olympiad" className="text-muted hover:text-primary transition-colors">Olympiads</Link></li>
              <li><Link href="/opportunities/category/scholarship" className="text-muted hover:text-primary transition-colors">Scholarships</Link></li>
              <li><Link href="/opportunities/category/coding-ai" className="text-muted hover:text-primary transition-colors">Coding &amp; AI</Link></li>
              <li><Link href="/opportunities/category/robotics" className="text-muted hover:text-primary transition-colors">Robotics</Link></li>
              <li><Link href="/opportunities/category/exchange" className="text-muted hover:text-primary transition-colors">Exchange Programs</Link></li>
              <li><Link href="/opportunities/category/writing" className="text-muted hover:text-primary transition-colors">Writing &amp; Essay</Link></li>
              <li><Link href="/opportunities/category/quiz" className="text-muted hover:text-primary transition-colors">Quiz &amp; GK</Link></li>
              <li><Link href="/opportunities/category/innovation" className="text-muted hover:text-primary transition-colors">Innovation</Link></li>
              <li><Link href="/opportunities/category/art" className="text-muted hover:text-primary transition-colors">Art &amp; Design</Link></li>
            </ul>
          </div>

          {/* By Class Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">By Class</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/opportunities/class/1-5" className="text-muted hover:text-primary transition-colors">Class 1–5</Link></li>
              <li><Link href="/opportunities/class/6-8" className="text-muted hover:text-primary transition-colors">Class 6–8</Link></li>
              <li><Link href="/opportunities/class/9-10" className="text-muted hover:text-primary transition-colors">Class 9–10</Link></li>
              <li><Link href="/opportunities/class/11-12" className="text-muted hover:text-primary transition-colors">Class 11–12</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-6 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3.5 text-[14px]">
              <li><Link href="/about" className="text-muted hover:text-primary transition-colors">About Myark</Link></li>
              <li><Link href="/how-it-works" className="text-muted hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/for-schools" className="text-muted hover:text-primary transition-colors">For Schools</Link></li>
              <li><Link href="/for-organisers" className="text-muted hover:text-primary transition-colors">For Organisers</Link></li>
              <li><Link href="/campus-ambassador" className="text-muted hover:text-primary transition-colors">Campus Ambassador</Link></li>
              <li><Link href="/submit-opportunity" className="text-muted hover:text-primary transition-colors font-medium">Submit Opportunity</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Footer Bar */}
        <div className="pt-8 border-t border-default flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <p className="text-[13px] text-muted font-medium">
            &copy; {CURRENT_YEAR} {SITE_NAME} <span className="mx-1.5 hidden sm:inline">•</span><br className="sm:hidden" /> Free for all students <span className="mx-1.5 hidden sm:inline">•</span><br className="sm:hidden" /> Not affiliated with any government body
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1.5 text-[13px] text-muted font-medium">
            <span>Made with <span className="text-red-500">♥</span> in India, for every student</span>
            <span className="hidden sm:inline mx-1.5 text-default">•</span>
            <div className="flex gap-3 sm:gap-1.5 mt-2 sm:mt-0">
              <a href="https://instagram.com/myarkin" target="_blank" rel="noopener noreferrer" className="hover:text-heading transition-colors">Instagram</a>
              <span className="hidden sm:inline mx-1.5 text-default">•</span>
              <a href="https://linkedin.com/company/myarkin" target="_blank" rel="noopener noreferrer" className="hover:text-heading transition-colors">LinkedIn</a>
              <span className="hidden sm:inline mx-1.5 text-default">•</span>
              <a href="https://t.me/myarkin" target="_blank" rel="noopener noreferrer" className="hover:text-heading transition-colors">Telegram</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
