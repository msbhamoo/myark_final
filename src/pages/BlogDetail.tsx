import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Share2,
    Bookmark,
    ChevronRight,
    Loader2,
    BookOpen,
    Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogsService } from "@/lib/firestore";
import type { BlogPost } from "@/types/admin";

// ============================================
// BLOG SCHEMA GENERATOR (GEO/AI Optimized)
// ============================================

const generateBlogSchema = (blog: BlogPost) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.coverImage || "https://myark.in/og-image.png",
    "author": {
        "@type": "Person",
        "name": blog.author || "Myark Insider"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Myark",
        "logo": {
            "@type": "ImageObject",
            "url": "https://myark.in/logo.png"
        }
    },
    "datePublished": blog.publishedAt,
    "description": blog.title // Blog post type doesn't have a dedicated short description in many cases, using title
});

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<BlogPost | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;
            try {
                const data = await blogsService.getBySlug(slug);
                setBlog(data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary glow-primary rounded-full p-2" />
                    <p className="text-sm font-black uppercase tracking-widest animate-pulse">Fetching Intel...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <div className="glass-card p-12 inline-block">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
                        <p className="text-muted-foreground mb-8">This story has entered another dimension.</p>
                        <Button onClick={() => navigate("/blog")} variant="hero">
                            Back to Feed
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-secondary selection:text-white antialiased">
            <SEO
                title={blog.title}
                description={`Read ${blog.title} on Myark. Stay ahead with the latest student insights.`}
                image={blog.coverImage}
                url={`https://myark.in/blog/${slug}`}
                schema={generateBlogSchema(blog)}
            />
            <Navbar />

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10">
                {/* Immersive Header */}
                <header className="relative pt-32 pb-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate("/blog")}
                            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to stories
                        </motion.button>

                        <div className="space-y-8 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Badge className="bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full mb-6">
                                    {blog.category}
                                </Badge>
                                <h1 className="text-5xl md:text-7xl font-black font-display leading-[0.9] tracking-tighter mb-8 max-w-4xl">
                                    {blog.title}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center justify-center md:justify-start gap-8 p-6 glass-card border-white/5 bg-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-0.5">
                                        <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center font-black">
                                            {blog.author?.[0] || <User className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase tracking-widest">{blog.author || "Insider"}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Storyteller</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                                    <Calendar className="w-4 h-4" />
                                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'DRAFT'}
                                </div>

                                <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                                    <Clock className="w-4 h-4" />
                                    5 MIN READ
                                </div>

                                <div className="hidden md:block flex-1" />

                                <div className="flex items-center gap-2">
                                    <Button variant="glass" size="icon" className="rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="glass" size="icon" className="rounded-2xl hover:bg-secondary hover:text-white transition-all">
                                        <Bookmark className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Wide Hero Image */}
                <section className="max-w-7xl mx-auto px-4 mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] md:h-[600px] rounded-[60px] overflow-hidden shadow-2xl group"
                    >
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity z-10" />
                        <img
                            src={blog.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
                    </motion.div>
                </section>

                {/* Content Area */}
                <section className="max-w-4xl mx-auto px-4 pb-32">
                    <div className="glass-card p-8 md:p-16 border-white/5 relative overflow-hidden">
                        {/* Elegant accent line */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-secondary to-transparent opacity-30" />

                        <article className="prose prose-invert prose-2xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:font-display prose-p:text-muted-foreground/90 prose-p:leading-[1.8] quill-content">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </article>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-16 mt-16 border-t border-white/10">
                                {blog.tags.map(tag => (
                                    <Badge key={tag} className="bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary border-white/10 px-4 py-2 rounded-full cursor-pointer transition-all">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Gen Z Newsletter CTA */}
                    <div className="mt-24 p-12 md:p-20 rounded-[60px] bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10 text-center md:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                Exclusive Intel
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black font-display tracking-tighter italic leading-tight max-w-2xl">
                                Stay ahead of the <span className="text-primary glow-primary">curve.</span>
                            </h3>
                            <p className="text-xl text-white/70 max-w-xl font-medium">
                                Join 10k+ pathfinders receiving weekly deep-dives into the future of work and education.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button variant="hero" size="xl" className="h-20 px-12 rounded-3xl text-xl font-black uppercase tracking-widest">
                                    Join the Inner Circle
                                </Button>
                                <Button variant="glass" size="xl" className="h-20 px-12 rounded-3xl font-black uppercase tracking-widest border-2 border-white/10">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
