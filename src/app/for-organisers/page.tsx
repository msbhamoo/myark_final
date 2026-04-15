import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'For Organisers | Myark',
  description: 'Reach millions of Indian school students with your competition, olympiad, or program.',
};

export default function ForOrganisersPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="pt-24 pb-20 border-b border-default bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60"></div>
        <div className="container-main relative z-10 max-w-4xl text-center">
          <span className="inline-block py-1.5 px-3 rounded-md bg-purple-500/10 text-purple-600 font-bold text-[12px] uppercase tracking-wider mb-6">
            Organizer Portal
          </span>
          <h1 className="text-display mb-6 leading-tight">Scale Your Educational Event Nationwide.</h1>
          <p className="text-body text-[18px] text-muted mb-10 max-w-3xl mx-auto">
            {SITE_NAME} is India&apos;s most focused directory for K-12 students. We help universities, ed-techs, and NGOs 
            distribute scholarships, competitions, and programs to highly motivated students and partner schools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-opportunity" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-lg">
              Submit Opportunity
            </Link>
            <Link href="#audience" className="px-8 py-3.5 rounded-xl font-semibold text-heading bg-transparent border border-default hover:bg-bg transition-colors text-[15px]">
              Our Audience
            </Link>
          </div>
        </div>
      </div>

      {/* Stats/Audience Grid */}
      <div id="audience" className="container-main py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-heading mb-4 tracking-tight">Access Highly Targeted Demographics</h2>
          <p className="text-muted text-[15px]">Organizing a class 8 robotics competition in Delhi? We deliver exactly that audience straight to your registration page.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm text-center">
            <h3 className="text-4xl font-black text-primary mb-2">1M+</h3>
            <p className="font-bold text-heading text-[14px] uppercase tracking-wider mb-1">Monthly Views</p>
            <span className="text-[12px] text-muted">Across all directories</span>
          </div>

          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm text-center">
            <h3 className="text-4xl font-black text-blue-500 mb-2">350+</h3>
            <p className="font-bold text-heading text-[14px] uppercase tracking-wider mb-1">School Networks</p>
            <span className="text-[12px] text-muted">Direct notification reach</span>
          </div>

          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm text-center">
            <h3 className="text-4xl font-black text-blue-500 mb-2">40%</h3>
            <p className="font-bold text-heading text-[14px] uppercase tracking-wider mb-1">Click-Through</p>
            <span className="text-[12px] text-muted">Average listing CTR</span>
          </div>

          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm text-center">
            <h3 className="text-4xl font-black text-purple-500 mb-2">0₹</h3>
            <p className="font-bold text-heading text-[14px] uppercase tracking-wider mb-1">Listing Cost</p>
            <span className="text-[12px] text-muted">Currently entirely free</span>
          </div>

        </div>
      </div>

      <div className="bg-surface py-28 px-4 border-t border-default relative">
        <div className="container-main max-w-4xl flex flex-col items-center">
           <span className="w-16 h-1 bg-primary mb-8 rounded-full"></span>
           <h2 className="text-3xl lg:text-4xl font-extrabold text-heading mb-6 tracking-tight text-center">Ready to launch your program?</h2>
           <p className="text-muted text-center max-w-2xl mx-auto mb-10 text-[16px] leading-relaxed">
             Submission is totally free and takes only 5 minutes. Our moderation team reviews all listings to ensure student safety within 24 hours.
           </p>
           <Link href="/submit-opportunity" className="inline-block bg-[var(--color-heading)] text-[var(--color-bg)] font-bold px-12 py-4 rounded-[14px] shadow-xl hover:scale-105 transition-transform text-[15px]">
             Submit Your First Program Now
           </Link>
        </div>
      </div>

    </div>
  );
}
