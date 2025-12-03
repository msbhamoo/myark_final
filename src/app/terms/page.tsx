'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { FileText, AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TermsPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    acceptance: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using Myark, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'Myark reserves the right to update these terms at any time. Your continued use of the platform after changes constitutes your acceptance of the new terms.',
      ],
    },
    {
      id: 'use',
      title: '2. Use License',
      content: [
        'Permission is granted to temporarily download one copy of the materials (information or software) on Myark for personal, non-commercial transitory viewing only.',
        'This is the grant of a license, not a transfer of title, and under this license you may not:',
        '• Modifying or copying the materials',
        '• Using the materials for any commercial purpose or for any public display',
        '• Attempting to decompile or reverse engineer any software contained on Myark',
        '• Transferring the materials to another person or "mirroring" the materials on any other server',
        '• Removing any copyright or other proprietary notations from the materials',
      ],
    },
    {
      id: 'disclaimer',
      title: '3. Disclaimer',
      content: [
        'The materials on Myark are provided on an "as is" basis. Myark makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
        'Further, Myark does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.',
      ],
    },
    {
      id: 'limitations',
      title: '4. Limitations',
      content: [
        'In no event shall Myark or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Myark.',
        'Even if Myark or a Myark authorized representative has been notified orally or in writing of the possibility of such damage, the liability of Myark will not exceed the total amount you have actually paid to Myark, if any, in the six (6) months prior to such claim.',
      ],
    },
    {
      id: 'accuracy',
      title: '5. Accuracy of Materials',
      content: [
        'The materials appearing on Myark could include technical, typographical, or photographic errors.',
        'Myark does not warrant that any of the materials on Myark are accurate, complete, or current.',
        'Myark may make changes to the materials contained on Myark at any time without notice.',
        'Myark does not, however, make any commitment to update the materials.',
      ],
    },
    {
      id: 'links',
      title: '6. Links',
      content: [
        'Myark has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site.',
        'The inclusion of any link does not imply endorsement by Myark of the site. Use of any such linked web site is at the user\'s own risk.',
        'If you discover a broken link or inappropriate content, please report it to support@myark.in.',
      ],
    },
    {
      id: 'modifications',
      title: '7. Modifications',
      content: [
        'Myark may revise these terms of service for its web site at any time without notice.',
        'By using this web site you are agreeing to be bound by the then current version of these terms of service.',
      ],
    },
    {
      id: 'governing',
      title: '8. Governing Law',
      content: [
        'These terms and conditions are governed by and construed in accordance with the laws of India.',
        'You irrevocably submit to the exclusive jurisdiction of the courts located in Jaipur, Rajasthan.',
      ],
    },
    {
      id: 'userContent',
      title: '9. User-Generated Content',
      content: [
        'Users are responsible for all content they upload, post, or display on Myark.',
        'By posting content, you grant Myark a license to use, reproduce, and distribute the content.',
        'You represent and warrant that you own or have the necessary rights to the content you post.',
        'Myark reserves the right to remove any content that violates these terms.',
      ],
    },
    {
      id: 'prohibited',
      title: '10. Prohibited Activities',
      content: [
        'Users shall not engage in any activity that disrupts, degrades, or impairs the normal functioning of Myark.',
        'Prohibited activities include:',
        '• Hacking, phishing, or unauthorized access',
        '• Harassment, abuse, or threatening behavior',
        '• Spam or unsolicited communications',
        '• Copyright infringement or intellectual property violations',
        '• Fraudulent activities or misrepresentation',
        '• Interfering with other users\' rights',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-blue-200 dark:ring-blue-300/40">
              <FileText className="h-4 w-4" />
              Terms & Conditions
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Terms of Service
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              Please read these terms and conditions carefully before using Myark.
            </p>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Last updated: November 2024
            </p>
          </div>
        </section>

        {/* Warning Box */}
        <section className="py-8 px-4 bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-900/30">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  Important: Please read carefully
                </p>
                <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                  These terms govern your use of Myark. By using this platform, you agree to these terms. If you don't agree, please don't use the service.
                </p>
              </div>
            </div>
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
                    <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-3 bg-slate-50 dark:bg-slate-800/30">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {paragraph.startsWith('•') ? paragraph : `• ${paragraph}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 rounded-2xl border-2 border-blue-200 bg-blue-50 p-8 dark:border-blue-400/30 dark:bg-blue-950/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Questions About These Terms?
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                If you have any questions about these terms and conditions, please contact us at:
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                support@myark.in
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
