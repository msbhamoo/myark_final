"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Eye, Bookmark, Share2, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types/admin";
import { useState } from "react";
import { useStudentAuth } from "@/lib/studentAuth";
import { useToast } from "@/hooks/use-toast";

interface InshortsCardProps {
    opportunity: Opportunity;
    onTap: () => void;
    isActive: boolean;
}

// Gen Z energy type configurations 🔥
const typeVibes = {
    competition: {
        label: "Competition 🏆",
        vibe: "Win big or go home",
        gradient: "from-purple-500/80 via-pink-500/70 to-transparent",
        badge: "bg-purple-500/90 text-white",
        icon: Trophy,
    },
    scholarship: {
        label: "Scholarship 💰",
        vibe: "Free money alert",
        gradient: "from-emerald-500/80 via-teal-500/70 to-transparent",
        badge: "bg-emerald-500/90 text-white",
        icon: Sparkles,
    },
    olympiad: {
        label: "Olympiad 🧠",
        vibe: "Big brain energy",
        gradient: "from-blue-500/80 via-cyan-500/70 to-transparent",
        badge: "bg-blue-500/90 text-white",
        icon: Zap,
    },
    workshop: {
        label: "Workshop 🛠️",
        vibe: "Level up your skills",
        gradient: "from-orange-500/80 via-amber-500/70 to-transparent",
        badge: "bg-orange-500/90 text-white",
        icon: Flame,
    },
};

// Strip HTML and truncate description for clean display
const truncateDescription = (text: string, wordLimit: number = 80): string => {
    if (!text) return "No cap, this one's fire. Tap to peep the deets! 👀";

    // Strip HTML tags
    let cleanText = text.replace(/<[^>]*>/g, '');

    // Decode common HTML entities
    cleanText = cleanText
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '...');

    // Normalize whitespace
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    const words = cleanText.split(/\s+/);
    if (words.length <= wordLimit) return cleanText;
    return words.slice(0, wordLimit).join(' ') + '...';
};

// Format deadline with Gen Z urgency
const formatDeadline = (opportunity: Opportunity): string => {
    if (opportunity.dates?.registrationEndDescription) {
        return opportunity.dates.registrationEndDescription;
    }
    if (!opportunity.dates?.registrationEnd) return "No deadline vibes";

    const end = new Date(opportunity.dates.registrationEnd).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return "⚠️ Already closed";
    if (diff === 1) return "🔥 Last day! GO GO GO!";
    if (diff <= 3) return `⚡ ${diff} days - Act fast!`;
    if (diff <= 7) return `🚨 ${diff} days left`;
    if (diff <= 14) return `📅 ${diff} days - Still time`;
    return `${diff} days to apply`;
};

const InshortsCard = ({ opportunity, onTap, isActive }: InshortsCardProps) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { student, showAuthModal, saveOpportunity, unsaveOpportunity } = useStudentAuth();
    const { toast } = useToast();

    const config = typeVibes[opportunity.type as keyof typeof typeVibes] || typeVibes.competition;
    const IconComponent = config.icon;

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!student) {
            showAuthModal({
                mode: 'login',
                trigger: 'save',
                message: 'Sign in to save this W for later! 🔖',
            });
            return;
        }

        try {
            if (isBookmarked) {
                await unsaveOpportunity(opportunity.id);
                setIsBookmarked(false);
                toast({ title: "Removed from saves 😢" });
            } else {
                await saveOpportunity(opportunity.id);
                setIsBookmarked(true);
                toast({ title: "Saved! No cap, smart move 💯" });
            }
        } catch {
            toast({ title: "Bruh, something went wrong 😅", variant: "destructive" });
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const shareData = {
            title: opportunity.title,
            text: `Yo check this out! ${opportunity.title} on MyArk 🔥`,
            url: `https://myark.in/opportunity/${opportunity.id}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                toast({ title: "Link copied! Share the W 🔗" });
            }
        } catch {
            // User cancelled share
        }
    };

    return (
        <motion.div
            className={cn(
                "absolute inset-0 w-full h-full bg-background overflow-hidden",
                "cursor-pointer select-none touch-pan-y"
            )}
            onClick={onTap}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Image Cover - Takes up 40% of screen */}
            <div className="relative h-[30vh] w-full overflow-hidden">
                {/* Background Image */}
                {opportunity.image ? (
                    <Image
                        src={opportunity.image}
                        alt={opportunity.title}
                        fill
                        priority={isActive}
                        className="object-cover"
                        sizes="100vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-50" />
                )}

                {/* Gradient Overlay for readability */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t",
                    config.gradient
                )} />

                {/* Bottom gradient for text */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
                        "backdrop-blur-md shadow-lg",
                        config.badge
                    )}>
                        <IconComponent className="w-4 h-4" />
                        {config.label}
                    </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        {opportunity.viewCount || 0}
                    </div>
                    {(opportunity.hypeCount || 0) > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/80 backdrop-blur-md text-white text-xs font-medium">
                            <Flame className="w-3.5 h-3.5" />
                            {opportunity.hypeCount}
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-16 right-4 flex flex-col gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBookmark}
                        className={cn(
                            "p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all",
                            isBookmarked
                                ? "bg-primary text-primary-foreground"
                                : "bg-black/40 text-white hover:bg-black/60"
                        )}
                    >
                        <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white shadow-lg hover:bg-black/60 transition-all"
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Content Area - 70% of screen */}
            <div className="absolute bottom-0 inset-x-0 h-[70vh] bg-background px-5 py-4 overflow-y-auto no-scrollbar">
                {/* Title */}
                <h2 className="font-display text-xl md:text-2xl font-bold leading-tight mb-1 line-clamp-2">
                    {opportunity.title}
                </h2>

                {/* Organizer */}
                <p className="text-muted-foreground text-sm font-medium mb-2">
                    by {opportunity.organizer || "MyArk Verified"} ✓
                </p>

                {/* Compact Info Bar - Single scrollable line */}
                <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
                    {/* Deadline Pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-xs">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="font-semibold text-primary">
                            {formatDeadline(opportunity)}
                        </span>
                    </div>

                    {/* Fee Pill */}
                    <div className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                        opportunity.fees && opportunity.fees > 0
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-emerald-500/10 text-emerald-400"
                    )}>
                        {opportunity.fees && opportunity.fees > 0 ? (
                            <>💳 ₹{opportunity.fees}</>
                        ) : (
                            <>🆓 Free</>
                        )}
                    </div>

                    {/* Prize Pill - Only show if exists */}
                    {opportunity.prizes?.first && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-xs font-semibold text-amber-400">
                            🏆 {opportunity.prizes.first}
                        </div>
                    )}

                    {/* Grade Pill */}
                    {opportunity.eligibility?.grades && opportunity.eligibility.grades.length > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                            📚 Class {opportunity.eligibility.grades.length === 1
                                ? opportunity.eligibility.grades[0]
                                : `${Math.min(...opportunity.eligibility.grades)}-${Math.max(...opportunity.eligibility.grades)}`
                            }
                        </div>
                    )}
                </div>

                {/* Description - Full description */}
                <p className="text-foreground/80 text-sm leading-relaxed mb-4 text-justify">
                    {truncateDescription(opportunity.description || opportunity.shortDescription)}
                </p>

                {/* Additional prizes if available */}
                {(opportunity.prizes?.second || opportunity.prizes?.third) && (
                    <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                        <span className="font-medium">More prizes:</span>
                        {opportunity.prizes?.second && <span>🥈 {opportunity.prizes.second}</span>}
                        {opportunity.prizes?.third && <span>🥉 {opportunity.prizes.third}</span>}
                    </div>
                )}

                {/* Location if available */}
                {opportunity.location && (
                    <div className="flex items-center gap-1.5 mb-4 text-xs text-muted-foreground">
                        <span>📍</span>
                        <span>{opportunity.location}</span>
                    </div>
                )}

                {/* Tap hint */}
                <div className="flex justify-center pb-2">
                    <p className="text-xs text-muted-foreground animate-pulse">
                        Tap to peep full deets 👆
                    </p>
                </div>
            </div>

            {/* Swipe indicators */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30">
                <div className="w-1 h-16 bg-white/30 rounded-full" />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30">
                <div className="w-1 h-16 bg-white/30 rounded-full" />
            </div>
        </motion.div>
    );
};

export default InshortsCard;
