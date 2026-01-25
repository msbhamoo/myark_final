"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Ticket,
    Zap,
    Users,
    Activity,
    Loader2,
    Save,
    X,
    Filter,
    Calendar,
    Medal,
    ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { db, COLLECTIONS } from "@/lib/firestore";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { RedemptionReward, RedemptionPartner, Badge as BadgeType } from "@/types/admin";
import { cn } from "@/lib/utils";

const Redemption = () => {
    const { toast } = useToast();
    const [rewards, setRewards] = useState<RedemptionReward[]>([]);
    const [partners, setPartners] = useState<RedemptionPartner[]>([]);
    const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [partnerFilter, setPartnerFilter] = useState("all");

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingReward, setEditingReward] = useState<RedemptionReward | null>(null);
    const [formData, setFormData] = useState({
        partnerId: "",
        title: "",
        description: "",
        xpCost: 0,
        couponCode: "",
        discountValue: "",
        stockLimit: 0,
        requiredBadgeId: "",
        requiredLevel: 0,
        eligibilityCriteria: "",
        isActive: true,
        expiresAt: "",
    });

    const fetchData = async () => {
        try {
            const [rewardsSnap, partnersSnap, badgesSnap] = await Promise.all([
                getDocs(collection(db, "rewards")),
                getDocs(collection(db, "partners")),
                getDocs(collection(db, COLLECTIONS.badges))
            ]);

            const rewardsData = rewardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RedemptionReward));
            const partnersData = partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RedemptionPartner));
            const badgesData = badgesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BadgeType));

            setRewards(rewardsData);
            setPartners(partnersData);
            setAllBadges(badgesData);
        } catch (error) {
            console.error("Error fetching redemption data:", error);
            toast({ title: "Error", description: "Failed to load redemption data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (reward?: RedemptionReward) => {
        if (reward) {
            setEditingReward(reward);
            setFormData({
                partnerId: reward.partnerId,
                title: reward.title,
                description: reward.description,
                xpCost: reward.xpCost,
                couponCode: reward.couponCode || "",
                discountValue: reward.discountValue || "",
                stockLimit: reward.stockLimit || 0,
                requiredBadgeId: reward.requiredBadgeId || "",
                requiredLevel: reward.requiredLevel || 0,
                eligibilityCriteria: reward.eligibilityCriteria || "",
                isActive: reward.isActive,
                expiresAt: reward.expiresAt ? (reward.expiresAt as any).toDate().toISOString().split('T')[0] : "",
            });
        } else {
            setEditingReward(null);
            setFormData({
                partnerId: partners[0]?.id || "",
                title: "",
                description: "",
                xpCost: 100,
                couponCode: "",
                discountValue: "",
                stockLimit: 0,
                requiredBadgeId: "",
                requiredLevel: 0,
                eligibilityCriteria: "",
                isActive: true,
                expiresAt: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveReward = async () => {
        if (!formData.title.trim() || !formData.partnerId) return;
        setIsSaving(true);
        try {
            const rewardData = {
                ...formData,
                xpCost: Number(formData.xpCost),
                stockLimit: Number(formData.stockLimit),
                requiredLevel: Number(formData.requiredLevel),
                expiresAt: formData.expiresAt ? Timestamp.fromDate(new Date(formData.expiresAt)) : null,
                updatedAt: Timestamp.now(),
            };

            if (editingReward) {
                await updateDoc(doc(db, "rewards", editingReward.id), rewardData);
                toast({ title: "Success", description: "Reward updated successfully" });
            } else {
                await addDoc(collection(db, "rewards"), {
                    ...rewardData,
                    claimCount: 0,
                    createdAt: Timestamp.now(),
                });
                toast({ title: "Success", description: "Reward added successfully" });
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save reward", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteReward = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reward?")) return;
        try {
            await deleteDoc(doc(db, "rewards", id));
            toast({ title: "Success", description: "Reward deleted" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete reward", variant: "destructive" });
        }
    };

    const filteredRewards = rewards.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPartner = partnerFilter === "all" || r.partnerId === partnerFilter;
        return matchesSearch && matchesPartner;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Redemption Rewards</h2>
                    <p className="text-muted-foreground text-sm">Create and manage XP-gated rewards for students</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Reward
                </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search rewards..."
                                className="pl-9 bg-muted/50 border-transparent focus:border-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                            <SelectTrigger className="w-full md:w-64">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by Partner" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Partners</SelectItem>
                                {partners.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredRewards.map((reward) => {
                            const partner = partners.find(p => p.id === reward.partnerId);
                            const requiredBadge = allBadges.find(b => b.id === reward.requiredBadgeId);
                            return (
                                <motion.div
                                    key={reward.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="group relative h-full flex flex-col hover:border-primary/50 transition-all duration-300 bg-card/40 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3">
                                            <Badge variant={reward.isActive ? "default" : "secondary"} className="shadow-sm">
                                                {reward.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm">
                                                    {partner?.logo ? (
                                                        <img src={partner.logo} alt={partner.name} className="w-6 h-6 object-contain" />
                                                    ) : (
                                                        <Ticket className="w-6 h-6 text-primary" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{partner?.name || "Unknown Partner"}</p>
                                                    <h3 className="text-lg font-bold truncate pr-16">{reward.title}</h3>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col gap-4">
                                            <p className="text-sm text-muted-foreground line-clamp-2">{reward.description}</p>

                                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-white/5">
                                                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                                                    <div className="flex items-center gap-1.5 text-primary mb-0.5">
                                                        <Zap className="w-3.5 h-3.5 fill-primary" />
                                                        <span className="text-sm font-bold">{reward.xpCost}</span>
                                                    </div>
                                                    <p className="text-[10px] uppercase font-black opacity-50">XP Cost</p>
                                                </div>
                                                <div className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                                    <div className="flex items-center gap-1.5 text-orange-500 mb-0.5">
                                                        <Activity className="w-3.5 h-3.5" />
                                                        <span className="text-sm font-bold">{reward.claimCount}</span>
                                                    </div>
                                                    <p className="text-[10px] uppercase font-black opacity-50">Claimed</p>
                                                </div>
                                            </div>

                                            {requiredBadge && (
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/5 border border-secondary/10">
                                                    <Medal className="w-4 h-4 text-secondary" />
                                                    <span className="text-[10px] font-bold">Needs: {requiredBadge.name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 pt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-xs gap-1.5 h-8 hover:bg-primary/10 hover:text-primary"
                                                    onClick={() => handleOpenDialog(reward)}
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-xs gap-1.5 h-8 hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => handleDeleteReward(reward.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredRewards.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-bold">No rewards found</h3>
                    <p className="text-muted-foreground">Define what students can redeem with their XP</p>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingReward ? "Edit Reward" : "Add New Reward"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Brand Partner</Label>
                                <Select
                                    value={formData.partnerId}
                                    onValueChange={(v) => setFormData({ ...formData, partnerId: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partners.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Reward Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., 20% Off iPhone"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="xpCost">XP Cost</Label>
                                    <Input
                                        id="xpCost"
                                        type="number"
                                        value={formData.xpCost}
                                        onChange={(e) => setFormData({ ...formData, xpCost: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Limit</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        placeholder="0 for unlim"
                                        value={formData.stockLimit}
                                        onChange={(e) => setFormData({ ...formData, stockLimit: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coupon">Coupon Code (Optional)</Label>
                                <Input
                                    id="coupon"
                                    placeholder="MYARK20"
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Gated by Badge (Optional)</Label>
                                <Select
                                    value={formData.requiredBadgeId}
                                    onValueChange={(v) => setFormData({ ...formData, requiredBadgeId: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="No Badge Requirement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {allBadges.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="criteria">Eligibility Criteria Text</Label>
                                <Input
                                    id="criteria"
                                    placeholder="e.g., Only for college students"
                                    value={formData.eligibilityCriteria}
                                    onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Reward Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Explain how to redeem and what's included"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-white/5">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <p className="text-[10px] text-muted-foreground uppercase">Visible in student app</p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveReward} disabled={isSaving || !formData.title}>
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {editingReward ? "Update Reward" : "Add Reward"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Redemption;
