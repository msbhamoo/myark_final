'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    School,
    Building2,
    Home,
    BookOpen,
    Upload,
    Palette,
    Settings,
    HelpCircle,
    LucideIcon,
} from 'lucide-react';

// Icon map to resolve string names to components
const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    FileText,
    Users,
    School,
    Building2,
    Home,
    BookOpen,
    Upload,
    Palette,
    Settings,
    HelpCircle,
};

interface AdminNavLinkProps {
    href: string;
    iconName: string;
    children: React.ReactNode;
    isCollapsed?: boolean;
}

export function AdminNavLink({ href, iconName, children, isCollapsed = false }: AdminNavLinkProps) {
    const pathname = usePathname();
    const Icon = iconMap[iconName] || FileText;

    // For dashboard, only exact match. For others, check if path starts with href
    const isActive = href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(href);

    return (
        <Link
            href={href}
            title={isCollapsed ? String(children) : undefined}
            className={cn(
                'flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                isCollapsed ? 'justify-center px-3 py-2.5' : 'gap-3 px-4 py-2.5',
                isActive
                    ? 'bg-gradient-to-r from-violet-500/15 to-purple-500/15 text-violet-700 dark:text-violet-300 shadow-sm border border-violet-200/50 dark:border-violet-500/20'
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground'
            )}
        >
            <Icon className={cn(
                'h-4 w-4 transition-colors shrink-0',
                isActive ? 'text-violet-600 dark:text-violet-400' : ''
            )} />
            {!isCollapsed && (
                <>
                    <span className="truncate">{children}</span>
                    {isActive && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    )}
                </>
            )}
        </Link>
    );
}
