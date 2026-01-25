import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Save,
    X,
    Plus,
    Loader2,
    ChevronLeft,
    Image as ImageIcon,
    Eye,
    Type,
    FileText,
    Tag,
    Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { blogsService } from "@/lib/firestore";
import type { BlogPost, BlogStatus } from "@/types/admin";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from "@/components/ImageUpload";

const CATEGORIES = ["Education", "Career Advice", "Study Tips", "Scholarships", "Student Life", "Technology"];

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        author: "Admin",
        category: "Education",
        tags: [],
        status: "draft" as BlogStatus,
        featured: false,
        viewCount: 0,
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const blog = await blogsService.getById(id);
                    if (blog) {
                        setFormData(blog);
                    } else {
                        toast({
                            title: "Error",
                            description: "Blog post not found",
                            variant: "destructive",
                        });
                        navigate("/admin/blog");
                    }
                } catch (error) {
                    console.error("Error fetching blog:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        }
    }, [id, navigate, toast]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast({
                title: "Validation Error",
                description: "Title and content are required.",
                variant: "destructive",
            });
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
                const updateData = {
                    ...dataToSave,
                };
                // If status is published and it doesn't have a publishedAt, add it
                if (updateData.status === "published" && !updateData.publishedAt) {
                    updateData.publishedAt = new Date();
                }
                await blogsService.update(id, updateData);
            } else {
                await blogsService.create({
                    ...dataToSave,
                    createdAt: new Date(),
                    publishedAt: formData.status === "published" ? new Date() : undefined,
                } as BlogPost);
            }

            toast({
                title: "Success",
                description: `Blog post ${id ? "updated" : "created"} successfully.`,
            });
            navigate("/admin/blog");
        } catch (error) {
            console.error("Error saving blog:", error);
            toast({
                title: "Error",
                description: "Failed to save blog post.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove),
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold font-display">
                            {id ? "Edit Blog Post" : "Create New Blog Post"}
                        </h2>
                        <p className="text-muted-foreground">
                            {id ? "Update your blog content" : "Share a new story with students"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate("/admin/blog")}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Post
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Type className="w-5 h-5" />
                                Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a catchy title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary shown in lists"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2 pb-12">
                                <Label htmlFor="content">Content *</Label>
                                <div className="h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                Publish Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v: BlogStatus) => setFormData({ ...formData, status: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Featured Post</Label>
                                    <p className="text-xs text-muted-foreground">Display at the top of the blog</p>
                                </div>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Taxonomy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tag..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" variant="outline" size="icon" onClick={addTag}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags?.map(tag => (
                                        <Badge key={tag} variant="secondary" className="gap-1">
                                            {tag}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <ImageUpload
                                    label="Cover Image"
                                    value={formData.coverImage || ""}
                                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
