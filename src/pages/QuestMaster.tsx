
import { motion } from "framer-motion";
import {
    Zap,
    Flame,
    Shield,
    Trophy,
    Star,
    Rocket,
    Target,
    Crown,
    Sparkles,
    ArrowRight,
    ChevronRight,
    TrendingUp,
    Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const QuestMaster = () => {
    const questSteps = [
        {
            icon: Zap,
            title: "Earn XP",
            count: "+50 XP",
            description: "Lock in your profile details to power up. Every field completed adds to your aura.",
            color: "text-primary",
            bg: "bg-primary/20",
            border: "border-primary/30"
        },
        {
            icon: Flame,
            title: "Keep it Lit",
            count: "Daily +10 XP",
            description: "Log in daily to stack your streak. Miss a day, and the fire goes out! 🕯️",
            color: "text-orange-500",
            bg: "bg-orange-500/20",
            border: "border-orange-500/30"
        },
        {
            icon: Target,
            title: "Jump In",
            count: "+40 XP",
            description: "Hit 'Jump In' on any opportunity. Complete the mission and pass the 'Aura Check'.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/20",
            border: "border-emerald-500/30"
        },
        {
            icon: Shield,
            title: "Unlock Badges",
            count: "RARE ITEMS",
            description: "Collect limited edition badges like 'Profile Pro' and 'Streak King' to flex on your profile.",
            color: "text-blue-500",
            bg: "bg-blue-500/20",
            border: "border-blue-500/30"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 antialiased">
            <SEO
                title="Quest Master Guide | Level Up Your Real-Life RPG 🎮"
                description="Master the Myark RPG. Learn how to earn XP, stack streaks, and unlock legendary badges to power up your student journey."
                url="https://myark.in/quest-master"
            />
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                {/* HERO SECTION */}
                <section className="max-w-6xl mx-auto text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-black uppercase tracking-widest text-primary/80">Quest Master Guide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black font-display mb-6 leading-[0.85] tracking-tighter uppercase"
                    >
                        Level Up Your <br />
                        <span className="gradient-text-primary">Aura.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
                    >
                        Myark is more than a platform—it's your RPG for real-life success. 🎮
                        Unlock rewards, stack streaks, and become a legend.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/">
                            <Button size="xl" className="h-16 px-10 rounded-2xl font-black text-lg gap-2 shadow-glow-primary">
                                Start My Quest <Rocket className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button variant="outline" size="xl" className="h-16 px-10 rounded-2xl font-black text-lg border-white/10 hover:bg-white/5">
                                View My Stats <TrendingUp className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                {/* THE SYSTEM GRID */}
                <section className="max-w-6xl mx-auto mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {questSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 relative group overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 ${step.bg} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center mb-6`}>
                                    <step.icon className={`w-7 h-7 ${step.color}`} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{step.title}</h3>
                                <div className={`text-xs font-black px-2 py-1 rounded inline-block mb-4 ${step.bg} ${step.color}`}>
                                    {step.count}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FEATURE HIGHLIGHT: STREAKS */}
                <section className="max-w-6xl mx-auto mb-32">
                    <div className="glass-card p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border-orange-500/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs font-black uppercase tracking-widest">
                                <Flame className="w-3 h-3" /> Streak System
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black font-display leading-[0.9] uppercase"> Don't Let The <br /> <span className="text-orange-500">Fire Go Out.</span></h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Log in every day to maintain your streak. As your streak grows, so does your reputation on Myark. Reach a 7-day streak to unlock the legendary <span className="text-white font-bold">Streak King</span> badge!
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 w-24">
                                    <div className="text-2xl font-black text-orange-500">1d</div>
                                    <div className="text-[10px] uppercase font-bold opacity-40">Starter</div>
                                </div>
                                <ChevronRight className="w-6 h-6 opacity-20" />
                                <div className="text-center p-4 bg-orange-500/20 rounded-2xl border border-orange-500/30 w-24 scale-110 shadow-lg shadow-orange-500/20">
                                    <div className="text-2xl font-black text-orange-500">3d</div>
                                    <div className="text-[10px] uppercase font-bold text-orange-500/60">On Fire</div>
                                </div>
                                <ChevronRight className="w-6 h-6 opacity-20" />
                                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 w-24">
                                    <div className="text-2xl font-black opacity-40">7d</div>
                                    <div className="text-[10px] uppercase font-bold opacity-40">King</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-orange-500 to-red-600 rounded-[40px] flex items-center justify-center shadow-2xl shadow-orange-500/40 relative z-10"
                                >
                                    <Flame className="w-24 h-24 md:w-32 md:h-32 text-white" />
                                </motion.div>
                                <div className="absolute inset-0 bg-orange-500/30 blur-3xl -z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE LOOT: BADGES */}
                <section className="max-w-6xl mx-auto mb-32 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase">Collect Rare Loot 💎</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, name: "Profile Pro", color: "from-blue-400 to-cyan-500" },
                            { icon: Crown, name: "Legend", color: "from-yellow-400 to-amber-600" },
                            { icon: Zap, name: "Fast Mover", color: "from-primary to-secondary" },
                            { icon: Gem, name: "Early Bird", color: "from-purple-400 to-pink-500" }
                        ].map((badge, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${badge.color} p-0.5 shadow-xl`}>
                                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                                        <badge.icon className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <span className="font-black uppercase tracking-tighter text-sm">{badge.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FINAL CALL */}
                <section className="max-w-4xl mx-auto py-20 px-8 glass-card border-primary/20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                    <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">Your Story Starts Here</h2>
                    <p className="text-lg text-muted-foreground mb-10">
                        Don't just scroll. Take action. Earn XP. Win the game of life. 👑
                    </p>
                    <Link to="/">
                        <Button size="xl" className="h-20 px-16 rounded-3xl font-black text-xl gap-2 shadow-glow-primary hover:scale-105 transition-transform">
                            I'm Ready <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default QuestMaster;
