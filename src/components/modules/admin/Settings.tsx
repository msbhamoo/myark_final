"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    Tag,
    Plus,
    Edit,
    Trash2,
    Save,
    GraduationCap,
    Trophy,
    Globe,
    Briefcase,
    BookOpen,
    Wrench,
    Medal,
    Video,
    Users,
    Sparkles,
    Loader2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OPPORTUNITY_TYPES, type OpportunityTypeConfig } from "@/types/admin";

const iconOptions = [
    { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
    { value: "Trophy", label: "Trophy", icon: Trophy },
    { value: "Globe", label: "Globe", icon: Globe },
    { value: "Briefcase", label: "Briefcase", icon: Briefcase },
    { value: "BookOpen", label: "Book", icon: BookOpen },
    { value: "Wrench", label: "Wrench", icon: Wrench },
    { value: "Medal", label: "Medal", icon: Medal },
    { value: "Video", label: "Video", icon: Video },
    { value: "Users", label: "Users", icon: Users },
    { value: "Sparkles", label: "Sparkles", icon: Sparkles },
];

const colorOptions = [
    { value: "text-green-500", label: "Green" },
    { value: "text-blue-500", label: "Blue" },
    { value: "text-yellow-500", label: "Yellow" },
    { value: "text-purple-500", label: "Purple" },
    { value: "text-cyan-500", label: "Cyan" },
    { value: "text-orange-500", label: "Orange" },
    { value: "text-pink-500", label: "Pink" },
    { value: "text-indigo-500", label: "Indigo" },
    { value: "text-red-500", label: "Red" },
    { value: "text-gray-500", label: "Gray" },
];

const getIconComponent = (iconName: string) => {
    const found = iconOptions.find(opt => opt.value === iconName);
    return found?.icon || Tag;
};

const Settings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Opportunity Types
    const [types, setTypes] = useState<OpportunityTypeConfig[]>(OPPORTUNITY_TYPES);
    const [editingType, setEditingType] = useState<OpportunityTypeConfig | null>(null);
    const [isNewType, setIsNewType] = useState(false);
    const [typeForm, setTypeForm] = useState({
        id: "",
        name: "",
        icon: "Tag",
        color: "text-gray-500",
        description: "",
    });

    // Grades/Classes
    const [grades, setGrades] = useState<number[]>([6, 7, 8, 9, 10, 11, 12]);
    const [newGrade, setNewGrade] = useState("");

    // Tags
    const [tags, setTags] = useState<string[]>(["Coding", "Science", "Math", "Arts", "Sports", "Business", "Leadership"]);
    const [newTag, setNewTag] = useState("");

    // Load settings from Firestore
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Load opportunity types
                const typesDoc = await getDoc(doc(db, "settings", "opportunityTypes"));
                if (typesDoc.exists() && typesDoc.data().types) {
                    setTypes(typesDoc.data().types);
                }

                // Load grades
                const gradesDoc = await getDoc(doc(db, "settings", "grades"));
                if (gradesDoc.exists() && gradesDoc.data().grades) {
                    setGrades(gradesDoc.data().grades);
                }

                // Load tags
                const tagsDoc = await getDoc(doc(db, "settings", "tags"));
                if (tagsDoc.exists() && tagsDoc.data().tags) {
                    setTags(tagsDoc.data().tags);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    // Save all settings
    const saveSettings = async () => {
        setSaving(true);
        try {
            await Promise.all([
                setDoc(doc(db, "settings", "opportunityTypes"), { types }),
                setDoc(doc(db, "settings", "grades"), { grades: grades.sort((a, b) => a - b) }),
                setDoc(doc(db, "settings", "tags"), { tags }),
            ]);

            toast({
                title: "Settings saved",
                description: "All settings have been saved successfully.",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // Opportunity Type handlers
    const openNewTypeDialog = () => {
        setIsNewType(true);
        setTypeForm({
            id: "",
            name: "",
            icon: "Tag",
            color: "text-gray-500",
            description: "",
        });
        setEditingType({} as OpportunityTypeConfig);
    };

    const openEditTypeDialog = (type: OpportunityTypeConfig) => {
        setIsNewType(false);
        setTypeForm({
            id: type.id,
            name: type.name,
            icon: type.icon,
            color: type.color,
            description: type.description,
        });
        setEditingType(type);
    };

    const saveType = () => {
        if (!typeForm.name.trim()) return;

        const typeData: OpportunityTypeConfig = {
            id: typeForm.id || typeForm.name.toLowerCase().replace(/\s+/g, "-"),
            name: typeForm.name,
            icon: typeForm.icon,
            color: typeForm.color,
            description: typeForm.description,
        };

        if (isNewType) {
            setTypes([...types, typeData]);
        } else {
            setTypes(types.map(t => t.id === editingType?.id ? typeData : t));
        }

        setEditingType(null);
    };

    const deleteType = (id: string) => {
        setTypes(types.filter(t => t.id !== id));
    };

    // Grade handlers
    const addGrade = () => {
        const grade = parseInt(newGrade);
        if (grade && !grades.includes(grade) && grade > 0 && grade <= 12) {
            setGrades([...grades, grade].sort((a, b) => a - b));
            setNewGrade("");
        }
    };

    const removeGrade = (grade: number) => {
        setGrades(grades.filter(g => g !== grade));
    };

    // Tag handlers
    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-display">Settings</h2>
                    <p className="text-muted-foreground">Configure opportunity types, classes, and tags</p>
                </div>
                <Button onClick={saveSettings} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Settings
                </Button>
            </div>

            {/* Opportunity Types */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="w-5 h-5" />
                                Opportunity Types
                            </CardTitle>
                            <CardDescription>
                                Configure the types of opportunities available on the platform
                            </CardDescription>
                        </div>
                        <Button onClick={openNewTypeDialog} size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Type
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {types.map((type) => {
                                const Icon = getIconComponent(type.icon);
                                return (
                                    <div
                                        key={type.id}
                                        className="flex items-center justify-between p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-background ${type.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{type.name}</p>
                                                <p className="text-sm text-muted-foreground">{type.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEditTypeDialog(type)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteType(type.id)} className="text-destructive hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Grades/Classes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Classes / Grades
                        </CardTitle>
                        <CardDescription>
                            Configure the student classes/grades for eligibility filtering
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Enter class (1-12)"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addGrade()}
                                className="w-40"
                                min="1"
                                max="12"
                            />
                            <Button onClick={addGrade} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Class
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {grades.map((grade) => (
                                <Badge
                                    key={grade}
                                    variant="secondary"
                                    className="px-4 py-2 text-sm gap-2 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors group"
                                >
                                    Class {grade}
                                    <button
                                        onClick={() => removeGrade(grade)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Tags
                        </CardTitle>
                        <CardDescription>
                            Manage tags used to categorize opportunities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add new tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTag()}
                            />
                            <Button onClick={addTag} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="px-3 py-1.5 text-sm gap-2 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors group"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* General Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Featured Opportunities Limit</Label>
                                <p className="text-sm text-muted-foreground">Maximum number of featured opportunities on homepage</p>
                            </div>
                            <Input type="number" defaultValue="6" className="w-20 text-center" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Auto-close Expired</Label>
                                <p className="text-sm text-muted-foreground">Automatically close opportunities past deadline</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Send email alerts for new demo requests</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Edit Type Dialog */}
            <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isNewType ? "Add New" : "Edit"} Opportunity Type</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Name *</Label>
                            <Input
                                value={typeForm.name}
                                onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                                placeholder="e.g., Scholarship, Workshop"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                value={typeForm.description}
                                onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                                placeholder="Brief description"
                                className="mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Icon</Label>
                                <Select value={typeForm.icon} onValueChange={(v) => setTypeForm({ ...typeForm, icon: v })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map(opt => {
                                            const IconComp = opt.icon;
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComp className="w-4 h-4" />
                                                        {opt.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Color</Label>
                                <Select value={typeForm.color} onValueChange={(v) => setTypeForm({ ...typeForm, color: v })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full ${opt.value.replace('text-', 'bg-')}`} />
                                                    {opt.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingType(null)}>Cancel</Button>
                        <Button onClick={saveType} disabled={!typeForm.name.trim()}>
                            {isNewType ? "Add Type" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Settings;
