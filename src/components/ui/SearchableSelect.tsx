'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
    value: string;
    label: string;
    sublabel?: string;
}

interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    disabled = false,
    required = false,
    className = '',
    id,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        const query = searchQuery.toLowerCase();
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(query) ||
                option.sublabel?.toLowerCase().includes(query)
        );
    }, [options, searchQuery]);

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearchQuery('');
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-10 w-full flex items-center justify-between gap-2 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white transition-colors',
                    'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
                    disabled && 'opacity-50 cursor-not-allowed',
                    isOpen && 'ring-2 ring-primary/30 border-primary/50'
                )}
            >
                <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && !required && (
                        <X
                            className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform',
                            isOpen && 'rotate-180'
                        )}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-border/60 dark:border-white/20 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search Input */}
                    <div className="p-2 border-b border-border/40 dark:border-white/10">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full h-9 pl-8 pr-3 rounded-md border border-border/40 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        'w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors',
                                        'hover:bg-primary/10 dark:hover:bg-primary/20',
                                        option.value === value && 'bg-primary/5 dark:bg-primary/10'
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            'h-4 w-4 shrink-0',
                                            option.value === value
                                                ? 'text-primary'
                                                : 'text-transparent'
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="truncate text-foreground dark:text-white">
                                            {option.label}
                                        </div>
                                        {option.sublabel && (
                                            <div className="truncate text-xs text-muted-foreground">
                                                {option.sublabel}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
