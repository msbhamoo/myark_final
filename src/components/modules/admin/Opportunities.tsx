"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    MoreHorizontal,
    Target,
    Eye,
    Edit,
    Trash2,
    Loader2,
    Calendar,
    Users,
    Zap,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { studentAuthService, type StudentUser } from "@/lib/studentAuthService";
import { useToast } from "@/hooks/use-toast";
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
import { opportunitiesService, settingsService } from "@/lib/firestore";
import { OPPORTUNITY_TYPES, type Opportunity, type OpportunityStatus, type OpportunityTypeConfig } from "@/types/admin";

const statusColors: Record<OpportunityStatus, string> = {
    draft: "bg-yellow-500/20 text-yellow-500",
    published: "bg-success/20 text-success",
    closed: "bg-muted text-muted-foreground",
};

const Opportunities = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [opportunityTypes, setOpportunityTypes] = useState<OpportunityTypeConfig[]>(OPPORTUNITY_TYPES);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [syncingAll, setSyncingAll] = useState(false);
    const [showApplicantsDialog, setShowApplicantsDialog] = useState(false);
    const [applicants, setApplicants] = useState<StudentUser[]>([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [selectedOpp, setSelectedOpp] = useState<{ id: string, title: string } | null>(null);
    const { toast } = useToast();

    const fetchTypes = async () => {
        try {
            const typesData = await settingsService.getOpportunityTypes();
            setOpportunityTypes(typesData.length > 0 ? typesData : OPPORTUNITY_TYPES);
        } catch (error) {
            console.error("Error fetching opportunity types:", error);
        }
    };

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const data = await opportunitiesService.getAll({
                type: typeFilter !== "all" ? typeFilter : undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
            });
            setOpportunities(data);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [typeFilter, statusFilter]);

    const handleSyncAll = async () => {
        setSyncingAll(true);
        try {
            let totalUpdated = 0;
            for (const opp of filteredOpportunities) {
                await opportunitiesService.syncApplicationCount(opp.id);
                totalUpdated++;
            }
            toast({ title: "Counts Synced", description: `Updated verified counts for ${totalUpdated} opportunities.` });
            fetchOpportunities();
        } catch (error) {
            console.error("Bulk sync failed:", error);
            toast({ title: "Error", description: "Bulk sync failed", variant: "destructive" });
        } finally {
            setSyncingAll(false);
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
            toast({ title: "Error", description: "Could not load applicants", variant: "destructive" });
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleOpenApplicants = (opp: Opportunity) => {
        setSelectedOpp({ id: opp.id, title: opp.title });
        setApplicants([]);
        setShowApplicantsDialog(true);
        fetchApplicants(opp.id);
    };

    const filteredOpportunities = opportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this opportunity?")) return;
        try {
            await opportunitiesService.delete(id);
            setOpportunities(opportunities.filter(o => o.id !== id));
        } catch (error) {
            console.error("Error deleting opportunity:", error);
        }
    };

    const getTypeName = (typeId: string) => {
        const type = opportunityTypes.find(t => t.id === typeId);
        return type?.name || typeId;
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
                    <h2 className="text-2xl font-bold font-display">Opportunities</h2>
                    <p className="text-muted-foreground">Manage scholarships, competitions, and more</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 border-secondary/30 text-secondary hover:bg-secondary/10"
                        onClick={handleSyncAll}
                        disabled={syncingAll || loading}
                    >
                        {syncingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Sync Counts
                    </Button>
                    <Button className="gap-2" onClick={() => router.push("/admin/opportunities/new")}>
                        <Plus className="w-4 h-4" />
                        Add Opportunity
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search opportunities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {opportunityTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardContent className="p-0">
                        {filteredOpportunities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Target className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No opportunities yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first opportunity to get started</p>
                                <Button onClick={() => router.push("/admin/opportunities/new")}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Opportunity
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Deadline</TableHead>
                                        <TableHead className="text-right">Applications</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-right">Shares</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOpportunities.map((opp, index) => (
                                        <motion.tr
                                            key={opp.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.push(`/admin/opportunities/${opp.id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {opp.image && (
                                                        <img src={opp.image} alt="" className="w-10 h-10 rounded object-cover" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{opp.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                            {opp.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{getTypeName(opp.type)}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[opp.status]}>{opp.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {opp.dates?.registrationEnd
                                                        ? new Date(opp.dates.registrationEnd).toLocaleDateString()
                                                        : "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Users className="w-3 h-3 text-muted-foreground" />
                                                    <span className="font-medium">{opp.applicationCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Eye className="w-3 h-3 text-muted-foreground" />
                                                    <span className="font-medium">{opp.viewCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Target className="w-3 h-3 text-muted-foreground" />
                                                    <span className="font-medium">{opp.shareCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/admin/opportunities/${opp.id}`);
                                                        }}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenApplicants(opp);
                                                        }}>
                                                            <Users className="w-4 h-4 mr-2" />
                                                            View Applicants
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(opp.id);
                                                            }}
                                                        >
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

            {/* Applicants List Dialog */}
            <Dialog open={showApplicantsDialog} onOpenChange={setShowApplicantsDialog}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 bg-card border-border/50">
                    <DialogHeader className="p-6 border-b border-border/50 bg-muted/30 flex-row items-center justify-between space-y-0">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-display font-bold">Quest Applicants</DialogTitle>
                            <DialogDescription className="text-muted-foreground/80">
                                Verified participants for <span className="text-primary font-medium">"{selectedOpp?.title}"</span>
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => selectedOpp && fetchApplicants(selectedOpp.id)}
                            disabled={loadingApplicants}
                            className="gap-2 h-9 px-3 hover:bg-muted"
                        >
                            {loadingApplicants ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Refresh
                        </Button>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto min-h-[300px]">
                        {loadingApplicants ? (
                            <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground animate-pulse">Summoning applicant list...</p>
                            </div>
                        ) : applicants.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <Users className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-muted-foreground">No heroes found</p>
                                    <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto">This quest hasn't attracted any participants yet. Time for some marketing magic?</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                                        <tr className="border-b border-border/50 shadow-sm">
                                            <th className="px-6 py-4 text-left font-bold text-muted-foreground/70 uppercase tracking-wider text-xs">Student</th>
                                            <th className="px-6 py-4 text-left font-bold text-muted-foreground/70 uppercase tracking-wider text-xs">Contact</th>
                                            <th className="px-6 py-4 text-left font-bold text-muted-foreground/70 uppercase tracking-wider text-xs">Class</th>
                                            <th className="px-6 py-4 text-left font-bold text-muted-foreground/70 uppercase tracking-wider text-xs">Aura (XP)</th>
                                            <th className="px-6 py-4 text-right font-bold text-muted-foreground/70 uppercase tracking-wider text-xs pr-8">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {applicants.map((student) => (
                                            <tr key={student.id} className="transition-all hover:bg-muted/50 group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10 shadow-sm">
                                                            {student.name ? student.name.charAt(0) : "S"}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-foreground text-base leading-tight">{student.name || "Anonymous Student"}</div>
                                                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Level {student.level || 1} Student</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-foreground font-mono text-xs">+91 {student.phone}</div>
                                                    <div className="text-[11px] text-muted-foreground mt-0.5">{student.email || 'No email provided'}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium px-2 py-0">Class {student.grade || "N/A"}</Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5 text-secondary font-black">
                                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                                        {student.xpPoints?.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right pr-8">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary rounded-full px-4"
                                                        onClick={() => {
                                                            setShowApplicantsDialog(false);
                                                            router.push(`/admin/students`);
                                                        }}
                                                    >
                                                        Profile
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 border-t border-border/50 bg-muted/20">
                        <Button variant="outline" className="rounded-full px-6" onClick={() => setShowApplicantsDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Opportunities;
