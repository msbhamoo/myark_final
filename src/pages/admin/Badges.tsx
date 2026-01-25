import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Medal,
    Award,
    Trophy,
    Star,
    Zap,
    Target,
    Shield,
    Flame,
    Heart,
    Crown,
    Loader2,
    Check,
    X,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { badgesService } from "@/lib/firestore";
import type { Badge, BadgeCategory } from "@/types/admin";
import { cn } from "@/lib/utils";

const iconOptions = [
    { value: "Medal", icon: Medal },
    { value: "Award", icon: Award },
    { value: "Trophy", icon: Trophy },
    { value: "Star", icon: Star },
    { value: "Zap", icon: Zap },
    { value: "Target", icon: Target },
    { value: "Shield", icon: Shield },
    { value: "Flame", icon: Flame },
    { value: "Heart", icon: Heart },
    { value: "Crown", icon: Crown },
];

const colorOptions = [
    { label: "Cyan", value: "text-primary", bg: "bg-primary/20", border: "border-primary/30" },
    { label: "Coral", value: "text-secondary", bg: "bg-secondary/20", border: "border-secondary/30" },
    { label: "Yellow", value: "text-yellow-500", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
    { label: "Emerald", value: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
    { label: "Rose", value: "text-rose-500", bg: "bg-rose-500/20", border: "border-rose-500/30" },
    { label: "Indigo", value: "text-indigo-500", bg: "bg-indigo-500/20", border: "border-indigo-500/30" },
    { label: "Amber", value: "text-amber-500", bg: "bg-amber-500/20", border: "border-amber-500/30" },
    { label: "Purple", value: "text-purple-500", bg: "bg-purple-500/20", border: "border-purple-500/30" },
];

const categoryColors: Record<BadgeCategory, string> = {
    achievement: "text-yellow-500",
    participation: "text-emerald-500",
    skill: "text-primary",
    special: "text-secondary",
};

const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(o => o.value === iconName);
    return option?.icon || Star;
};

const Badges = () => {
    const { toast } = useToast();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "Medal",
        color: "text-primary",
        category: "achievement" as BadgeCategory,
        level: "one-time" as any,
        parentId: "",
        xpRequirement: 0,
        xpReward: 0,
        isVisible: true,
    });

    const fetchBadges = async () => {
        try {
            const data = await badgesService.getAll();
            setBadges(data);
        } catch (error) {
            console.error("Error fetching badges:", error);
            toast({ title: "Error", description: "Failed to load badges", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBadges();
    }, []);

    const handleOpenDialog = (badge?: Badge) => {
        if (badge) {
            setEditingBadge(badge);
            setFormData({
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                color: badge.color,
                category: badge.category,
                level: (badge as any).level || "one-time",
                parentId: (badge as any).parentId || "",
                xpRequirement: badge.xpRequirement || 0,
                xpReward: (badge as any).xpReward || 0,
                isVisible: (badge as any).isVisible ?? true,
            });
        } else {
            setEditingBadge(null);
            setFormData({
                name: "",
                description: "",
                icon: "Medal",
                color: "text-primary",
                category: "achievement",
                level: "one-time",
                parentId: "",
                xpRequirement: 0,
                xpReward: 0,
                isVisible: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveBadge = async () => {
        if (!formData.name.trim()) return;
        setIsSaving(true);
        try {
            if (editingBadge) {
                await badgesService.update(editingBadge.id, formData);
                toast({ title: "Success", description: "Badge updated successfully" });
            } else {
                await badgesService.create(formData as any);
                toast({ title: "Success", description: "Badge created successfully" });
            }
            setIsDialogOpen(false);
            fetchBadges();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save badge", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBadge = async (id: string) => {
        if (!confirm("Are you sure you want to delete this badge?")) return;
        try {
            await badgesService.delete(id);
            toast({ title: "Success", description: "Badge deleted" });
            fetchBadges();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete badge", variant: "destructive" });
        }
    };

    const handleSeedBadges = async () => {
        if (!confirm("Add 12 default high-quality badges?")) return;
        setIsSaving(true);
        try {
            for (const badge of defaultBadges) {
                await badgesService.create(badge as any);
            }
            toast({ title: "Success", description: "12 badges created successfully" });
            fetchBadges();
        } catch (error) {
            toast({ title: "Error", description: "Failed to seed badges", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredBadges = badges.filter(badge => {
        const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || badge.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const SelectedIcon = getIconComponent(formData.icon);
    const selectedColor = colorOptions.find(c => c.value === formData.color) || colorOptions[0];

    const defaultBadges: Omit<Badge, "id" | "createdAt" | "updatedAt">[] = [
        { name: "Code Ninja I", description: "Master of logic (Bronze Level)", icon: "Zap", color: "text-primary", category: "skill", xpRequirement: 500, level: "bronze", isVisible: true } as any,
        { name: "Code Ninja II", description: "Grandmaster of algorithms (Silver Level)", icon: "Zap", color: "text-secondary", category: "skill", xpRequirement: 1500, level: "silver", isVisible: true } as any,
        { name: "Code Ninja III", description: "Architect of Systems (Gold Level)", icon: "Zap", color: "text-yellow-500", category: "skill", xpRequirement: 5000, level: "gold", isVisible: true } as any,
        { name: "Early Bird", description: "Among the first 100 students to join MyArk", icon: "Crown", color: "text-amber-500", category: "achievement", xpRequirement: 100, level: "one-time", isVisible: true } as any,
        { name: "Streak Master", description: "Maintained a 30-day activity streak", icon: "Flame", color: "text-rose-500", category: "achievement", xpRequirement: 600, level: "one-time", isVisible: true } as any,
        { name: "Alpha Member", description: "Part of the exclusive Alpha test group", icon: "Medal", color: "text-secondary", category: "special", xpRequirement: 0, level: "one-time", isVisible: true } as any,
        { name: "Creative Mind", description: "Designed innovative solutions", icon: "Star", color: "text-yellow-500", category: "skill", xpRequirement: 300, level: "one-time", isVisible: true } as any,
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Badge Management</h2>
                    <p className="text-muted-foreground text-sm">Create and manage digital rewards for students</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSeedBadges} disabled={isSaving || loading}>
                        Seed Data
                    </Button>
                    <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        Create Badge
                    </Button>
                </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search badges by name or description..."
                            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-48 bg-muted/50 border-transparent">
                            <Filter className="w-4 h-4 mr-2 opacity-50" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="achievement">Achievement</SelectItem>
                            <SelectItem value="participation">Participation</SelectItem>
                            <SelectItem value="skill">Skill</SelectItem>
                            <SelectItem value="special">Special</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredBadges.map((badge) => {
                            const Icon = getIconComponent(badge.icon);
                            const color = colorOptions.find(c => c.value === badge.color) || colorOptions[0];
                            return (
                                <motion.div
                                    key={badge.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 interactive-card border-white/5 bg-card/40">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                    color.bg,
                                                    color.border,
                                                    "border-2 shadow-lg"
                                                )}>
                                                    <Icon className={cn("w-10 h-10", color.value)} />
                                                </div>
                                                <div className="space-y-1.5 w-full">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <UIBadge variant="outline" className={cn("text-[10px] uppercase font-black py-0 px-2", categoryColors[badge.category])}>
                                                            {badge.category}
                                                        </UIBadge>
                                                        <UIBadge variant="secondary" className="text-[10px] uppercase font-black py-0 px-2 bg-background border-border">
                                                            {(badge as any).level}
                                                        </UIBadge>
                                                    </div>
                                                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{badge.name}</h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">{badge.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex-1 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
                                                        onClick={() => handleOpenDialog(badge)}
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex-1 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDeleteBadge(badge.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredBadges.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Medal className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No badges found</h3>
                    <p className="text-muted-foreground">Start by creating your first digital badge</p>
                    <Button onClick={() => handleOpenDialog()} variant="outline" className="mt-6">
                        Create Badge
                    </Button>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingBadge ? "Edit Badge" : "Create New Badge"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center mb-6">
                            <div className={cn(
                                "w-24 h-24 rounded-2xl flex items-center justify-center border-2 shadow-xl",
                                selectedColor.bg,
                                selectedColor.border
                            )}>
                                <SelectedIcon className={cn("w-12 h-12", selectedColor.value)} />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Badge Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Code Ninja"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What is this badge for?"
                                    className="resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>XP Req / Reward</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Req"
                                        className="bg-muted/50 border-transparent"
                                        value={formData.xpRequirement}
                                        onChange={(e) => setFormData({ ...formData, xpRequirement: Number(e.target.value) })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Reward"
                                        className="bg-muted/50 border-transparent"
                                        value={formData.xpReward}
                                        onChange={(e) => setFormData({ ...formData, xpReward: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Badge Level</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(v) => setFormData({ ...formData, level: v })}
                                >
                                    <SelectTrigger className="bg-muted/50 border-transparent">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one-time">One-Time</SelectItem>
                                        <SelectItem value="bronze">Bronze</SelectItem>
                                        <SelectItem value="silver">Silver</SelectItem>
                                        <SelectItem value="gold">Gold</SelectItem>
                                        <SelectItem value="legendary">Legendary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Parent Badge (Tree)</Label>
                                <Select
                                    value={formData.parentId}
                                    onValueChange={(v) => setFormData({ ...formData, parentId: v })}
                                >
                                    <SelectTrigger className="bg-muted/50 border-transparent text-xs">
                                        <SelectValue placeholder="No Parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {badges.filter(b => b.id !== editingBadge?.id).map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Icon</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {iconOptions.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = formData.icon === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: opt.value })}
                                            className={cn(
                                                "h-10 flex items-center justify-center rounded-lg border transition-all",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/50 border-transparent hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Badge Color</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorOptions.map((opt) => {
                                    const isSelected = formData.color === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: opt.value })}
                                            className={cn(
                                                "h-8 flex items-center justify-center rounded-lg border transition-all gap-1.5 text-[10px] font-bold",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted/50 border-transparent hover:bg-muted"
                                            )}
                                        >
                                            <div className={cn("w-2 h-2 rounded-full", opt.bg.replace('/20', ''))} />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveBadge} disabled={isSaving || !formData.name}>
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {editingBadge ? "Update Badge" : "Create Badge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Badges;
