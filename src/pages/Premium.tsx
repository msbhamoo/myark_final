import { motion } from "framer-motion";
import { Sparkles, Crown, Zap, Shield, Target, Smartphone, Bell, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Premium = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Premium | MyArk+"
                description="Level up with MyArk+. Exclusive early-access opportunities, expert mentorship, and premium Myro power-ups."
            />
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero */}
                <section className="container-tight text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 font-bold text-secondary text-sm uppercase tracking-widest"
                    >
                        <Crown className="w-4 h-4" />
                        Coming Soon
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">Level Up with <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent italic">Myark+</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        For the hyper-ambitious. Get the tools, access, and guidance to become a top 1% student athlete, artist, or scholar.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-center">
                        <Button size="lg" className="h-14 px-10 rounded-2xl bg-secondary hover:bg-secondary/90 text-lg font-bold shadow-xl shadow-secondary/20">
                            Join Waitlist <Sparkles className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="ghost" size="lg" className="h-14 px-8 rounded-2xl font-bold">
                            View Benefits <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container-tight mt-32 px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Early Access",
                                desc: "Get notified of elite scholarships and internships 48 hours before the general public.",
                                color: "text-amber-400"
                            },
                            {
                                icon: Target,
                                title: "Expert Review",
                                desc: "Get real feedback on your applications from mentors who have actually won major awards.",
                                color: "text-blue-400"
                            },
                            {
                                icon: Crown,
                                title: "Legendary Aura",
                                desc: "Elite profile themes, exclusive badges, and a custom Myro skin to show off your rank.",
                                color: "text-secondary"
                            },
                            {
                                icon: Shield,
                                title: "Premium Verification",
                                desc: "A verified badge that proves your credentials to organizers and universities.",
                                color: "text-emerald-400"
                            },
                            {
                                icon: Smartphone,
                                title: "App Beta Access",
                                desc: "Be the first to test our upcoming iOS & Android mobile apps with offline mode.",
                                color: "text-purple-400"
                            },
                            {
                                icon: Bell,
                                title: "Smart Filter",
                                desc: "Advanced discovery logic that predicts which opportunities you are most likely to win.",
                                color: "text-rose-400"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-[40px] border border-white/5 space-y-4"
                            >
                                <div className={`p-3 rounded-2xl bg-muted/50 w-fit ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Pricing Peek */}
                <section className="container-tight mt-40 px-4 text-center">
                    <div className="max-w-xl mx-auto p-12 rounded-[48px] bg-gradient-to-br from-secondary/10 via-background to-accent/10 border border-secondary/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Crown className="w-32 h-32" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Elite Tier</h2>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-muted-foreground line-through text-lg">₹499</span>
                            <span className="text-4xl font-black italic">Free for Beta</span>
                        </div>
                        <p className="text-muted-foreground mb-8">
                            Join the waitlist now and get 6 months of MyArk+ for free when we launch. Limited to the first 100 explorers.
                        </p>
                        <Button className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors">
                            Claim Beta Spot
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Premium;
