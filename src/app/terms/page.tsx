import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Myark',
  description: 'Terms and conditions for using the Myark platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-display mb-4">Terms of Use</h1>
        <p className="text-muted mb-12">Last updated: March 2026</p>

        <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-body">
          <h2 className="text-h2 mt-8 mb-4 text-heading">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using Myark, you accept and agree to be bound by the terms and provision of this agreement. 
            In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h2 className="text-h2 mt-8 mb-4 text-heading">2. Description of Service</h2>
          <p className="mb-6">
            Myark provides a discovery platform for verified opportunities including but not limited to scholarships, 
            olympiads, exchange programs, and educational competitions across India. You understand and agree that the Service 
            is provided &quot;AS-IS&quot; and that Myark assumes no responsibility for the timeliness, deletion, or failure to store any user communications or personalization settings.
          </p>

          <h2 className="text-h2 mt-8 mb-4 text-heading">3. Registration Obligations</h2>
          <p className="mb-6">
            In consideration of your use of the Service, you represent that you are of legal age to form a binding contract 
            and are not a person barred from receiving services under the laws of India or other applicable jurisdiction.
          </p>

          <h2 className="text-h2 mt-8 mb-4 text-heading">4. Contacting Organizers</h2>
          <p className="mb-6">
            Myark does not host the competitions. We exclusively aggregate and link out to official organizer domains. 
            We are not responsible for exact date changes, cancellations, or administrative issues resulting directly from the official event hosts.
          </p>
        </div>
      </div>
    </div>
  );
}
