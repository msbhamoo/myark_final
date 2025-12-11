'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Check, ChevronsUpDown, Loader2, Search, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface School {
    id: string;
    name: string;
    city?: string;
    state?: string;
    board?: string;
}

interface SchoolSelectProps {
    value: string;
    onValueChange: (value: string, schoolData?: School) => void;
    placeholder?: string;
    className?: string;
    allowCustom?: boolean;
}

export default function SchoolSelect({
    value,
    onValueChange,
    placeholder = 'Select your school',
    className,
    allowCustom = true,
}: SchoolSelectProps) {
    const [open, setOpen] = useState(false);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);

    // Fetch schools on first open
    const fetchSchools = useCallback(async () => {
        if (hasLoaded) return;

        setLoading(true);
        try {
            const response = await fetch('/api/schools');
            if (response.ok) {
                const data = await response.json();
                setSchools(data.items || []);
                setHasLoaded(true);
            }
        } catch (error) {
            console.error('Failed to fetch schools:', error);
        } finally {
            setLoading(false);
        }
    }, [hasLoaded]);

    useEffect(() => {
        if (open && !hasLoaded) {
            fetchSchools();
        }
    }, [open, hasLoaded, fetchSchools]);

    // Filter schools based on search
    const filteredSchools = useMemo(() => {
        if (!searchQuery.trim()) return schools;

        const query = searchQuery.toLowerCase();
        return schools.filter(school =>
            school.name.toLowerCase().includes(query) ||
            school.city?.toLowerCase().includes(query) ||
            school.state?.toLowerCase().includes(query)
        );
    }, [schools, searchQuery]);

    // Check if current value matches a school
    const selectedSchool = useMemo(() => {
        return schools.find(s => s.name === value || s.id === value);
    }, [schools, value]);

    const handleSelect = (school: School) => {
        onValueChange(school.name, school);
        setOpen(false);
        setSearchQuery('');
    };

    const handleCustomInput = () => {
        if (searchQuery.trim() && allowCustom) {
            onValueChange(searchQuery.trim());
            setOpen(false);
            setSearchQuery('');
        }
    };

    const displayValue = selectedSchool?.name || value || placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <span className="truncate flex items-center gap-2">
                        <School className="h-4 w-4 shrink-0 text-slate-400" />
                        {displayValue}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <div className="flex items-center border-b px-3 py-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder="Search schools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                            <span className="ml-2 text-sm text-slate-500">Loading schools...</span>
                        </div>
                    ) : filteredSchools.length === 0 ? (
                        <div className="py-6 text-center">
                            <p className="text-sm text-slate-500">No schools found.</p>
                            {allowCustom && searchQuery.trim() && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-primary"
                                    onClick={handleCustomInput}
                                >
                                    Use "{searchQuery}" as school name
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredSchools.map((school) => (
                                <button
                                    key={school.id}
                                    className={cn(
                                        'relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800',
                                        (selectedSchool?.id === school.id || value === school.name) && 'bg-slate-50 dark:bg-slate-900'
                                    )}
                                    onClick={() => handleSelect(school)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            (selectedSchool?.id === school.id || value === school.name) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{school.name}</p>
                                        {(school.city || school.state) && (
                                            <p className="text-xs text-slate-500">
                                                {[school.city, school.state].filter(Boolean).join(', ')}
                                                {school.board && ` • ${school.board}`}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}

                            {allowCustom && searchQuery.trim() && !filteredSchools.some(s => s.name.toLowerCase() === searchQuery.toLowerCase()) && (
                                <button
                                    className="relative flex w-full cursor-pointer select-none items-center border-t px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={handleCustomInput}
                                >
                                    <span className="text-primary">+ Add "{searchQuery}" as custom school</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
