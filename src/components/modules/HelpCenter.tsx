import { motion } from "framer-motion";
import { Search, HelpCircle, Book, Zap, Shield, Mail, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
    const faqs = [
        {
            q: "How do I earn XP?",
            a: "You earn XP for basically being active! Completing your profile, taking the discovery quiz, saving opportunities, and applying to them all grant you XP. Check your profile to see specific tasks and their rewards."
        },
        {
            q: "What are the different levels for?",
            a: "Levels represent your 'Player Rank' on MyArk. As you level up, you'll unlock special badges, earn a higher Aura score, and soon, you'll get access to exclusive premium opportunities and early-bird applications."
        },
        {
            q: "Is it free to apply to opportunities?",
            a: "Myark itself is 100% free for students! While we link to some external scholarships or events that might have their own fees, the vast majority of opportunities on our platform are free to enter. We always label paid ones clearly."
        },
        {
            q: "How does the Discovery Quiz work?",
            a: "The Discovery Quiz uses a bit of Myro magic to understand your vibes. It looks at your interests, how competitive you're feeling, and your weekly schedule to suggest opportunities that actually fit your life�no more doom-scrolling for info!"
        },
        {
            q: "How can I delete my account?",
            a: "We'd be sad to see you go! But if you need a break, you can find the delete option under Settings > Account. All your data and progress will be permanently wiped (this action cannot be undone)."
        }
    ];

    const faqSchema = {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Help Center & FAQ | MyArk Support"
                description="Got questions about XP, levels, or how to start your MyArk quest? Find all the answers here in our student-first guide."
                schema={faqSchema}
            />
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Header */}
                <section className="container-tight text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                    >
                        <HelpCircle className="w-16 h-16 text-primary mx-auto" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-display font-black mb-6">How can we <span className="text-primary italic">help</span>?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for answers..."
                            className="h-14 pl-12 pr-4 bg-muted/30 border-white/10 rounded-2xl focus:border-primary text-lg"
                        />
                    </div>
                </section>

                {/* Categories */}
                <section className="container-tight mt-20 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Zap, label: "XP & Levels", color: "text-amber-400" },
                            { icon: Book, label: "Quests", color: "text-blue-400" },
                            { icon: Shield, label: "Security", color: "text-secondary" },
                            { icon: Mail, label: "Contact", color: "text-emerald-400" }
                        ].map((cat, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
                            >
                                <cat.icon className={`w-8 h-8 ${cat.color}`} />
                                <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* FAQ Accordion */}
                <section className="container-tight mt-32 px-4">
                    <h2 className="text-3xl font-display font-bold mb-10">Popular Questions =%</h2>
                    <div className="glass-card rounded-[32px] overflow-hidden border-white/5">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="px-6 border-b border-white/5 last:border-0">
                                    <AccordionTrigger className="hover:no-underline py-6">
                                        <span className="text-left font-bold text-lg pr-4">{faq.q}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-8 text-muted-foreground leading-relaxed text-base">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Still need help? */}
                <section className="container-tight mt-40 px-4">
                    <div className="p-12 rounded-[40px] bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/5 text-center">
                        <h2 className="text-2xl font-display font-bold mb-4">Still stuck? �x��</h2>
                        <p className="text-muted-foreground mb-8">Our support legends are ready to help you out.</p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
                            <a
                                href="/contact"
                                className="px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Talk to Support
                            </a>
                            <a
                                href="mailto:support@myark.com"
                                className="px-8 py-3 bg-muted/50 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                Send an Email <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenter;
