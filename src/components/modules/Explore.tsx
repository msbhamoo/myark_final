"use client";



import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import OpportunityCard from "@/components/OpportunityCard";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import SEO from "@/components/SEO";

import { Loader2 } from "lucide-react";

import { opportunitiesService } from "@/lib/firestore";

import type { Opportunity } from "@/types/admin";
import { OPPORTUNITY_TYPES } from "@/types/admin";

import { useStudentAuth } from "@/lib/studentAuth";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Calendar as CalendarIcon, Tag as TagIcon, Check, Search, SlidersHorizontal, ArrowUpDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";



const Explore = () => {

    const [loading, setLoading] = useState(true);

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [allTags, setAllTags] = useState<string[]>([]);

    // Advanced Filter State
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
    const [monthFilter, setMonthFilter] = useState<string>('all');
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                const data = await opportunitiesService.getAll({ status: "published" });

                // Extract all unique tags
                const tags = new Set<string>();
                data.forEach(opp => {
                    opp.tags?.forEach(tag => tags.add(tag));
                });
                setAllTags(Array.from(tags).sort());

                // Calculate counts BEFORE applying filters
                const counts: Record<string, number> = {};
                data.forEach(opp => {
                    counts[opp.type] = (counts[opp.type] || 0) + 1;
                });
                setCategoryCounts(counts);

                // Apply Category Filter (from URL)
                let filteredData = [...data];
                if (categoryFilter) {
                    filteredData = filteredData.filter(opp =>
                        opp.type === categoryFilter ||
                        opp.tags?.includes(categoryFilter)
                    );
                }

                // Apply Status Filter
                const now = Date.now();
                if (statusFilter !== 'all') {
                    filteredData = filteredData.filter(opp => {
                        const isClosed = opp.dates?.registrationEnd ? new Date(opp.dates.registrationEnd).getTime() < now : false;
                        return statusFilter === 'active' ? !isClosed : isClosed;
                    });
                }

                // Apply Month & Year Filter
                if (monthFilter !== 'all' || yearFilter !== 'all') {
                    filteredData = filteredData.filter(opp => {
                        if (!opp.dates?.registrationEnd) return false;
                        const date = new Date(opp.dates.registrationEnd);
                        const matchMonth = monthFilter === 'all' || (date.getMonth() + 1).toString() === monthFilter;
                        const matchYear = yearFilter === 'all' || date.getFullYear().toString() === yearFilter;
                        return matchMonth && matchYear;
                    });
                }

                // Apply Tags Filter
                if (selectedTags.length > 0) {
                    filteredData = filteredData.filter(opp =>
                        selectedTags.every(tag => opp.tags?.includes(tag))
                    );
                }

                // Apply Search Filter
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filteredData = filteredData.filter(opp =>
                        opp.title.toLowerCase().includes(query) ||
                        opp.organizer?.toLowerCase().includes(query) ||
                        opp.shortDescription?.toLowerCase().includes(query)
                    );
                }

                if (isForYou && student) {
                    filteredData = filteredData.sort((a, b) => {
                        const aMatch = a.tags?.some(tag => student.interests?.includes(tag)) || a.type.includes(student.interests?.[0]);
                        const bMatch = b.tags?.some(tag => student.interests?.includes(tag)) || b.type.includes(student.interests?.[0]);
                        return (aMatch === bMatch) ? 0 : aMatch ? -1 : 1;
                    });
                }

                setOpportunities(filteredData);
            } catch (error) {
                console.error("Error fetching opportunities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOpps();
    }, [categoryFilter, isForYou, student, statusFilter, monthFilter, yearFilter, selectedTags, searchQuery]);

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };



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

                    {/* Header: More Premium, Instagram-style */}
                    <div className="flex flex-col gap-8 mb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl"
                                suppressHydrationWarning
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                    {opportunities.filter(o => {
                                        const isClosed = o.dates?.registrationEnd ? new Date(o.dates.registrationEnd).getTime() < Date.now() : false;
                                        return !isClosed;
                                    }).length} Active
                                </span>
                                <span className="h-3 w-px bg-white/10 mx-1" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {opportunities.filter(o => {
                                        const isClosed = o.dates?.registrationEnd ? new Date(o.dates.registrationEnd).getTime() < Date.now() : false;
                                        return isClosed;
                                    }).length} Closed
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-display text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent"
                            >
                                {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}s` : "Explore Everyone"}
                            </motion.h1>
                        </div>

                        {/* Unified Search & Global Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="Search by title, organizer, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-14 pl-12 pr-4 bg-white/5 border-white/10 rounded-2xl text-lg transition-all focus:ring-2 focus:ring-primary/20 hover:bg-white/[0.07] focus:bg-background shadow-2xl"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <SlidersHorizontal className="w-5 h-5 mr-3" />
                                        <span>FILTERS</span>
                                        {(statusFilter !== 'all' || monthFilter !== 'all' || yearFilter !== 'all' || selectedTags.length > 0) && (
                                            <span className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-[11px]">
                                                {selectedTags.length + (statusFilter !== 'all' ? 1 : 0) + (monthFilter !== 'all' ? 1 : 0) + (yearFilter !== 'all' ? 1 : 0)}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10 p-0">
                                    <div className="h-full flex flex-col">
                                        <div className="p-8 border-b border-white/5">
                                            <SheetHeader className="text-left space-y-1">
                                                <SheetTitle className="text-3xl font-black italic tracking-tighter">REFINE QUESTS</SheetTitle>
                                                <SheetDescription className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                                    Tailor your discovery path
                                                </SheetDescription>
                                            </SheetHeader>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                            {/* Status Toggle */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                    <ArrowUpDown className="w-3 h-3" />
                                                    Mission Status
                                                </label>
                                                <div className="flex gap-2">
                                                    {(['all', 'active', 'closed'] as const).map((s) => (
                                                        <Button
                                                            key={s}
                                                            variant={statusFilter === s ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setStatusFilter(s)}
                                                            className="flex-1 rounded-xl h-11 capitalize font-bold"
                                                        >
                                                            {s}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Deadline Selector */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    Registration Deadline
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                                            <SelectValue placeholder="Month" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Any Month</SelectItem>
                                                            {months.map(m => (
                                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={yearFilter} onValueChange={setYearFilter}>
                                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                                            <SelectValue placeholder="Year" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Any Year</SelectItem>
                                                            {years.map(y => (
                                                                <SelectItem key={y} value={y}>{y}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Interests/Tags */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                        <TagIcon className="w-3.5 h-3.5" />
                                                        Interests
                                                    </label>
                                                    {selectedTags.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedTags([])}
                                                            className="text-[10px] font-black text-primary uppercase hover:underline underline-offset-4"
                                                        >
                                                            Clear All
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {allTags.map(tag => (
                                                        <Badge
                                                            key={tag}
                                                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                                                            className={cn(
                                                                "h-9 cursor-pointer px-4 rounded-xl transition-all text-xs font-bold",
                                                                selectedTags.includes(tag)
                                                                    ? "bg-primary text-primary-foreground border-transparent scale-105 shadow-lg shadow-primary/20"
                                                                    : "bg-white/5 border-white/10 hover:border-white/30"
                                                            )}
                                                            onClick={() => toggleTag(tag)}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 border-t border-white/5 bg-background/50">
                                            <SheetClose asChild>
                                                <Button
                                                    className="w-full h-14 rounded-2xl font-black text-base"
                                                >
                                                    SHOW {opportunities.length} QUESTS
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Category Fast Toggles: Cleaner Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 auto-cols-min">
                            <Button
                                variant={!categoryFilter ? "default" : "secondary"}
                                size="sm"
                                onClick={() => router.push('/explore')}
                                className={cn(
                                    "whitespace-nowrap rounded-full px-6 h-10 text-xs font-black transition-all",
                                    !categoryFilter && "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                )}
                            >
                                SHOW ALL
                            </Button>
                            {OPPORTUNITY_TYPES.filter(type => (categoryCounts[type.id] || 0) > 0).map((type) => (
                                <Button
                                    key={type.id}
                                    variant={categoryFilter === type.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => router.push(`/explore?category=${type.id}`)}
                                    className={cn(
                                        "whitespace-nowrap rounded-full px-6 h-10 text-xs font-black border border-white/10 transition-all",
                                        categoryFilter === type.id
                                            ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                            : "bg-white/5 hover:bg-white/10"
                                    )}
                                >
                                    {type.name.toUpperCase()}s
                                    <span className="ml-2 opacity-50">{categoryCounts[type.id]}</span>
                                </Button>
                            ))}
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

                                    type={opp.type as "competition" | "scholarship" | "olympiad" | "workshop"}

                                    deadline={(() => {
                                        if (opp.dates?.registrationEndDescription) return opp.dates.registrationEndDescription;
                                        if (!mounted || !opp.dates?.registrationEnd) return "Ending Soon";
                                        const end = new Date(opp.dates.registrationEnd).getTime();
                                        const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
                                        return diff > 0 ? `${diff} days left` : "Ending Soon";
                                    })()}

                                    participants={opp.applicationCount || 0}

                                    prize={opp.prizes?.first || "Certificate"}

                                    isClosed={opp.dates?.registrationEnd ? new Date(opp.dates.registrationEnd).getTime() < Date.now() : false}

                                    delay={index * 50}

                                />

                            ))}

                        </div>

                    ) : (

                        <div className="text-center py-32 glass-card rounded-[40px] border-dashed">

                            <p className="text-xl text-muted-foreground font-medium">No quests found here right now. Try adjusting your filters!</p>

                        </div>

                    )}

                </div>

            </main>

            <Footer />

        </div>

    );

};



export default Explore;

