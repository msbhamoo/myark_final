"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Trophy,
    Medal,
    Flame,
    Heart,
    Gift,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    Target,
    BookOpen,
    Sparkles,
    TrendingUp,
    Award,
    Calendar,
    Crown,
    Eye,
    Bookmark,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RewardsPage() {
    const myroVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        bounce: { y: [0, -10, 0], transition: { duration: 1, repeat: Infinity } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="text-center space-y-8 mb-16"
                    >
                        <motion.div
                            variants={myroVariants}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                        >
                            <div className="text-3xl">🐧</div>
                            <span className="font-bold text-primary">Myro's Game Guide</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-bold font-display"
                        >
                            Level Up Your <span className="text-primary italic">Journey</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 max-w-2xl border border-primary/10">
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        variants={myroVariants}
                                        animate="bounce"
                                        className="text-4xl"
                                    >
                                        🐧
                                    </motion.div>
                                    <div className="text-left">
                                        <p className="text-lg font-medium text-primary mb-2">Hey there, explorer! I'm Myro 🐧</p>
                                        <p className="text-muted-foreground">
                                            Welcome to Myark's gamification system! Think of this as your personal progress adventure.
                                            Every action you take brings you closer to awesome rewards and achievements.
                                            No pressure, no penalties—just pure motivation to help you grow! 🚀
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* XP Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl p-8 border border-blue-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                                        <Zap className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">XP: Your Progress Points</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-blue-600 mb-2">"XP is like collecting stars in your favorite game!"</p>
                                            <p className="text-muted-foreground">
                                                Every meaningful action you take earns you XP points. It's our way of celebrating your effort and curiosity.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">How to Earn XP</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { action: "Explore opportunities", xp: "5 XP", icon: Eye },
                                                    { action: "Heart (hype) an opportunity", xp: "2 XP", icon: Heart },
                                                    { action: "Save for later", xp: "3 XP", icon: Bookmark },
                                                    { action: "Apply to an opportunity", xp: "10 XP", icon: CheckCircle },
                                                    { action: "Complete profile steps", xp: "20 XP", icon: User },
                                                    { action: "Maintain daily streak", xp: "1 XP", icon: Flame },
                                                ].map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                                                    >
                                                        <item.icon className="w-5 h-5 text-blue-500" />
                                                        <span className="flex-1">{item.action}</span>
                                                        <Badge className="bg-blue-500/20 text-blue-600">{item.xp}</Badge>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Myro's Pro Tip</h3>
                                            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-2xl">🐧</div>
                                                    <div>
                                                        <p className="font-medium text-yellow-700 mb-2">"Start small, dream big!"</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Even exploring opportunities earns you XP. The more you discover,
                                                            the more you grow. No rush—just keep moving forward! 🌟
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Levels Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl p-8 border border-green-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-green-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Levels: Your Growth Journey</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-green-600 mb-2">"Every level up is a celebration of your progress!"</p>
                                            <p className="text-muted-foreground">
                                                As you earn XP, you level up automatically. Higher levels unlock new features and show how far you've come.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="text-center p-4 rounded-xl bg-background/50">
                                            <div className="text-4xl mb-2">🌱</div>
                                            <h4 className="font-semibold mb-1">Level 1-5</h4>
                                            <p className="text-sm text-muted-foreground">Getting started, building habits</p>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-background/50">
                                            <div className="text-4xl mb-2">🚀</div>
                                            <h4 className="font-semibold mb-1">Level 6-15</h4>
                                            <p className="text-sm text-muted-foreground">Exploring more opportunities</p>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-background/50">
                                            <div className="text-4xl mb-2">👑</div>
                                            <h4 className="font-semibold mb-1">Level 16+</h4>
                                            <p className="text-sm text-muted-foreground">Master explorer, inspiring others</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Badges Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl p-8 border border-yellow-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                                        <Medal className="w-8 h-8 text-yellow-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Badges: Your Achievement Stories</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-yellow-600 mb-2">"Badges are like collecting memories of your journey!"</p>
                                            <p className="text-muted-foreground">
                                                Badges represent your unique path and achievements. They're not just rewards—they're symbols of who you are becoming.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Badge Categories</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { name: "First Steps", desc: "Your first exploration", icon: "👶", color: "text-green-500" },
                                                    { name: "Consistency King", desc: "7-day streak master", icon: "🔥", color: "text-orange-500" },
                                                    { name: "Opportunity Hunter", desc: "Applied to 10 opportunities", icon: "🎯", color: "text-blue-500" },
                                                    { name: "Profile Complete", desc: "100% profile filled", icon: "⭐", color: "text-purple-500" },
                                                    { name: "Community Builder", desc: "Helped opportunities trend", icon: "🤝", color: "text-pink-500" },
                                                ].map((badge, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                                                    >
                                                        <span className="text-2xl">{badge.icon}</span>
                                                        <div>
                                                            <div className="font-medium">{badge.name}</div>
                                                            <div className="text-sm text-muted-foreground">{badge.desc}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Badge Levels</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-600">B</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Bronze</div>
                                                        <div className="text-sm text-muted-foreground">Getting started</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold text-blue-600">S</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Silver</div>
                                                        <div className="text-sm text-muted-foreground">Building momentum</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold text-yellow-600">G</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Gold</div>
                                                        <div className="text-sm text-muted-foreground">Master achieved</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Streaks Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-3xl p-8 border border-red-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                                        <Flame className="w-8 h-8 text-red-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Streaks: Your Consistency Superpower</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-red-600 mb-2">"Streaks are like training your motivation muscles!"</p>
                                            <p className="text-muted-foreground">
                                                Daily streaks reward consistency. Miss a day? No worries—start fresh! It's about building positive habits, not perfection.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">How Streaks Work</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                                                    <Calendar className="w-5 h-5 text-red-500" />
                                                    <span>Log in daily to maintain your streak</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                                                    <Zap className="w-5 h-5 text-red-500" />
                                                    <span>Earn 1 XP per day of streak</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                                                    <Heart className="w-5 h-5 text-red-500" />
                                                    <span>Special badges for milestone streaks</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Streak Milestones</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { days: 7, reward: "Consistency Champion Badge" },
                                                    { days: 30, reward: "Monthly Master Badge" },
                                                    { days: 100, reward: "Century Club Badge" },
                                                ].map((milestone, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
                                                    >
                                                        <span className="font-medium">{milestone.days} Days</span>
                                                        <span className="text-sm text-muted-foreground">{milestone.reward}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hearts Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-3xl p-8 border border-pink-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                                        <Heart className="w-8 h-8 text-pink-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Hearts: Community Hype Signals</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-pink-600 mb-2">"Hearts are like giving a high-five to great opportunities!"</p>
                                            <p className="text-muted-foreground">
                                                When you heart an opportunity, you're helping it trend and reach more students who might love it too. It's community power in action!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Why Hearts Matter</h3>
                                            <div className="space-y-3">
                                                <div className="p-4 rounded-lg bg-background/50">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <TrendingUp className="w-5 h-5 text-pink-500" />
                                                        <span className="font-medium">Trending Opportunities</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Opportunities with lots of hearts appear in trending sections, helping more students discover them.
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-background/50">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Users className="w-5 h-5 text-pink-500" />
                                                        <span className="font-medium">Community Impact</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your hearts help build a supportive community where great opportunities get the attention they deserve.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Heart Power</h3>
                                            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-6 border border-pink-500/20">
                                                <div className="text-center mb-4">
                                                    <div className="text-6xl mb-2">💖</div>
                                                    <p className="font-medium">10 Hearts = Trending!</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground text-center">
                                                    When an opportunity reaches 10 hearts, it becomes "trending" and gets featured prominently.
                                                    Your single heart can make a big difference! 🌟
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Rewards Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl p-8 border border-purple-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                                        <Gift className="w-8 h-8 text-purple-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Rewards: Real-World Benefits</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-purple-600 mb-2">"Rewards are like bonus levels in your real-life adventure!"</p>
                                            <p className="text-muted-foreground">
                                                Earn XP through genuine effort, then redeem them for real discounts, coupons, and exclusive perks from our partner brands.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { name: "BookMyShow", cost: "500 XP", benefit: "Movie ticket discount", icon: "🎬" },
                                            { name: "Domino's", cost: "300 XP", benefit: "Pizza coupon", icon: "🍕" },
                                            { name: "Amazon", cost: "1000 XP", benefit: "₹100 voucher", icon: "📦" },
                                            { name: "Unacademy", cost: "750 XP", benefit: "Course discount", icon: "📚" },
                                            { name: "BYJU'S", cost: "600 XP", benefit: "Learning kit", icon: "🎓" },
                                            { name: "Nykaa", cost: "400 XP", benefit: "Beauty product discount", icon: "💄" },
                                        ].map((reward, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="p-4 rounded-xl bg-background/50 border border-purple-500/20"
                                            >
                                                <div className="text-3xl mb-2">{reward.icon}</div>
                                                <h4 className="font-semibold mb-1">{reward.name}</h4>
                                                <p className="text-sm text-muted-foreground mb-2">{reward.benefit}</p>
                                                <Badge className="bg-purple-500/20 text-purple-600">{reward.cost}</Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Community Signals Section */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-3xl p-8 border border-cyan-500/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                                        <Users className="w-8 h-8 text-cyan-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">Community Signals: Celebrating Together</h2>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="text-3xl">🐧</div>
                                        <div>
                                            <p className="text-lg font-medium text-cyan-600 mb-2">"Community signals are like group high-fives for everyone's progress!"</p>
                                            <p className="text-muted-foreground">
                                                When you hit milestones, the community celebrates with you. These signals create positive energy and inspire others on their journey.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Signal Types</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { type: "Badge Unlocked", desc: "When you earn a new badge", icon: "🏆" },
                                                    { type: "XP Milestone", desc: "Reaching XP milestones", icon: "⭐" },
                                                    { type: "Trending Now", desc: "Your heart helped something trend", icon: "🔥" },
                                                ].map((signal, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                                                    >
                                                        <span className="text-2xl">{signal.icon}</span>
                                                        <div>
                                                            <div className="font-medium">{signal.type}</div>
                                                            <div className="text-sm text-muted-foreground">{signal.desc}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">Why It Matters</h3>
                                            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl p-6 border border-cyan-500/20">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🐧</div>
                                                    <div>
                                                        <p className="font-medium text-cyan-700 mb-2">"We're all in this together!"</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Community signals create a supportive environment where everyone celebrates each other's wins.
                                                            It's not about competition—it's about shared success! 🤝
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Final Message */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 border border-primary/10">
                            <motion.div
                                variants={myroVariants}
                                animate="bounce"
                                className="text-6xl mb-6"
                            >
                                🐧
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                                Remember: This Isn't About Playing Games
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                                Myark's gamification is about making your real progress visible, celebrating your genuine effort,
                                and keeping you motivated on your journey to discover amazing opportunities. No pressure,
                                no penalties—just pure encouragement to explore, learn, and grow at your own pace.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/explore">
                                    <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                                        Start Exploring
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/profile">
                                    <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                                        View My Progress
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
