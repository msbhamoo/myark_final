import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast({
                title: "Message Sent! 🚀",
                description: "We'll get back to you faster than a speedrun.",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Contact Us | MyArk"
                description="Drop a line, report a bug, or just say hi. We're here to help you master your quest."
            />
            <Navbar />

            <main className="pt-24 pb-20">
                <section className="container-tight px-4 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left Side: Info */}
                        <div className="space-y-8">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 inline-block p-3 rounded-2xl bg-secondary/10 text-secondary"
                                >
                                    <MessageSquare className="w-8 h-8" />
                                </motion.div>
                                <h1 className="text-4xl font-display font-black mb-4">Drop a <span className="text-secondary italic">line</span></h1>
                                <p className="text-muted-foreground leading-relaxed">
                                    Got a bug to report? A suggestion for a feature? Or just want to tell us how much you love Myro? We're all ears.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary h-fit">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-1">Email Us</p>
                                        <p className="font-bold">support@myark.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-white/5 text-center">
                                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 h-fit">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-1">Join the Vibe</p>
                                        <p className="font-bold">Follow @MyArkQuest</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                <p className="text-sm font-bold flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Aura Points incoming!
                                </p>
                                <p className="text-xs text-muted-foreground">Every helpful bug report gets you an exclusive "Beta Legend" badge + 500 XP bonus. 🚀</p>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 rounded-[40px] shadow-2xl relative"
                        >
                            {submitted ? (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold">LOCKED IN! 🔒</h2>
                                    <p className="text-muted-foreground">
                                        Your message is on its way to the support legends. Keep an eye on your inbox!
                                    </p>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSubmitted(false)}
                                        className="mt-4"
                                    >
                                        Send another one
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Alex"
                                            required
                                            className="h-12 bg-muted/50 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@email.com"
                                            required
                                            className="h-12 bg-muted/50 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">What's the vibe?</Label>
                                        <Input
                                            id="subject"
                                            placeholder="e.g. Bug Report / Question"
                                            required
                                            className="h-12 bg-muted/50 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Your Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Drop your thoughts here..."
                                            className="min-h-[150px] bg-muted/50 rounded-2xl p-4"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 rounded-2xl text-lg font-bold group"
                                    >
                                        {loading ? "Sending..." : (
                                            <>Send Message <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
