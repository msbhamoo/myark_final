import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoriesClient from './StoriesClient';
import { listBlogsByTag } from '@/lib/blogService';
import { BlogPost } from '@/types/blog';
import { Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Success Stories | Myark',
    description: 'Inspiring stories of students, parents, and schools achieving their goals with Myark.',
};

export default async function SuccessStoriesPage() {
    let stories: BlogPost[] = [];

    try {
        // Fetch stories tagged with "Success Story"
        stories = await listBlogsByTag('Success Story');
    } catch (error) {
        console.error('Failed to fetch success stories:', error);
        // Fallback to empty array, Client component will handle mock data
        stories = [];
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-slate-900 py-20 sm:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>

                    <div className="container relative mx-auto px-4 text-center">
                        <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-300 backdrop-blur-sm mb-6">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Real Impact, Real Stories
                        </div>
                        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            Celebrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Success</span> Across Our Community
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300">
                            Discover how students are achieving their dreams, parents are finding clarity, and schools are transforming education with Myark.
                        </p>
                    </div>
                </section>

                {/* Stories Section */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <StoriesClient initialStories={stories} />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-white dark:bg-slate-900 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to Write Your Own Story?</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of students and parents who are already using Myark to navigate their educational journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/opportunities"
                                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
                            >
                                Explore Opportunities
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
