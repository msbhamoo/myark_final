'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import {
    Search,
    Sparkles,
    Heart,
    ArrowRight,
    Compass,
    GraduationCap,
    Briefcase,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAREERS, INTEREST_CHIPS, Career } from '@/constants/careers';
import { searchCareers, generateMatchMessage } from '@/lib/careerService';

// Career Card Component
function CareerCard({
    career,
    query,
}: {
    career: Career;
    query: string;
}) {
    const matchMessage = query ? generateMatchMessage(career, query) : null;

    return (
        <Link
            href={`/career-finder/${career.slug}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
            <div className="flex items-start justify-between">
                <span
                    className={cn(
                        'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                        career.categoryColor
                    )}
                >
                    {career.category.toUpperCase()}
                </span>
                <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-primary dark:text-white">
                {career.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {career.shortDescription}
            </p>

            {matchMessage && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 dark:bg-rose-500/10">
                    <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                    <p className="text-xs text-rose-700 dark:text-rose-300 italic">
                        "{matchMessage}"
                    </p>
                </div>
            )}
        </Link>
    );
}

function CareerFinderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [searchInput, setSearchInput] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(!!initialQuery);

    // Update query when URL changes
    useEffect(() => {
        const urlQuery = searchParams.get('q') || '';
        if (urlQuery !== query) {
            setQuery(urlQuery);
            setSearchInput(urlQuery);
            setIsSearching(!!urlQuery);
        }
    }, [searchParams]);

    // Search results
    const results = useMemo(() => {
        if (!query) return CAREERS;
        return searchCareers(query);
    }, [query]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setQuery(searchInput.trim());
            setIsSearching(true);
            router.push(`/career-finder?q=${encodeURIComponent(searchInput.trim())}`, { scroll: false });
        }
    };

    // Handle chip click
    const handleChipClick = (chipLabel: string) => {
        setSearchInput(chipLabel.toLowerCase());
        setQuery(chipLabel.toLowerCase());
        setIsSearching(true);
        router.push(`/career-finder?q=${encodeURIComponent(chipLabel.toLowerCase())}`, { scroll: false });
    };

    // Handle clear
    const handleClear = () => {
        setSearchInput('');
        setQuery('');
        setIsSearching(false);
        router.push('/career-finder', { scroll: false });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Hero + Search Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/30 px-4 pt-12 pb-16 sm:px-6 md:pt-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-60 w-60 rounded-full bg-accent/30 blur-3xl" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-primary shadow-sm ring-1 ring-primary/20 dark:bg-slate-800/90 dark:ring-primary/40">
                            <Compass className="h-4 w-4" />
                            <span>Career Finder</span>
                        </div>

                        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
                            Discover the perfect career<br className="hidden sm:block" />
                            <span className="text-primary">without the confusion</span>
                        </h1>

                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Tell us what you love, what you're good at, or a job you're curious about.
                            Myark explains it all simply — salary, colleges, and how to get there.
                        </p>

                        {/* Search Box */}
                        <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder='Try "space", "coding", "doctor", or "money"...'
                                    className="w-full rounded-full border-2 border-slate-200 bg-white py-4 pl-12 pr-32 text-base shadow-lg placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2 font-semibold text-white shadow-md hover:bg-primary/90"
                                >
                                    Explore
                                </Button>
                            </div>
                        </form>

                        {/* Interest Chips */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {INTEREST_CHIPS.map((chip) => (
                                <button
                                    key={chip.label}
                                    onClick={() => handleChipClick(chip.label)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                        query.toLowerCase() === chip.label.toLowerCase()
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white text-slate-600 shadow-sm hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300'
                                    )}
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="py-12 md:py-16 px-4">
                    <div className="mx-auto max-w-7xl">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {isSearching ? 'Here are some paths made for you' : 'Explore All Careers'}
                                </h2>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">
                                    {isSearching
                                        ? `Click on any card to see the full roadmap, salary, and details.`
                                        : `${CAREERS.length} career paths to explore`}
                                </p>
                            </div>
                            {isSearching && (
                                <button
                                    onClick={handleClear}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>

                        {/* Results Grid */}
                        {results.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {results.map((career) => (
                                    <CareerCard key={career.slug} career={career} query={query} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-800">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    No careers found for "{query}"
                                </h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Try a different interest or explore our categories above.
                                </p>
                                <Button onClick={handleClear} className="mt-4">
                                    View All Careers
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Stats/Trust Section */}
                <section className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{CAREERS.length}+</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Careers Covered</p>
                            </div>
                            <div>
                                <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 dark:bg-emerald-500/20">
                                    <Briefcase className="h-6 w-6 text-emerald-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">100+</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Colleges Listed</p>
                            </div>
                            <div>
                                <div className="mx-auto w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 dark:bg-amber-500/20">
                                    <TrendingUp className="h-6 w-6 text-amber-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">Real</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Salary Data</p>
                            </div>
                            <div>
                                <div className="mx-auto w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3 dark:bg-purple-500/20">
                                    <Sparkles className="h-6 w-6 text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">AI</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Powered Matching</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-white to-accent/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                            Still confused? Start with what excites you.
                        </h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Every great career starts with a spark of curiosity.
                        </p>
                        <div className="mt-6">
                            <Button
                                onClick={() => {
                                    setSearchInput('');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    document.querySelector('input')?.focus();
                                }}
                                size="lg"
                                className="rounded-full bg-primary px-8 py-6 text-base font-semibold text-white shadow-lg"
                            >
                                Try the Search
                                <ChevronRight className="ml-2 h-5 w-5" />
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

// Loading fallback for Suspense
function CareerFinderLoading() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Loading...</div>
            </main>
            <Footer />
        </div>
    );
}

// Default export with Suspense boundary
export default function CareerFinderPage() {
    return (
        <Suspense fallback={<CareerFinderLoading />}>
            <CareerFinderContent />
        </Suspense>
    );
}
