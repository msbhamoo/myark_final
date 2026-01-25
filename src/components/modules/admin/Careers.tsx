"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    MoreHorizontal,
    Briefcase,
    Edit,
    Trash2,
    Eye,
    Loader2,
    GraduationCap,
    IndianRupee,
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
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Career profile type based on actual Firestore data
interface CareerProfile {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    categoryColor: string;
    degrees: string[];
    collegesIndia: string[];
    collegesGlobal: string[];
    exams: string[];
    keywords: string[];
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    roadmap: Array<{ title: string; description: string }>;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const Careers = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [careers, setCareers] = useState<CareerProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const q = query(collection(db, "careers"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                    updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
                })) as CareerProfile[];

                setCareers(data);

                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(c => c.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching careers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);

    const filteredCareers = careers.filter(career => {
        const matchesSearch =
            career.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === "all" || career.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this career profile?")) return;
        try {
            await deleteDoc(doc(db, "careers", id));
            setCareers(careers.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting career:", error);
        }
    };

    const formatSalary = (salary: CareerProfile["salary"]) => {
        if (!salary) return "-";
        const min = salary.min || 0;
        const max = salary.max || 0;
        if (min === 0 && max === 0) return "-";
        return `��${min}L - ��${max}L`;
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
                    <h2 className="text-2xl font-bold font-display">Career Profiles</h2>
                    <p className="text-muted-foreground">Manage career paths and roadmaps for students</p>
                </div>
                <Button className="gap-2" onClick={() => router.push("/admin/careers/new")}>
                    <Plus className="w-4 h-4" />
                    Add Career
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{careers.length}</p>
                                <p className="text-sm text-muted-foreground">Total Careers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary/10">
                                <GraduationCap className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{categories.length}</p>
                                <p className="text-sm text-muted-foreground">Categories</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search careers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardContent className="p-0">
                        {filteredCareers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No career profiles found</h3>
                                <p className="text-muted-foreground mb-4">Create career profiles for students to explore</p>
                                <Button onClick={() => router.push("/admin/careers/new")}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Career
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Career Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Degrees</TableHead>
                                        <TableHead>Salary Range</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCareers.map((career, index) => (
                                        <motion.tr
                                            key={career.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.push(`/admin/careers/${career.id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {career.images?.[0] && (
                                                        <img src={career.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{career.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                                                            {career.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={career.categoryColor || "bg-muted"}>
                                                    {career.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {career.degrees?.slice(0, 2).map((deg, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs">
                                                            {deg}
                                                        </Badge>
                                                    ))}
                                                    {career.degrees?.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{career.degrees.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <IndianRupee className="w-3 h-3" />
                                                    {formatSalary(career.salary)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {career.updatedAt ? new Date(career.updatedAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/careers/${career.id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.open(`/careers/${career.slug}`, "_blank")}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Live
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(career.id)}>
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

export default Careers;
