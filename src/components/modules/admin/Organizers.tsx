"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Users,
    Plus,
    Edit,
    Trash2,
    Loader2,
    ExternalLink,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { settingsService } from "@/lib/firestore";
import type { Organizer, OrganizerType } from "@/types/admin";

const Organizers = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [selectedOrganizer, setSelectedOrganizer] = useState<Partial<Organizer> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formContent, setFormContent] = useState({
        name: "",
        type: "school" as OrganizerType,
        website: "",
        description: "",
    });

    useEffect(() => {
        fetchOrganizers();
    }, []);

    const fetchOrganizers = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getOrganizers();
            setOrganizers(data);
        } catch (error) {
            console.error("Error fetching organizers:", error);
            toast({ title: "Error", description: "Failed to load organizers", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredOrganizers = organizers.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || org.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleOpenDialog = (org?: Organizer) => {
        if (org) {
            setIsEditing(true);
            setSelectedOrganizer(org);
            setFormContent({
                name: org.name,
                type: org.type,
                website: org.website || "",
                description: org.description || "",
            });
        } else {
            setIsEditing(false);
            setSelectedOrganizer({});
            setFormContent({
                name: "",
                type: "school",
                website: "",
                description: "",
            });
        }
    };

    const handleSave = async () => {
        if (!formContent.name.trim()) return;
        setSaving(true);
        try {
            await settingsService.saveOrganizer(formContent);
            await fetchOrganizers();
            setSelectedOrganizer(null);
            toast({ title: "Success", description: "Organizer saved successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save organizer", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this organizer?")) return;
        try {
            await settingsService.deleteOrganizer(id);
            setOrganizers(organizers.filter(o => o.id !== id));
            toast({ title: "Deleted", description: "Organizer removed" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete" });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Organizers</h2>
                    <p className="text-muted-foreground">Manage schools, government bodies, and partners</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Organizer
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search organizers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="school">School</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="ngo">NGO</SelectItem>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardContent className="p-0">
                        {filteredOrganizers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No organizers found</h3>
                                <p className="text-muted-foreground">Start by adding a new organizer</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Website</TableHead>
                                        <TableHead>Added On</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrganizers.map((org) => (
                                        <TableRow key={org.id} className="group">
                                            <TableCell className="font-medium">{org.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="uppercase text-[10px]">
                                                    {org.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {org.website ? (
                                                    <a
                                                        href={org.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                                                    >
                                                        Visit <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {org.createdAt?.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenDialog(org)}
                                                        className="opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(org.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Form Dialog */}
            <Dialog open={!!selectedOrganizer} onOpenChange={() => setSelectedOrganizer(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit" : "Add"} Organizer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Organizer Name *</Label>
                            <Input
                                value={formContent.name}
                                onChange={(e) => setFormContent({ ...formContent, name: e.target.value })}
                                placeholder="e.g., Delhi Public School"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formContent.type}
                                onValueChange={(v: OrganizerType) => setFormContent({ ...formContent, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="school">School</SelectItem>
                                    <SelectItem value="government">Government</SelectItem>
                                    <SelectItem value="ngo">NGO</SelectItem>
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Website (Optional)</Label>
                            <Input
                                value={formContent.website}
                                onChange={(e) => setFormContent({ ...formContent, website: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Input
                                value={formContent.description}
                                onChange={(e) => setFormContent({ ...formContent, description: e.target.value })}
                                placeholder="Brief description..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedOrganizer(null)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !formContent.name.trim()}>
                            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {isEditing ? "Update" : "Save"} Organizer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Organizers;
