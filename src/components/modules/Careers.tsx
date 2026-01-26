"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search,
    Briefcase,
    IndianRupee,
    MapPin,
    ChevronRight,
    Loader2,
    Filter,
    TrendingUp,
    Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface CareerProfile {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    category: string;
    categoryColor: string;
    salary: {
        min: number;
        max: number;
    };
    images: string[];
}

const Careers = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [careers, setCareers] = useState<CareerProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const q = query(collection(db, "careers"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as CareerProfile[];
                setCareers(data);
            } catch (error) {
                console.error("Error fetching careers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, []);

    const categories = ["All", ...Array.from(new Set(careers.map(c => c.category).filter(Boolean)))];

    const filteredCareers = careers.filter(career => {
        const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || career.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Future-Ready Paths</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6"
                        >
                            Discover Your <span className="text-secondary italic">Dream Career</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground"
                        >
                            Explore emerging career paths, understand roadmaps, and find your place in the world of tomorrow.
                        </motion.p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-6 mb-12">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search career fields, expertise..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-muted/50 border-none text-lg"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
                                        : "bg-muted/50 hover:bg-muted"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Careers Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
                            <p className="text-muted-foreground">Mapping out career paths...</p>
                        </div>
                    ) : filteredCareers.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCareers.map((career, index) => (
                                <motion.div
                                    key={career.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group cursor-pointer"
                                    onClick={() => router.push(`/careers/${career.id}`)}
                                >
                                    <Card className="rounded-[40px] overflow-hidden border-none shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:y-[-8px] bg-card">
                                        <CardContent className="p-0">
                                            {/* Image Area */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={career.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
                                                    alt={career.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className={`${career.categoryColor || "bg-secondary"} border-none text-[10px] font-bold px-3 py-1 uppercase tracking-tighter`}>
                                                        {career.category}
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-2xl font-bold text-white font-display leading-tight mb-2">
                                                        {career.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-8 space-y-6">
                                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                    {career.shortDescription}
                                                </p>

                                                <div className="flex items-center justify-between text-sm py-4 border-y border-border/50">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <IndianRupee className="w-4 h-4 text-green-500" />
                                                        {career.salary?.min}L - {career.salary?.max}L
                                                    </div>
                                                    <div className="text-muted-foreground flex items-center gap-1 font-medium">
                                                        <Filter className="w-3 h-3" />
                                                        Overview
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-secondary font-bold group-hover:gap-4 transition-all">
                                                    Explore Career Path
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-[40px] border-2 border-dashed border-muted">
                            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">No career matches your search</h3>
                            <p className="text-muted-foreground">Try exploring other categories or search terms.</p>
                        </div>
                    )}

                    {/* Future Section */}
                    <div className="mt-32 p-12 rounded-[50px] bg-muted/50 border border-border/50 flex flex-col items-center text-center">
                        <h2 className="text-3xl font-bold font-display mb-4">Don't see your interest?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                            We're constantly adding new career profiles. Tell us what you'd like to see next!
                        </p>
                        <Button size="lg" className="rounded-2xl px-8 py-6 h-auto text-lg font-bold">
                            Submit a Request
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Careers;
