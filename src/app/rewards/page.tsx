"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RewardsPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm"
                >
                    <Gift className="w-4 h-4" />
                    Coming Soon
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-bold font-display">
                    Myark <span className="text-primary italic">Rewards</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We're building an epic rewards system where you can redeem your XP for exclusive perks,
                    discounts, and academic resources. Stay tuned!
                </p>

                <div className="py-12 flex justify-center">
                    <div className="relative w-48 h-48">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-primary via-secondary to-accent opacity-20 blur-2xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-7xl">
                            🎁
                        </div>
                    </div>
                </div>

                <Link href="/">
                    <Button variant="outline" size="lg" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Explore
                    </Button>
                </Link>
            </div>
        </div>
    );
}
