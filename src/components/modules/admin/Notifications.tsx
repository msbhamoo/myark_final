"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Send,
    Bell,
    Users,
    Clock,
    CheckCircle,
    Eye,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { notificationsService, studentsService } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Notification } from "@/types/admin";

const Notifications = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [target, setTarget] = useState<string>("all");
    const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [grades, setGrades] = useState<number[]>([6, 7, 8, 9, 10, 11, 12]);
    const [interests, setInterests] = useState<string[]>(["Science", "Math", "Coding", "Arts", "Sports"]);
    const [studentStats, setStudentStats] = useState({ total: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifsData, statsData] = await Promise.all([
                    notificationsService.getAll(),
                    studentsService.getStats(),
                ]);
                setNotifications(notifsData);
                setStudentStats({ total: statsData.total });

                // Load grades and interests from settings
                const [gradesDoc, interestsDoc] = await Promise.all([
                    getDoc(doc(db, "settings", "grades")),
                    getDoc(doc(db, "settings", "tags")),
                ]);

                if (gradesDoc.exists() && gradesDoc.data().grades) {
                    setGrades(gradesDoc.data().grades);
                }
                if (interestsDoc.exists() && interestsDoc.data().tags) {
                    setInterests(interestsDoc.data().tags);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleGrade = (grade: number) => {
        setSelectedGrades(prev =>
            prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
        );
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const getEstimatedReach = () => {
        if (target === "all") return `~${studentStats.total.toLocaleString()} students`;
        if (target === "by-grade" && selectedGrades.length > 0) {
            return `~${(selectedGrades.length * Math.round(studentStats.total / grades.length)).toLocaleString()} students`;
        }
        if (target === "by-interest" && selectedInterests.length > 0) {
            return `~${(selectedInterests.length * Math.round(studentStats.total / interests.length / 2)).toLocaleString()} students`;
        }
        return "Select audience";
    };

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;

        setSending(true);
        try {
            await notificationsService.send({
                title,
                message,
                target: target as "all" | "by-grade" | "by-interest",
                targetCriteria: {
                    grades: target === "by-grade" ? selectedGrades : undefined,
                    interests: target === "by-interest" ? selectedInterests : undefined,
                },
                sentCount: parseInt(getEstimatedReach().replace(/[^0-9]/g, "")) || 0,
                openedCount: 0,
            });

            toast({
                title: "Notification sent!",
                description: `Sent to ${getEstimatedReach()}`,
            });

            // Reset form
            setTitle("");
            setMessage("");
            setTarget("all");
            setSelectedGrades([]);
            setSelectedInterests([]);

            // Refresh notifications
            const updated = await notificationsService.getAll();
            setNotifications(updated);
        } catch (error) {
            console.error("Error sending notification:", error);
            toast({
                title: "Error",
                description: "Failed to send notification",
                variant: "destructive",
            });
        } finally {
            setSending(false);
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
            <div>
                <h2 className="text-2xl font-bold font-display">Notifications</h2>
                <p className="text-muted-foreground">Send push notifications to students</p>
            </div>

            <Tabs defaultValue="compose" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="compose" className="gap-2">
                        <Send className="w-4 h-4" />
                        Compose
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <Clock className="w-4 h-4" />
                        History ({notifications.length})
                    </TabsTrigger>
                </TabsList>

                {/* Compose Tab */}
                <TabsContent value="compose" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Compose Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="w-5 h-5" />
                                            Compose Notification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g., New Scholarship Alert! �x}"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Write your notification message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="mt-1 min-h-[120px]"
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {message.length}/500 characters
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Target Audience
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Select value={target} onValueChange={setTarget}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Students</SelectItem>
                                                <SelectItem value="by-grade">By Grade</SelectItem>
                                                <SelectItem value="by-interest">By Interest</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {target === "by-grade" && (
                                            <div className="space-y-2">
                                                <Label>Select Grades</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {grades.map(grade => (
                                                        <button
                                                            key={grade}
                                                            type="button"
                                                            onClick={() => toggleGrade(grade)}
                                                            className={`px-4 py-2 rounded-lg border transition-all ${selectedGrades.includes(grade)
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-muted/50 border-border hover:border-primary/50"
                                                                }`}
                                                        >
                                                            Class {grade}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {target === "by-interest" && (
                                            <div className="space-y-2">
                                                <Label>Select Interests</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {interests.map(interest => (
                                                        <button
                                                            key={interest}
                                                            type="button"
                                                            onClick={() => toggleInterest(interest)}
                                                            className={`px-4 py-2 rounded-lg border transition-all ${selectedInterests.includes(interest)
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-muted/50 border-border hover:border-primary/50"
                                                                }`}
                                                        >
                                                            {interest}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Preview & Send */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Mock notification preview */}
                                    <div className="p-4 bg-muted rounded-xl space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                                <span className="text-primary-foreground font-bold text-xs">M</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">MyArk</p>
                                                <p className="text-xs text-muted-foreground">now</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">{title || "Notification Title"}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {message || "Your notification message will appear here..."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                        <p className="text-sm text-muted-foreground">Estimated Reach</p>
                                        <p className="text-2xl font-bold text-primary">{getEstimatedReach()}</p>
                                    </div>

                                    <Button
                                        className="w-full gap-2"
                                        size="lg"
                                        disabled={!title || !message || sending}
                                        onClick={handleSend}
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Notification
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <CardContent className="p-0">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No notifications sent yet</h3>
                                        <p className="text-muted-foreground">Your sent notifications will appear here</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Notification</TableHead>
                                                <TableHead>Target</TableHead>
                                                <TableHead className="text-right">Sent</TableHead>
                                                <TableHead className="text-right">Opened</TableHead>
                                                <TableHead className="text-right">Open Rate</TableHead>
                                                <TableHead>Sent At</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {notifications.map((notif) => {
                                                const openRate = notif.sentCount
                                                    ? Math.round(((notif.openedCount || 0) / notif.sentCount) * 100)
                                                    : 0;
                                                return (
                                                    <TableRow key={notif.id} className="cursor-pointer hover:bg-muted/50">
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{notif.title}</p>
                                                                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                                                    {notif.message}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {notif.target === "all" ? "All Students" :
                                                                    notif.target === "by-grade" ? `Class ${notif.targetCriteria?.grades?.join(", ")}` :
                                                                        notif.targetCriteria?.interests?.join(", ") || notif.target}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {(notif.sentCount || 0).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {(notif.openedCount || 0).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge className={openRate > 50 ? "bg-success/20 text-success" : "bg-yellow-500/20 text-yellow-500"}>
                                                                {openRate}%
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {notif.sentAt ? new Date(notif.sentAt).toLocaleString() : "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Notifications;
