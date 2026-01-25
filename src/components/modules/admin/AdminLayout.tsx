"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Target,
    Users,
    School,
    Bell,
    Settings,
    FileText,
    Briefcase,
    Menu,
    X,
    ChevronLeft,
    LogOut,
    Search,
    Loader2,
    Medal,
    Zap,
    ShoppingBag,
    Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Opportunities", icon: Target, path: "/admin/opportunities" },
    { label: "Blog", icon: FileText, path: "/admin/blog" },
    { label: "Careers", icon: Briefcase, path: "/admin/careers" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Schools", icon: School, path: "/admin/schools" },
    { label: "Organizers", icon: Users, path: "/admin/organizers" },
    { label: "Badges", icon: Medal, path: "/admin/badges" },
    { label: "Gamification", icon: Zap, path: "/admin/gamification" },
    { label: "Partners", icon: ShoppingBag, path: "/admin/partners" },
    { label: "Rewards", icon: Ticket, path: "/admin/rewards" },
    { label: "Notifications", icon: Bell, path: "/admin/notifications" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut, isAdmin } = useAuth();

    const getCurrentPageTitle = () => {
        const currentItem = navItems.find(item =>
            pathname === item.path ||
            (item.path !== "/admin" && pathname?.startsWith(item.path))
        );
        return currentItem?.label || "Dashboard";
    };

    const isLoginPage = pathname === "/admin/login";

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAdmin && !isLoginPage) {
            router.push("/admin/login");
        }
    }, [isAdmin, loading, router, isLoginPage]);

    // Show loading state or unauthorized state
    if (loading || (!isAdmin && !isLoginPage)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">{loading ? "Authenticating..." : "Redirecting to login..."}</p>
                </div>
            </div>
        );
    }

    // If on login page, render children directly (or the login component)
    if (isLoginPage) {
        return <>{children}</>;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 256 : 80 }}
                className={cn(
                    "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-border z-40",
                    "transition-all duration-300"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    <AnimatePresence mode="wait">
                        {sidebarOpen ? (
                            <motion.div
                                key="full-logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">M</span>
                                </div>
                                <span className="font-display font-bold text-lg">MyArk Admin</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="icon-logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto"
                            >
                                <span className="text-primary-foreground font-bold text-sm">M</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={cn("shrink-0", !sidebarOpen && "hidden")}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/admin" && pathname?.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", !sidebarOpen && "mx-auto")} />
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {item.badge && sidebarOpen && (
                                    <span className="ml-auto bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge && !sidebarOpen && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className={cn(
                            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
                            !sidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </motion.aside>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed left-0 top-0 h-full w-[280px] bg-card border-r border-border z-50 lg:hidden"
                    >
                        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">M</span>
                                </div>
                                <span className="font-display font-bold text-lg">MyArk Admin</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <nav className="py-4 px-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path || (item.path !== "/admin" && pathname?.startsWith(item.path));
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
                            <Button
                                variant="ghost"
                                onClick={handleSignOut}
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300",
                    sidebarOpen ? "lg:ml-64" : "lg:ml-20"
                )}
            >
                {/* Top Header */}
                <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h1 className="font-display font-semibold text-lg">{getCurrentPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="w-64 pl-9 bg-muted/50 border-transparent focus:border-primary"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                                2
                            </span>
                        </Button>

                        {/* Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 px-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <span className="text-primary-foreground font-semibold text-sm">
                                            {user?.displayName?.charAt(0) || "A"}
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline font-medium">
                                        {user?.displayName || "Admin"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                    {user?.email}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
