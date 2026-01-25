/**
 * Mascot Feedback Component
 * Animated character that provides friendly feedback during auth flow
 */

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export type MascotState =
    | 'idle'
    | 'thinking'
    | 'happy'
    | 'excited'
    | 'concerned'
    | 'celebrating';

interface MascotFeedbackProps {
    state: MascotState;
    message?: string;
    className?: string;
}

// Mascot messages based on state
const defaultMessages: Record<MascotState, string[]> = {
    idle: [
        "Hey there, explorer! 👋",
        "Ready for your next adventure?",
        "Let's unlock something awesome!",
    ],
    thinking: [
        "Hmm, looking good...",
        "Almost there...",
        "You got this!",
    ],
    happy: [
        "Perfect! 🎉",
        "You nailed it!",
        "That's the spirit!",
    ],
    excited: [
        "Let's gooo! 🚀",
        "This is gonna be epic!",
        "Adventure awaits!",
    ],
    concerned: [
        "Oops! Try again? 💪",
        "No worries, one more shot!",
        "You can do it!",
    ],
    celebrating: [
        "Welcome to the squad! 🎮",
        "You're officially in! ✨",
        "Let the games begin! 🏆",
    ],
};

// Mascot expressions as emoji + gradient combos
const mascotExpressions: Record<MascotState, { emoji: string; gradient: string }> = {
    idle: { emoji: "🦊", gradient: "from-orange-400 to-amber-500" },
    thinking: { emoji: "🤔", gradient: "from-blue-400 to-indigo-500" },
    happy: { emoji: "😊", gradient: "from-green-400 to-emerald-500" },
    excited: { emoji: "🤩", gradient: "from-purple-400 to-pink-500" },
    concerned: { emoji: "😅", gradient: "from-yellow-400 to-orange-500" },
    celebrating: { emoji: "🎉", gradient: "from-primary to-secondary" },
};

const MascotFeedback = ({ state, message, className = "" }: MascotFeedbackProps) => {
    const expression = mascotExpressions[state];
    const defaultMessage = useMemo(() => {
        const messages = defaultMessages[state];
        return messages[Math.floor(Math.random() * messages.length)];
    }, [state]);

    const displayMessage = message || defaultMessage;

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {/* Animated Mascot Avatar */}
            <motion.div
                key={state}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
            >
                {/* Glow effect */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${expression.gradient} rounded-full blur-xl opacity-50`}
                    animate={{
                        scale: state === 'celebrating' ? [1, 1.3, 1] : [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                        duration: state === 'celebrating' ? 0.5 : 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Main avatar circle */}
                <motion.div
                    className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${expression.gradient} flex items-center justify-center shadow-2xl`}
                    animate={
                        state === 'celebrating'
                            ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }
                            : state === 'concerned'
                                ? { x: [0, -5, 5, -5, 5, 0] }
                                : { y: [0, -5, 0] }
                    }
                    transition={{
                        duration: state === 'celebrating' ? 0.5 : state === 'concerned' ? 0.4 : 2,
                        repeat: state === 'celebrating' ? 0 : Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <span className="text-5xl" role="img" aria-label="mascot">
                        {expression.emoji}
                    </span>
                </motion.div>

                {/* Floating particles for celebrating state */}
                <AnimatePresence>
                    {state === 'celebrating' && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0.5],
                                        x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                                        y: Math.sin((i * 60 * Math.PI) / 180) * 60 - 20,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.1,
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
                                >
                                    {['✨', '🌟', '💫', '⭐', '🎯', '🏆'][i]}
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Message bubble */}
            <motion.div
                key={displayMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <p className="text-lg font-medium text-foreground">
                    {displayMessage}
                </p>
            </motion.div>
        </div>
    );
};

export default MascotFeedback;
