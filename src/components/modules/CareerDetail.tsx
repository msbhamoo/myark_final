"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    IndianRupee,
    MapPin,
    GraduationCap,
    ListChecks,
    Lightbulb,
    AlertCircle,
    Milestone,
    ChevronRight,
    TrendingUp,
    Loader2,
    Building2,
    Trophy,
    Rocket,
    Briefcase,
    Sparkles,
    Share2,
    Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { careersService } from "@/lib/firestore";
import type { Career } from "@/types/admin";

const CareerDetail = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [career, setCareer] = useState<Career | null>(null);

    useEffect(() => {
        const fetchCareer = async () => {
            if (!id) return; // Ensure id is available before fetching
            try {
                setLoading(true);
                const data = await careersService.getBySlug(id);
                if (data) {
                    setCareer(data);
                } else {
                    router.push("/careers");
                }
            } catch (error) {
                console.error("Error fetching career:", error);
                router.push("/careers");
            } finally {
                setLoading(false);
            }
        };
        fetchCareer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary glow-primary rounded-full p-2" />
                    <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-xs">Loading Matrix...</p>
                </div>
            </div>
        );
    }

    if (!career) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="glass-card p-12 text-center max-w-md border-primary/20">
                        <AlertCircle className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
                        <h1 className="text-3xl font-bold font-display mb-4">404: Path Not Found</h1>
                        <p className="text-muted-foreground mb-8 text-lg">This career path hasn't been unlocked yet. Try exploring another dimension.</p>
                        <Button onClick={() => router.push("/careers")} variant="hero" className="w-full">
                            Return to Hub
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
            <Navbar />

            {/* Immersive Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <main className="relative z-10">
                {/* Futuristic Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden px-4">
                    <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-6 py-2 rounded-full border border-white/10 glass-card bg-white/5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2`}
                                >
                                    <Sparkles className="w-4 h-4 text-primary glow-primary" />
                                    <span className="gradient-text-primary">{career.category}</span>
                                </motion.div>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black font-display leading-[0.9] tracking-tighter">
                                {career.title.split(' ').map((word, i) => (
                                    <span key={i} className={i % 2 === 1 ? "gradient-text-secondary italic block" : "block"}>
                                        {word}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                                {career.shortDescription}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button size="xl" variant="hero" className="group h-16 px-8 rounded-2xl text-lg font-black uppercase tracking-wider">
                                    Start The Quest
                                    <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="xl" variant="ghost" className="h-16 px-8 rounded-2xl border border-white/10 glass-card hover:bg-white/10 font-bold">
                                    <Share2 className="mr-2 w-5 h-5" />
                                    Save Path
                                </Button>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, ease: "backOut" }}
                                className="relative z-10"
                            >
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                                <div className="relative aspect-square md:aspect-[4/3] rounded-[60px] overflow-hidden border-2 border-white/20 shadow-2xl group cursor-none">
                                    <img
                                        src={career.images?.[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"}
                                        alt={career.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                                    {/* Floating stats on image */}
                                    <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                                        <div className="glass-card p-4 backdrop-blur-2xl border-white/10 animate-float">
                                            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1 text-white">Entry Power</p>
                                            <p className="text-2xl font-black text-white">{career.salary?.min}L - {career.salary?.max}L</p>
                                        </div>
                                        <div className="glass-card p-4 backdrop-blur-2xl border-white/10 animate-float-delayed">
                                            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1 text-white">Demand level</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-2 w-full rounded-full ${i <= 4 ? "bg-primary glow-primary" : "bg-white/20"}`} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Floating Icons */}
                            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-10 -right-10 glass-card p-4 text-primary glow-primary rotate-12 z-20">
                                <Briefcase className="w-8 h-8" />
                            </motion.div>
                            <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute -bottom-10 -left-10 glass-card p-4 text-secondary rotate-[-12deg] z-20">
                                <Zap className="w-8 h-8" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Cyber Stats Bar */}
                <div className="max-w-7xl mx-auto px-4 -mt-20 mb-32 relative z-30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 glass-card border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {[
                            { label: "Stability", val: "Critical", icon: Milestone, color: "text-blue-400" },
                            { label: "Creativity", val: "Insane", icon: Lightbulb, color: "text-amber-400" },
                            { label: "Remote", val: "Active", icon: MapPin, color: "text-emerald-400" },
                            { label: "Future", val: "Trending", icon: TrendingUp, color: "text-primary" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                                <stat.icon className={`w-5 h-5 mb-3 ${stat.color} opacity-70 group-hover:scale-110 transition-transform`} />
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">{stat.label}</p>
                                <p className="text-xl font-black">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-32">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Main Mission Log - Left 8 Units */}
                        <div className="lg:col-span-8 space-y-24">
                            {/* Detailed Lore */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[2px] w-12 bg-primary" />
                                    <h2 className="text-4xl font-black font-display uppercase italic tracking-tighter">Mission <span className="text-primary italic">Overview</span></h2>
                                </div>
                                <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-colors" />
                                    <article className="prose prose-invert prose-lg max-w-none text-muted-foreground/90 leading-[1.8] quill-content">
                                        <div dangerouslySetInnerHTML={{ __html: career.fullDescription }} />
                                    </article>
                                </div>
                            </section>

                            {/* The Quest Roadmap */}
                            <section className="relative">
                                <div className="flex items-center gap-4 mb-16">
                                    <h2 className="text-4xl font-black font-display uppercase italic tracking-tighter text-right flex-1">The Path to <span className="text-secondary italic">Mastery</span></h2>
                                    <div className="h-[2px] w-12 bg-secondary" />
                                </div>

                                <div className="space-y-4 relative">
                                    {/* Vertical Quest Line */}
                                    <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent hidden md:block" />

                                    {career.roadmap?.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative flex gap-8 items-start group"
                                        >
                                            <div className="relative z-10 hidden md:block shrink-0 mt-4">
                                                <div className="w-16 h-16 rounded-full glass-card border-white/20 flex items-center justify-center font-black text-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl">
                                                    {i + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 glass-card p-8 md:p-10 border-white/5 group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                                    <Milestone className="w-24 h-24" />
                                                </div>
                                                <Badge className="mb-4 bg-primary/10 text-primary border-none font-black uppercase text-[10px] tracking-widest">Stage {i + 1}</Badge>
                                                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                                                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Skills & Perks Grid */}
                            <section className="grid md:grid-cols-2 gap-8">
                                <div className="glass-card p-8 overflow-hidden relative">
                                    <div className="flex items-center gap-2 mb-8">
                                        <Trophy className="w-6 h-6 text-yellow-400 glow-primary" />
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Unlockable Perks</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {career.goodStuff?.map((item, i) => (
                                            <motion.li key={i} whileHover={{ x: 10 }} className="flex items-center gap-4 text-muted-foreground font-medium">
                                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="glass-card p-8 overflow-hidden relative border-secondary/20">
                                    <div className="flex items-center gap-2 mb-8">
                                        <AlertCircle className="w-6 h-6 text-secondary" />
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Level Challenges</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {career.challenges?.map((item, i) => (
                                            <motion.li key={i} whileHover={{ x: 10 }} className="flex items-center gap-4 text-muted-foreground font-medium">
                                                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_hsl(var(--secondary))]" />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Inventory & Metadata - Right 4 Units */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Quest Inventory */}
                            <Card className="rounded-[40px] glass-card border-primary/20 p-8 sticky top-24 overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px]" />
                                <h3 className="text-2xl font-black font-display mb-8 uppercase italic tracking-tighter">Path <span className="text-primary italic">Requirements</span></h3>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-primary" /> Required Gear
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {career.degrees?.map(deg => (
                                                <Badge key={deg} className="px-4 py-2 bg-white/5 border-white/10 text-white rounded-xl hover:bg-primary transition-colors cursor-default">
                                                    {deg}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                                            <Rocket className="w-4 h-4 text-secondary" /> Key Bosses (Exams)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {career.exams?.map(exam => (
                                                <Badge key={exam} className="px-4 py-2 bg-white/5 border-white/10 text-white rounded-xl hover:bg-secondary transition-colors cursor-default">
                                                    {exam}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Local Training Pods</p>
                                        <div className="space-y-3">
                                            {career.collegesIndia?.slice(0, 3).map(clg => (
                                                <div key={clg} className="flex items-center gap-3 group cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">IN</div>
                                                    <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">{clg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Global Expansion</p>
                                        <div className="space-y-3">
                                            {career.collegesGlobal?.slice(0, 3).map(clg => (
                                                <div key={clg} className="flex items-center gap-3 group cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-secondary group-hover:text-white transition-all">GL</div>
                                                    <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">{clg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button size="xl" variant="hero" className="w-full mt-12 rounded-2xl h-16 font-black uppercase tracking-widest shadow-glow-primary">
                                    Join The Path
                                </Button>
                            </Card>

                            {/* Random Fact Card */}
                            {career.didYouKnow && (
                                <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-3xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                        <Sparkles className="w-48 h-48" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Easter Egg</p>
                                    <p className="text-lg font-bold text-white italic leading-relaxed">
                                        "{career.didYouKnow[0]}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cyber Footer CTA */}
                <section className="bg-primary pt-32 pb-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <h2 className="text-5xl md:text-7xl font-black font-display text-primary-foreground italic tracking-tighter uppercase">Ready to <span className="block text-white">Transcend?</span></h2>
                            <p className="text-2xl text-primary-foreground/80 font-medium">Join 5,000+ students already mapping their future.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <Button size="xl" className="h-20 px-12 rounded-3xl bg-white text-primary font-black uppercase text-xl hover:scale-105 transition-transform shadow-2xl">
                                    Unlock Access
                                </Button>
                                <Button size="xl" className="h-20 px-12 rounded-3xl bg-transparent border-2 border-white/30 text-white font-black uppercase text-xl hover:bg-white/10 transition-colors">
                                    Contact Mentor
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Perspective lines */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CareerDetail;
