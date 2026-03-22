import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us | Myark',
  description: 'The story behind Myark and our mission to help Indian students discover verified opportunities.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Header */}
      <div className="pt-32 pb-24 border-b border-default bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60"></div>
        <div className="container-main relative z-10 max-w-4xl text-center">
          <h1 className="text-display mb-6">Democratizing Discovery for Every Student.</h1>
          <p className="text-body text-[18px] text-muted max-w-2xl mx-auto">
            {SITE_NAME} was built on a simple premise: no student should miss a life-changing opportunity simply because they didn&apos;t know it existed.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-main py-24 max-w-3xl">
        <div className="prose prose-invert max-w-none text-[16px] leading-relaxed text-body">
          <h2 className="text-3xl font-extrabold text-heading mb-6 tracking-tight">The Problem We Are Solving</h2>
          <p className="mb-8 font-medium">
            Every year, millions of Indian school students miss out on scholarships, olympiads, and exchange programs. 
            The internet is flooded with scattered information, broken links, outdated deadlines, and unverified organizers. 
            Parents and students waste countless hours searching for legitimate opportunities relevant to their exact class and interests.
          </p>
          <div className="w-full h-px bg-default my-12"></div>
          
          <h2 className="text-3xl font-extrabold text-heading mb-6 tracking-tight">Our Mission</h2>
          <p className="mb-8 font-medium">
            We built Myark to be the ultimate, verified directory. We partner with organizers, schools, and administrators to centralize everything. 
            By standardizing the discovery process, we empower students to focus on preparing for these opportunities rather than struggling to find them.
          </p>
          
          <div className="w-full h-px bg-default my-12"></div>
          
          <h2 className="text-3xl font-extrabold text-heading mb-6 tracking-tight">Future Forward</h2>
          <p className="mb-10 font-medium">
            We are just getting started. In 2026, we are introducing deep school integrations, analytics for organizers to measure their impact, 
            and AI-driven recommendations to ensure the right student always finds the perfect opportunity.
          </p>
          
          <div className="bg-surface border border-default p-8 rounded-[24px] text-center mt-8">
            <h3 className="text-xl font-bold text-heading mb-3">Join our journey</h3>
            <p className="text-muted text-sm mb-6">Are you an organizer looking to host an event?</p>
            <Link href="/for-organisers" className="btn btn-primary inline-flex px-8 py-3 rounded-xl font-bold text-[14px]">
              Partner with Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
