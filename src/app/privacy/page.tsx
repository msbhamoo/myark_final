import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Myark',
  description: 'How Myark protects your data and privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-display mb-4">Privacy Policy</h1>
        <p className="text-muted mb-12">Last updated: March 2026</p>

        <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-body">
          <h2 className="text-h2 mt-8 mb-4 text-heading">1. Introduction</h2>
          <p className="mb-6">
            Welcome to Myark. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>

          <h2 className="text-h2 mt-8 mb-4 text-heading">2. Data We Collect</h2>
          <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
          </ul>

          <h2 className="text-h2 mt-8 mb-4 text-heading">3. How We Use Your Data</h2>
          <p className="mb-6">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data 
            in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you. 
            Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
          </p>

          <h2 className="text-h2 mt-8 mb-4 text-heading">4. Data Security</h2>
          <p className="mb-6">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
            used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data 
            to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </div>
      </div>
    </div>
  );
}
