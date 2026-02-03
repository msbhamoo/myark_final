"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Search, Users, Shield, Zap, Target, ArrowRight, Star, Globe, Award, Sparkles, Coins, FileText, Mail, Trophy, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const VerificationChecklist = () => {
    const checklistItems = [
        {
            title: "Source Authenticity",
            description: "We only source from official organization websites, government portals, and verified partners. No third-party hearsay.",
            icon: Globe,
            color: "text-blue-400"
        },
        {
            title: "Benefit Validation",
            description: "We verify the exact prize pool, scholarship amount, or certificate value to ensure it's worth your time.",
            icon: Award,
            color: "text-amber-400"
        },
        {
            title: "Deadline Accuracy",
            description: "Dates are cross-checked across multiple sources to ensure you never miss a real window or chase a fake one.",
            icon: Zap,
            color: "text-primary"
        },
        {
            title: "Eligibility Scan",
            description: "We verify grades, age brackets, and regional restrictions so you don't apply to something you can't win.",
            icon: Users,
            color: "text-emerald-400"
        },
        {
            title: "Host Credibility",
            description: "Is the organizer legitimate? We check for office addresses, registration details, and track records.",
            icon: Shield,
            color: "text-indigo-400"
        },
        {
            title: "Data Safe Zone",
            description: "We only link to secure platforms (HTTPS). Your personal data should never be on a sketchy form.",
            icon: ShieldCheck,
            color: "text-rose-400"
        },
        {
            title: "Hidden Fee Audit",
            description: "We hunt for 'pay-to-win' traps. If it's free, it must stay free. No hidden processing costs allowed.",
            icon: Coins,
            color: "text-yellow-400"
        },
        {
            title: "Legalese Cleanup",
            description: "Our team skims the fine print for predatory terms where they might 'own' your IP or content forever.",
            icon: FileText,
            color: "text-cyan-400"
        },
        {
            title: "Contact Check",
            description: "Every opportunity must have a reachable support team. No ghosts allowed in the Myark discovery engine.",
            icon: Mail,
            color: "text-purple-400"
        },
        {
            title: "Prestige Score",
            description: "Is this a high-aura W for your CV? We prioritize opportunities from world-class institutes and brands.",
            icon: Star,
            color: "text-amber-500"
        },
        {
            title: "Winner History",
            description: "Has the host actually awarded prizes in the past? We look for evidence of successful previous editions.",
            icon: Trophy,
            color: "text-orange-400"
        },
        {
            title: "Mobile Ready",
            description: "We test the application flow on mobile to ensure you can apply while on the bus or between classes.",
            icon: Rocket,
            color: "text-blue-500"
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Discovery & Sourcing",
            description: "Our crawlers and community scouts identify ~200+ opportunities weekly across the global web.",
            icon: Search
        },
        {
            number: "02",
            title: "The Vetting Gauntlet",
            description: "Our curation team applies a 12-point checklist to filter out scams, expired links, and low-value contests.",
            icon: ShieldCheck
        },
        {
            number: "03",
            title: "Gamification Mapping",
            description: "We assign XP values and relevant tags based on the difficulty and prestige of the opportunity.",
            icon: Target
        },
        {
            number: "04",
            title: "Verification Pulse",
            description: "Even after posting, we monitor links daily to ensure they remain active until the deadline.",
            icon: Star
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="How We Verify Opportunities | Myark"
                description="Learn about Myark's strict verification process. We review 200+ opportunities weekly to ensure you only get the most trustworthy scholarships and competitions."
            />
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6"
                        >
                            <Shield className="w-4 h-4" />
                            Trust & Transparency
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black font-display mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic"
                        >
                            HOW WE VET <br /><span className="text-primary italic">EVERY OPPORTUNITY</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            We know your time is valuable. That&apos;s why we review over <span className="text-white font-bold">200+ opportunities</span> every single week, so you only see the cream of the crop.
                        </motion.p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {[
                            { label: "Opps Reviewed Weekly", value: "200+", icon: Search },
                            { label: "Verification Rate", value: "18%", icon: ShieldCheck },
                            { label: "Active Monitors", value: "24/7", icon: Zap }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 text-center border-primary/10 group hover:border-primary/30 transition-colors"
                            >
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-4xl font-black mb-1">{stat.value}</div>
                                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* The Checklist */}
                    <section className="mb-24">
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Our 12-Point <span className="text-primary italic">Checklist</span></h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {checklistItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 p-6 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                >
                                    <div className={`shrink-0 w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center ${item.color}`}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* The Process Steps */}
                    <section className="mb-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black mb-4">THE VERIFICATION FLOW</h2>
                            <p className="text-muted-foreground">From initial discovery to your dashboard, here&apos;s the journey.</p>
                        </div>

                        <div className="relative">
                            {/* Connector line for desktop */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block -translate-y-1/2" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {steps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative z-10 flex flex-col items-center text-center group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all">
                                            <span className="text-primary font-black italic">{step.number}</span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-3">{step.title}</h4>
                                        <p className="text-sm text-muted-foreground italic px-4 leading-relaxed">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Trust Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-10 md:p-16 rounded-[48px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-primary/10">
                            <ShieldCheck className="w-40 h-40 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-black mb-6 italic tracking-tight uppercase">Quality Over Quantity</h2>
                            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed italic">
                                &quot;Our mission isn&apos;t to have the most opportunities, but to have the <span className="text-white font-bold">right ones</span>. We reject 82% of what we find so you can focus on winning.&quot;
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-primary">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    No Scams
                                </div>
                                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    No Expired Links
                                </div>
                                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Real Benefits
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VerificationChecklist;
