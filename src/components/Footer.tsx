import Link from 'next/link';
import { CURRENT_YEAR, SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-default py-12">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-dark mb-4">
              <span className="font-heading font-extrabold text-2xl tracking-tighter">
                myark
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></span>
            </Link>
            <p className="text-body max-w-sm mb-6">
              {SITE_TAGLINE} India&apos;s first professional identity and opportunity discovery platform for K-12 students.
            </p>
            <p className="text-sm text-hint">
              Curated with purpose by Mahendra Bhamu.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="eyebrow mb-4 text-dark">Directory</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/opportunities" className="text-body hover:text-primary transition-colors">
                  All Opportunities
                </Link>
              </li>
              <li>
                <Link href="/opportunities/category/olympiad" className="text-body hover:text-primary transition-colors">
                  Olympiads
                </Link>
              </li>
              <li>
                <Link href="/opportunities/category/scholarship" className="text-body hover:text-primary transition-colors">
                  Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="eyebrow mb-4 text-dark">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/admin" className="text-body hover:text-primary transition-colors">
                  School Admin Login
                </Link>
              </li>
              <li>
                <a href="#" className="text-body hover:text-primary transition-colors">
                  Contact Organiser
                </a>
              </li>
              <li>
                <a href="#" className="text-body hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-default flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {CURRENT_YEAR} {SITE_NAME}. All rights reserved. Not affiliated with any government body.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted">
            Built for 🇮🇳 students
          </div>
        </div>
      </div>
    </footer>
  );
}
