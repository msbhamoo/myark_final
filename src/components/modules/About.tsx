import { motion } from "framer-motion";
import { Sparkles, Rocket, Heart, Users, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="About Us | MyArk"
                description="We're on a mission to gamify the future for every student. Discover the story behind Myro and the MyArk quest."
            />
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="container-tight text-center relative px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 inline-block"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-2xl shadow-primary/20">
                            🐧
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6"
                    >
                        Gamifying the <span className="text-secondary italic">Future</span> 🚀
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        We believe discovering opportunities shouldn't feel like a chore. At MyArk, we've turned the search for success into an epic quest.
                    </motion.p>
                </section>

                {/* Story Section */}
                <section className="container-tight mt-32 px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-display font-bold">The Myro Story 🐱</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                It all started with a realization: the transition from student life to the "real world" is often confusing and overwhelming.
                                Traditional portals are dry, boring, and disconnected from what actually matters to our generation.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                That's where <span className="font-bold text-foreground">Myro</span> comes in. Our clever mascot was born from the idea that every student needs a guideâ€”a partner who makes the journey exciting, rewards progress, and never lets a good opportunity go to waste.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-[40px] bg-muted/30 overflow-hidden border border-white/5 flex items-center justify-center p-12"
                        >
                            <img src="/myro.png" alt="Myro Mascot" className="w-full h-auto drop-shadow-2xl" />
                        </motion.div>
                    </div>
                </section>

                {/* Mission Cards */}
                <section className="container-tight mt-40 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold mb-4">Vibe Check: Our Mission 🎯</h2>
                        <p className="text-muted-foreground">Why we do what we do, in plain English.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Rocket,
                                title: "Launch Careers",
                                desc: "Connecting you with scholarships, olympiads, and roles that actually matter.",
                                color: "text-blue-400"
                            },
                            {
                                icon: Heart,
                                title: "Student-First",
                                desc: "Designed by people who get it. No jargon, no gatekeeping, just pure opportunities.",
                                color: "text-rose-400"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Reliable Info",
                                desc: "Every listing is verified by our team. If it's on MyArk, it's legit.",
                                color: "text-emerald-400"
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-3xl space-y-4"
                            >
                                <div className={`p-3 rounded-2xl bg-muted/50 w-fit ${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">{card.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="container-tight mt-40 px-4">
                    <div className="p-12 rounded-[40px] bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex flex-wrap justify-center gap-12 md:gap-24 text-center">
                        <div>
                            <p className="text-5xl font-black mb-2">15k+</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-primary">Students</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black mb-2">2k+</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Opportunities</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black mb-2">500k</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-accent">XP Awarded</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container-tight mt-40 text-center px-4">
                    <h2 className="text-4xl font-display font-bold mb-8">Ready to start your quest? 👑</h2>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-primary/20"
                    >
                        Start Exploring <Sparkles className="w-5 h-5" />
                    </a>
                </section>
            </main>

            <Footer />
        </div >
    );
};

export default About;
