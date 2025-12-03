'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Shield, Mail, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function PrivacyPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    collection: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      content: [
        'When you create a Myark account, we collect information such as your name, email address, date of birth, phone number, school name, grade, and interests.',
        'We collect information about the opportunities you view, bookmark, register for, and your progress on the platform.',
        'We may collect technical information about your device, browser type, operating system, and usage patterns to improve our services.',
        'With your permission, we may collect location data to show you opportunities relevant to your area.',
      ],
    },
    {
      id: 'use',
      title: '2. How We Use Your Information',
      content: [
        'To create and maintain your account and provide platform services.',
        'To personalize your experience and recommend opportunities tailored to your interests.',
        'To communicate with you about new opportunities, updates, and important announcements.',
        'To improve our platform, fix bugs, and develop new features.',
        'To comply with legal obligations and protect against fraud.',
        'To analyze how students and parents use our platform to enhance user experience.',
      ],
    },
    {
      id: 'security',
      title: '3. Data Security',
      content: [
        'We implement industry-standard encryption and security protocols to protect your personal information.',
        'Your data is stored on secure servers with restricted access.',
        'We regularly conduct security audits and maintain backup systems.',
        'While we take security seriously, no online service is completely secure. We encourage you to use strong passwords.',
      ],
    },
    {
      id: 'sharing',
      title: '4. Information Sharing',
      content: [
        'We do not sell your personal information to third parties.',
        'We may share information with partner organizations only when you register for their programs.',
        'We may disclose information when required by law or to protect our rights and safety.',
        'We use analytics services to understand platform usage trends (anonymized data).',
      ],
    },
    {
      id: 'parents',
      title: '5. Information for Parents',
      content: [
        'Parents can create accounts to access resources and monitor their child\'s activity (with child\'s permission).',
        'We collect parent contact information to send updates and educational resources.',
        'Parents can manage their privacy settings to control communication frequency.',
        'We take parental consent seriously and comply with COPPA guidelines for children under 13.',
      ],
    },
    {
      id: 'rights',
      title: '6. Your Rights',
      content: [
        'You have the right to access your personal information anytime through your account settings.',
        'You can request to update, correct, or delete your information.',
        'You can opt-out of marketing communications while maintaining your account.',
        'You can download your data in a portable format.',
        'You have the right to lodge a complaint with relevant data protection authorities.',
      ],
    },
    {
      id: 'cookies',
      title: '7. Cookies & Tracking',
      content: [
        'We use cookies to remember your preferences and improve user experience.',
        'You can control cookie settings in your browser.',
        'We use analytics tools to understand how users interact with our platform.',
        'Third-party services may place cookies to provide services like payments and customer support.',
      ],
    },
    {
      id: 'retention',
      title: '8. Data Retention',
      content: [
        'We retain your information for as long as your account is active.',
        'After account deletion, we keep some information for legal and compliance purposes.',
        'You can request complete data deletion, except for information required by law.',
        'Aggregated, anonymized data may be retained for analytical purposes.',
      ],
    },
    {
      id: 'changes',
      title: '9. Changes to This Policy',
      content: [
        'We may update this privacy policy to reflect changes in our practices or legal requirements.',
        'We will notify you via email if significant changes are made.',
        'Your continued use of Myark after updates constitutes acceptance of the new policy.',
        'Check this page periodically for the latest version of our privacy policy.',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm ring-1 ring-emerald-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-emerald-200 dark:ring-emerald-300/40">
              <Shield className="h-4 w-4" />
              Your Privacy Matters
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Privacy Policy
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              At Myark, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
            </p>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Last updated: November 2024
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white text-left">
                      {section.title}
                    </h2>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition ${expandedSections[section.id] ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {expandedSections[section.id] && (
                    <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-4 bg-slate-50 dark:bg-slate-800/30">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          • {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-400/30 dark:bg-emerald-950/20">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Questions About Privacy?
                  </h3>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  </p>
                  <p className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    support@myark.in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
