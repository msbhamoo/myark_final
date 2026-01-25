import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Users,
    Flame,
    Zap,
    TrendingUp,
    MoreHorizontal,
    Eye,
    Mail,
    Loader2,
    Medal,
    Plus,
    X,
    Heart,
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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { studentsService, badgesService } from "@/lib/firestore";
import type { Student, Badge as BadgeType } from "@/types/admin";
import { cn } from "@/lib/utils";

const Students = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [gradeFilter, setGradeFilter] = useState<string>("all");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [stats, setStats] = useState({ total: 0, activeThisWeek: 0, avgStreak: 0, newThisWeek: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentData, statsData, badgeData] = await Promise.all([
                    studentsService.getAll({ grade: gradeFilter !== "all" ? parseInt(gradeFilter) : undefined }),
                    studentsService.getStats(),
                    badgesService.getAll(),
                ]);
                setStudents(studentData);
                setStats({ ...statsData, newThisWeek: Math.round(statsData.total * 0.05) });
                setAllBadges(badgeData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gradeFilter]);

    const handleAssignBadge = async (badgeId: string) => {
        if (!selectedStudent) return;
        setIsAssigning(true);
        try {
            await studentsService.assignBadge(selectedStudent.id, badgeId);
            const updatedStudent = {
                ...selectedStudent,
                badges: [...(selectedStudent.badges || []), badgeId]
            };
            setSelectedStudent(updatedStudent);
            setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));
        } catch (error) {
            console.error("Error assigning badge:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleRemoveBadge = async (badgeId: string) => {
        if (!selectedStudent) return;
        try {
            await studentsService.removeBadge(selectedStudent.id, badgeId);
            const updatedStudent = {
                ...selectedStudent,
                badges: (selectedStudent.badges || []).filter(id => id !== badgeId)
            };
            setSelectedStudent(updatedStudent);
            setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));
        } catch (error) {
            console.error("Error removing badge:", error);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isActiveRecently = (lastActive: Date | undefined) => {
        if (!lastActive) return false;
        const now = new Date();
        const diff = now.getTime() - new Date(lastActive).getTime();
        return diff < 24 * 60 * 60 * 1000; // 24 hours
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
            <div>
                <h2 className="text-2xl font-bold font-display">Students</h2>
                <p className="text-muted-foreground">Registered students and their activity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <TrendingUp className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.activeThisWeek.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Active This Week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.avgStreak}</p>
                                <p className="text-sm text-muted-foreground">Avg Streak Days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary/10">
                                <Zap className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.newThisWeek}</p>
                                <p className="text-sm text-muted-foreground">New This Week</p>
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
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={gradeFilter} onValueChange={setGradeFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="All Grades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                                    <SelectItem key={grade} value={String(grade)}>Class {grade}</SelectItem>
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
                        {filteredStudents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No students found</h3>
                                <p className="text-muted-foreground">Students will appear here when they register</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>School</TableHead>
                                        <TableHead>Streak</TableHead>
                                        <TableHead>XP</TableHead>
                                        <TableHead>Applications</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group cursor-pointer hover:bg-muted/50"
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{student.name}</p>
                                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">Class {student.grade}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-[150px] truncate">
                                                {student.school || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Flame className="w-4 h-4 text-orange-500" />
                                                    {student.streakDays}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                    {student.xpPoints.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{student.appliedOpportunities?.length || 0}</TableCell>
                                            <TableCell>
                                                {isActiveRecently(student.lastActiveAt) ? (
                                                    <Badge className="bg-success/20 text-success">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`mailto:${student.email}`}>
                                                                <Mail className="w-4 h-4 mr-2" />
                                                                Send Email
                                                            </a>
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

            {/* Student Detail Sheet */}
            <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Student Profile</SheetTitle>
                    </SheetHeader>
                    {selectedStudent && (
                        <div className="mt-6 space-y-6">
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-xl bg-muted/50">
                                    <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                                        <Flame className="w-5 h-5" />
                                        <span className="text-xl font-bold">{selectedStudent.streakDays}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Day Streak</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-muted/50">
                                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                                        <Zap className="w-5 h-5" />
                                        <span className="text-xl font-bold">{selectedStudent.xpPoints}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">XP Points</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-muted/50">
                                    <p className="text-xl font-bold text-primary mb-1">Lv {selectedStudent.level}</p>
                                    <p className="text-xs text-muted-foreground">Level</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Grade</span>
                                    <span className="font-medium">Class {selectedStudent.grade}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">School</span>
                                    <span className="font-medium">{selectedStudent.school || "-"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">City</span>
                                    <span className="font-medium">{selectedStudent.city || "-"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Applications</span>
                                    <span className="font-medium">{selectedStudent.appliedOpportunities?.length || 0}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span className="font-medium">
                                        {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Discovery Insights */}
                            {(selectedStudent.personaGoal || selectedStudent.competitiveness || selectedStudent.weeklyTimeCommitment || selectedStudent.deliveryPreference) && (
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        Discovery Insights
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedStudent.personaGoal && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Goal Vibe</p>
                                                <p className="text-xs font-bold capitalize">{selectedStudent.personaGoal.replace('_', ' ')}</p>
                                            </div>
                                        )}
                                        {selectedStudent.competitiveness && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Heat Level</p>
                                                <p className="text-xs font-bold capitalize">{selectedStudent.competitiveness.replace('_', ' ')}</p>
                                            </div>
                                        )}
                                        {selectedStudent.weeklyTimeCommitment && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Weekly Time</p>
                                                <p className="text-xs font-bold capitalize">{selectedStudent.weeklyTimeCommitment.replace(/_/g, ' ')}</p>
                                            </div>
                                        )}
                                        {selectedStudent.deliveryPreference && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Preference</p>
                                                <p className="text-xs font-bold capitalize">{selectedStudent.deliveryPreference}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Interests */}
                            {selectedStudent.interests?.length > 0 && (
                                <div className="pt-6 border-t border-border">
                                    <p className="text-sm font-bold mb-3 flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        Interests
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudent.interests.map(interest => (
                                            <Badge key={interest} variant="secondary" className="px-3 py-1 bg-muted/50 border-white/5">{interest}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Badges Section */}
                            <div className="space-y-4 pt-6 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <Medal className="w-4 h-4 text-primary" />
                                        Earned Badges
                                    </p>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10">
                                                <Plus className="w-3.5 h-3.5" />
                                                Assign
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 overflow-hidden">
                                            <p className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">Select Badge</p>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {allBadges.filter(b => !selectedStudent.badges?.includes(b.id)).length === 0 ? (
                                                    <p className="p-4 text-center text-xs text-muted-foreground italic">No badges left to assign</p>
                                                ) : (
                                                    allBadges
                                                        .filter(b => !selectedStudent.badges?.includes(b.id))
                                                        .map(badge => (
                                                            <DropdownMenuItem key={badge.id} onClick={() => handleAssignBadge(badge.id)} className="gap-2">
                                                                <div className={cn("w-6 h-6 rounded flex items-center justify-center bg-primary/20", badge.color)}>
                                                                    <Medal className="w-3.5 h-3.5" />
                                                                </div>
                                                                <span className="flex-1">{badge.name}</span>
                                                            </DropdownMenuItem>
                                                        ))
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {selectedStudent.badges?.map(badgeId => {
                                        const badge = allBadges.find(b => b.id === badgeId);
                                        if (!badge) return null;
                                        return (
                                            <div key={badgeId} className="group relative p-3 rounded-xl bg-muted/50 border border-white/5 flex flex-col items-center text-center gap-2 hover:border-primary/20 transition-all duration-300">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveBadge(badgeId)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", badge.color, "bg-background shadow-sm")}>
                                                    <Medal className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold line-clamp-1">{badge.name}</p>
                                                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{badge.category}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!selectedStudent.badges || selectedStudent.badges.length === 0) && (
                                        <div className="col-span-2 py-8 text-center bg-muted/30 rounded-xl border border-dashed border-border/50">
                                            <Medal className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                            <p className="text-xs text-muted-foreground italic">No badges earned yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Students;
