"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Phone,
    Mail,
    MapPin,
    Users,
    MoreHorizontal,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    Loader2,
    Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { schoolDemosService } from "@/lib/firestore";
import type { SchoolDemo, DemoStatus } from "@/types/admin";

const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
    contacted: { label: "Contacted", color: "bg-blue-500/20 text-blue-500", icon: Phone },
    scheduled: { label: "Scheduled", color: "bg-purple-500/20 text-purple-500", icon: Calendar },
    completed: { label: "Completed", color: "bg-success/20 text-success", icon: CheckCircle },
    rejected: { label: "Rejected", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const Schools = () => {
    const [loading, setLoading] = useState(true);
    const [demos, setDemos] = useState<SchoolDemo[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedDemo, setSelectedDemo] = useState<SchoolDemo | null>(null);
    const [notes, setNotes] = useState("");
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [demosData, counts] = await Promise.all([
                    schoolDemosService.getAll({ status: statusFilter !== "all" ? statusFilter : undefined }),
                    schoolDemosService.getCountByStatus(),
                ]);
                setDemos(demosData);
                setStatusCounts(counts);
            } catch (error) {
                console.error("Error fetching demos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [statusFilter]);

    const filteredDemos = demos.filter(demo =>
        demo.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: DemoStatus) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const updateStatus = async (id: string, newStatus: DemoStatus) => {
        try {
            await schoolDemosService.updateStatus(id, newStatus, notes);
            setDemos(demos.map(d => d.id === id ? { ...d, status: newStatus } : d));
            setSelectedDemo(null);
        } catch (error) {
            console.error("Error updating status:", error);
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
                    <h2 className="text-2xl font-bold font-display">School Demo Requests</h2>
                    <p className="text-muted-foreground">Manage demo bookings from schools</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                    const count = statusCounts[status] || 0;
                    const Icon = config.icon;
                    return (
                        <Card key={status} className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => setStatusFilter(status)}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}>
                                        <Icon className={`w-5 h-5 ${config.color.split(" ")[1]}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{count}</p>
                                        <p className="text-sm text-muted-foreground">{config.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search schools..."
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
                                {Object.entries(statusConfig).map(([value, config]) => (
                                    <SelectItem key={value} value={value}>{config.label}</SelectItem>
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
                        {filteredDemos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No demo requests yet</h3>
                                <p className="text-muted-foreground">School demo requests will appear here</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDemos.map((demo, index) => (
                                        <motion.tr
                                            key={demo.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-muted/50 cursor-pointer"
                                            onClick={() => setSelectedDemo(demo)}
                                        >
                                            <TableCell>
                                                <div className="font-medium">{demo.schoolName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium">{demo.contactPerson}</p>
                                                    <p className="text-muted-foreground">{demo.designation}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {demo.city}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="w-3 h-3" />
                                                    {demo.studentCount}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(demo.status)}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {demo.createdAt ? new Date(demo.createdAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setSelectedDemo(demo)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => updateStatus(demo.id, "contacted")}>
                                                            Mark as Contacted
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(demo.id, "scheduled")}>
                                                            Mark as Scheduled
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(demo.id, "completed")}>
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => updateStatus(demo.id, "rejected")}
                                                        >
                                                            Reject
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

            {/* Detail Dialog */}
            <Dialog open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Demo Request Details</DialogTitle>
                    </DialogHeader>
                    {selectedDemo && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{selectedDemo.schoolName}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    {selectedDemo.city}{selectedDemo.state ? `, ${selectedDemo.state}` : ""}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Contact Person</p>
                                    <p className="font-medium">{selectedDemo.contactPerson}</p>
                                    <p className="text-sm text-muted-foreground">{selectedDemo.designation}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Student Count</p>
                                    <p className="font-medium">{selectedDemo.studentCount}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 gap-2" asChild>
                                    <a href={`mailto:${selectedDemo.email}`}>
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </a>
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2" asChild>
                                    <a href={`tel:${selectedDemo.phone}`}>
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </a>
                                </Button>
                            </div>

                            {selectedDemo.message && (
                                <div className="p-4 bg-muted/50 rounded-xl">
                                    <p className="text-sm text-muted-foreground mb-1">Message</p>
                                    <p className="text-sm">{selectedDemo.message}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Add Notes</p>
                                <Textarea
                                    placeholder="Add internal notes about this demo..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Update Status</p>
                                <Select defaultValue={selectedDemo.status} onValueChange={(v) => updateStatus(selectedDemo.id, v as DemoStatus)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(statusConfig).map(([value, config]) => (
                                            <SelectItem key={value} value={value}>{config.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedDemo(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Schools;
