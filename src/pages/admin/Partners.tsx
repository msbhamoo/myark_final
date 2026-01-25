import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ShoppingBag,
    Globe,
    Activity,
    Loader2,
    Save,
    X,
    ExternalLink
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    orderBy
} from "firebase/firestore";
import { RedemptionPartner } from "@/types/admin";
import { cn } from "@/lib/utils";

const Partners = () => {
    const { toast } = useToast();
    const [partners, setPartners] = useState<RedemptionPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingPartner, setEditingPartner] = useState<RedemptionPartner | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        logo: "",
        category: "Education",
        isActive: true,
    });

    const fetchPartners = async () => {
        try {
            const q = query(collection(db, COLLECTIONS.settings), orderBy("name", "asc"));
            // Note: Since we are using a general 'settings' collection for simple CRUDs sometimes, 
            // but for Partners we should probably have a dedicated collection.
            // Let's use a dedicated collection 'partners'
            const partnersRef = collection(db, "partners");
            const snapshot = await getDocs(partnersRef);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RedemptionPartner));
            setPartners(data);
        } catch (error) {
            console.error("Error fetching partners:", error);
            toast({ title: "Error", description: "Failed to load partners", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleOpenDialog = (partner?: RedemptionPartner) => {
        if (partner) {
            setEditingPartner(partner);
            setFormData({
                name: partner.name,
                description: partner.description,
                website: partner.website || "",
                logo: partner.logo || "",
                category: partner.category,
                isActive: partner.isActive,
            });
        } else {
            setEditingPartner(null);
            setFormData({
                name: "",
                description: "",
                website: "",
                logo: "",
                category: "Education",
                isActive: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSavePartner = async () => {
        if (!formData.name.trim()) return;
        setIsSaving(true);
        try {
            const partnersRef = collection(db, "partners");
            if (editingPartner) {
                await updateDoc(doc(db, "partners", editingPartner.id), {
                    ...formData,
                    updatedAt: Timestamp.now(),
                });
                toast({ title: "Success", description: "Partner updated successfully" });
            } else {
                await addDoc(partnersRef, {
                    ...formData,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });
                toast({ title: "Success", description: "Partner added successfully" });
            }
            setIsDialogOpen(false);
            fetchPartners();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save partner", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePartner = async (id: string) => {
        if (!confirm("Are you sure you want to delete this partner? This might affect existing rewards.")) return;
        try {
            await deleteDoc(doc(db, "partners", id));
            toast({ title: "Success", description: "Partner deleted" });
            fetchPartners();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete partner", variant: "destructive" });
        }
    };

    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Brand Partners</h2>
                    <p className="text-muted-foreground text-sm">Manage educational and lifestyle partners for XP redemption</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Add Partner
                </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search partners by name or category..."
                            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                        {filteredPartners.map((partner) => (
                            <motion.div
                                key={partner.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 bg-card/40">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                {partner.logo ? (
                                                    <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                                )}
                                            </div>
                                            <Badge variant={partner.isActive ? "default" : "secondary"}>
                                                {partner.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{partner.name}</h3>
                                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{partner.category}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{partner.description}</p>

                                        {partner.website && (
                                            <a
                                                href={partner.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                                            >
                                                <Globe className="w-3 h-3" />
                                                {new URL(partner.website).hostname}
                                                <ExternalLink className="w-2 h-2" />
                                            </a>
                                        )}

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
                                                onClick={() => handleOpenDialog(partner)}
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDeletePartner(partner.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredPartners.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-bold">No partners found</h3>
                    <p className="text-muted-foreground">Start by adding your first brand partner</p>
                    <Button onClick={() => handleOpenDialog()} variant="outline" className="mt-6">
                        Add Partner
                    </Button>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Partner Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Apple, Starbucks, Coursera"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                                            <SelectItem value="Tech">Tech</SelectItem>
                                            <SelectItem value="Gaming">Gaming</SelectItem>
                                            <SelectItem value="Food">Food & Beverage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center gap-2 h-10">
                                        <Switch
                                            checked={formData.isActive}
                                            onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                                        />
                                        <span className="text-sm font-medium">{formData.isActive ? "Active" : "Inactive"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input
                                    id="website"
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo URL (Optional)</Label>
                                <Input
                                    id="logo"
                                    placeholder="https://example.com/logo.png"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief introduction of the partner"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSavePartner} disabled={isSaving || !formData.name}>
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {editingPartner ? "Update Partner" : "Add Partner"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Partners;
