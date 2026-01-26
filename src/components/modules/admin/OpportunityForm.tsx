"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Trash2, Image, Calendar, Link as LinkIcon, Plus, Check, ChevronsUpDown, Loader2, Zap, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type Opportunity, type OpportunityType, type OpportunityStatus, type Organizer, type OrganizerType, type OpportunityTypeConfig } from "@/types/admin";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { opportunitiesService, settingsService } from "@/lib/firestore";
import studentAuthService, { type StudentUser } from "@/lib/studentAuthService";
// No hardcoded grades, will fetch from settings
const formatDateForInput = (date: any) => {
    if (!date) return "";
    try {
        const d = date && date.toDate ? date.toDate() : new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0];
    } catch (e) {
        return "";
    }
};

const OpportunityForm = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { toast } = useToast();
    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Opportunity>>({
        title: "",
        type: "scholarship" as OpportunityType,
        shortDescription: "",
        description: "",
        image: "",
        organizer: "",
        location: "",
        link: "",
        eligibility: {
            grades: [],
            requirements: [],
        },
        dates: {
            registrationStart: new Date(),
            registrationEnd: new Date(),
        },
        prizes: {},
        fees: 0,
        tags: "" as any, // Form uses string, Firestore uses array
        status: "draft" as OpportunityStatus,
        featured: false,
        seoConfig: {
            metaTitle: "",
            metaDescription: "",
            aiSummary: "",
            noIndex: false,
            schemaType: 'Scholarship'
        }
    });
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [availableGrades, setAvailableGrades] = useState<number[]>([]);
    const [opportunityTypes, setOpportunityTypes] = useState<OpportunityTypeConfig[]>([]);
    const [feeType, setFeeType] = useState<"free" | "paid">("free");
    // Searchable Select State
    const [open, setOpen] = useState(false);
    // Inline Add State
    const [showAddOrganizer, setShowAddOrganizer] = useState(false);
    const [newOrgForm, setNewOrgForm] = useState({
        name: "",
        type: "school" as OrganizerType,
        website: "",
    });
    const [savingOrg, setSavingOrg] = useState(false);
    const [applicants, setApplicants] = useState<StudentUser[]>([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [showApplicantsDialog, setShowApplicantsDialog] = useState(false);
    const handleChange = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSEOChange = (field: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            seoConfig: {
                ...(prev.seoConfig || {}),
                [field]: value
            }
        }));
    };
    const toggleGrade = (grade: number) => {
        setFormData(prev => ({
            ...prev,
            eligibility: {
                ...prev.eligibility!,
                grades: prev.eligibility?.grades.includes(grade)
                    ? prev.eligibility.grades.filter(g => g !== grade)
                    : [...(prev.eligibility?.grades || []), grade].sort((a, b) => a - b)
            }
        }));
    };
    const handlePreview = () => {
        // Process tags: string -> array
        const currentTags = formData.tags as any;
        const processedTags = typeof currentTags === 'string'
            ? currentTags.split(",").map(t => t.trim()).filter(t => t !== "")
            : currentTags;
        const previewData = {
            ...formData,
            id: id || "preview",
            tags: processedTags,
            updatedAt: new Date(),
        };
        sessionStorage.setItem("opportunity_preview", JSON.stringify(previewData));
        window.open(`/opportunities/${id || 'preview'}?preview=true`, "_blank");
    };
    const fetchOrganizers = async () => {
        try {
            const orgs = await settingsService.getOrganizers();
            setOrganizers(orgs);
        } catch (error) {
            console.error("Error fetching organizers:", error);
        }
    };
    const fetchInitialData = async () => {
        try {
            // Load grades from settings
            const gradesData = await settingsService.getGrades();
            setAvailableGrades(gradesData);
            // Load opportunity types from settings
            const typesData = await settingsService.getOpportunityTypes();
            setOpportunityTypes(typesData.length > 0 ? typesData : []);
            // Fetch organizers
            const orgs = await settingsService.getOrganizers();
            setOrganizers(orgs);
            if (id) {
                const data = await opportunitiesService.getById(id);
                if (data) {
                    // Convert tags array to string for the form
                    const tagsString = Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || "");
                    setFormData({
                        ...data,
                        tags: tagsString as any
                    });
                    setFeeType(data.fees && data.fees > 0 ? "paid" : "free");
                } else {
                    toast({ title: "Error", description: "Opportunity not found", variant: "destructive" });
                    router.push("/admin/opportunities");
                }
            }
        } catch (error) {
            console.error("Error loading initial data:", error);
        } finally {
            setLoading(false);
        }

        if (id) {
            fetchApplicants(id);
        }
    };

    const fetchApplicants = async (oppId: string) => {
        setLoadingApplicants(true);
        try {
            const allUsers = await studentAuthService.getAllUsers();
            const filtered = allUsers.filter(user =>
                user.appliedOpportunities?.includes(oppId)
            );
            setApplicants(filtered);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        } finally {
            setLoadingApplicants(false);
        }
    };
    useEffect(() => {
        fetchInitialData();
    }, [id, router, toast]);
    const handleAddOrganizer = async () => {
        if (!newOrgForm.name.trim()) return;
        setSavingOrg(true);
        try {
            await settingsService.saveOrganizer(newOrgForm);
            await fetchOrganizers();
            handleChange("organizer", newOrgForm.name);
            setShowAddOrganizer(false);
            setNewOrgForm({ name: "", type: "school", website: "" });
            toast({ title: "Success", description: "Organizer added and selected" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to add organizer", variant: "destructive" });
        } finally {
            setSavingOrg(false);
        }
    };

    const handleSyncCount = async () => {
        if (!id) return;
        setLoadingApplicants(true);
        try {
            const count = await opportunitiesService.syncApplicationCount(id);
            setFormData(prev => ({ ...prev, applicationCount: count }));
            await fetchApplicants(id);
            toast({ title: "Counts Synced", description: `Found ${count} verified applications.` });
        } catch (error) {
            console.error("Sync failed:", error);
            toast({ title: "Sync Failed", description: "Database error.", variant: "destructive" });
        } finally {
            setLoadingApplicants(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            toast({ title: "Validation Error", description: "Title is required", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            // Process tags: string -> array
            const currentTags = formData.tags as any;
            const processedTags = typeof currentTags === 'string'
                ? currentTags.split(",").map(t => t.trim()).filter(t => t !== "")
                : currentTags;
            // Omit technical fields from update to prevent overwriting with stale counts
            const {
                id: _id,
                applicationCount,
                hypeCount,
                viewCount,
                shareCount,
                createdAt,
                updatedAt,
                ...updateableData
            } = formData;

            const finalData = {
                ...updateableData,
                tags: processedTags
            };

            if (id) {
                await opportunitiesService.update(id, finalData as any);
                toast({ title: "Updated", description: "Opportunity updated successfully" });
            } else {
                await opportunitiesService.create(finalData as any);
                toast({ title: "Created", description: "Opportunity created successfully" });
            }
            router.push("/admin/opportunities");
        } catch (error) {
            console.error("Error saving opportunity:", error);
            toast({ title: "Error", description: "Failed to save opportunity", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/opportunities")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold font-display">
                            {isEditing ? "Edit Opportunity" : "Add New Opportunity"}
                        </h2>
                        <p className="text-muted-foreground">Fill in the details below</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={handlePreview}>
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                    <Button className="gap-2" onClick={handleSubmit} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        <Save className="w-4 h-4" />
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Google Code-In 2024"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="type">Type *</Label>
                                    <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opportunityTypes.map(type => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    <span className={type.color}>{type.name}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="organizer">Organizer *</Label>
                                    <div className="flex gap-2 items-start mt-1">
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between font-normal bg-muted/50 border-transparent hover:bg-muted/80"
                                                >
                                                    {formData.organizer || "Select organizer..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search organizer..." />
                                                    <CommandList>
                                                        <CommandEmpty>No organizer found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {organizers.map((org) => (
                                                                <CommandItem
                                                                    key={org.id}
                                                                    value={org.name}
                                                                    onSelect={(currentValue) => {
                                                                        handleChange("organizer", currentValue);
                                                                        setOpen(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            formData.organizer === org.name ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {org.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => setShowAddOrganizer(true)}
                                            title="Add New Organizer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase">Manage in sidebar</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="shortDescription">Short Description *</Label>
                                    <Textarea
                                        id="shortDescription"
                                        placeholder="Brief summary (shown in cards)"
                                        value={formData.shortDescription}
                                        onChange={(e) => handleChange("shortDescription", e.target.value)}
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Details */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="pb-12">
                                <Label htmlFor="description">Full Description</Label>
                                <div className="h-[300px] mt-1 text-black">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(content) => handleChange("description", content)}
                                        className="h-full rounded-xl overflow-hidden"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2 space-y-4 pt-4 border-t">
                                    <ImageUpload
                                        label="Featured Image"
                                        value={formData.image || ""}
                                        onChange={(url) => handleChange("image", url)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="link">Apply Link</Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="link"
                                            placeholder="https://..."
                                            value={formData.link}
                                            onChange={(e) => handleChange("link", e.target.value)}
                                        />
                                        <Button type="button" variant="outline" size="icon">
                                            <LinkIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Online, Delhi, Pan India"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        placeholder="e.g., coding, science, math"
                                        value={formData.tags}
                                        onChange={(e) => handleChange("tags", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Eligibility */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Eligibility</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Eligible Grades</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {availableGrades.map(grade => (
                                        <button
                                            key={grade}
                                            type="button"
                                            onClick={() => toggleGrade(grade)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${formData.eligibility?.grades.includes(grade)
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-muted/50 border-border hover:border-primary/50"
                                                }`}
                                        >
                                            Class {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t">
                                <div>
                                    <Label htmlFor="maxAge">Maximum Age (Optional)</Label>
                                    <Input
                                        id="maxAge"
                                        type="number"
                                        placeholder="e.g., 18"
                                        value={formData.eligibility?.maxAge || ""}
                                        onChange={(e) => handleChange("eligibility", { ...formData.eligibility, maxAge: Number(e.target.value) })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="pb-12 border-t pt-6">
                                <Label htmlFor="eligibilityDescription">Detailed Eligibility (Entrance Rights)</Label>
                                <div className="h-[250px] mt-1 text-black">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.eligibility?.description || ""}
                                        onChange={(content) => handleChange("eligibility", { ...formData.eligibility, description: content })}
                                        className="h-full rounded-xl overflow-hidden"
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                        placeholder="Outline specific requirements, age limits, or criteria..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Dates */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="registrationStart">Registration Start</Label>
                                    <Input
                                        id="registrationStart"
                                        type="date"
                                        value={formatDateForInput(formData.dates?.registrationStart)}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, registrationStart: e.target.value ? new Date(e.target.value) : null })}
                                        className="mt-1"
                                    />
                                    <Input
                                        placeholder="Custom text (e.g. Ongoing)"
                                        value={formData.dates?.registrationStartDescription || ""}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, registrationStartDescription: e.target.value })}
                                        className="mt-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="registrationEnd">Registration End *</Label>
                                    <Input
                                        id="registrationEnd"
                                        type="date"
                                        value={formatDateForInput(formData.dates?.registrationEnd)}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, registrationEnd: e.target.value ? new Date(e.target.value) : null })}
                                        className="mt-1"
                                    />
                                    <Input
                                        placeholder="Custom text (e.g. No deadline)"
                                        value={formData.dates?.registrationEndDescription || ""}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, registrationEndDescription: e.target.value })}
                                        className="mt-2 text-xs"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="eventDate">Event Date (Optional)</Label>
                                    <Input
                                        id="eventDate"
                                        type="date"
                                        value={formatDateForInput(formData.dates?.eventDate)}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, eventDate: e.target.value ? new Date(e.target.value) : null })}
                                        className="mt-1"
                                    />
                                    <Input
                                        placeholder="Custom text (e.g. January 2026)"
                                        value={formData.dates?.eventDateDescription || ""}
                                        onChange={(e) => handleChange("dates", { ...formData.dates, eventDateDescription: e.target.value })}
                                        className="mt-2 text-xs"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Date when the exams, competition or workshop actually takes place.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Prizes & Fees */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Prizes & Fees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <Label>Fee Type</Label>
                                    <div className="flex bg-muted rounded-xl p-1 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => { setFeeType("free"); handleChange("fees", 0); }}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${feeType === "free" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFeeType("paid")}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${feeType === "paid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                                        >
                                            Paid
                                        </button>
                                    </div>
                                </div>
                                {feeType === "paid" && (
                                    <div>
                                        <Label htmlFor="fees">Registration Fee (₹₹)</Label>
                                        <Input
                                            id="fees"
                                            type="number"
                                            placeholder="Amount"
                                            value={formData.fees}
                                            onChange={(e) => handleChange("fees", Number(e.target.value))}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="prizeFirst">1st Prize</Label>
                                    <Input
                                        id="prizeFirst"
                                        placeholder="e.g., ₹₹50,000"
                                        value={formData.prizes?.first}
                                        onChange={(e) => handleChange("prizes", { ...formData.prizes, first: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prizeSecond">2nd Prize</Label>
                                    <Input
                                        id="prizeSecond"
                                        placeholder="e.g., ₹₹25,000"
                                        value={formData.prizes?.second}
                                        onChange={(e) => handleChange("prizes", { ...formData.prizes, second: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prizeThird">3rd Prize</Label>
                                    <Input
                                        id="prizeThird"
                                        placeholder="e.g., ₹₹10,000"
                                        value={formData.prizes?.third}
                                        onChange={(e) => handleChange("prizes", { ...formData.prizes, third: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prizeOther">Other Perks / Prizes</Label>
                                    <Input
                                        id="prizeOther"
                                        placeholder="e.g., Swags, Internships"
                                        value={formData.prizes?.other}
                                        onChange={(e) => handleChange("prizes", { ...formData.prizes, other: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">Certificates Provided</Label>
                                        <p className="text-xs text-muted-foreground italic">Students get a verified certificate</p>
                                    </div>
                                    <Switch
                                        checked={formData.prizes?.certificates || false}
                                        onCheckedChange={(v) => handleChange("prizes", { ...formData.prizes, certificates: v })}
                                    />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-2">
                                    <Label htmlFor="xpValue" className="flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-secondary fill-secondary" />
                                        XP Points Awarded
                                    </Label>
                                    <Input
                                        id="xpValue"
                                        type="number"
                                        placeholder="e.g., 500"
                                        value={formData.xpValue || ""}
                                        onChange={(e) => handleChange("xpValue", Number(e.target.value))}
                                        className="mt-1 font-bold text-secondary"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1 italic uppercase tracking-wider">Redeemable with brand collaborations</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* SEO & AI Discovery */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                SEO & AI Discovery (GEO/AEO)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label htmlFor="metaTitle">Custom Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        placeholder="Leave blank to use opportunity title"
                                        value={formData.seoConfig?.metaTitle || ""}
                                        onChange={(e) => handleSEOChange("metaTitle", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        placeholder="Brief summary for Google results"
                                        value={formData.seoConfig?.metaDescription || ""}
                                        onChange={(e) => handleSEOChange("metaDescription", e.target.value)}
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="aiSummary">AI Quick Summary (Distilled for LLMs)</Label>
                                    <Textarea
                                        id="aiSummary"
                                        placeholder="Factual, concise summary for ChatGPT/Gemini to cite..."
                                        value={formData.seoConfig?.aiSummary || ""}
                                        onChange={(e) => handleSEOChange("aiSummary", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">This version is prioritized by AI models during semantic search.</p>
                                </div>
                                <div>
                                    <Label htmlFor="schemaType">Structured Data Type</Label>
                                    <Select
                                        value={formData.seoConfig?.schemaType || "Scholarship"}
                                        onValueChange={(v) => handleSEOChange("schemaType", v)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Scholarship">Scholarship</SelectItem>
                                            <SelectItem value="EducationEvent">Competition/Event</SelectItem>
                                            <SelectItem value="Course">Workshop/Course</SelectItem>
                                            <SelectItem value="FAQPage">Help/FAQ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                                    <Input
                                        id="canonicalUrl"
                                        placeholder="https://myark.in/..."
                                        value={formData.seoConfig?.canonicalUrl || ""}
                                        onChange={(e) => handleSEOChange("canonicalUrl", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="sm:col-span-2 flex items-center justify-between p-4 bg-background rounded-xl border border-primary/10">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">Hide from Search Engines</Label>
                                        <p className="text-xs text-muted-foreground">Sets robots to 'noindex'</p>
                                    </div>
                                    <Switch
                                        checked={formData.seoConfig?.noIndex || false}
                                        onCheckedChange={(v) => handleSEOChange("noIndex", v)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Status</Label>
                                    <p className="text-sm text-muted-foreground">Control visibility of this opportunity</p>
                                </div>
                                <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured</Label>
                                    <p className="text-sm text-muted-foreground">Show in featured section on homepage</p>
                                </div>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={(v) => handleChange("featured", v)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/admin/opportunities")}>
                        Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <Button type="button" variant="destructive" className="gap-2" onClick={() => {
                                if (confirm("Are you sure?")) {
                                    opportunitiesService.delete(id).then(() => router.push("/admin/opportunities"));
                                }
                            }}>
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        )}
                        <Button type="submit" className="gap-2" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            <Save className="w-4 h-4" />
                            {isEditing ? "Update Opportunity" : "Create Opportunity"}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Applicants List */}
            {isEditing && (
                <div className="mt-8 pt-8 border-t border-border/50">
                    <div className="glass-card p-6 rounded-2xl flex items-center justify-between bg-secondary/5 border-secondary/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Quest Participants</h3>
                                <p className="text-sm text-muted-foreground">{applicants.length} heroes have joined this opportunity</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleSyncCount}
                                disabled={loadingApplicants}
                                className="border-secondary/30 text-secondary hover:bg-secondary/10"
                            >
                                {loadingApplicants ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                Sync DB
                            </Button>
                            <Button
                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                onClick={() => setShowApplicantsDialog(true)}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Applicants
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants List Dialog */}
            <Dialog open={showApplicantsDialog} onOpenChange={setShowApplicantsDialog}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 border-secondary/20 bg-card">
                    <DialogHeader className="p-6 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-display font-bold">Quest Applicants</DialogTitle>
                                <DialogDescription>Verified students for "{formData.title}"</DialogDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchApplicants(id)}
                                disabled={loadingApplicants}
                                className="gap-2"
                            >
                                {loadingApplicants ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Refresh
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-0">
                        {applicants.length === 0 ? (
                            <div className="py-20 text-center">
                                <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">No heroes have stepped forward yet.</p>
                                <p className="text-sm text-muted-foreground/60">Share this quest to attract participants!</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-muted z-10">
                                    <tr className="border-b border-border/50">
                                        <th className="px-6 py-4 text-left font-bold text-muted-foreground">Student</th>
                                        <th className="px-6 py-4 text-left font-bold text-muted-foreground">Contact</th>
                                        <th className="px-6 py-4 text-left font-bold text-muted-foreground">Class</th>
                                        <th className="px-6 py-4 text-left font-bold text-muted-foreground">Aura (XP)</th>
                                        <th className="px-6 py-4 text-right font-bold text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {applicants.map((student) => (
                                        <tr key={student.id} className="transition-colors hover:bg-muted/30 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border border-primary/10">
                                                        {student.name ? student.name.charAt(0) : "S"}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground">{student.name || "Anonymous Student"}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Level {student.level || 1}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-foreground font-mono">+91 {student.phone}</div>
                                                <div className="text-xs text-muted-foreground">ID: {student.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="bg-muted border-primary/10">Class {student.grade || "N/A"}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-secondary font-bold">
                                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                                    {student.xpPoints?.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => router.push(`/admin/students`)}
                                                >
                                                    View User
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <DialogFooter className="p-4 border-t border-border/50 bg-muted/10">
                        <Button variant="ghost" onClick={() => setShowApplicantsDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quick Add Organizer Dialog */}
            <Dialog open={showAddOrganizer} onOpenChange={setShowAddOrganizer}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Organizer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Organizer Name *</Label>
                            <Input
                                value={newOrgForm.name}
                                onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                                placeholder="e.g., Delhi Public School"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={newOrgForm.type}
                                onValueChange={(v: OrganizerType) => setNewOrgForm({ ...newOrgForm, type: v })}
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddOrganizer(false)}>Cancel</Button>
                        <Button onClick={handleAddOrganizer} disabled={savingOrg || !newOrgForm.name.trim()}>
                            {savingOrg && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Add Organizer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default OpportunityForm;