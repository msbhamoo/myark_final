import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Schools | Myark',
  description: 'Empower your students with a centralized discovery platform for external opportunities.',
};

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="pt-24 pb-20 border-b border-default bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60"></div>
        <div className="container-main relative z-10 max-w-3xl text-center">
          <span className="inline-block py-1.5 px-3 rounded-md bg-primary/10 text-primary font-bold text-[12px] uppercase tracking-wider mb-6">
            School Partnerships
          </span>
          <h1 className="text-display mb-6 leading-tight">Bring World-Class Opportunities to Your Students</h1>
          <p className="text-body text-[18px] text-muted mb-10 max-w-2xl mx-auto">
            Myark partners with progressive schools to ensure every student has access to verified scholarships, coding olympiads, and exchange programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold text-[15px]">
              Partner with Myark
            </Link>
            <Link href="#features" className="px-8 py-3.5 rounded-xl font-semibold text-heading bg-transparent border border-default hover:bg-bg transition-colors text-[15px]">
              View Benefits
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div id="features" className="container-main py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Verified Scholarships</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              We vet every scholarship program so your school counselors don&apos;t have to. Protect your students from data-mining scams and focus purely on legitimate financial aid.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M22 12h-40M12 22V2M15.4 3a10.9 10.9 0 0 1 0 18M8.6 3a10.9 10.9 0 0 0 0 18"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Global Competitions</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Elevate your school&apos;s profile by having your students participate (and win) in national and international olympiads, robotics challenges, and hackathons.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-[24px] border border-default shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Skill Building</h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Beyond academics, students discover essay writing contests, art programs, and public speaking competitions that build robust college profiles.
            </p>
          </div>

        </div>
      </div>

      <div className="bg-primary pb-28 pt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to empower your school?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-10 text-[16px]">
          There are zero costs associated with integrating Myark into your school&apos;s ecosystem. 
          Contact us today to give your students the competitive edge they deserve.
        </p>
        <Link href="/contact" className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
          Start the Conversation
        </Link>
      </div>

    </div>
  );
}
