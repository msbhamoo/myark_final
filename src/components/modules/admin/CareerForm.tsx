"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    X,
    Loader2,
    ChevronLeft,
    Plus,
    Trash2,
    Briefcase,
    GraduationCap,
    IndianRupee,
    MapPin,
    ListChecks,
    AlertCircle,
    Lightbulb,
    Image as ImageIcon,
    Link,
    Milestone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { careersService } from "@/lib/firestore";
import type { Career } from "@/types/admin";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import ImageUpload from "@/components/ImageUpload";



const CATEGORY_COLORS = [
    { label: "Engineering (Orange)", value: "bg-orange-100 text-orange-700" },
    { label: "Medical (Red)", value: "bg-red-100 text-red-700" },
    { label: "Arts (Purple)", value: "bg-purple-100 text-purple-700" },
    { label: "Commerce (Blue)", value: "bg-blue-100 text-blue-700" },
    { label: "Science (Green)", value: "bg-green-100 text-green-700" },
];

const CareerForm = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Career>>({
        title: "",
        slug: "",
        category: "",
        categoryColor: "bg-orange-100 text-orange-700",
        shortDescription: "",
        fullDescription: "",
        challenges: [],
        collegesGlobal: [],
        collegesIndia: [],
        degrees: [],
        didYouKnow: [],
        exams: [],
        goodStuff: [],
        images: [],
        keywords: [],
        relatedCareers: [],
        roadmap: [{ title: "", description: "" }],
        salary: {
            min: 0,
            max: 0,
            currency: "INR",
            entry: "0",
            mid: "0",
            senior: "0",
            salaryNote: "",
        },
    });

    useEffect(() => {
        if (id) {
            const fetchCareer = async () => {
                try {
                    const data = await careersService.getById(id);
                    if (data) {
                        setFormData(data);
                    } else {
                        toast({ title: "Error", description: "Career not found", variant: "destructive" });
                        router.push("/admin/careers");
                    }
                } catch (error) {
                    console.error("Error fetching career:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCareer();
        }
    }, [id, router, toast]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            toast({ title: "Error", description: "Title is required", variant: "destructive" });
            return;
        }

        setSaving(true);
        try {
            const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");
            const dataToSave = {
                ...formData,
                slug,
                updatedAt: new Date(),
            };

            if (id) {
                await careersService.update(id, dataToSave as any);
            } else {
                await careersService.create(dataToSave as any);
            }

            toast({ title: "Success", description: `Career profile ${id ? "updated" : "created"}` });
            router.push("/admin/careers");
        } catch (error) {
            console.error("Error saving:", error);
            toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleArrayUpdate = (field: keyof Career, value: string, index?: number) => {
        setFormData(prev => {
            const currentArray = [...(prev[field] as any[])];
            if (typeof index === "number") {
                currentArray[index] = value;
            } else {
                currentArray.push(value);
            }
            return { ...prev, [field]: currentArray };
        });
    };

    const removeItem = (field: keyof Career, index: number) => {
        setFormData(prev => {
            const currentArray = [...(prev[field] as any[])];
            currentArray.splice(index, 1);
            return { ...prev, [field]: currentArray };
        });
    };

    const updateRoadmap = (index: number, key: "title" | "description", value: string) => {
        setFormData(prev => {
            const roadmap = [...(prev.roadmap || [])];
            roadmap[index] = { ...roadmap[index], [key]: value };
            return { ...prev, roadmap };
        });
    };

    const ArrayInputSection = ({ title, field, icon: Icon, placeholder }: { title: string, field: keyof Career, icon: any, placeholder: string }) => {
        const [newItem, setNewItem] = useState("");
        return (
            <Card className="h-full">
                <CardHeader className="py-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder={placeholder}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), newItem.trim() && (handleArrayUpdate(field, newItem), setNewItem("")))}
                        />
                        <Button size="icon" variant="outline" type="button" onClick={() => { if (newItem.trim()) { handleArrayUpdate(field, newItem); setNewItem(""); } }}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(formData[field] as string[] || []).map((item, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 pr-1">
                                {item}
                                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeItem(field, i)} />
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/careers")}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold font-display">{id ? "Edit Career Profile" : "New Career Profile"}</h2>
                        <p className="text-muted-foreground">Define paths, salaries, and roadmaps</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.push("/admin/careers")}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile
                    </Button>
                </div>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" />Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Career Title *</Label>
                                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., 3D House Printing Engineer" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Engineering" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Short Description</Label>
                                <Textarea value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="h-20" />
                            </div>
                            <div className="space-y-2 pb-12">
                                <Label>Full Description</Label>
                                <div className="h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.fullDescription}
                                        onChange={(content) => setFormData({ ...formData, fullDescription: content })}
                                        className="h-full rounded-2xl overflow-hidden"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roadmap */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-lg flex items-center gap-2"><Milestone className="w-5 h-5" />Career Roadmap</CardTitle>
                            <Button type="button" size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, roadmap: [...(prev.roadmap || []), { title: "", description: "" }] }))}>
                                <Plus className="w-4 h-4 mr-1" /> Add Step
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.roadmap?.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start p-4 rounded-xl border bg-muted/30 relative group">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">{i + 1}</div>
                                    <div className="flex-1 space-y-3">
                                        <Input value={step.title} onChange={(e) => updateRoadmap(i, "title", e.target.value)} placeholder="Step Title (e.g., Undergraduate)" />
                                        <Textarea value={step.description} onChange={(e) => updateRoadmap(i, "description", e.target.value)} placeholder="What to do in this stage..." />
                                    </div>
                                    <Button type="button" size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeItem("roadmap", i)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Grid sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ArrayInputSection title="Indian Colleges" field="collegesIndia" icon={MapPin} placeholder="e.g., IIT Madras" />
                        <ArrayInputSection title="Global Colleges" field="collegesGlobal" icon={MapPin} placeholder="e.g., TU Eindhoven" />
                        <ArrayInputSection title="Degrees Required" field="degrees" icon={GraduationCap} placeholder="e.g., B.Tech Civil" />
                        <ArrayInputSection title="Entrance Exams" field="exams" icon={ListChecks} placeholder="e.g., GATE" />
                        <ArrayInputSection title="Good Stuff (Pros)" field="goodStuff" icon={Lightbulb} placeholder="Why this career is great..." />
                        <ArrayInputSection title="Challenges (Cons)" field="challenges" icon={AlertCircle} placeholder="Current difficulties..." />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Salary */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" />Salary (Lakhs INR)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Min (LPA)</Label>
                                    <Input type="number" value={formData.salary?.min} onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary!, min: Number(e.target.value) } })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max (LPA)</Label>
                                    <Input type="number" value={formData.salary?.max} onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary!, max: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Salary Note</Label>
                                <Input value={formData.salary?.salaryNote} onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary!, salaryNote: e.target.value } })} placeholder="e.g., Varies by location" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories & Visuals */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm font-medium">Tagging & Visuals</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category Color</Label>
                                <Select value={formData.categoryColor} onValueChange={(v) => setFormData({ ...formData, categoryColor: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_COLORS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Keywords</Label>
                                <div className="flex gap-2">
                                    <Input id="kw" placeholder="Add keyword..." onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const val = (e.target as HTMLInputElement).value.trim();
                                            if (val) {
                                                handleArrayUpdate("keywords", val);
                                                (e.target as HTMLInputElement).value = "";
                                            }
                                        }
                                    }} />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {formData.keywords?.map((k, i) => (
                                        <Badge key={i} variant="outline" className="text-[10px]">{k}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-sm font-bold uppercase tracking-widest text-primary">Gallery Assets</Label>
                                <div className="grid grid-cols-1 gap-6">
                                    {formData.images?.map((url, i) => (
                                        <div key={i} className="relative glass-card p-4 border-white/10 group">
                                            <div className="absolute -top-2 -right-2 z-20">
                                                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => removeItem("images", i)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <ImageUpload
                                                value={url}
                                                onChange={(newUrl) => handleArrayUpdate("images", newUrl, i)}
                                                className="mt-0"
                                            />
                                        </div>
                                    ))}
                                    <Button type="button" variant="hero" size="lg" className="h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => handleArrayUpdate("images", "")}>
                                        <Plus className="w-5 h-5 mr-2" /> Add Asset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

// Re-using some shadcn-like components locally for brevity
const Select = ({ children, value, onValueChange }: any) => {
    const [open, setOpen] = useState(false);
    return <div className="relative">
        <div onClick={() => setOpen(!open)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
            <span className="truncate">{CATEGORY_COLORS.find(c => c.value === value)?.label || "Select color"}</span>
            <ChevronLeft className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-90" : "-rotate-90"}`} />
        </div>
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-12 left-0 w-full z-50 rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-1">
                        {CATEGORY_COLORS.map(c => (
                            <div key={c.value} onClick={() => { onValueChange(c.value); setOpen(false); }} className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${value === c.value ? "bg-accent" : ""}`}>
                                {c.label}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>;
};

const SelectTrigger = ({ children }: any) => children;
const SelectValue = ({ children }: any) => children;
const SelectContent = ({ children }: any) => children;
const SelectItem = ({ children }: any) => children;

export default CareerForm;
