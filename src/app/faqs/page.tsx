'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, GraduationCap, Users, School, Award, Shield, CreditCard, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { cn } from '@/lib/utils';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    icon: React.ReactNode;
    items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
    {
        title: 'About MyArk',
        icon: <HelpCircle className="h-5 w-5" />,
        items: [
            {
                question: 'What is MyArk?',
                answer: 'MyArk is India\'s leading platform that helps students in Grades 4-12 discover and participate in competitions, scholarships, olympiads, and skill-building opportunities. We curate the best opportunities from across India and make them easily accessible to students and parents.',
            },
            {
                question: 'Why does MyArk exist?',
                answer: 'We noticed that students across India miss out on amazing opportunities simply because they don\'t know they exist. Talented children in tier-2 and tier-3 cities often lack access to information about national and international competitions. MyArk bridges this gap by bringing all opportunities to one place, ensuring every student has equal access to success.',
            },
            {
                question: 'Who founded MyArk?',
                answer: 'MyArk was founded by passionate educators and technologists who believe that every child deserves a chance to shine. Our team is based in Jaipur, Rajasthan, and we\'re committed to democratizing access to opportunities across India.',
            },
            {
                question: 'Is MyArk only for students in India?',
                answer: 'Yes, currently MyArk focuses on opportunities for students studying in Indian schools. However, many of the competitions and scholarships we list have international components, allowing Indian students to compete globally.',
            },
        ],
    },
    {
        title: 'For Students',
        icon: <GraduationCap className="h-5 w-5" />,
        items: [
            {
                question: 'Is MyArk free for students?',
                answer: 'Yes! MyArk is completely free for students. You can create an account, browse all opportunities, save favorites, and apply without paying anything. We believe access to opportunities should never be limited by financial constraints.',
            },
            {
                question: 'What grade levels does MyArk support?',
                answer: 'MyArk supports students from Grade 4 to Grade 12. We curate age-appropriate opportunities for each grade level, from junior olympiads to college scholarships.',
            },
            {
                question: 'How do I create an account?',
                answer: 'You can sign up using your email address or Google account. The process takes less than a minute. Once signed up, you can personalize your profile, set your grade, and start discovering opportunities tailored for you.',
            },
            {
                question: 'Can I participate in multiple competitions?',
                answer: 'Absolutely! There\'s no limit to how many opportunities you can explore or participate in. We encourage students to try different types of competitions to discover their strengths and interests.',
            },
            {
                question: 'How do I know which opportunities are right for me?',
                answer: 'MyArk provides smart recommendations based on your grade, interests, and past participation. You can also filter opportunities by category (Science, Math, Arts, etc.), mode (online/offline), and difficulty level.',
            },
            {
                question: 'What happens after I register for an opportunity?',
                answer: 'After registration, you\'ll receive confirmation along with all necessary details. We\'ll send reminders before important dates like exam schedules. Your registrations are tracked in your dashboard so you never miss a deadline.',
            },
        ],
    },
    {
        title: 'For Parents',
        icon: <Users className="h-5 w-5" />,
        items: [
            {
                question: 'Is MyArk free for parents?',
                answer: 'Yes, MyArk is completely free for parents too. You can explore opportunities, save them for your child, and understand all the details without any cost.',
            },
            {
                question: 'How can I help my child use MyArk?',
                answer: 'Parents can create an account to explore opportunities and understand what\'s available. You can discuss options with your child, help them prepare for competitions, and track their participation through the dashboard.',
            },
            {
                question: 'Are the opportunities on MyArk verified?',
                answer: 'Yes! Every opportunity listed on MyArk is verified by our team. We check the organizing body, past track record, and authenticity before adding any program to our platform. We clearly mark established competitions vs new ones.',
            },
            {
                question: 'How do I know if an opportunity is suitable for my child?',
                answer: 'Each opportunity page clearly mentions eligibility criteria including grade range, prerequisites, and difficulty level. We also provide preparation tips and what to expect, helping you make informed decisions.',
            },
            {
                question: 'Will my child\'s data be safe?',
                answer: 'Absolutely. We take data privacy very seriously. We don\'t share personal information with third parties without consent. All data is encrypted and stored securely. Please read our Privacy Policy for complete details.',
            },
        ],
    },
    {
        title: 'For Schools',
        icon: <School className="h-5 w-5" />,
        items: [
            {
                question: 'Can schools partner with MyArk?',
                answer: 'Yes! Schools can partner with MyArk to provide their students easy access to opportunities. We offer school accounts that allow teachers and administrators to enroll students in bulk for various programs.',
            },
            {
                question: 'Is there a fee for schools?',
                answer: 'We offer free basic access for schools. Premium features like bulk enrollment, analytics, and dedicated support are available through our school partnership program. Contact us to learn more.',
            },
            {
                question: 'How can my school get started?',
                answer: 'Schools can reach out to us at support@myark.in with basic details. Our team will set up your school account, verify your institution, and guide you through the onboarding process.',
            },
            {
                question: 'Can schools create their own events on MyArk?',
                answer: 'Yes! Verified schools can host their own competitions, scholarships, and events on MyArk. This helps reach students beyond your immediate community and build your school\'s brand.',
            },
        ],
    },
    {
        title: 'Opportunities & Competitions',
        icon: <Award className="h-5 w-5" />,
        items: [
            {
                question: 'What types of opportunities are available on MyArk?',
                answer: 'MyArk covers a wide range including: Academic Olympiads (Math, Science, Computing), Scholarships & Financial Aid, Essay & Creative Writing Competitions, Science Fairs & Innovation Challenges, Art & Design Contests, Quiz Competitions, Coding & Hackathons, Sports Scholarships, and much more.',
            },
            {
                question: 'Are these competitions free to participate in?',
                answer: 'Many competitions on MyArk are free. Some olympiads and competitive exams have registration fees charged by the organizing body. We always clearly mention any fees on the opportunity page.',
            },
            {
                question: 'How often are new opportunities added?',
                answer: 'Our team adds new opportunities daily. We monitor major organizing bodies, educational institutions, and government programs to ensure you never miss an opportunity.',
            },
            {
                question: 'Can I get reminders for application deadlines?',
                answer: 'Yes! When you save an opportunity or register interest, we\'ll send you reminders before the deadline. You can manage your notification preferences in your account settings.',
            },
            {
                question: 'What if I miss a deadline?',
                answer: 'Don\'t worry! Many competitions happen annually or have multiple rounds. Save the opportunity to get notified when the next cycle opens. We also show trending opportunities so you\'re always aware of what\'s coming up.',
            },
        ],
    },
    {
        title: 'Platform & Security',
        icon: <Shield className="h-5 w-5" />,
        items: [
            {
                question: 'Is my personal information safe on MyArk?',
                answer: 'Yes. We use industry-standard encryption and security practices. Your personal data is never sold to third parties. We only use your information to provide better opportunity recommendations and essential communications.',
            },
            {
                question: 'Can I delete my account?',
                answer: 'Yes, you can delete your account at any time from your settings page. Upon deletion, all your personal data will be permanently removed from our systems.',
            },
            {
                question: 'Does MyArk work on mobile devices?',
                answer: 'Yes! MyArk is fully responsive and works great on mobile phones and tablets. You can also install MyArk as an app on your device for quick access.',
            },
            {
                question: 'How do I report a problem or bug?',
                answer: 'You can report issues through the feedback option in your dashboard or email us at support@myark.in. Our team actively monitors and fixes issues to improve your experience.',
            },
        ],
    },
    {
        title: 'Pricing & Payment',
        icon: <CreditCard className="h-5 w-5" />,
        items: [
            {
                question: 'Does MyArk charge any fee?',
                answer: 'MyArk is free for students and parents. We don\'t charge for browsing, registering, or applying to opportunities. Some premium features for organizations may have associated costs.',
            },
            {
                question: 'Do competitions on MyArk have registration fees?',
                answer: 'Some competitions have registration fees charged by the organizing body (not MyArk). We always clearly mention if there are any fees, and payment is made directly to the organizer, not through MyArk.',
            },
            {
                question: 'How does MyArk sustain itself if it\'s free?',
                answer: 'MyArk partners with educational institutions, competition organizers, and sponsors who believe in our mission. These partnerships help us keep the platform free for students while continuously improving our services.',
            },
        ],
    },
    {
        title: 'Support & Contact',
        icon: <Mail className="h-5 w-5" />,
        items: [
            {
                question: 'How can I contact MyArk support?',
                answer: 'You can reach us at support@myark.in for any queries. We typically respond within 24 hours on business days. For urgent matters, you can also reach out on our social media channels.',
            },
            {
                question: 'Can I suggest a new opportunity to be added?',
                answer: 'Absolutely! We welcome suggestions. Email us at support@myark.in with details about the opportunity, and our team will review it for inclusion.',
            },
            {
                question: 'I\'m an organizer. How can I list my competition on MyArk?',
                answer: 'Competition organizers can apply to list their programs on MyArk. Visit our "Host" section or email us at support@myark.in with your organization details and program information.',
            },
            {
                question: 'Where is MyArk based?',
                answer: 'MyArk is based in Jaipur, Rajasthan, India. We\'re a proudly Indian company serving students across the nation.',
            },
        ],
    },
];

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-slate-200 dark:border-white/10">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
            >
                <span className="font-medium text-slate-900 dark:text-white pr-4">{item.question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96 pb-4' : 'max-h-0'
                )}
            >
                <p className="text-slate-600 dark:text-white/70 leading-relaxed">{item.answer}</p>
            </div>
        </div>
    );
}

export default function FAQsPage() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allKeys = new Set<string>();
        FAQ_CATEGORIES.forEach((cat, catIdx) => {
            cat.items.forEach((_, itemIdx) => {
                allKeys.add(`${catIdx}-${itemIdx}`);
            });
        });
        setOpenItems(allKeys);
    };

    const collapseAll = () => {
        setOpenItems(new Set());
    };

    // Generate FAQPage structured data for SEO
    const faqSchemaData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_CATEGORIES.flatMap(category =>
            category.items.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        )
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* FAQPage Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
            />
            <Header />

            <main className="flex-1 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                {/* Header */}
                <section className="relative overflow-hidden py-16 sm:py-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <HelpCircle className="h-4 w-4" />
                            Frequently Asked Questions
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                            Everything you need to know about{' '}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MyArk</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
                            Find answers to common questions about our platform, opportunities, and how we help students achieve their dreams.
                        </p>
                    </div>
                </section>

                {/* FAQs Content */}
                <section className="pb-20">
                    <div className="mx-auto max-w-4xl px-6">
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mb-8">
                            <button
                                onClick={expandAll}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Expand All
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                                onClick={collapseAll}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Collapse All
                            </button>
                        </div>

                        {/* FAQ Categories */}
                        <div className="space-y-12">
                            {FAQ_CATEGORIES.map((category, catIndex) => (
                                <div
                                    key={category.title}
                                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {category.icon}
                                        </div>
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            {category.title}
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-slate-200 dark:divide-white/10">
                                        {category.items.map((item, itemIndex) => (
                                            <FAQAccordion
                                                key={itemIndex}
                                                item={item}
                                                isOpen={openItems.has(`${catIndex}-${itemIndex}`)}
                                                onClick={() => toggleItem(catIndex, itemIndex)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Still Have Questions */}
                        <div className="mt-16 text-center">
                            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 sm:p-12">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Still have questions?
                                </h3>
                                <p className="mt-3 text-slate-600 dark:text-white/70">
                                    Can't find the answer you're looking for? Our team is here to help.
                                </p>
                                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </Link>
                                    <a
                                        href="mailto:support@myark.in"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10"
                                    >
                                        Email: support@myark.in
                                    </a>
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
