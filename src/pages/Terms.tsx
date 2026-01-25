import { motion } from "framer-motion";
import { Scale, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Terms of Service | MyArk"
                description="Simple terms of service. The rules of the MyArk quest."
            />
            <Navbar />

            <main className="pt-24 pb-20">
                <section className="container-tight px-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-6">
                            <Scale className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black mb-4">The <span className="text-blue-500 italic">Rules</span></h1>
                        <p className="text-muted-foreground">Practical terms for an epic experience.</p>
                    </motion.div>

                    <div className="prose prose-invert max-w-none space-y-12">
                        <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold m-0 text-center">Eligibility</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed m-0 text-center">
                                MyArk is for students. If you're a high-schooler, college student, or lifelong learner, you're welcome here. Just keep it real and provide accurate info in your profile.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                <h2 className="text-xl font-bold m-0 text-center">Code of Conduct</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed m-0 text-center">
                                Don't spam, don't farm XP with bots, and definitely don't try to hack the Ark. Respect your fellow explorers. We reserve the right to ban accounts that disrupt the community vibe.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-bold m-0 text-center">The Fine Print</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed m-0 text-center">
                                Myark provides information on opportunities, but we don't control the opportunities themselves. Application results, deadlines, and rewards are determined by the organizations offering them.
                            </p>
                        </div>
                    </div>

                    <p className="mt-20 text-center text-xs text-muted-foreground">
                        By using MyArk, you agree to these terms. Last updated: January 2026.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
