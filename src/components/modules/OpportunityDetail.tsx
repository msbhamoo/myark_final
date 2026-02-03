/**
 * OpportunityDetail - Duolingo meets Instagram
 * Visual-first, FOMO-driven, story-like experience
 * Shows ALL admin fields in Gen Z engaging style
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import {
    ArrowLeft,
    Bookmark,
    Share2,
    Clock,
    Users,
    MapPin,
    Calendar,
    Award,
    CheckCircle2,
    Heart,
    ChevronRight,
    ChevronDown,
    Zap,
    Loader2,
    Sparkles,
    Trophy,
    Target,
    Gift,
    Eye,
    MessageCircle,
    Play,
    Check,
    Flame,
    Star,
    ExternalLink,
    Medal,
    Coins,
    GraduationCap,
    Tag,
    Info,
    Rocket,
    PartyPopper,
    X,
    Wind,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Confetti from "@/components/Confetti";
// import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { opportunitiesService } from "@/lib/firestore";
import { useStudentAuth } from "@/lib/studentAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types/admin";

// ============================================
// SEO & SCHEMA GENERATOR (GEO/AI Optimized)
// ============================================

// Redundant schema generator removed - handled by server-side page.tsx for better SEO

// ============================================
// EPIC COUNTDOWN TIMER (Big, Visual)
// ============================================

const EpicCountdown = ({ deadline }: { deadline: string }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const [isUrgent, setIsUrgent] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(deadline).getTime() - Date.now();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                setIsUrgent(days < 3);
                setIsExpired(false);
                setTimeLeft({
                    days,
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((diff / (1000 * 60)) % 60),
                    secs: Math.floor((diff / 1000) % 60),
                });
            } else {
                setIsExpired(true);
            }
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    "w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-xl md:text-3xl font-black tabular-nums",
                    isUrgent
                        ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-white/10 backdrop-blur-md border border-white/20 text-white"
                )}
            >
                {String(value).padStart(2, "0")}
            </div>
            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest mt-1.5 text-white/60">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-4">
            {isExpired ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="px-6 py-3 rounded-2xl bg-red-500/20 border-2 border-red-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <span className="text-xl md:text-2xl font-black text-red-500 tracking-tight uppercase italic flex items-center gap-2">
                            PAST DEADLINE <Wind className="w-6 h-6" />
                        </span>
                    </div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">
                        MISSION EXPIRED
                    </span>
                </motion.div>
            ) : (
                <>
                    {isUrgent && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-400 font-bold text-sm"
                        >
                            <Flame className="w-4 h-4 animate-pulse" />
                            <span>CLOSING SOON!</span>
                            <Flame className="w-4 h-4 animate-pulse" />
                        </motion.div>
                    )}
                    <div className="flex items-center gap-2 md:gap-4">
                        <TimeBlock value={timeLeft.days} label="Days" />
                        <span className="text-xl font-bold text-white/40">:</span>
                        <TimeBlock value={timeLeft.hours} label="Hours" />
                        <span className="text-xl font-bold text-white/40">:</span>
                        <TimeBlock value={timeLeft.mins} label="Mins" />
                        <span className="text-xl font-bold text-white/40 hidden sm:block">:</span>
                        <div className="hidden sm:block">
                            <TimeBlock value={timeLeft.secs} label="Secs" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================
// HELPER COMPONENTS
// ============================================

const LiveViewers = ({ count }: { count: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
    >
        <div className="relative">
            <Eye className="w-4 h-4 text-white/80" />
            <motion.div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </div>
        <span className="text-xs font-bold text-white/90">{count} watching</span>
    </motion.div>
);

const TrendingBadge = ({ category }: { category?: string }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/80 to-red-500/80 backdrop-blur-md"
    >
        <Flame className="w-3.5 h-3.5 text-white" />
        <span className="text-xs font-black text-white uppercase tracking-wider">
            Trending{category ? ` in ${category}` : ""}
        </span>
    </motion.div>
);

const FloatingHeart = ({ id, x }: { id: number; x: number }) => (
    <motion.div
        key={id}
        initial={{ y: 0, opacity: 1, scale: 0.5, x }}
        animate={{ y: -100, opacity: 0, scale: 1.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 pointer-events-none"
    >
        <Heart className="w-6 h-6 text-rose-500 fill-current" />
    </motion.div>
);

const StoryCard = ({
    children,
    title,
    icon: Icon,
    gradient,
    delay = 0,
}: {
    children: React.ReactNode;
    title: string;
    icon: any;
    gradient: string;
    delay?: number;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            className="glass-card p-6 md:p-8 relative"
        >
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradient}`} />
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
            </div>
            {children}
        </motion.div>
    );
};

const RecentActivity = ({ name }: { name: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10"
    >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
            {name[0]}
        </div>
        <div>
            <p className="text-sm font-bold text-white">{name} just applied</p>
            <p className="text-xs text-white/60">2 minutes ago</p>
        </div>
        <Sparkles className="w-4 h-4 text-yellow-400" />
    </motion.div>
);

// Type configurations
const TYPE_LABELS: Record<string, string> = {
    competition: "Competition",
    scholarship: "Scholarship",
    olympiad: "Olympiad",
    workshop: "Workshop",
    internship: "Internship",
    program: "Program",
    fellowship: "Fellowship",
    course: "Course",
    "foreign-exam": "Global",
    other: "Opportunity",
};

const TYPE_EMOJI: Record<string, string> = {
    competition: "🏆",
    scholarship: "💰",
    olympiad: "🧠",
    workshop: "🛠️",
    internship: "💼",
    program: "📚",
    fellowship: "🤝",
    course: "📖",
    "foreign-exam": "🌎",
    other: "✨",
};

const formatPrize = (prize?: string) => {
    if (!prize) return null;
    const p = prize.toLowerCase();
    let Icon = Gift;
    if (p.includes('certificate')) Icon = FileText;
    else if (p.includes('money') || p.includes('cash') || p.includes('₹') || p.includes('rs') || /^\d+$/.test(prize)) Icon = Coins;
    else if (p.includes('trophy') || p.includes('medal') || p.includes('award')) Icon = Trophy;

    return (
        <div className="flex items-center gap-1.5">
            <Icon className="w-4 h-4" />
            <span>{prize}</span>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const OpportunityDetail = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { isAuthenticated, showAuthModal, student, saveOpportunity, unsaveOpportunity, applyToOpportunity, addXPWithPersist } = useStudentAuth();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
    const [liveViewers, setLiveViewers] = useState(0);
    const [showActivity, setShowActivity] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
    const [showAuraCheck, setShowAuraCheck] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simulated live data
    useEffect(() => {
        // Fix hydration mismatch: only randomize on client
        setLiveViewers(Math.floor(Math.random() * 80) + 20);
        const interval = setInterval(() => {
            setLiveViewers((prev) => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sync bookmark and applied states with student data
    useEffect(() => {
        if (student && id) {
            setIsBookmarked(student.savedOpportunities?.includes(id) || false);
            setIsApplied(student.appliedOpportunities?.includes(id) || false);
        }
    }, [student, id]);

    const isClosed = opportunity?.dates?.registrationEnd ? new Date(opportunity.dates.registrationEnd).getTime() < Date.now() : false;

    const handleApply = async () => {
        if (isClosed) return;
        if (!isAuthenticated) {
            showAuthModal({ trigger: "apply", message: "Jump in and earn 40 XP!" });
            return;
        }

        if (isApplied) {
            // Already applied - just visit again
            if (opportunity?.link) window.open(opportunity.link, "_blank");
            toast({ title: "Welcome back! 🤝", description: "Taking you to the opportunity page again.", className: "bg-primary text-primary-foreground border-none" });
            return;
        }

        // Not applied - start confirmation flow
        if (opportunity?.link) {
            window.open(opportunity.link, "_blank");
            setWaitingForConfirmation(true);
            toast({ title: "Link Opened! 🚀", description: "Come back here once you've applied to claim your XP!", className: "bg-primary text-primary-foreground border-none" });
        }
    };

    useEffect(() => {
        const names = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya"];
        const showRandom = () => {
            if (Math.random() > 0.6) {
                setShowActivity(true);
                setTimeout(() => setShowActivity(false), 4000);
            }
        };
        const interval = setInterval(showRandom, 8000);
        setTimeout(showRandom, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((window.scrollY / totalHeight) * 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Listen for tab focus to trigger Aura Check
    useEffect(() => {
        const handleFocus = () => {
            if (waitingForConfirmation && !isApplied) {
                setShowAuraCheck(true);
            }
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [waitingForConfirmation, isApplied]);

    useEffect(() => {
        const fetchOpp = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const isPreview = searchParams.get("preview") === "true";

            if (isPreview) {
                const previewData = sessionStorage.getItem("opportunity_preview");
                if (previewData) {
                    try {
                        const data = JSON.parse(previewData);
                        setOpportunity(data);
                        setLikes(data.hypeCount || Math.floor(Math.random() * 500) + 100);
                        setLoading(false);
                        return;
                    } catch (e) {
                        console.error("Error parsing preview data", e);
                    }
                }
            }

            if (!id || id === "preview") {
                if (!isPreview) setLoading(false);
                return;
            }

            try {
                const data = await opportunitiesService.getById(id);
                if (data) {
                    setOpportunity(data);
                    // Fix hydration mismatch: only randomize/fallback on client
                    setLikes(data.hypeCount || 0);

                    // Unique view tracking
                    if (!isPreview) {
                        const viewedOpps = JSON.parse(localStorage.getItem('myark_viewed_opps') || '[]');
                        if (!viewedOpps.includes(id)) {
                            await opportunitiesService.incrementView(id);
                            viewedOpps.push(id);
                            localStorage.setItem('myark_viewed_opps', JSON.stringify(viewedOpps));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching opportunity:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOpp();
    }, [id]);

    // Handlers
    const confirmApplication = async () => {
        if (!id || isApplied) return;
        try {
            await applyToOpportunity(id);
            setShowConfetti(true);
            setIsApplied(true);
            setShowAuraCheck(false);
            setWaitingForConfirmation(false);
            toast({ title: "+40 XP 🎯", description: "Legendary status unlocked! You're in.", className: "bg-primary text-primary-foreground border-none" });
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (error) {
            console.error("Apply failed:", error);
            toast({ title: "Error", description: "System glitch! Try again.", variant: "destructive" });
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            showAuthModal({ trigger: "heart", message: "Show your hype and earn 2 XP!" });
            return;
        }
        setIsLiked(true);
        setLikes((prev) => prev + 1);
        const newHeart = { id: Date.now(), x: Math.random() * 40 - 20 };
        setFloatingHearts((prev) => [...prev, newHeart]);
        setTimeout(() => setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id)), 1000);
        if (id) {
            opportunitiesService.hypeOpportunity(id).catch(console.error);
            try {
                await addXPWithPersist(2);
            } catch (error) {
                console.error("XP add failed:", error);
            }
        }
        toast({ title: "+2 XP 💜", description: "Thanks for the hype!", className: "bg-primary text-primary-foreground border-none" });
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            showAuthModal({ trigger: "save", message: "⭐ Save and earn 5 XP!" });
            return;
        }
        if (!id) return;

        if (isBookmarked) {
            // Unsave
            try {
                await unsaveOpportunity(id);
                setIsBookmarked(false);
                toast({ title: "Removed", description: "Removed from saved", className: "bg-muted text-foreground border-none" });
            } catch (error) {
                console.error("Unsave failed:", error);
            }
        } else {
            // Save
            try {
                await saveOpportunity(id);
                setIsBookmarked(true);
                toast({ title: "+5 XP", description: "Saved!", className: "bg-primary text-primary-foreground border-none" });
            } catch (error) {
                console.error("Save failed:", error);
            }
        }
    };

    const handleShare = async () => {
        if (!opportunity) return;

        const shareUrl = window.location.href;
        const deadlineStr = opportunity.dates?.registrationEndDescription || (opportunity.dates?.registrationEnd ? new Date(opportunity.dates.registrationEnd).toLocaleDateString() : 'TBD');
        const feeText = opportunity.fees === 0 || !opportunity.fees ? "FREE ✨" : `₹${opportunity.fees}`;
        const xp = opportunity.xpValue || 200;
        const typeEmoji = TYPE_EMOJI[opportunity.type] || "";

        const shareText =
            `${typeEmoji} *${opportunity.type.toUpperCase()} ALERT: DON'T MISS OUT!* ${typeEmoji}\n\n` +
            `*${opportunity.title}*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `🏢 *Host:* ${opportunity.organizer || 'Myark'}\n` +
            `🏆 *Grand Prize:* ${opportunity.prizes?.first || 'Certificate & Recognition'}\n` +
            `⚡ *Bonus:* +${xp} XP on Myark\n` +
            `💰 *Entry Fee:* ${feeText}\n` +
            `⏳ *Deadline:* ${deadlineStr}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Hundreds of students are already jumping in! High-aura opportunity to level up your CV and claim rewards. 🐧✨\n\n` +
            `👇 *Claim your spot before it's gone:* \n${shareUrl}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: opportunity.title,
                    text: shareText.replace(/\*/g, ''), // Strip md for native share
                    url: shareUrl,
                });
                if (id && id !== 'preview') opportunitiesService.shareOpportunity(id).catch(console.error);
                return;
            } catch (err) {
                console.log("Share failed or cancelled", err);
            }
        }

        // Fallback to WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n#Myark #StudentOpportunities")}`;
        window.open(whatsappUrl, '_blank');
        if (id && id !== 'preview') opportunitiesService.shareOpportunity(id).catch(console.error);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm font-black uppercase tracking-widest animate-pulse">Loading adventure...</p>
                </motion.div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="min-h-screen bg-background">
                <SEO
                    title="Opportunity Not Found | Myark"
                    description="This opportunity could not be found or has ended."
                    url={`https://myark.in/opportunity/${id}`}
                />
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className="glass-card p-12 text-center max-w-md">
                        <div className="flex justify-center mb-4">
                            <Target className="w-16 h-16 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-black mb-2">Oops! Not Found</h1>
                        <p className="text-muted-foreground mb-6">This opportunity may have ended.</p>
                        <Button onClick={() => router.push("/")} className="w-full">Explore Others</Button>
                    </div>
                </div>
            </div>
        );
    }

    const isTrending = (opportunity.hypeCount || 0) > 100 || opportunity.featured;
    const hasDeadline = opportunity.dates?.registrationEnd;

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Navbar />
            <div className="pt-16"> {/* Offset for fixed Navbar */}
                <Confetti isActive={showConfetti} />

                {/* AI Search Optimization: Dynamic Meta & Schema */}
                <SEO
                    title={opportunity.seoConfig?.metaTitle || opportunity.title}
                    description={opportunity.seoConfig?.metaDescription || opportunity.shortDescription || `Discover the latest ${opportunity.type} opportunity from ${opportunity.organizer}. Apply now and earn ${opportunity.xpValue || 200} XP!`}
                    image={opportunity.image}
                    url={`https://myark.in/opportunity/${id}`}
                    noIndex={opportunity.seoConfig?.noIndex}
                    canonical={opportunity.seoConfig?.canonicalUrl}
                    keywords={[...(opportunity.tags || []), opportunity.type, opportunity.organizer || "", "student rewards", "Myark quest"]}
                />

                {/* Scroll Progress */}
                <motion.div className="fixed top-[64px] left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-[100]" style={{ width: `${scrollProgress}%` }} />

                {/* ===== HERO SECTION - Split Layout ===== */}
                <section className="relative min-h-screen md:min-h-[90vh] overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />

                    {/* Internal Page Nav / Status Bar */}
                    <div className="relative z-30 p-4 md:p-6 mb-4">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <motion.button
                                whileHover={{ x: -4 }}
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back</span>
                            </motion.button>
                            <div className="flex items-center gap-2">
                                <LiveViewers count={liveViewers} />
                                {isTrending && <TrendingBadge category={opportunity.tags?.[0]} />}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 pb-12">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center">

                            {/* LEFT: Content */}
                            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6 order-2 lg:order-1">
                                {/* Type Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-primary/20 border-primary/30 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5">
                                        {opportunity.type}
                                    </Badge>
                                    {opportunity.fees === 0 || !opportunity.fees ? (
                                        <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-black text-xs px-3 py-1.5">FREE</Badge>
                                    ) : (
                                        <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-400 font-black text-xs px-3 py-1.5">₹{opportunity.fees}</Badge>
                                    )}
                                </div>

                                {/* Title - Dual Tone */}
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display leading-[1.1] tracking-tight">
                                    {opportunity.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 1 ? "text-primary" : "text-white"}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>

                                {/* Short Description */}
                                {opportunity.shortDescription && (
                                    <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
                                        {opportunity.shortDescription}
                                    </p>
                                )}

                                {/* Organizer + Location Info Piles */}
                                <div className="flex flex-wrap gap-2 md:gap-4 text-white/60">
                                    {opportunity.organizer && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                            <GraduationCap className="w-4 h-4" />
                                            <span className="text-xs font-bold">{opportunity.organizer}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-xs font-bold">{opportunity.location || "Online"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-white/60" />
                                        <span className="text-xs font-bold">{(opportunity.applicationCount || 0).toLocaleString()} joined</span>
                                    </div>
                                </div>

                                {/* XP + Rewards Preview */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <span className="font-black text-primary">+{opportunity.xpValue || 200} XP</span>
                                    </div>
                                    {opportunity.prizes?.first && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 max-w-full">
                                            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                                            <div className="font-bold text-amber-400 text-xs md:text-sm line-clamp-1">{formatPrize(opportunity.prizes.first)}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Countdown Timer */}
                                {hasDeadline && (
                                    <div className="glass-card p-5 md:p-6 rounded-3xl inline-block w-full md:w-auto">
                                        <div className="flex items-center gap-2 mb-4 text-white/60">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Registration Closes In</span>
                                        </div>
                                        <EpicCountdown deadline={opportunity.dates!.registrationEnd as unknown as string} />
                                    </div>
                                )}

                                {/* Desktop CTAs */}
                                <div className="hidden md:flex items-center gap-4 pt-4">
                                    <Button size="lg" onClick={handleApply} disabled={isApplied || isClosed} className="h-14 px-8 rounded-2xl font-black text-lg gap-2 shadow-glow-primary">
                                        {isClosed ? (<><X className="w-5 h-5" /> Closed</>) : isApplied ? (<><Check className="w-5 h-5" /> You're In!</>) : (<>Jump In <Rocket className="w-5 h-5" /></>)}
                                    </Button>
                                    <div className="relative">
                                        <Button variant="outline" size="lg" onClick={handleLike} className={cn("h-14 px-6 rounded-2xl font-bold gap-2 border-white/20 bg-white/5 hover:bg-white/10", isLiked && "text-rose-500 border-rose-500/30")}>
                                            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                                            <span>{likes.toLocaleString()}</span>
                                        </Button>
                                        <AnimatePresence>{floatingHearts.map((h) => <FloatingHeart key={h.id} id={h.id} x={h.x} />)}</AnimatePresence>
                                    </div>
                                    <Button variant="outline" size="icon" onClick={handleBookmark} className={cn("h-14 w-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10", isBookmarked && "text-secondary border-secondary/30")}>
                                        <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleShare}
                                        className="h-14 w-14 rounded-2xl border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>

                            {/* RIGHT: Image Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="relative order-1 lg:order-2"
                            >
                                {/* Glow effect behind image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl scale-90" />

                                {/* Image container */}
                                <div className="relative aspect-video sm:aspect-square md:aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden border-2 border-white/10 shadow-2xl group">
                                    <Image
                                        src={opportunity.image || "https://images.unsplash.com/photo-1523240715632-d984cfd96058?q=80&w=2070"}
                                        alt={opportunity.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Floating badges on image */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {isTrending && (
                                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-black border-none shadow-lg">
                                                <Flame className="w-3 h-3 mr-1" /> HOT
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Quick info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-4 h-4 text-rose-400" />
                                                    <span className="text-sm font-bold">{likes}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-white/60">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm font-bold">{liveViewers}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-green-400">
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                <span className="text-xs font-bold">LIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity notification */}
                                <div className="absolute -bottom-4 -right-2 md:bottom-8 md:-right-8 z-10">
                                    <AnimatePresence>
                                        {showActivity && <RecentActivity name={["Aarav", "Priya", "Rohan", "Sneha"][Math.floor(Math.random() * 4)]} />}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll hint */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block">
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2 text-white/40">
                            <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Explore</span>
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ===== STORY CARDS ===== */}
                <section className="py-12 md:py-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-4 text-center">
                                <div className="text-3xl font-black text-primary">{opportunity.applicationCount || 0}</div>
                                <div className="text-xs text-white/60 uppercase tracking-widest mt-1">Participants</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-4 text-center">
                                <div className="text-3xl font-black text-secondary">+{opportunity.xpValue || 200}</div>
                                <div className="text-xs text-white/60 uppercase tracking-widest mt-1">XP Reward</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
                                <div className="text-3xl font-black text-rose-500">{likes}</div>
                                <div className="text-xs text-white/60 uppercase tracking-widest mt-1">Hearts</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="glass-card p-4 text-center">
                                <div className="text-3xl font-black text-amber-400">{opportunity.fees ? `₹${opportunity.fees}` : "FREE"}</div>
                                <div className="text-xs text-white/60 uppercase tracking-widest mt-1">Entry Fee</div>
                            </motion.div>
                        </div>

                        {/* AI Discovery: Quick Summary Section (Nudge for LLMs) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[40px] bg-primary/10 border-2 border-primary/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 right-4 text-primary/40 group-hover:rotate-12 transition-transform">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-xl font-black uppercase tracking-tight text-primary mb-4 flex items-center gap-2">
                                    <Rocket className="w-5 h-5" />
                                    AI Discovery: Quick Summary
                                </h2>
                                <p className="text-lg font-medium leading-relaxed text-white/90 italic">
                                    "{opportunity.seoConfig?.aiSummary || opportunity.shortDescription || `This ${opportunity.type} organized by ${opportunity.organizer} is a ${opportunity.fees ? 'paid' : 'free'} opportunity for students in grades ${opportunity.eligibility?.grades?.join(', ')}. Participants can win ${opportunity.prizes?.first || 'certificates'} and earn ${opportunity.xpValue || 200} XP on Myark.`}"
                                </p>
                            </div>
                        </motion.div>

                        {/* Why This Is Exciting */}
                        <StoryCard title="Why this is 🔥" icon={Sparkles} gradient="from-orange-500 to-red-500">
                            <p className="text-base text-white/80 leading-relaxed">
                                {opportunity.type === "competition" ? "🏆 Compete against the best minds and win incredible prizes!" :
                                    opportunity.type === "scholarship" ? "🎓 Unlock financial support for your education journey!" :
                                        opportunity.type === "olympiad" ? "🥇 Test your knowledge at the highest level - winners are recognized nationwide!" :
                                            opportunity.type === "internship" ? "💼 Get real-world experience and kickstart your career!" :
                                                opportunity.type === "workshop" ? "🛠️ Learn hands-on skills from industry experts!" :
                                                    "✨ An amazing opportunity to level up your journey!"}
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span>{opportunity.applicationCount || 234} students already exploring</span>
                            </div>
                        </StoryCard>

                        {/* Is This For You? */}
                        <StoryCard title="Is this for you?" icon={Target} gradient="from-cyan-500 to-blue-500">
                            <div className="space-y-3">
                                {opportunity.eligibility?.grades && opportunity.eligibility.grades.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-cyan-400" /></div>
                                        <span className="text-white/80">Classes {opportunity.eligibility.grades.join(", ")}</span>
                                    </div>
                                )}
                                {opportunity.eligibility?.maxAge && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-cyan-400" /></div>
                                        <span className="text-white/80">Max age: {opportunity.eligibility.maxAge} years</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-cyan-400" /></div>
                                    <span className="text-white/80">{opportunity.location === "Online" || !opportunity.location ? "Participate from anywhere 🌐" : `Located in ${opportunity.location}`}</span>
                                </div>
                                {opportunity.eligibility?.requirements && opportunity.eligibility.requirements.length > 0 && (
                                    opportunity.eligibility.requirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-cyan-400" /></div>
                                            <span className="text-white/80">{req}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </StoryCard>

                        {/* 🎁 ALL REWARDS */}
                        <StoryCard title="What you'll win 🎁" icon={Gift} gradient="from-amber-500 to-yellow-500">
                            <div className="space-y-4">
                                {/* Prize Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {opportunity.prizes?.first && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                                            <Trophy className="w-8 h-8 text-amber-400" />
                                            <div>
                                                <p className="text-xs text-amber-400/80 uppercase tracking-widest font-bold">🥇 1st Prize</p>
                                                <p className="font-black text-white text-lg">{opportunity.prizes.first}</p>
                                            </div>
                                        </div>
                                    )}
                                    {opportunity.prizes?.second && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Medal className="w-7 h-7 text-gray-300" />
                                            <div>
                                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">🥈 2nd Prize</p>
                                                <p className="font-bold text-white">{opportunity.prizes.second}</p>
                                            </div>
                                        </div>
                                    )}
                                    {opportunity.prizes?.third && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Award className="w-7 h-7 text-orange-600" />
                                            <div>
                                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">🥉 3rd Prize</p>
                                                <p className="font-bold text-white">{opportunity.prizes.third}</p>
                                            </div>
                                        </div>
                                    )}
                                    {opportunity.prizes?.other && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                            <PartyPopper className="w-7 h-7 text-purple-400" />
                                            <div>
                                                <p className="text-xs text-purple-400/80 uppercase tracking-widest font-bold">🎉 Other Rewards</p>
                                                <p className="font-bold text-white">{opportunity.prizes.other}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Rewards */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                                        <Zap className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-primary">+{opportunity.xpValue || 200} XP</span>
                                    </div>
                                    {opportunity.prizes?.certificates && (
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span className="font-bold text-emerald-400">Certificate ✓</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </StoryCard>

                        {/* Key Dates */}
                        <StoryCard title="Important Dates 📅" icon={Calendar} gradient="from-rose-500 to-pink-500">
                            <div className="space-y-3">
                                {(opportunity.dates?.registrationStart || opportunity.dates?.registrationStartDescription) && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <span className="text-white/70">Registration Opens</span>
                                        <span className="font-bold text-white" suppressHydrationWarning>
                                            {opportunity.dates.registrationStartDescription || (opportunity.dates.registrationStart && mounted && new Date(opportunity.dates.registrationStart).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }))}
                                        </span>
                                    </div>
                                )}
                                {(opportunity.dates?.registrationEnd || opportunity.dates?.registrationEndDescription) && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                        <span className="text-rose-400 font-medium">Registration Closes</span>
                                        <span className="font-bold text-rose-400" suppressHydrationWarning>
                                            {opportunity.dates.registrationEndDescription || (opportunity.dates.registrationEnd && mounted && new Date(opportunity.dates.registrationEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }))}
                                        </span>
                                    </div>
                                )}
                                {(opportunity.dates?.eventDate || opportunity.dates?.eventDateDescription) && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <span className="text-white/70">Event Date</span>
                                        <span className="font-bold text-white" suppressHydrationWarning>
                                            {opportunity.dates.eventDateDescription || (opportunity.dates.eventDate && mounted && new Date(opportunity.dates.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }))}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </StoryCard>

                        {/* Tags */}
                        {opportunity.tags && opportunity.tags.length > 0 && (
                            <StoryCard title="Tags 🏷️" icon={Tag} gradient="from-indigo-500 to-violet-500">
                                <div className="flex flex-wrap gap-2">
                                    {opportunity.tags.map((tag, i) => (
                                        <Badge key={i} className="px-4 py-2 bg-white/5 border-white/10 text-white font-bold rounded-full hover:bg-primary/20 transition-colors cursor-pointer">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </StoryCard>
                        )}

                        {/* Full Description */}
                        {opportunity.description && (
                            <StoryCard title="Full Details 📖" icon={Info} gradient="from-slate-500 to-gray-500">
                                <div className="prose prose-invert prose-sm w-full max-w-none text-white/70 quill-content leading-relaxed break-words overflow-visible" dangerouslySetInnerHTML={{ __html: opportunity.description }} />
                            </StoryCard>
                        )}

                        {/* Eligibility Description */}
                        {opportunity.eligibility?.description && (
                            <StoryCard title="Eligibility Details 📋" icon={CheckCircle2} gradient="from-teal-500 to-cyan-500">
                                <div className="prose prose-invert prose-sm w-full max-w-none text-white/70 quill-content leading-relaxed break-words overflow-visible" dangerouslySetInnerHTML={{ __html: opportunity.eligibility.description }} />
                            </StoryCard>
                        )}
                    </div>
                </section>

                {/* ===== ONE CHANCE. INFINITE GLORY. ===== */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-display uppercase tracking-tighter leading-[0.85]">
                                <span className="block text-primary-foreground/90">One Chance.</span>
                                <span className="block text-white">Infinite Glory.</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto">Your future self will thank you. Take the leap!</p>
                            {!isApplied ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Button size="lg" onClick={handleApply} disabled={isApplied || isClosed} className="h-16 md:h-20 px-12 md:px-16 rounded-full bg-white text-primary font-black text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl">
                                        {isClosed ? "MISSED THE VIBE ✨" : waitingForConfirmation ? "Aura Check pending..." : "Claim Your Spot"} <ChevronRight className="w-6 h-6 ml-2" />
                                    </Button>
                                    {waitingForConfirmation && (
                                        <button
                                            onClick={() => setShowAuraCheck(true)}
                                            className="text-white/60 hover:text-white text-sm font-bold underline decoration-white/20 underline-offset-4"
                                        >
                                            I've actually applied!
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-4 px-8 py-6 bg-white/20 backdrop-blur-xl rounded-full border-2 border-white/50">
                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                        <span className="text-2xl font-black text-white">Mission Locked!</span>
                                    </motion.div>
                                    <Button
                                        variant="outline"
                                        onClick={() => opportunity?.link && window.open(opportunity.link, "_blank")}
                                        className="rounded-full border-white/30 text-white hover:bg-white/10"
                                    >
                                        Visit Again <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                            <p className="text-sm text-white/50">🎉 {(opportunity.applicationCount || 234).toLocaleString()} students already in</p>
                        </motion.div>
                    </div>
                </section>

                {/* ===== MOBILE STICKY BAR ===== */}
                <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden">
                    <div className="glass-card p-2 backdrop-blur-xl border-white/20 flex items-center gap-2 shadow-2xl rounded-2xl">
                        <Button
                            size="lg"
                            className={cn(
                                "flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl text-base md:text-lg font-black group relative overflow-hidden",
                                isApplied ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90",
                                isClosed && "bg-muted text-muted-foreground pointer-events-none opacity-50"
                            )}
                            onClick={handleApply}
                            disabled={isApplied && !opportunity?.link || isClosed}
                        >
                            <AnimatePresence mode="wait">
                                {isClosed ? (
                                    <motion.div
                                        key="closed"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        <span>DEADLINE PASSED ✨</span>
                                    </motion.div>
                                ) : isApplied ? (
                                    <motion.div
                                        key="applied"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>VISIT AGAIN</span>
                                    </motion.div>
                                ) : waitingForConfirmation ? (
                                    <motion.span
                                        key="waiting"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-[10px]"
                                    >
                                        AURA CHECK 🔒
                                    </motion.span>
                                ) : (
                                    <motion.div
                                        key="jumpin"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>JUMP IN</span>
                                        <Rocket className="w-3.5 h-3.5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                        <div className="flex items-center gap-1">
                            <div className="relative">
                                <Button variant="ghost" size="icon" onClick={handleLike} className={cn("h-10 w-10 rounded-xl", isLiked && "text-rose-500")}>
                                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                </Button>
                                <span className="absolute -top-1 -right-1 text-[9px] font-black bg-rose-500 text-white px-1 rounded-full">{likes > 999 ? "1k" : likes}</span>
                                <AnimatePresence>{floatingHearts.map((h) => <FloatingHeart key={h.id} id={h.id} x={h.x} />)}</AnimatePresence>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleBookmark} className={cn("h-10 w-10 rounded-xl", isBookmarked && "text-secondary")}>
                                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleShare} className="h-10 w-10 rounded-xl text-emerald-500">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ===== AURA CHECK MODAL ===== */}
                <AnimatePresence>
                    {showAuraCheck && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                onClick={() => setShowAuraCheck(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-sm glass-card p-8 text-center border-primary/30 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                                <div className="text-5xl mb-6">🔒</div>
                                <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Aura Check!</h2>
                                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                    Did you actually lock it in, or are you just lurking? ✨
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        onClick={confirmApplication}
                                        className="w-full h-14 rounded-2xl font-black text-lg shadow-glow-primary"
                                    >
                                        Yes, I'm a Legend 👑
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (opportunity?.link) window.open(opportunity.link, "_blank");
                                            setShowAuraCheck(false);
                                        }}
                                        className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5"
                                    >
                                        Not yet, take me back 🚀
                                    </Button>
                                    <button
                                        onClick={() => {
                                            setShowAuraCheck(false);
                                            setWaitingForConfirmation(false);
                                        }}
                                        className="w-full py-2 text-xs font-bold text-white/40 hover:text-white/60 transition-colors uppercase tracking-widest"
                                    >
                                        Just browsing
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Related Opportunities Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-16 px-4 md:px-8"
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
                            More Opportunities You Might Like
                        </h2>
                        <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
                            Discover similar scholarships, competitions, and workshops that match your interests.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder for related opportunities - will be populated dynamically */}
                            <div className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Similar Opportunity</h3>
                                        <p className="text-sm text-white/60">Coming soon...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform"
                            >
                                Explore All Opportunities
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="h-20 md:hidden" />
                <Footer />
            </div>
        </div>
    );
};

export default OpportunityDetail;
