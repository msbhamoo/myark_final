'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    School,
    Users,
    TrendingUp,
    Award,
    FileText,
    BarChart3,
    Mail,
    Clock,
    Zap,
    Shield,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Target,
    Heart,
    Download,
    Share2,
    Bell,
    Calendar,
    Star,
    Quote,
    Globe,
} from 'lucide-react';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}

interface Benefit {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Testimonial {
    name: string;
    role: string;
    school: string;
    quote: string;
    rating: number;
    image?: string;
}

interface Stat {
    value: string;
    label: string;
    icon: React.ReactNode;
}

const FEATURES: Feature[] = [
    {
        icon: <Globe className="h-6 w-6" />,
        title: 'Host Your Own Opportunities',
        description:
            'Create and host opportunities for students with flexible visibility: Public (open to all), Private (your students only), or Hybrid (selected schools). Perfect for school events, competitions, and exclusive programs.',
        gradient: 'from-teal-500 to-cyan-500',
    },
    {
        icon: <Target className="h-6 w-6" />,
        title: 'Centralized Opportunity Hub',
        description:
            'Post, manage, and track all opportunities (competitions, scholarships, events) from one dashboard. No more scattered emails or spreadsheets.',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: <FileText className="h-6 w-6" />,
        title: 'Digital Student Portfolios',
        description:
            'Every student gets a dynamic digital profile showcasing achievements, certificates, and participation—perfect for college applications.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: 'Automated Achievement Tracking',
        description:
            'Automatically record and showcase student participation, awards, and milestones. Save hours on manual record-keeping.',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        icon: <BarChart3 className="h-6 w-6" />,
        title: 'Participation Analytics',
        description:
            'Gain insights into student engagement across grades, subjects, and opportunity types. Make data-driven decisions.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: <Bell className="h-6 w-6" />,
        title: 'Parent & Student Engagement',
        description:
            'Keep parents informed and students motivated with automatic notifications, updates, and progress reports.',
        gradient: 'from-rose-500 to-red-500',
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: 'Safe & Verified Platform',
        description:
            'Only vetted, quality opportunities. Built with student safety and data privacy as top priorities.',
        gradient: 'from-indigo-500 to-violet-500',
    },
];

const BENEFITS: Benefit[] = [
    {
        icon: <Clock className="h-5 w-5" />,
        title: 'Save 10+ Hours Weekly',
        description: 'Automate repetitive tasks like opportunity notifications and achievement logging.',
    },
    {
        icon: <TrendingUp className="h-5 w-5" />,
        title: 'Boost Student Participation',
        description: 'Students discover and register for opportunities 3x faster with personalized recommendations.',
    },
    {
        icon: <Award className="h-5 w-5" />,
        title: 'Showcase School Excellence',
        description: 'Highlight your school\'s achievements and student success stories to attract admissions.',
    },
    {
        icon: <Heart className="h-5 w-5" />,
        title: 'Strengthen Parent Relationships',
        description: 'Build trust with transparent, real-time updates on student progress and opportunities.',
    },
];

const TESTIMONIALS: Testimonial[] = [
    {
        name: 'Dr. Anjali Mehta',
        role: 'Principal',
        school: 'Greenfield International School, Mumbai',
        quote:
            'Myark has transformed how we manage student opportunities. What used to take hours now happens automatically. Our students are more engaged than ever!',
        rating: 5,
    },
    {
        name: 'Rajesh Kumar',
        role: 'VP Academics',
        school: 'Delhi Public School, Bangalore',
        quote:
            'The digital portfolios are a game-changer for our students. Parents love seeing their child\'s achievements in one place, and colleges appreciate the comprehensive profiles.',
        rating: 5,
    },
    {
        name: 'Priya Sharma',
        role: 'Student Counselor',
        school: 'St. Xavier\'s High School, Pune',
        quote:
            'Myark\'s analytics help us identify students who need more support and recognize those who excel. It\'s become an essential tool for our team.',
        rating: 5,
    },
];

const STATS: Stat[] = [
    {
        value: '500+',
        label: 'Partner Schools',
        icon: <School className="h-6 w-6" />,
    },
    {
        value: '100K+',
        label: 'Active Students',
        icon: <Users className="h-6 w-6" />,
    },
    {
        value: '50K+',
        label: 'Opportunities Posted',
        icon: <Target className="h-6 w-6" />,
    },
    {
        value: '95%',
        label: 'Parent Satisfaction',
        icon: <Star className="h-6 w-6" />,
    },
];

export default function ForSchoolsClient() {
    const searchParams = useSearchParams();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        schoolName: '',
        contactName: '',
        email: '',
        phone: '',
        city: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Open auth modal if openAuth parameter is present
    useEffect(() => {
        if (searchParams.get('openAuth') === 'true') {
            setIsAuthModalOpen(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/school-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit');
            }

            setSubmitted(true);
            setFormData({ schoolName: '', contactName: '', email: '', phone: '', city: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-16 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 sm:py-24">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 blur-3xl" />
                        <div className="absolute -right-4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left column - Text content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-slate-900/50">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">Trusted by 500+ Schools Across India</span>
                                </div>

                                <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                                    Empower Your Students with{' '}
                                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Myark
                                    </span>
                                </h1>

                                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 sm:text-xl">
                                    Transform how your school discovers, manages, and tracks student opportunities. Join the leading
                                    platform helping schools boost engagement, streamline administration, and celebrate student success.
                                </p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        size="lg"
                                        className="group rounded-full bg-gradient-to-r from-primary to-primaryDark px-8 py-6 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:shadow-xl hover:shadow-primary/40"
                                        onClick={() => setIsAuthModalOpen(true)}
                                    >
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full border-2 border-primary bg-white px-8 py-6 text-base font-semibold text-primary hover:bg-accent/10 dark:bg-slate-900"
                                    >
                                        Watch Demo
                                    </Button>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>Setup in 5 minutes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>Free for first 3 months</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right column - Visual/Stats */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    {STATS.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
                                        >
                                            <div className="flex flex-col gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primaryDark text-white shadow-md shadow-primary/30">
                                                    {stat.icon}
                                                </div>
                                                <div>
                                                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Host Opportunities Callout Section */}
                <section className="border-y border-slate-200 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 px-4 py-16 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400">
                                🎯 Create & Host
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                Host Opportunities for Your Students
                            </h2>
                            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
                                Schools can create their own opportunities and control who participates. Choose from three visibility modes to match your needs.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Public Mode */}
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-teal-200 bg-white p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl dark:border-teal-700 dark:bg-slate-900">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
                                    <Globe className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Public</h3>
                                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
                                    Open to <span className="font-semibold text-teal-600 dark:text-teal-400">all students</span> on Myark. Perfect for inter-school competitions, national-level events, and building your school\\'s reputation.
                                </p>
                                <div className="rounded-lg bg-teal-50 p-3 text-sm text-slate-700 dark:bg-teal-900/20 dark:text-slate-300">
                                    <strong>Example:</strong> Annual science fair, debate tournament
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 blur-2xl" />
                            </div>

                            {/* Private Mode */}
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl dark:border-purple-700 dark:bg-slate-900">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Private</h3>
                                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
                                    Visible only to <span className="font-semibold text-purple-600 dark:text-purple-400">your students</span>. Ideal for internal events, school-specific programs, and building campus culture.
                                </p>
                                <div className="rounded-lg bg-purple-50 p-3 text-sm text-slate-700 dark:bg-purple-900/20 dark:text-slate-300">
                                    <strong>Example:</strong> Sports day, talent show, student council
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
                            </div>

                            {/* Hybrid Mode */}
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-white p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl dark:border-amber-700 dark:bg-slate-900">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Hybrid</h3>
                                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
                                    Open to <span className="font-semibold text-amber-600 dark:text-amber-400">selected schools</span> you choose. Great for collaborative events, regional competitions, and partner school programs.
                                </p>
                                <div className="rounded-lg bg-amber-50 p-3 text-sm text-slate-700 dark:bg-amber-900/20 dark:text-slate-300">
                                    <strong>Example:</strong> Multi-school hackathon, cluster tournaments
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-2xl" />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 text-center">
                            <Button
                                size="lg"
                                className="group rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 text-base font-semibold text-white shadow-lg hover:shadow-xl"
                                onClick={() => {
                                    const formSection = document.getElementById('contact-form');
                                    formSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Start Hosting Opportunities
                                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-4 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Features</Badge>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                Everything Your School Needs to Thrive
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                                A complete platform designed to simplify opportunity management and amplify student success
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {/* Icon with gradient */}
                                    <div
                                        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition group-hover:scale-110`}
                                    >
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>

                                    {/* Hover effect gradient bar */}
                                    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${feature.gradient} opacity-0 transition group-hover:opacity-100`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-slate-50 px-4 py-16 dark:bg-slate-900/50 sm:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                                Benefits
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                Why Schools Love Myark
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                                Real impact, proven results
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {BENEFITS.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primaryDark/20 text-primary">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="px-4 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400">
                                Testimonials
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                Loved by Educators Nationwide
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                                Hear from school leaders who've transformed their student engagement
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {/* Quote icon */}
                                    <Quote className="mb-4 h-10 w-10 text-primary/20" />

                                    {/* Rating */}
                                    <div className="mb-4 flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="mb-6 leading-relaxed text-slate-700 dark:text-slate-300">"{testimonial.quote}"</p>

                                    {/* Author */}
                                    <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                                        <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                                        <div className="text-sm font-semibold text-primary">{testimonial.school}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primaryDark to-purple-700 px-4 py-16 sm:py-24">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-white blur-3xl" />
                        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-white blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Ready to Transform Your School?
                        </h2>
                        <p className="mb-8 text-xl text-white/90">
                            Join 500+ forward-thinking schools empowering students to discover and achieve more.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button
                                size="lg"
                                className="rounded-full bg-white px-8 py-6 text-base font-semibold text-primary shadow-lg hover:bg-slate-50"
                                onClick={() => {
                                    const formSection = document.getElementById('contact-form');
                                    formSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full border-2 border-white bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
                            >
                                Schedule a Demo
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact-form" className="px-4 py-16 sm:py-24">
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-12 text-center">
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Get in Touch</Badge>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                Let's Get Your School Started
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Fill out the form below and our team will reach out within 24 hours
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="schoolName" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        School Name *
                                    </label>
                                    <Input
                                        id="schoolName"
                                        type="text"
                                        required
                                        value={formData.schoolName}
                                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                        placeholder="Enter school name"
                                        className="rounded-xl border-slate-300 dark:border-slate-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contactName" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Your Name *
                                    </label>
                                    <Input
                                        id="contactName"
                                        type="text"
                                        required
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        placeholder="Enter your name"
                                        className="rounded-xl border-slate-300 dark:border-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Email Address *
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="school@example.com"
                                        className="rounded-xl border-slate-300 dark:border-slate-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Phone Number *
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="rounded-xl border-slate-300 dark:border-slate-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="city" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    City *
                                </label>
                                <Input
                                    id="city"
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Enter city"
                                    className="rounded-xl border-slate-300 dark:border-slate-600"
                                />
                            </div>

                            {submitted && (
                                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-700 dark:bg-green-500/10 dark:text-green-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <p>Thank you! We'll be in touch within 24 hours.</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-500/10 dark:text-red-300">
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                disabled={submitting}
                                className="w-full rounded-full bg-gradient-to-r from-primary to-primaryDark py-6 text-base font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                                {!submitting && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>

                            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                By submitting this form, you agree to our{' '}
                                <Link href="/terms" className="underline hover:text-primary">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="underline hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </p>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
            <BottomNavigation />

            {/* Business Authentication Modal */}
            <AuthModal
                open={isAuthModalOpen}
                onOpenChange={setIsAuthModalOpen}
                defaultAccountType="organization"
                redirectUrl="/host"
            />
        </div >
    );
}
