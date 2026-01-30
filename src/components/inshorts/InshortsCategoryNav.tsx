"use client";

import { motion } from "framer-motion";
import { Bell, Settings, Sparkles, Trophy, BookOpen, Beaker, Wrench, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    label: string;
    icon: React.ElementType;
    emoji: string;
}

const categories: Category[] = [
    { id: "all", label: "For You", icon: Flame, emoji: "🔥" },
    { id: "scholarship", label: "Scholarships", icon: Sparkles, emoji: "💰" },
    { id: "competition", label: "Competitions", icon: Trophy, emoji: "🏆" },
    { id: "olympiad", label: "Olympiads", icon: Beaker, emoji: "🧠" },
    { id: "workshop", label: "Workshops", icon: Wrench, emoji: "🛠️" },
];

interface InshortsCategoryNavProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onNotificationsClick?: () => void;
    onSettingsClick?: () => void;
}

const InshortsCategoryNav = ({
    activeCategory,
    onCategoryChange,
    onNotificationsClick,
    onSettingsClick,
}: InshortsCategoryNavProps) => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 inset-x-0 z-50"
        >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-white/5" />

            <div className="relative px-4 pt-2 pb-3 safe-area-inset-top">
                {/* Top row - Branding & Actions */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-display font-bold gradient-text-primary">
                            MyArk
                        </span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                            BETA ✨
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onNotificationsClick}
                            className="relative p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {/* Notification dot */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onSettingsClick}
                            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Category tabs - Horizontally scrollable */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                    {categories.map((category) => {
                        const isActive = activeCategory === category.id;
                        const Icon = category.icon;

                        return (
                            <motion.button
                                key={category.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onCategoryChange(category.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {isActive ? (
                                    <span className="text-base">{category.emoji}</span>
                                ) : (
                                    <Icon className="w-4 h-4" />
                                )}
                                {category.label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
};

export default InshortsCategoryNav;
