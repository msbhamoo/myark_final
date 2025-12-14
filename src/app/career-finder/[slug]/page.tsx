import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    GraduationCap,
    Banknote,
    MapPin,
    Lightbulb,
    CheckCircle,
    AlertTriangle,
    ChevronRight,
    BookOpen,
    Building,
    Globe,
    Award,
    Heart,
    Clock,
    TrendingUp,
    Target,
    Sparkles,
    Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCareerBySlug, getRelatedCareers } from '@/lib/careerService';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CareerDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const career = getCareerBySlug(slug);

    if (!career) {
        notFound();
    }

    const relatedCareers = getRelatedCareers(career.relatedCareers);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Hero Section - Enhanced */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/10 px-4 py-8 sm:py-12 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-6xl">
                        {/* Back button & Share */}
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href="/career-finder"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition dark:text-slate-400"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Careers
                            </Link>
                            <button className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition">
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-4">
                            <span
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm',
                                    career.categoryColor
                                )}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                {career.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {career.title}
                        </h1>

                        {/* Short Description */}
                        <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                            {career.fullDescription}
                        </p>

                        {/* Quick Stats Strip */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-200/60 p-4 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                                    <Banknote className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Starting</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{career.salary.entry}</p>
                            </div>
                            <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-200/60 p-4 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Senior</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{career.salary.senior}</p>
                            </div>
                            <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-200/60 p-4 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Roadmap</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{career.roadmap.length} Steps</p>
                            </div>
                            <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-200/60 p-4 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                    <Target className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Exams</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{career.exams.length}+</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-10 px-4">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Left Column - Roadmap */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* The Path (Roadmap) */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primaryDark shadow-lg shadow-primary/25">
                                            <GraduationCap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                                Your Roadmap to Success
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Step-by-step career path</p>
                                        </div>
                                    </div>

                                    <div className="space-y-0">
                                        {career.roadmap.map((step, index) => (
                                            <div key={index} className="relative pl-10 pb-8 last:pb-0">
                                                {/* Timeline line */}
                                                {index < career.roadmap.length - 1 && (
                                                    <div className="absolute left-[15px] top-10 h-full w-0.5 bg-gradient-to-b from-primary/50 to-slate-200 dark:to-slate-700" />
                                                )}
                                                {/* Timeline dot */}
                                                <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                                                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4 ml-2 dark:bg-slate-800/50 hover:shadow-md transition-shadow">
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                                        {step.title}
                                                    </h3>
                                                    {step.subtitle && (
                                                        <p className="text-sm font-medium text-primary mt-0.5">
                                                            {step.subtitle}
                                                        </p>
                                                    )}
                                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Where to Study */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                                Where to Study
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Top colleges and exams</p>
                                        </div>
                                    </div>

                                    {/* Key Exams */}
                                    {career.exams.length > 0 && (
                                        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/50 dark:bg-amber-500/10 dark:border-amber-500/20">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                <Award className="h-5 w-5 text-amber-600" />
                                                Key Entrance Exams
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {career.exams.map((exam, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block rounded-full bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm dark:bg-amber-900/50 dark:text-amber-200"
                                                    >
                                                        {exam}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Colleges Grid */}
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {/* India */}
                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/50 dark:bg-blue-500/10 dark:border-blue-500/20">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                <Building className="h-5 w-5 text-blue-600" />
                                                Top Colleges (India)
                                            </h3>
                                            <ul className="space-y-2">
                                                {career.collegesIndia.slice(0, 5).map((college, i) => (
                                                    <li
                                                        key={i}
                                                        className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                                    >
                                                        <span className="text-blue-500 font-bold mt-0.5">›</span>
                                                        {college}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Global */}
                                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/50 dark:bg-purple-500/10 dark:border-purple-500/20">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                <Globe className="h-5 w-5 text-purple-600" />
                                                Top Colleges (Global)
                                            </h3>
                                            <ul className="space-y-2">
                                                {career.collegesGlobal.slice(0, 5).map((college, i) => (
                                                    <li
                                                        key={i}
                                                        className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                                    >
                                                        <span className="text-purple-500 font-bold mt-0.5">›</span>
                                                        {college}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Degrees */}
                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-teal-600" />
                                            Degrees & Qualifications
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {career.degrees.map((degree, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                >
                                                    {degree}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Money Talk - Enhanced */}
                                <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm dark:border-amber-500/30 dark:from-amber-900/20 dark:to-slate-900">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                                            <Banknote className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                            💰 Salary Insights
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/50">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Entry Level</p>
                                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                                ₹{career.salary.entry}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/50">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Mid Level (5-8 yrs)</p>
                                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                                ₹{career.salary.mid}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 dark:border-primary/30">
                                            <p className="text-xs text-primary uppercase tracking-wider font-medium">Senior/Expert</p>
                                            <p className="text-2xl font-extrabold text-primary">
                                                ₹{career.salary.senior}
                                            </p>
                                        </div>
                                    </div>

                                    {career.salaryNote && (
                                        <p className="mt-4 text-xs text-slate-500 italic border-t border-amber-200 pt-4 dark:border-amber-700/30">
                                            💡 {career.salaryNote}
                                        </p>
                                    )}
                                </div>

                                {/* Did You Know - Enhanced */}
                                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm dark:border-purple-500/30 dark:from-purple-900/20 dark:to-slate-900">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                                            <Lightbulb className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                            ✨ You Could Also Be
                                        </h2>
                                    </div>

                                    <ul className="space-y-2">
                                        {career.didYouKnow.map((item, i) => (
                                            <li
                                                key={i}
                                                className="p-2.5 rounded-lg bg-white/80 text-sm text-slate-800 dark:bg-slate-800/50 dark:text-slate-200 flex items-center gap-2 font-medium"
                                            >
                                                <Heart className="h-4 w-4 text-rose-400 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Reality Check - Enhanced */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                        ⚖️ Reality Check
                                    </h2>

                                    {/* Good Stuff */}
                                    <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200/50 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            The Good Stuff
                                        </h3>
                                        <ul className="space-y-2">
                                            {career.goodStuff.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                                >
                                                    <span className="text-emerald-500 font-bold">+</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Challenges */}
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/50 dark:bg-amber-500/10 dark:border-amber-500/20">
                                        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            The Challenges
                                        </h3>
                                        <ul className="space-y-2">
                                            {career.challenges.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                                >
                                                    <span className="text-amber-600 font-bold">!</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Careers */}
                {relatedCareers.length > 0 && (
                    <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span>🔗</span> You Might Also Like
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedCareers.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/career-finder/${related.slug}`}
                                        className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <span
                                            className={cn(
                                                'inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3',
                                                related.categoryColor
                                            )}
                                        >
                                            {related.category}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary dark:text-white transition">
                                            {related.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {related.shortDescription}
                                        </p>
                                        <div className="mt-3 text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                            Explore <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="py-12 px-4 bg-gradient-to-r from-primary/5 via-white to-accent/5 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            Ready to explore more careers?
                        </h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Discover 30+ career paths tailored for students like you
                        </p>
                        <div className="mt-6">
                            <Button asChild size="lg" className="rounded-full px-8 py-6 shadow-lg shadow-primary/30">
                                <Link href="/career-finder">
                                    Explore All Careers
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <BottomNavigation />
        </div>
    );
}
