"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OpportunityCard from "@/components/OpportunityCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Loader2, Sparkles, Filter } from "lucide-react";
import { opportunitiesService } from "@/lib/firestore";
import type { Opportunity } from "@/types/admin";
import { useStudentAuth } from "@/lib/studentAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Explore = () => {
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { student } = useStudentAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categoryFilter = searchParams?.get("category");
    const isForYou = searchParams?.get("filter") === "for-you";

    useEffect(() => {
        const fetchOpps = async () => {
            try {
                setLoading(true);
                // Fetch all published opportunities
                let data = await opportunitiesService.getAll({ status: "published" });

                // Apply filters
                if (categoryFilter) {
                    data = data.filter(opp =>
                        opp.type === categoryFilter ||
                        opp.tags?.includes(categoryFilter)
                    );
                }

                if (isForYou && student) {
                    data = data.sort((a, b) => {
                        const aMatch = a.tags?.some(tag => student.interests?.includes(tag)) || a.type.includes(student.interests?.[0]);
                        const bMatch = b.tags?.some(tag => student.interests?.includes(tag)) || b.type.includes(student.interests?.[0]);
                        return (aMatch === bMatch) ? 0 : aMatch ? -1 : 1;
                    });
                }

                setOpportunities(data);
            } catch (error) {
                console.error("Error fetching opportunities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOpps();
    }, [categoryFilter, isForYou, student]);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
            <SEO
                title="Explore Opportunities | Myark"
                description="Browse all scholarships, competitions, and events. Your quest for success starts here."
                url="https://myark.in/explore"
            />
            <Navbar />

            <main className="pt-24 pb-20 px-4 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3" />
                                {opportunities.length} Opportunities Live
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl font-bold">
                                {categoryFilter ? `${categoryFilter} Qusts` : "Explore Everything �x�"}
                            </h1>
                        </div>

                        {/* Simple Filter Toggles */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            <Button
                                variant={!categoryFilter ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.push('/explore')}
                            >
                                All
                            </Button>
                            <Button
                                variant={categoryFilter === "scholarship" ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.push('/explore?category=scholarship')}
                            >
                                Scholarships
                            </Button>
                            <Button
                                variant={categoryFilter === "competition" ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.push('/explore?category=competition')}
                            >
                                Competitions
                            </Button>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-96 rounded-[40px] bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : opportunities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {opportunities.map((opp, index) => (
                                <OpportunityCard
                                    key={opp.id}
                                    id={opp.id}
                                    title={opp.title}
                                    organization={opp.organizer || "Admin"}
                                    type={opp.type as any}
                                    deadline={(() => {
                                        if (!mounted || !opp.dates?.registrationEnd) return "Ending Soon";
                                        const end = new Date(opp.dates.registrationEnd).getTime();
                                        const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
                                        return diff > 0 ? `${diff} days left` : "Ending Soon";
                                    })()}
                                    participants={opp.applicationCount || 0}
                                    prize={opp.prizes?.first || "Certificate"}
                                    delay={index * 50}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 glass-card rounded-[40px] border-dashed">
                            <p className="text-xl text-muted-foreground font-medium">No quests found here right now. Check back soon! �x"�️⬍�"️</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Explore;
