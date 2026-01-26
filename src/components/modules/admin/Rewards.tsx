"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Ticket,
    Plus,
    Edit,
    Trash2,
    Search,
    RefreshCw,
    Loader2,
    Eye,
    EyeOff,
    Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { rewardsService } from "@/lib/firestore";
import { RedemptionReward, RedemptionPartner } from "@/types/admin";

const Rewards = () => {
    const [loading, setLoading] = useState(true);
    const [rewards, setRewards] = useState<RedemptionReward[]>([]);
    const [partners, setPartners] = useState<RedemptionPartner[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedReward, setSelectedReward] = useState<RedemptionReward | null>(null);
    const [formData, setFormData] = useState({
        partnerId: '',
        title: '',
        description: '',
        xpCost: 0,
        couponCode: '',
        discountValue: '',
        stockLimit: 0,
        requiredBadgeId: '',
        requiredLevel: 0,
        eligibilityCriteria: '',
        isActive: true,
    });
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rewardsData, partnersData] = await Promise.all([
                rewardsService.getAll(),
                rewardsService.getPartners(),
            ]);
            setRewards(rewardsData);
            setPartners(partnersData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRewards = rewards.filter(reward =>
        reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        setFormData({
            partnerId: '',
            title: '',
            description: '',
            xpCost: 0,
            couponCode: '',
            discountValue: '',
            stockLimit: 0,
            requiredBadgeId: '',
            requiredLevel: 0,
            eligibilityCriteria: '',
            isActive: true,
        });
        setShowCreateDialog(true);
    };

    const handleEdit = (reward: RedemptionReward) => {
        setSelectedReward(reward);
        setFormData({
            partnerId: reward.partnerId,
            title: reward.title,
            description: reward.description,
            xpCost: reward.xpCost,
            couponCode: reward.couponCode || '',
            discountValue: reward.discountValue || '',
            stockLimit: reward.stockLimit || 0,
            requiredBadgeId: reward.requiredBadgeId || '',
            requiredLevel: reward.requiredLevel || 0,
            eligibilityCriteria: reward.eligibilityCriteria || '',
            isActive: reward.isActive,
        });
        setShowEditDialog(true);
    };

    const handleSave = async () => {
        try {
            // TODO: Implement create/update in firestore
            toast({
                title: selectedReward ? "Reward updated" : "Reward created",
                description: `Reward has been ${selectedReward ? 'updated' : 'created'} successfully.`,
            });
            setShowCreateDialog(false);
            setShowEditDialog(false);
            fetchData();
        } catch (error) {
            console.error("Error saving reward:", error);
            toast({
                title: "Error",
                description: "Failed to save reward. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleToggleActive = async (reward: RedemptionReward) => {
        try {
            // TODO: Implement toggle in firestore
            toast({
                title: reward.isActive ? "Reward deactivated" : "Reward activated",
                description: `Reward has been ${reward.isActive ? 'deactivated' : 'activated'}.`,
            });
            fetchData();
        } catch (error) {
            console.error("Error toggling reward:", error);
        }
    };

    const getPartnerName = (partnerId: string) => {
        const partner = partners.find(p => p.id === partnerId);
        return partner?.name || 'Unknown Partner';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Redemption Rewards</h1>
                    <p className="text-muted-foreground">Manage XP redemption rewards and partner offers</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Reward
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search rewards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reward</TableHead>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>XP Cost</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRewards.map((reward) => (
                                    <TableRow key={reward.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{reward.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {reward.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Gift className="w-4 h-4 text-muted-foreground" />
                                                {getPartnerName(reward.partnerId)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{reward.xpCost} XP</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {reward.stockLimit ? (
                                                <span className="text-sm">
                                                    {reward.claimCount}/{reward.stockLimit}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Unlimited</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={reward.isActive ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
                                                {reward.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(reward.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Ticket className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(reward)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(reward)}>
                                                        {reward.isActive ? (
                                                            <>
                                                                <EyeOff className="w-4 h-4 mr-2" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
                if (!open) {
                    setShowCreateDialog(false);
                    setShowEditDialog(false);
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {showCreateDialog ? "Create New Reward" : "Edit Reward"}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the reward details and redemption requirements.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partnerId">Partner *</Label>
                                <Select value={formData.partnerId} onValueChange={(value) => setFormData(prev => ({ ...prev, partnerId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select partner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partners.map((partner) => (
                                            <SelectItem key={partner.id} value={partner.id}>
                                                {partner.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="xpCost">XP Cost *</Label>
                                <Input
                                    id="xpCost"
                                    type="number"
                                    value={formData.xpCost}
                                    onChange={(e) => setFormData(prev => ({ ...prev, xpCost: parseInt(e.target.value) || 0 }))}
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Reward title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Reward description"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="couponCode">Coupon Code</Label>
                                <Input
                                    id="couponCode"
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value }))}
                                    placeholder="Optional coupon code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discountValue">Discount Value</Label>
                                <Input
                                    id="discountValue"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                                    placeholder="e.g., 20% off, ₹500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stockLimit">Stock Limit</Label>
                                <Input
                                    id="stockLimit"
                                    type="number"
                                    value={formData.stockLimit}
                                    onChange={(e) => setFormData(prev => ({ ...prev, stockLimit: parseInt(e.target.value) || 0 }))}
                                    placeholder="0 for unlimited"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="requiredLevel">Required Level</Label>
                                <Input
                                    id="requiredLevel"
                                    type="number"
                                    value={formData.requiredLevel}
                                    onChange={(e) => setFormData(prev => ({ ...prev, requiredLevel: parseInt(e.target.value) || 0 }))}
                                    placeholder="0 for no requirement"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                            <Textarea
                                id="eligibilityCriteria"
                                value={formData.eligibilityCriteria}
                                onChange={(e) => setFormData(prev => ({ ...prev, eligibilityCriteria: e.target.value }))}
                                placeholder="Additional eligibility requirements"
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowCreateDialog(false);
                            setShowEditDialog(false);
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {selectedReward ? "Update Reward" : "Create Reward"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Rewards;