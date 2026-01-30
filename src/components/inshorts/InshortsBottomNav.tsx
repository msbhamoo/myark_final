"use client";

import { motion } from "framer-motion";
import { Home, Compass, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useStudentAuth } from "@/lib/studentAuth";

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    path: string;
    requiresAuth?: boolean;
}

const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "explore", label: "Explore", icon: Search, path: "/explore" },
    { id: "discover", label: "Swipe", icon: Compass, path: "/beta" },
    { id: "profile", label: "You", icon: User, path: "/profile", requiresAuth: true },
];

interface InshortsBottomNavProps {
    activeTab?: string;
}

const InshortsBottomNav = ({ activeTab = "discover" }: InshortsBottomNavProps) => {
    const router = useRouter();
    const { student, showAuthModal } = useStudentAuth();

    const handleNavClick = (item: NavItem) => {
        if (item.requiresAuth && !student) {
            showAuthModal({
                mode: 'login',
                trigger: 'profile',
                message: 'Sign in to access your profile and saved stuff! 💪',
                onSuccess: () => router.push(item.path),
            });
            return;
        }
        router.push(item.path);
    };

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
            className="fixed bottom-0 inset-x-0 z-50"
        >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/5" />

            <div className="relative flex items-center justify-around px-4 py-3 safe-area-inset-bottom">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNavClick(item)}
                            className={cn(
                                "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all",
                                isActive && "text-primary"
                            )}
                        >
                            <div className={cn(
                                "relative p-2 rounded-xl transition-all",
                                isActive && "bg-primary/20"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 transition-all",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )} />

                                {/* Active indicator glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute inset-0 bg-primary/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </div>

                            <span className={cn(
                                "text-[10px] font-bold transition-all",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.nav>
    );
};

export default InshortsBottomNav;
