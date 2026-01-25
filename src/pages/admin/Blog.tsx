import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    MoreHorizontal,
    FileText,
    Eye,
    Edit,
    Trash2,
    Loader2,
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
import { Card, CardContent } from "@/components/ui/card";
import { blogsService } from "@/lib/firestore";
import type { BlogPost, BlogStatus } from "@/types/admin";

const statusColors: Record<BlogStatus, string> = {
    draft: "bg-yellow-500/20 text-yellow-500",
    published: "bg-success/20 text-success",
    archived: "bg-muted text-muted-foreground",
};

const Blog = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogsService.getAll({ status: statusFilter !== "all" ? statusFilter : undefined });
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [statusFilter]);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await blogsService.delete(id);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error("Error deleting blog:", error);
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
                    <h2 className="text-2xl font-bold font-display">Blog Posts</h2>
                    <p className="text-muted-foreground">Manage your blog content</p>
                </div>
                <Button className="gap-2" onClick={() => navigate("/admin/blog/new")}>
                    <Plus className="w-4 h-4" />
                    New Post
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardContent className="p-0">
                        {filteredBlogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FileText className="w-12648 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first blog post to get started</p>
                                <Button onClick={() => navigate("/admin/blog/new")}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Post
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead>Published</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBlogs.map((blog, index) => (
                                        <motion.tr
                                            key={blog.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group cursor-pointer hover:bg-muted/50"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {blog.coverImage && (
                                                        <img src={blog.coverImage} alt="" className="w-10 h-10 rounded object-cover" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{blog.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{blog.excerpt}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{blog.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[blog.status]}>{blog.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{blog.author}</TableCell>
                                            <TableCell className="text-right">{blog.viewCount.toLocaleString()}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/blog/${blog.id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(blog.id)}>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Blog;
