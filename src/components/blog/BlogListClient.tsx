'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Tag, X } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { calculateReadingTime, formatReadingTime } from '@/lib/blogUtils';

interface BlogListClientProps {
    posts: BlogPost[];
    allTags: string[];
}

export function BlogListClient({ posts, allTags }: BlogListClientProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const filteredPosts = useMemo(() => {
        if (!selectedTag) return posts;
        return posts.filter(p => p.tags?.includes(selectedTag));
    }, [posts, selectedTag]);

    const featuredPost = filteredPosts[0];
    const otherPosts = filteredPosts.slice(1);

    return (
        <>
            {/* Tag Filter */}
            {allTags.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by topic:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition"
                            >
                                <X className="h-3 w-3" />
                                Clear
                            </button>
                        )}
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${selectedTag === tag
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-orange-500/20 dark:hover:text-orange-400'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {filteredPosts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-900/50 py-16 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No blog posts yet. Check back soon!'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 md:gap-10">
                    {/* Featured Post */}
                    {featuredPost && (
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg transition hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/80">
                                {/* Image */}
                                {featuredPost.coverImage && (
                                    <div className="relative md:col-span-3 h-64 md:h-80 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <img
                                            src={featuredPost.coverImage}
                                            alt={featuredPost.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                                                Featured
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                {formatReadingTime(calculateReadingTime(featuredPost.content))}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                                            </span>
                                            {featuredPost.author && (
                                                <>
                                                    <span className="text-slate-400">•</span>
                                                    <span className="text-slate-900 dark:text-slate-200 font-medium">{featuredPost.author}</span>
                                                </>
                                            )}
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/80 h-full">
                                {/* Image */}
                                {post.coverImage && (
                                    <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            {post.tags && post.tags[0] && (
                                                <span className="inline-flex items-center rounded-full bg-orange-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
                                                <Clock className="h-3 w-3" />
                                                {formatReadingTime(calculateReadingTime(post.content))}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-5">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                                        </div>
                                        {post.author && (
                                            <span className="text-xs font-medium text-slate-900 dark:text-slate-300">
                                                {post.author.split(' ')[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
