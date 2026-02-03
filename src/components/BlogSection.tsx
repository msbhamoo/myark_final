"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Clock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogsService } from "@/lib/firestore";
import type { BlogPost } from "@/types/admin";

const BlogSection = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogsService.getAll({ status: "published", limit: 3 });
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs for home:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (!loading && blogs.length === 0) return null;

    return (
        <section className="py-12 md:py-24 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4"
                        >
                            <Sparkles className="w-3 h-3" />
                            Resources
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                            Latest from our <span className="text-primary italic">Blog</span>
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/blog")}
                        className="group gap-2 hover:bg-white/50"
                    >
                        View all stories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-[16/10] bg-muted rounded-[30px]" />
                                <div className="h-4 bg-muted rounded w-1/2" />
                                <div className="h-6 bg-muted rounded w-full" />
                                <div className="h-4 bg-muted rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => router.push(`/blog/${blog.slug}`)}
                            >
                                <div className="relative aspect-[16/10] rounded-[24px] md:rounded-[30px] overflow-hidden mb-4 md:mb-6 shadow-lg">
                                    <Image
                                        src={blog.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/20 backdrop-blur-md text-white border-white/50 hover:bg-white/30">
                                            {blog.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span suppressHydrationWarning>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            5 Min Read
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 hidden md:block">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all pt-2">
                                        Read Story
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogSection;
