import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { opportunitiesService } from "@/lib/firestore";
import { OPPORTUNITY_TYPES, type Opportunity, type OpportunityStatus } from "@/types/admin";

const statusColors: Record<OpportunityStatus, string> = {
    draft: "bg-yellow-500/20 text-yellow-500",
    published: "bg-success/20 text-success",
    closed: "bg-muted text-muted-foreground",
};

const Opportunities = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        const fetchOpportunities = async () => {
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

        fetchOpportunities();
    }, [typeFilter, statusFilter]);

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
        const type = OPPORTUNITY_TYPES.find(t => t.id === typeId);
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
                <Button className="gap-2" onClick={() => navigate("/admin/opportunities/new")}>
                    <Plus className="w-4 h-4" />
                    Add Opportunity
                </Button>
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
                                {OPPORTUNITY_TYPES.map(type => (
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
                                <Button onClick={() => navigate("/admin/opportunities/new")}>
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
                                            onClick={() => navigate(`/admin/opportunities/${opp.id}`)}
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
                                                    {opp.applicationCount || 0}
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
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/opportunities/${opp.id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(opp.id)}>
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

export default Opportunities;
