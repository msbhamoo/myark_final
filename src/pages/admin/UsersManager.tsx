/**
 * Users Manager - Admin Page
 * Full control over student accounts:
 * - View registration details, last login, session activity
 * - PIN reset, rate-limit management, account blocking
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Users,
    Phone,
    Clock,
    Shield,
    ShieldOff,
    Key,
    LogOut,
    MoreHorizontal,
    Loader2,
    Eye,
    Calendar,
    Smartphone,
    AlertTriangle,
    RefreshCw,
    Zap,
    TrendingUp,
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { studentAuthService, type StudentUser, type SessionInfo } from "@/lib/studentAuthService";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const UsersManager = () => {
    const [users, setUsers] = useState<StudentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<StudentUser | null>(null);
    const [userSessions, setUserSessions] = useState<SessionInfo[]>([]);
    const [showDetailsSheet, setShowDetailsSheet] = useState(false);
    const [showBlockDialog, setShowBlockDialog] = useState(false);
    const [showResetPinDialog, setShowResetPinDialog] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [newPin, setNewPin] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const { toast } = useToast();

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await studentAuthService.getAllUsers({ search: searchQuery });
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Load user sessions when selected
    const handleViewDetails = async (user: StudentUser) => {
        setSelectedUser(user);
        setShowDetailsSheet(true);
        try {
            const sessions = await studentAuthService.getUserSessions(user.id);
            setUserSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    // Block user
    const handleBlockUser = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            await studentAuthService.blockUser(selectedUser.id, blockReason);
            toast({ title: "User Blocked", description: `${selectedUser.phone} has been blocked` });
            setShowBlockDialog(false);
            setBlockReason("");
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to block user", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    // Unblock user
    const handleUnblockUser = async (user: StudentUser) => {
        setActionLoading(true);
        try {
            await studentAuthService.unblockUser(user.id);
            toast({ title: "User Unblocked", description: `${user.phone} has been unblocked` });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to unblock user", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    // Reset PIN
    const handleResetPin = async () => {
        if (!selectedUser || newPin.length !== 4) return;
        setActionLoading(true);
        try {
            await studentAuthService.resetUserPin(selectedUser.id, newPin);
            toast({ title: "PIN Reset", description: `New PIN set for ${selectedUser.phone}` });
            setShowResetPinDialog(false);
            setNewPin("");
        } catch (error) {
            toast({ title: "Error", description: "Failed to reset PIN", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    // Terminate all sessions
    const handleTerminateSessions = async (user: StudentUser) => {
        setActionLoading(true);
        try {
            await studentAuthService.terminateAllUserSessions(user.id);
            toast({ title: "Sessions Terminated", description: "All sessions for this user have been ended" });
            if (selectedUser?.id === user.id) {
                const sessions = await studentAuthService.getUserSessions(user.id);
                setUserSessions(sessions);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to terminate sessions", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    // Format relative time
    const formatRelativeTime = (date?: Date) => {
        if (!date) return "Never";
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    // Get status badge
    const getStatusBadge = (user: StudentUser) => {
        if (user.isBlocked) {
            return <Badge variant="destructive" className="gap-1"><ShieldOff className="w-3 h-3" /> Blocked</Badge>;
        }
        const lastActive = user.lastLoginAt;
        if (!lastActive) {
            return <Badge variant="secondary" className="gap-1">New</Badge>;
        }
        const hoursSinceActive = (Date.now() - lastActive.getTime()) / 3600000;
        if (hoursSinceActive < 1) {
            return <Badge className="gap-1 bg-success/20 text-success border-success/30"><div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online</Badge>;
        }
        if (hoursSinceActive < 24) {
            return <Badge variant="secondary" className="gap-1">Active today</Badge>;
        }
        return <Badge variant="outline" className="gap-1 text-muted-foreground">Away</Badge>;
    };

    // Stats
    const stats = {
        total: users.length,
        active: users.filter(u => {
            const last = u.lastLoginAt;
            return last && (Date.now() - last.getTime()) < 24 * 3600000;
        }).length,
        blocked: users.filter(u => u.isBlocked).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold">Student Users</h1>
                    <p className="text-muted-foreground">Manage student accounts, sessions, and access</p>
                </div>
                <Button variant="outline" onClick={fetchUsers} disabled={loading}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/10">
                            <Zap className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.active}</p>
                            <p className="text-sm text-muted-foreground">Active Today</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-4 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                            <ShieldOff className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.blocked}</p>
                            <p className="text-sm text-muted-foreground">Blocked</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by phone or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>XP / Level</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                                                {user.name?.[0]?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name || "Unnamed"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.grade ? `Class ${user.grade}` : "Grade not set"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-mono">+91 {user.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span className="font-medium">{user.xpPoints}</span>
                                            <span className="text-muted-foreground">/ Lvl {user.level}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            {formatRelativeTime(user.lastLoginAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(user)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowResetPinDialog(true);
                                                }}>
                                                    <Key className="w-4 h-4 mr-2" />
                                                    Reset PIN
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTerminateSessions(user)}>
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    End All Sessions
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {user.isBlocked ? (
                                                    <DropdownMenuItem onClick={() => handleUnblockUser(user)}>
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Unblock User
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowBlockDialog(true);
                                                        }}
                                                    >
                                                        <ShieldOff className="w-4 h-4 mr-2" />
                                                        Block User
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* User Details Sheet */}
            <Sheet open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                    </SheetHeader>
                    {selectedUser && (
                        <div className="space-y-6 py-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                                    {selectedUser.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedUser.name || "Unnamed User"}</h3>
                                    <p className="text-muted-foreground">+91 {selectedUser.phone}</p>
                                    {getStatusBadge(selectedUser)}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4 rounded-xl">
                                    <p className="text-sm text-muted-foreground">XP Points</p>
                                    <p className="text-2xl font-bold text-primary">{selectedUser.xpPoints}</p>
                                </div>
                                <div className="glass-card p-4 rounded-xl">
                                    <p className="text-sm text-muted-foreground">Level</p>
                                    <p className="text-2xl font-bold">{selectedUser.level}</p>
                                </div>
                                <div className="glass-card p-4 rounded-xl">
                                    <p className="text-sm text-muted-foreground">Streak</p>
                                    <p className="text-2xl font-bold">{selectedUser.streakDays} days</p>
                                </div>
                                <div className="glass-card p-4 rounded-xl">
                                    <p className="text-sm text-muted-foreground">Badges</p>
                                    <p className="text-2xl font-bold">{selectedUser.badges.length}</p>
                                </div>
                            </div>

                            {/* Discovery Insights */}
                            {(selectedUser.personaGoal || selectedUser.competitiveness || selectedUser.weeklyTimeCommitment || selectedUser.deliveryPreference) && (
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        Discovery Insights
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedUser.personaGoal && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Goal Vibe</p>
                                                <p className="text-xs font-bold capitalize">{selectedUser.personaGoal.replace('_', ' ')}</p>
                                            </div>
                                        )}
                                        {selectedUser.competitiveness && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Heat Level</p>
                                                <p className="text-xs font-bold capitalize">{selectedUser.competitiveness.replace('_', ' ')}</p>
                                            </div>
                                        )}
                                        {selectedUser.weeklyTimeCommitment && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Weekly Time</p>
                                                <p className="text-xs font-bold capitalize">{selectedUser.weeklyTimeCommitment.replace(/_/g, ' ')}</p>
                                            </div>
                                        )}
                                        {selectedUser.deliveryPreference && (
                                            <div className="p-3 rounded-xl bg-muted/30 border border-white/5">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Preference</p>
                                                <p className="text-xs font-bold capitalize">{selectedUser.deliveryPreference}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Interests */}
                            {selectedUser.interests?.length > 0 && (
                                <div className="space-y-3 pt-6 border-t border-border">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-primary" />
                                        Interests
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.interests.map(interest => (
                                            <Badge key={interest} variant="secondary" className="px-3 py-1 bg-muted/50 border-white/5">{interest}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Registration Info */}
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Registration Details
                                </h4>
                                <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Registered</span>
                                        <span>{selectedUser.createdAt.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created via</span>
                                        <span className="capitalize">{selectedUser.createdVia}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Login</span>
                                        <span>{selectedUser.lastLoginAt?.toLocaleString() || "Never"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Failed Attempts</span>
                                        <span className={selectedUser.failedLoginAttempts > 0 ? "text-destructive font-medium" : ""}>
                                            {selectedUser.failedLoginAttempts}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Sessions */}
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Active Sessions ({userSessions.filter(s => s.isActive).length})
                                </h4>
                                {userSessions.filter(s => s.isActive).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No active sessions</p>
                                ) : (
                                    <div className="space-y-2">
                                        {userSessions.filter(s => s.isActive).map((session) => (
                                            <div key={session.id} className="glass-card p-3 rounded-lg flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{session.browser} / {session.device}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Last active: {formatRelativeTime(session.lastActiveAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Block Reason if blocked */}
                            {selectedUser.isBlocked && selectedUser.blockReason && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-destructive mb-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="font-semibold">Account Blocked</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{selectedUser.blockReason}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowResetPinDialog(true);
                                    }}
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                    Reset PIN
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleTerminateSessions(selectedUser)}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    End Sessions
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Block User Dialog */}
            <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Block User</DialogTitle>
                        <DialogDescription>
                            This will prevent the user from logging in and terminate all active sessions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for blocking</Label>
                            <Textarea
                                placeholder="Enter the reason for blocking this user..."
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBlockUser}
                            disabled={actionLoading || !blockReason.trim()}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Block User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset PIN Dialog */}
            <Dialog open={showResetPinDialog} onOpenChange={setShowResetPinDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset PIN</DialogTitle>
                        <DialogDescription>
                            Set a new 4-digit PIN for this user. They will need to use this PIN to log in.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New PIN (4 digits)</Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={4}
                                placeholder="0000"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="text-center text-2xl tracking-widest font-mono"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowResetPinDialog(false);
                            setNewPin("");
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetPin}
                            disabled={actionLoading || newPin.length !== 4}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Reset PIN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UsersManager;
