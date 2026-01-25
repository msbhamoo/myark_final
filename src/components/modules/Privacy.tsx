import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
    const sections = [
        {
            title: "What we collect",
            icon: Eye,
            content: "We only ask for details that help Myro find you the best matches. This includes your phone number (for login), grade level, interests, and optionally your school and city. No weird data-scraping here."
        },
        {
            title: "How we use it",
            icon: FileText,
            content: "Your data powers your personalized 'For You' feed and tracks your XP progress. We don't sell your info to third-party advertisers. Your aura remains your own."
        },
        {
            title: "Security first",
            icon: Lock,
            content: "We use Firebase (powered by Google Cloud) to store your data securely. Your PIN is hashed (encrypted) so even we can't see it. We treat your digital identity with respect."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Privacy Policy | MyArk"
                description="Plain-English privacy policy. Learn how we guard your aura and your data at MyArk."
            />
            <Navbar />

            <main className="pt-24 pb-20">
                <section className="container-tight px-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black mb-4">Guarding your <span className="text-emerald-500 italic">aura</span></h1>
                        <p className="text-muted-foreground">Privacy at MyArk is plain, simple, and student-first.</p>
                    </motion.div>

                    <div className="space-y-6">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-muted/50 text-emerald-500">
                                        <section.icon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold">{section.title}</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-[40px] bg-muted/20 border border-white/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Your Rights
                        </h3>
                        <ul className="space-y-3 text-muted-foreground text-sm list-inside list-disc">
                            <li>Request a copy of your personal data at any time.</li>
                            <li>Ask us to correct any incorrect info.</li>
                            <li>Permanently delete your account and data through Settings.</li>
                            <li>Opt-out of any non-essential notifications.</li>
                        </ul>
                    </div>

                    <p className="mt-12 text-center text-xs text-muted-foreground">
                        Last updated: January 25, 2026. Still got questions? <a href="/contact" className="text-primary hover:underline">Drop us a line.</a>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
