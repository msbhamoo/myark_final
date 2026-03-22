import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works | Myark',
  description: 'The easiest way to discover verified school opportunities.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Header */}
      <div className="pt-24 pb-16 border-b border-default bg-surface text-center">
        <div className="container-main">
          <h1 className="text-display mb-6">How Myark Works.</h1>
          <p className="text-body text-[18px] text-muted max-w-xl mx-auto">
            Three simple steps to connect with the best opportunities across India. Free forever for students.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container-main py-24 max-w-4xl mx-auto">
        <div className="space-y-20 relative">
          
          <div className="hidden md:block absolute left-[39px] top-4 border-l border-default h-[calc(100%-80px)] border-dashed"></div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="flex-shrink-0 w-20 h-20 bg-primary/10 border border-primary/20 text-primary font-black text-3xl rounded-full flex items-center justify-center">
              1
            </div>
            <div className="pt-2 bg-surface p-8 rounded-[24px] border border-default shadow-sm flex-1">
              <h3 className="text-2xl font-bold text-heading mb-4">Discover Opportunities</h3>
              <p className="text-muted leading-relaxed text-[15px] mb-4">
                Use our powerful directory and filters to search specifically for your class grade, region, or interests. 
                Whether you&apos;re looking for coding olympiads or art scholarships, browse verified listings all in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="flex-shrink-0 w-20 h-20 bg-primary/10 border border-primary/20 text-primary font-black text-3xl rounded-full flex items-center justify-center">
              2
            </div>
            <div className="pt-2 bg-surface p-8 rounded-[24px] border border-default shadow-sm flex-1">
              <h3 className="text-2xl font-bold text-heading mb-4">Register in One Click</h3>
              <p className="text-muted leading-relaxed text-[15px] mb-4">
                Found something interesting? Enter your basic details just once. We&apos;ll save your profile securely. 
                Next time you apply for any opportunity, you&apos;ll bypass the forms and go straight to the organizer&apos;s checkout.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="flex-shrink-0 w-20 h-20 bg-primary/10 border border-primary/20 text-primary font-black text-3xl rounded-full flex items-center justify-center">
              3
            </div>
            <div className="pt-2 bg-surface p-8 rounded-[24px] border border-default shadow-sm flex-1">
              <h3 className="text-2xl font-bold text-heading mb-4">Never Miss a Deadline</h3>
              <p className="text-muted leading-relaxed text-[15px] mb-4">
                Track everything easily. Our platform logs the opportunities you&apos;ve explored. You can easily 
                see when exams are approaching and avoid last-minute stressful applications.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-20 text-center">
          <Link href="/opportunities" className="btn btn-primary px-8 py-4 rounded-xl text-[16px] font-bold shadow-lg">
            Start Exploring Now
          </Link>
        </div>
      </div>
    </div>
  );
}
