"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, WifiOff, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { opportunitiesService } from "@/lib/firestore";
import { useStudentAuth } from "@/lib/studentAuth";
import type { Opportunity } from "@/types/admin";
import InshortsCard from "./InshortsCard";
import InshortsCategoryNav from "./InshortsCategoryNav";
import InshortsBottomNav from "./InshortsBottomNav";

// Swipe threshold for triggering navigation
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 300;

// Gen Z loading messages
const loadingMessages = [
    "Loading the vibes...",
    "Fetching the W's...",
    "Getting you that fire content...",
    "No cap, almost there...",
    "Cooking up something good...",
];

// Empty state messages
const emptyMessages = {
    all: "Nothing here yet fam 😢 Check back later!",
    scholarship: "No scholarship bags rn... More dropping soon! 💰",
    competition: "No competitions atm... Stay tuned for the next W! 🏆",
    olympiad: "Olympiad szn coming soon... Big brain time! 🧠",
    workshop: "No workshops live rn... Skill up loading... 🛠️",
};

interface GroupedOpportunities {
    [category: string]: Opportunity[];
}

const InshortsFeed = () => {
    const router = useRouter();
    const { student, showAuthModal } = useStudentAuth();

    // State
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [groupedOpps, setGroupedOpps] = useState<GroupedOpportunities>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<"up" | "down" | null>(null);

    // Categories for horizontal swipe
    const categoryOrder = ["all", "scholarship", "competition", "olympiad", "workshop"];

    // Get current opportunities based on category
    const currentOpportunities = activeCategory === "all"
        ? opportunities
        : (groupedOpps[activeCategory] || []);

    const currentOpportunity = currentOpportunities[currentIndex];

    // Fetch opportunities
    const fetchOpportunities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await opportunitiesService.getAll({ status: "published" });

            // Sort by featured first, then by date
            const sorted = data.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setOpportunities(sorted);

            // Group by type
            const grouped: GroupedOpportunities = {};
            sorted.forEach(opp => {
                const type = opp.type || "other";
                if (!grouped[type]) grouped[type] = [];
                grouped[type].push(opp);
            });
            setGroupedOpps(grouped);

        } catch (err) {
            console.error("Error fetching opportunities:", err);
            setError("Oof, couldn't load the content. Try again? 😅");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    // Reset index when category changes
    useEffect(() => {
        setCurrentIndex(0);
        setDirection(null);
    }, [activeCategory]);

    // Handle card tap
    const handleCardTap = useCallback(() => {
        if (!currentOpportunity) return;

        if (!student) {
            showAuthModal({
                mode: 'login',
                trigger: 'apply',
                message: 'Sign in to peep the full deets! 👀',
                onSuccess: () => router.push(`/opportunity/${currentOpportunity.id}`),
            });
            return;
        }

        router.push(`/opportunity/${currentOpportunity.id}`);
    }, [currentOpportunity, student, showAuthModal, router]);

    // Handle vertical swipe (next/prev opportunity)
    const handleVerticalSwipe = useCallback((dir: "up" | "down") => {
        if (dir === "up" && currentIndex < currentOpportunities.length - 1) {
            setDirection("up");
            setCurrentIndex(prev => prev + 1);
        } else if (dir === "down" && currentIndex > 0) {
            setDirection("down");
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex, currentOpportunities.length]);

    // Handle horizontal swipe (category switch)
    const handleHorizontalSwipe = useCallback((dir: "left" | "right") => {
        const currentCategoryIndex = categoryOrder.indexOf(activeCategory);

        if (dir === "left" && currentCategoryIndex < categoryOrder.length - 1) {
            setActiveCategory(categoryOrder[currentCategoryIndex + 1]);
        } else if (dir === "right" && currentCategoryIndex > 0) {
            setActiveCategory(categoryOrder[currentCategoryIndex - 1]);
        }
    }, [activeCategory]);

    // Pan gesture handler
    const handleDragEnd = useCallback((
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const { offset, velocity } = info;

        // Determine if swipe was primarily horizontal or vertical
        const isHorizontal = Math.abs(offset.x) > Math.abs(offset.y);

        if (isHorizontal) {
            // Horizontal swipe - category switch
            if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > SWIPE_VELOCITY) {
                handleHorizontalSwipe(offset.x < 0 ? "left" : "right");
            }
        } else {
            // Vertical swipe - opportunity navigation
            if (Math.abs(offset.y) > SWIPE_THRESHOLD || Math.abs(velocity.y) > SWIPE_VELOCITY) {
                handleVerticalSwipe(offset.y < 0 ? "up" : "down");
            }
        }
    }, [handleHorizontalSwipe, handleVerticalSwipe]);

    // Loading state
    if (loading) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-primary" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-muted-foreground font-medium"
                >
                    Loading the vibes...
                </motion.p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
                <WifiOff className="w-16 h-16 text-muted-foreground" />
                <p className="text-lg font-medium">{error}</p>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchOpportunities}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </motion.button>
            </div>
        );
    }

    // Empty state
    if (currentOpportunities.length === 0) {
        return (
            <div className="fixed inset-0 bg-background">
                <InshortsCategoryNav
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10 }}
                    >
                        <Sparkles className="w-20 h-20 text-muted-foreground" />
                    </motion.div>
                    <p className="text-xl font-bold">
                        {emptyMessages[activeCategory as keyof typeof emptyMessages] || emptyMessages.all}
                    </p>
                    <p className="text-muted-foreground">
                        Swipe left/right to check other categories ✨
                    </p>
                </div>

                <InshortsBottomNav activeTab="discover" />
            </div>
        );
    }

    // Slide animation variants
    const slideVariants = {
        enter: (dir: "up" | "down" | null) => ({
            y: dir === "up" ? "100%" : dir === "down" ? "-100%" : 0,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (dir: "up" | "down" | null) => ({
            y: dir === "up" ? "-100%" : dir === "down" ? "100%" : 0,
            opacity: 0,
        }),
    };

    return (
        <div className="fixed inset-0 bg-background overflow-hidden">
            {/* Category Navigation */}
            <InshortsCategoryNav
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Main Feed Area with Gesture Handling */}
            <motion.div
                className="absolute inset-0 pt-24 pb-20"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
            >
                <AnimatePresence mode="wait" custom={direction}>
                    {currentOpportunity && (
                        <motion.div
                            key={`${activeCategory}-${currentOpportunity.id}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                y: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="absolute inset-0"
                        >
                            <InshortsCard
                                opportunity={currentOpportunity}
                                onTap={handleCardTap}
                                isActive={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {currentOpportunities.slice(0, Math.min(5, currentOpportunities.length)).map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                idx === currentIndex % 5
                                    ? "w-6 bg-primary"
                                    : "w-1.5 bg-muted-foreground/30"
                            )}
                        />
                    ))}
                    {currentOpportunities.length > 5 && (
                        <span className="text-[10px] text-muted-foreground ml-1">
                            +{currentOpportunities.length - 5}
                        </span>
                    )}
                </div>

                {/* Swipe hint (shown briefly) */}
                {currentIndex === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </motion.div>
                            <span className="text-xs">Swipe up for more</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Counter badge */}
            <div className="absolute top-24 right-4 z-10">
                <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold">
                    {currentIndex + 1} / {currentOpportunities.length}
                </div>
            </div>

            {/* Bottom Navigation */}
            <InshortsBottomNav activeTab="discover" />
        </div>
    );
};

export default InshortsFeed;
