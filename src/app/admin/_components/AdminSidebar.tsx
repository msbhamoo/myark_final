'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AdminNavLink } from './AdminNavLink';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavSection {
    title: string;
    items: {
        href: string;
        label: string;
        iconName: string;
    }[];
}

interface AdminSidebarProps {
    navSections: NavSection[];
}

export function AdminSidebar({ navSections }: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                'shrink-0 transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            <nav className="sticky top-24 space-y-6">
                {/* Collapse/Expand Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="text-xs font-medium">Collapse</span>
                        </>
                    )}
                </button>

                {navSections.map((section) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((link) => (
                                <AdminNavLink
                                    key={link.href}
                                    href={link.href}
                                    iconName={link.iconName}
                                    isCollapsed={isCollapsed}
                                >
                                    {link.label}
                                </AdminNavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
