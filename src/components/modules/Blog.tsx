"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search,
    Clock,
    ArrowRight,
    Calendar,
    User,
    Loader2,
    BookOpen,
    Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { blogsService } from "@/lib/firestore";
import type { BlogPost } from "@/types/admin";

const Blog = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogsService.getAll({ status: "published" });
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 antialiased">
            <SEO
                title="Resources & Success Stories | Myark Blog"
                description="Explore student guides, competition tips, and success stories to level up your academic and professional journey."
                url="https://myark.in/blog"
            />
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Resources & Stories</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold font-display mb-6"
                        >
                            The MyArk <span className="text-primary italic">Blog</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-muted-foreground"
                        >
                            Explore tips, guides, and success stories to help you navigate your academic journey.
                        </motion.p>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search articles, tips, stories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-muted/50 border-none text-lg"
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Fetching latest stories...</p>
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group cursor-pointer hover:y-[-4px] transition-all duration-300"
                                    onClick={() => router.push(`/blog/${blog.slug}`)}
                                >
                                    <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-xl">
                                        <img
                                            src={blog.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/50 px-3 py-1">
                                                {blog.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                5 min read
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-bold font-display group-hover:text-primary transition-colors">
                                            {blog.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                            Read More
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted/50">
                            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">No stories found</h3>
                            <p className="text-muted-foreground">Try searching for something else or check back later.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
