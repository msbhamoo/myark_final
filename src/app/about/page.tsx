"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Rocket, Zap, Star, Users, Target, Crown, Wind, CloudIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <SEO
                title="About Us | From Dreamers to Dreamers | Myark"
                description="The Myark story: Built by dreamers, for the dreamers who are ready to change the world. Discover our mission to empower every student."
            />
            <Navbar />

            <main className="pt-24 pb-20 overflow-hidden">
                {/* Hero Section - The "Dreamers" Hook */}
                <section className="relative px-4 py-20 md:py-32">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent)] pointer-events-none" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            Our Manifesto
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black font-display leading-[1] tracking-tighter mb-8 italic"
                        >
                            FROM <span className="text-primary italic">DREAMERS</span><br />TO <span className="text-white italic">DREAMERS.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed italic"
                        >
                            Myark wasn&apos;t built in a boardroom. It was born in the late nights, the &apos;what-ifs&apos;, and the pursuit of something bigger.
                        </motion.p>
                    </div>

                    {/* Floating background elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-10 md:left-20 opacity-20 hidden md:block"
                    >
                        <CloudIcon className="w-20 h-20 text-white" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-10 md:right-20 opacity-20 hidden md:block"
                    >
                        <Star className="w-16 h-16 text-primary fill-current" />
                    </motion.div>
                </section>

                {/* The "Why" Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl font-black italic tracking-tight">THE <span className="text-primary">SPARK.</span></h2>
                            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed italic">
                                <p>
                                    We remember what it felt like to have big dreams but no map. To see scholarships that felt unreachable and competitions that felt reserved for &apos;someone else&apos;.
                                </p>
                                <p>
                                    Myark is the map we wish we had. We are a team of students, dropouts, and dreamers who decided that access to opportunity shouldn&apos;t be a lottery—it should be a level playing field.
                                </p>
                                <p className="text-white font-bold">
                                    Every line of code we write is a bridge between who you are and who you want to become.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square md:aspect-[4/5] rounded-[48px] overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1523240715632-d984cfd96058?q=80&w=2070"
                                alt="Team dreaming"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-black italic text-xl uppercase tracking-tighter">
                                    &quot;The future belongs to those who believe in the beauty of their dreams.&quot;
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* The Founder's Story - Stage Fear */}
                <section className="py-24 px-4 relative overflow-hidden bg-primary/5">
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="w-16 h-1 px-1 bg-primary/30 mx-auto mb-8 rounded-full" />
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">THE NIGHT I <span className="text-primary italic">DIDN'T STAND UP.</span></h2>
                        </motion.div>

                        <div className="grid gap-12 text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                It was 2018. A national-level pitching competition. I had the idea, the data, and the passion. I was sitting in the third row, my heart hammering against my ribs so hard it felt internal, like a trapped bird.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-8 md:p-12 rounded-[40px] bg-black/60 border border-white/5 relative"
                            >
                                <p className="text-white font-medium mb-6">
                                    They called my name. The spotlight hit the empty space where I should have stood. But my legs were lead. My throat was sand. I watched as the opportunity of a lifetime—a chance to get the funding I desperately needed—floated away because I was too terrified to walk those ten steps to the stage.
                                </p>
                                <p className="text-primary font-bold">
                                    I went home that night and cried. Not because I lost, but because I never even tried.
                                </p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                That moment taught me something vital: **Confidence isn't something you're born with; it's a muscle you build through small wins.** By missing that stage, I realized that many students don't need more "information"—they need a safe space to start, to fail, and to eventually find their voice before the stakes get too high.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-white font-bold text-center mt-8 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 py-6 rounded-2xl border border-primary/20"
                            >
                                Myark was born to bridge this "Confidence Gap." <br />
                                <span className="text-primary text-sm uppercase tracking-widest mt-2 block">Our Mission</span>
                                <span className="text-2xl mt-2 block italic font-black uppercase tracking-tighter">To ignite early-stage courage.</span>
                            </motion.p>
                        </div>
                    </div>

                    {/* Subtle heartbeats in the background */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.03] pointer-events-none">
                        <Heart className="w-[600px] h-[600px] animate-pulse" />
                    </div>
                </section>

                {/* Core Values / Vibes */}
                <section className="py-20 px-4 bg-muted/20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black uppercase tracking-widest italic mb-4">OUR HOUSE RULES</h2>
                            <p className="text-muted-foreground italic">What kept us going when it was just a sketch on a napkin.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Radical Empathy",
                                    desc: "We build for the student who is stressed, the one who is curious, and the one who is just looking for a win. We've been there.",
                                    icon: Heart,
                                    color: "border-rose-500/30 text-rose-400"
                                },
                                {
                                    title: "High Aura Energy",
                                    desc: "We don't do boring. We believe education and growth should feel like a quest, not a chore. If it's not exciting, we don't build it.",
                                    icon: Zap,
                                    color: "border-primary/30 text-primary"
                                },
                                {
                                    title: "The Dreamer's Code",
                                    desc: "Quantity is noise. Quality is signal. We reject the average to bring you the legendary opportunities you deserve.",
                                    icon: Crown,
                                    color: "border-amber-500/30 text-amber-400"
                                }
                            ].map((value, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-10 rounded-[40px] border bg-black/40 backdrop-blur-sm group hover:-translate-y-2 transition-all duration-300 ${value.color}`}
                                >
                                    <value.icon className="w-10 h-10 mb-6" />
                                    <h3 className="text-2xl font-black mb-4 italic text-white uppercase">{value.title}</h3>
                                    <p className="text-muted-foreground italic leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The "Confidence" Section */}
                <section className="py-32 px-4 relative">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <Rocket className="w-20 h-20 text-primary mx-auto mb-8 animate-pulse" />
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">
                                BUILD YOUR COURAGE <br /><span className="text-primary italic">BEFORE THE STAGE.</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 md:p-12 rounded-[56px] border-2 border-primary/20 bg-primary/5 italic relative overflow-hidden"
                        >
                            <Wind className="absolute top-0 right-0 w-32 h-32 text-primary/10 -rotate-12 translate-x-8 -translate-y-8" />
                            <p className="text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                                &quot;We don&apos;t just give you opportunities. We give you the small wins that build the muscle of confidence. Myark is your practice ground, your hype-team, and your early-stage launchpad to ensure you never have to stay in the third row.&quot;
                            </p>
                            <div className="mt-8 pt-8 border-t border-primary/10 flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black italic uppercase text-sm">Ignite Early-Stage Courage</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Small Wins, Big Impact</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
