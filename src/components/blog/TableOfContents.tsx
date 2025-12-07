'use client';

import { useMemo } from 'react';
import { extractHeadings } from '@/lib/blogUtils';
import { List } from 'lucide-react';

interface TableOfContentsProps {
    content: string;
    className?: string;
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
    const headings = useMemo(() => extractHeadings(content), [content]);

    if (headings.length < 3) {
        // Don't show TOC for short articles
        return null;
    }

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className={`rounded-xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-900/50 p-5 ${className}`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <List className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Table of Contents
                </h3>
            </div>
            <ul className="space-y-2">
                {headings.map((heading, index) => (
                    <li
                        key={`${heading.id}-${index}`}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className="text-left text-sm text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors line-clamp-2"
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
