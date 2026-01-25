"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Target,
    Users,
    School,
    Rocket,
    TrendingUp,
    FileText,
    Briefcase,
    Plus,
    Bell,
    Eye,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { dashboardService } from "@/lib/firestore";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface StatsData {
    totalOpportunities: number;
    publishedOpportunities: number;
    totalStudents: number;
    activeStudents: number;
    pendingDemos: number;
}

interface Activity {
    type: string;
    user: string;
    action: string;
    item: string;
    time: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StatsData>({
        totalOpportunities: 0,
        publishedOpportunities: 0,
        totalStudents: 0,
        activeStudents: 0,
        pendingDemos: 0,
    });
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [quickStats, setQuickStats] = useState({
        blogPosts: 0,
        careers: 0,
        notifications: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch main stats
                const dashboardStats = await dashboardService.getStats();
                setStats(dashboardStats);

                // Fetch quick stats
                const [blogsSnap, careersSnap, notifsSnap] = await Promise.all([
                    getDocs(query(collection(db, "blogs"), limit(100))),
                    getDocs(query(collection(db, "careers"), limit(100))),
                    getDocs(query(collection(db, "notifications"), limit(100))),
                ]);

                setQuickStats({
                    blogPosts: blogsSnap.size,
                    careers: careersSnap.size,
                    notifications: notifsSnap.size,
                });

                // Mock recent activities (in production, fetch from Firestore)
                setRecentActivities([
                    { type: "application", user: "Priya Sharma", action: "applied to", item: "KVPY Fellowship", time: "2 min ago" },
                    { type: "registration", user: "Arjun Patel", action: "registered on", item: "MyArk", time: "5 min ago" },
                    { type: "application", user: "Sneha Gupta", action: "applied to", item: "Google Code-In", time: "8 min ago" },
                    { type: "demo", user: "DPS Noida", action: "requested", item: "school demo", time: "15 min ago" },
                    { type: "application", user: "Rahul Kumar", action: "applied to", item: "Tata Scholarship", time: "22 min ago" },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsCards = [
        {
            title: "Total Opportunities",
            value: stats.totalOpportunities,
            change: `${stats.publishedOpportunities} published`,
            changeType: "positive" as const,
            icon: Target,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Registered Students",
            value: stats.totalStudents > 1000 ? `${(stats.totalStudents / 1000).toFixed(1)}K` : stats.totalStudents,
            change: `${stats.activeStudents} active this week`,
            changeType: "positive" as const,
            icon: Users,
            color: "text-secondary",
            bgColor: "bg-secondary/10",
        },
        {
            title: "Pending Demos",
            value: stats.pendingDemos,
            change: "Awaiting response",
            changeType: "neutral" as const,
            icon: School,
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            title: "Quick Actions",
            value: "â†’",
            change: "Add content",
            changeType: "neutral" as const,
            icon: Rocket,
            color: "text-success",
            bgColor: "bg-success/10",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold font-display">{stat.value}</p>
                                        {stat.change && (
                                            <p className={`text-xs ${stat.changeType === "positive" ? "text-success" :
                                                stat.changeType === "negative" ? "text-destructive" :
                                                    "text-muted-foreground"
                                                }`}>
                                                <TrendingUp className="w-3 h-3 inline mr-1" />
                                                {stat.change}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                            {/* Decorative gradient */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent opacity-50`} />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Mini Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full justify-start gap-3"
                                onClick={() => router.push("/admin/opportunities/new")}
                            >
                                <Plus className="w-4 h-4" />
                                Add New Opportunity
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3"
                                onClick={() => router.push("/admin/blog/new")}
                            >
                                <FileText className="w-4 h-4" />
                                Write Blog Post
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3"
                                onClick={() => router.push("/admin/notifications")}
                            >
                                <Bell className="w-4 h-4" />
                                Send Notification
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3"
                                onClick={() => router.push("/admin/schools")}
                            >
                                <Eye className="w-4 h-4" />
                                View Demo Requests
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Mini Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Content Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                    <span className="font-medium">Blog Posts</span>
                                </div>
                                <span className="text-xl font-bold">{quickStats.blogPosts}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                    <span className="font-medium">Active Careers</span>
                                </div>
                                <span className="text-xl font-bold">{quickStats.careers}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-muted-foreground" />
                                    <span className="font-medium">Notifications Sent</span>
                                </div>
                                <span className="text-xl font-bold">{quickStats.notifications}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                            <Badge variant="secondary" className="animate-pulse">Live</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 text-sm">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "application" ? "bg-primary" :
                                        activity.type === "registration" ? "bg-success" :
                                            "bg-accent"
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate">
                                            <span className="font-medium">{activity.user}</span>
                                            {" "}{activity.action}{" "}
                                            <span className="text-primary">{activity.item}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Placeholder for Charts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Applications Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-xl">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Chart will be rendered here</p>
                                <p className="text-sm">Connect to real data for analytics</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
