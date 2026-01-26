import { useState, useEffect } from "react";

import { motion } from "framer-motion";

import {

    Zap,

    Gift,

    ShoppingBag,

    Ticket,

    Lock,

    Medal,

    Search,

    Loader2,

    Sparkles,

    PartyPopper

} from "lucide-react";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import SEO from "@/components/SEO";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {

    Dialog,

    DialogContent,

    DialogHeader,

    DialogTitle,

    DialogDescription,

    DialogFooter

} from "@/components/ui/dialog";

import { useStudentAuth } from "@/lib/studentAuth";

import { rewardsService, badgesService } from "@/lib/firestore";

import type { RedemptionReward, RedemptionPartner } from "@/types/admin";

import { useToast } from "@/hooks/use-toast";



const Rewards = () => {

    const { student, updateStudent, isAuthenticated, showAuthModal } = useStudentAuth();

    const { toast } = useToast();

    const [rewards, setRewards] = useState<RedemptionReward[]>([]);

    const [partners, setPartners] = useState<RedemptionPartner[]>([]);

    const [allBadges, setAllBadges] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedReward, setSelectedReward] = useState<RedemptionReward | null>(null);

    const [isRedeeming, setIsRedeeming] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);



    useEffect(() => {

        const fetchData = async () => {

            try {

                const [rewardsData, partnersData, badgesData] = await Promise.all([

                    rewardsService.getAll(),

                    rewardsService.getPartners(),

                    badgesService.getAll()

                ]);

                setRewards(rewardsData);

                setPartners(partnersData);

                setAllBadges(badgesData);

            } catch (error) {

                console.error("Error fetching rewards:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);



    const handleRedeem = async () => {

        if (!student || !selectedReward) return;



        // 1. Check XP

        if (student.xpPoints < selectedReward.xpCost) {

            toast({

                title: "Not enough XP! �a�",

                description: `You need ${selectedReward.xpCost - student.xpPoints} more XP to unlock this.`,

                variant: "destructive"

            });

            return;

        }



        // 2. Check Badge

        if (selectedReward.requiredBadgeId && !student.badges?.includes(selectedReward.requiredBadgeId)) {

            toast({

                title: "Locked by Badge =",

                description: "You need to unlock a specific badge to claim this reward.",

                variant: "destructive"

            });

            return;

        }



        setIsRedeeming(true);

        try {

            await rewardsService.redeem(selectedReward.id, student.id, selectedReward.xpCost);



            // Deduct XP locally (and sync)

            await updateStudent({

                xpPoints: student.xpPoints - selectedReward.xpCost

            });



            setShowSuccess(true);

            setSelectedReward(null);

        } catch (error) {

            console.error(error);

            toast({

                title: "Redemption Failed",

                description: "Something went wrong. Please try again.",

                variant: "destructive"

            });

        } finally {

            setIsRedeeming(false);

        }

    };



    const filteredRewards = rewards.filter(r =>

        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

        r.description.toLowerCase().includes(searchTerm.toLowerCase())

    );



    return (

        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">

            <SEO

                title="Rewards Store | Spend Your XP �x}�"

                description="Redeem your hard-earned XP for real rewards, coupons, and exclusive swag from our partners."

            />

            <Navbar />



            <main className="pt-24 pb-20 px-4">

                {/* Hero */}

                <section className="max-w-6xl mx-auto mb-16 relative">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        <div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">

                                <Gift className="w-3 h-3" />

                                Rewards Store

                            </div>

                            <h1 className="text-4xl md:text-6xl font-black font-display mb-4">

                                Spend Your <span className="text-primary">XP.</span>

                            </h1>

                            <p className="text-xl text-muted-foreground max-w-lg mb-8">

                                You've earned it. Now enjoy it. Redeem exclusive perks from top brands and educational partners.

                            </p>



                            {student ? (

                                <div className="p-6 bg-muted/30 rounded-3xl border border-white/5 inline-flex items-center gap-6">

                                    <div className="text-center">

                                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Your Balance</p>

                                        <div className="text-3xl font-black flex items-center gap-1 text-primary">

                                            <Zap className="w-6 h-6 fill-primary" />

                                            {student.xpPoints}

                                        </div>

                                    </div>

                                    <div className="h-10 w-px bg-white/10" />

                                    <div className="text-center">

                                        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Level {student.level}</p>

                                        <div className="text-lg font-bold text-foreground">

                                            Explorer

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                <Button onClick={() => showAuthModal({ mode: 'login' })} size="lg" className="rounded-xl font-bold">

                                    Sign in to view XP

                                </Button>

                            )}

                        </div>



                        <div className="relative hidden md:block">

                            <motion.div

                                animate={{ y: [0, -20, 0] }}

                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}

                                className="relative z-10"

                            >

                                <img src="/myro.png" alt="Myro" className="w-64 h-auto drop-shadow-2xl" />

                            </motion.div>

                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />

                        </div>

                    </div>

                </section>



                {/* Partners Ticker */}

                <section className="max-w-6xl mx-auto mb-20 overflow-hidden">

                    <p className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Powered by</p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">

                        {partners.map(p => (

                            <div key={p.id} className="flex items-center gap-2">

                                {p.logo ? (

                                    <img src={p.logo} alt={p.name} className="h-8 object-contain" />

                                ) : (

                                    <span className="text-xl font-black">{p.name}</span>

                                )}

                            </div>

                        ))}

                    </div>

                </section>



                {/* Grid */}

                <section className="max-w-6xl mx-auto min-h-[400px]">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">

                        <div className="relative w-full md:w-96">

                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                            <Input

                                placeholder="Search rewards..."

                                className="pl-10 h-12 bg-muted/30 border-white/5 rounded-2xl"

                                value={searchTerm}

                                onChange={(e) => setSearchTerm(e.target.value)}

                            />

                        </div>

                        <div className="flex gap-2">

                            {/* Potentially Add Categories here later */}

                        </div>

                    </div>



                    {loading ? (

                        <div className="flex items-center justify-center py-20">

                            <Loader2 className="w-8 h-8 animate-spin text-primary" />

                        </div>

                    ) : filteredRewards.length > 0 ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {filteredRewards.map((reward) => {

                                const partner = partners.find(p => p.id === reward.partnerId);

                                const isAffordable = student ? student.xpPoints >= reward.xpCost : false;



                                // Robust Badge Check

                                let isLocked = false;

                                if (reward.requiredBadgeId && reward.requiredBadgeId !== "none" && student) {

                                    const requiredBadge = allBadges.find(b => b.id === reward.requiredBadgeId);



                                    // Debug Logs

                                    console.log(`Checking Reward: ${reward.title}`);

                                    console.log(`Required ID: ${reward.requiredBadgeId}`);

                                    console.log(`Required Name: ${requiredBadge?.name}`);

                                    console.log(`Student Badges:`, student.badges);



                                    // Normalize helper

                                    const normalize = (s: string) => s.toLowerCase().trim().replace(/[\s_-]+/g, '');



                                    const studentBadges = (student.badges || []).map(normalize);

                                    const requiredId = normalize(reward.requiredBadgeId);

                                    const requiredName = requiredBadge ? normalize(requiredBadge.name) : '';



                                    // Checks

                                    const hasId = studentBadges.includes(requiredId);

                                    const hasName = requiredName && studentBadges.includes(requiredName);



                                    // Special case: Check if the requiredBadgeId itself is stored as a name in student badges

                                    // e.g. reward.requiredBadgeId = "Early Bird" (legacy) and student has "Early Bird"

                                    const hasLegacyDirect = studentBadges.includes(requiredId);



                                    if (!hasId && !hasName && !hasLegacyDirect) {

                                        isLocked = true;

                                        console.log("-> LOCKED =");

                                    } else {

                                        console.log("-> UNLOCKED =");

                                    }

                                }



                                return (

                                    <motion.div

                                        key={reward.id}

                                        whileHover={{ y: -5 }}

                                        className="group glass-card p-6 flex flex-col h-full relative overflow-hidden"

                                    >

                                        <div className="absolute top-0 right-0 p-4">

                                            <div className="flex items-center gap-1 text-primary font-black bg-primary/10 px-3 py-1 rounded-full text-sm">

                                                <Zap className="w-3.5 h-3.5 fill-primary" />

                                                {reward.xpCost}

                                            </div>

                                        </div>



                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">

                                            {partner?.logo ? (

                                                <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain" />

                                            ) : (

                                                <Gift className="w-6 h-6 text-foreground" />

                                            )}

                                        </div>



                                        <h3 className="text-xl font-bold mb-2 pr-16">{reward.title}</h3>

                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">

                                            {reward.description}

                                        </p>



                                        {isLocked && (

                                            <div className="flex items-center gap-2 text-xs text-orange-500 font-bold mb-4 bg-orange-500/10 p-2 rounded-lg w-fit">

                                                <Lock className="w-3 h-3" />

                                                Locked (Badge Required)

                                            </div>

                                        )}



                                        {!isLocked && !isAffordable && student && (

                                            <div className="mb-4 space-y-2">

                                                <div className="flex justify-between text-xs font-bold">

                                                    <span className="text-muted-foreground">Progress</span>

                                                    <span className="text-primary">{Math.round((student.xpPoints / reward.xpCost) * 100)}%</span>

                                                </div>

                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">

                                                    <div

                                                        className="h-full bg-primary transition-all duration-500 rounded-full"

                                                        style={{ width: `${Math.min((student.xpPoints / reward.xpCost) * 100, 100)}%` }}

                                                    />

                                                </div>

                                                <p className="text-xs text-muted-foreground text-center">

                                                    {reward.xpCost - student.xpPoints} XP to go

                                                </p>

                                            </div>

                                        )}



                                        <Button

                                            className="w-full rounded-xl font-bold gap-2"

                                            variant={isAffordable && !isLocked ? "default" : "secondary"}

                                            disabled={!isAffordable || !!isLocked || !student}

                                            onClick={() => setSelectedReward(reward)}

                                        >

                                            {isLocked ? "Locked" : isAffordable ? "Redeem Now" : "Not Enough XP"}

                                        </Button>

                                    </motion.div>

                                );

                            })}

                        </div>

                    ) : (

                        <div className="text-center py-20">

                            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />

                            <h3 className="text-lg font-bold">No rewards found</h3>

                            <p className="text-muted-foreground">Check back later for new drops!</p>

                        </div>

                    )}

                </section>

            </main>



            {/* Redeem Dialog */}

            <Dialog open={!!selectedReward} onOpenChange={(v) => !v && setSelectedReward(null)}>

                <DialogContent className="max-w-md">

                    <DialogHeader>

                        <DialogTitle>Confirm Redemption</DialogTitle>

                        <DialogDescription>

                            Are you sure you want to spend <span className="font-bold text-primary">{selectedReward?.xpCost} XP</span> on this reward?

                        </DialogDescription>

                    </DialogHeader>



                    <div className="py-4">

                        <div className="glass-card p-4 rounded-xl flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">

                                <Gift className="w-6 h-6" />

                            </div>

                            <div>

                                <h4 className="font-bold">{selectedReward?.title}</h4>

                                <p className="text-xs text-muted-foreground">Provided by {partners.find(p => p.id === selectedReward?.partnerId)?.name}</p>

                            </div>

                        </div>

                    </div>



                    <DialogFooter>

                        <Button variant="ghost" onClick={() => setSelectedReward(null)}>Cancel</Button>

                        <Button onClick={handleRedeem} disabled={isRedeeming}>

                            {isRedeeming && <Loader2 className="w-4 h-4 animate-spin mr-2" />}

                            Confirm & Redeem

                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>



            {/* Success Dialog */}

            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>

                <DialogContent className="max-w-sm text-center">

                    <div className="flex justify-center mb-4">

                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">

                            <PartyPopper className="w-10 h-10 text-green-500" />

                        </div>

                    </div>

                    <DialogTitle className="text-center text-2xl font-black">Reward Unlocked! 🎉</DialogTitle>

                    <DialogDescription className="text-center text-lg">

                        Check your email for the coupon code and redemption instructions.

                    </DialogDescription>

                    <Button onClick={() => setShowSuccess(false)} className="mt-6 w-full rounded-xl font-bold">

                        Awesome!

                    </Button>

                </DialogContent>

            </Dialog>



            <Footer />

        </div>

    );

};



export default Rewards;

