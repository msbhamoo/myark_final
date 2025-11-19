'use client';

import { useState } from 'react';
import { BlogPost } from '@/types/blog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, School, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';

interface StoriesClientProps {
    initialStories: BlogPost[];
}

export default function StoriesClient({ initialStories }: StoriesClientProps) {
    const [filter, setFilter] = useState('all');

    // Mock stories to use if no real stories are found
    const mockStories: BlogPost[] = [
        {
            id: 'mock-1',
            title: 'How Aarav Cracked the National Science Olympiad',
            slug: 'aarav-science-olympiad',
            excerpt: 'Aarav, a Grade 9 student, shares his journey of preparation, perseverance, and eventual success in the NSO.',
            content: '...',
            coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop',
            author: 'Myark Team',
            tags: ['Success Story', 'Student', 'Olympiad'],
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            viewCount: 120,
            shares: { facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0 }
        },
        {
            id: 'mock-2',
            title: 'Greenwood High: Transforming Student Engagement',
            slug: 'greenwood-high-engagement',
            excerpt: 'See how Greenwood High used Myark to increase student participation in extracurriculars by 40%.',
            content: '...',
            coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
            author: 'Myark Team',
            tags: ['Success Story', 'School', 'Engagement'],
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            viewCount: 85,
            shares: { facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0 }
        },
        {
            id: 'mock-3',
            title: 'A Parent\'s Perspective: Finding the Right Path',
            slug: 'parents-perspective-right-path',
            excerpt: 'Mrs. Sharma explains how the Career Toolkit helped her guide her daughter towards a passion for coding.',
            content: '...',
            coverImage: 'https://images.unsplash.com/photo-1536009298352-8b23d91d1846?q=80&w=1974&auto=format&fit=crop',
            author: 'Myark Team',
            tags: ['Success Story', 'Parent', 'Career'],
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            viewCount: 210,
            shares: { facebook: 0, twitter: 0, linkedin: 0, whatsapp: 0 }
        }
    ];

    const stories = initialStories.length > 0 ? initialStories : mockStories;

    const filteredStories = stories.filter(story => {
        if (filter === 'all') return true;
        // Check if any tag matches the filter (case insensitive)
        return story.tags?.some(tag => tag.toLowerCase() === filter.toLowerCase());
    });

    return (
        <div className="space-y-10">
            {/* Filter Tabs */}
            <div className="flex justify-center">
                <Tabs defaultValue="all" onValueChange={setFilter} className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                        <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">All</TabsTrigger>
                        <TabsTrigger value="student" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Students</TabsTrigger>
                        <TabsTrigger value="parent" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Parents</TabsTrigger>
                        <TabsTrigger value="school" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Schools</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStories.map((story) => (
                    <Card key={story.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                            <img
                                src={story.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop'}
                                alt={story.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                                {story.tags?.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(story.publishedAt || story.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {story.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 flex-1">
                                {story.excerpt}
                            </p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                                    {story.tags?.includes('Student') ? <User className="h-4 w-4 text-blue-500" /> :
                                        story.tags?.includes('School') ? <School className="h-4 w-4 text-green-500" /> :
                                            <Quote className="h-4 w-4 text-purple-500" />}
                                    <span>Read Story</span>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-full text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredStories.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No stories found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your filter</p>
                </div>
            )}
        </div>
    );
}

function Search(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
