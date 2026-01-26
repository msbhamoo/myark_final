/**
 * Auth Prompt Component
 * Contextual card that appears when users try protected actions
 */

import { motion } from "framer-motion";
import { Lock, Zap, Trophy, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentAuth } from "@/lib/studentAuth";

interface AuthPromptProps {
    trigger?: 'heart' | 'save' | 'apply' | 'profile';
    onDismiss?: () => void;
    className?: string;
}

const triggerMessages = {
    heart: {
        icon: "❤️",
        title: "Heart this opportunity",
        benefits: [
            { icon: Zap, text: "Earn 2 XP" },
            { icon: Trophy, text: "Unlock 'Hype Master' badge" },
        ],
    },
    save: {
        icon: "⭐",
        title: "Save for later",
        benefits: [
            { icon: Bookmark, text: "Access your saved list anytime" },
            { icon: Zap, text: "Earn 5 XP" },
        ],
    },
    apply: {
        icon: "🚀",
        title: "Jump into this opportunity",
        benefits: [
            { icon: Zap, text: "Earn 40 XP" },
            { icon: Trophy, text: "Track your applications" },
            { icon: Sparkles, text: "Get personalized recommendations" },
        ],
    },
    profile: {
        icon: "🎮",
        title: "Access your profile",
        benefits: [
            { icon: Trophy, text: "View your badges & XP" },
            { icon: Sparkles, text: "Track your progress" },
        ],
    },
};

const AuthPrompt = ({ trigger = 'apply', onDismiss, className = "" }: AuthPromptProps) => {
    const { showAuthModal } = useStudentAuth();
    const config = triggerMessages[trigger];

    const handleSignIn = () => {
        showAuthModal({
            trigger,
            message: `${config.icon} ${config.title} and start earning rewards!`,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`glass-card p-6 rounded-xl border border-primary/20 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground">Login to unlock</h3>
                    <p className="text-sm text-muted-foreground">{config.title}</p>
                </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-6">
                {config.benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                    >
                        <benefit.icon className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{benefit.text}</span>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <Button onClick={handleSignIn} className="w-full" size="lg">
                Sign In to Continue 🚀
            </Button>

            {/* Sub-text */}
            <p className="text-center text-xs text-muted-foreground mt-3">
                Takes just 30 seconds! ⚡
            </p>

            {/* Dismiss link */}
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="block w-full text-center text-sm text-muted-foreground hover:text-foreground mt-2 transition-colors"
                >
                    Maybe later
                </button>
            )}
        </motion.div>
    );
};

export default AuthPrompt;
