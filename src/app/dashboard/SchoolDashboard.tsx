'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { AppUserProfile } from '@/context/AuthContext';
import {
    Users,
    GraduationCap,
    Trophy,
    Award,
    Building2,
    Search,
    CheckSquare,
    Square,
    Loader2,
    ExternalLink,
    Send
} from 'lucide-react';

interface Student {
    uid: string;
    displayName: string;
    email?: string;
    photoUrl?: string;
    className?: string;
    schoolInfo?: {
        schoolName?: string;
        board?: string;
        className?: string;
    };
    stats?: {
        competitionsParticipated?: number;
        totalAwards?: number;
    };
    appliedOpportunities?: Array<{
        opportunityId: string;
        opportunityTitle: string;
        registeredAt?: string | null;
    }>;
}

interface Opportunity {
    id: string;
    title: string;
    category?: string;
    registrationDeadline?: string;
    registrationMode: 'internal' | 'external';
    registrationCount?: number;
}

interface SchoolInfo {
    id: string;
    name: string;
    type?: string;
    numberOfStudents?: number;
    facilities?: string[];
    isVerified?: boolean;
    email?: string;
    phone?: string;
    website?: string;
    principalName?: string;
    address?: string;
    schoolLogoUrl?: string;
}

type Tab = 'students' | 'opportunities' | 'my-opportunities';

type SchoolDashboardProps = {
    user: AppUserProfile;
    signOut: () => Promise<void>;
    getIdToken: (force?: boolean) => Promise<string | null>;
};

const formatDate = (value: string | null | undefined): string => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function SchoolDashboard({
    user,
    signOut,
    getIdToken,
}: SchoolDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('students');
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [opportunityFilter, setOpportunityFilter] = useState<'internal' | 'external'>('internal');

    // Load school info
    const loadSchoolInfo = useCallback(async () => {
        if (!user.linkedSchoolId) return;
        try {
            const response = await fetch(`/api/schools?id=${user.linkedSchoolId}`);
            if (response.ok) {
                const data = await response.json();
                setSchoolInfo(data);
            }
        } catch (err) {
            console.error('Failed to load school info', err);
        }
    }, [user.linkedSchoolId]);

    // Load students for this school
    const loadStudents = useCallback(async () => {
        if (!user.linkedSchoolId) return;
        setIsLoading(true);
        try {
            const token = await getIdToken();
            const response = await fetch(`/api/schools/${user.linkedSchoolId}/students`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(data.students ?? []);
            }
        } catch (err) {
            console.error('Failed to load students', err);
        } finally {
            setIsLoading(false);
        }
    }, [user.linkedSchoolId, getIdToken]);

    // Load available opportunities based on filter
    const loadOpportunities = useCallback(async () => {
        try {
            const response = await fetch(`/api/opportunities?registrationMode=${opportunityFilter}&status=approved&limit=50`);
            if (response.ok) {
                const data = await response.json();
                setOpportunities(data.opportunities ?? data.items ?? []);
            }
        } catch (err) {
            console.error('Failed to load opportunities', err);
        }
    }, [opportunityFilter]);

    // Load my opportunities (created by this school)
    const loadMyOpportunities = useCallback(async () => {
        try {
            const token = await getIdToken();
            if (!token) return;
            const response = await fetch('/api/opportunities/mine', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMyOpportunities(data.items ?? []);
            }
        } catch (err) {
            console.error('Failed to load my opportunities', err);
        }
    }, [getIdToken]);

    useEffect(() => {
        loadSchoolInfo();
        loadStudents();
        loadOpportunities();
        loadMyOpportunities();
    }, [loadSchoolInfo, loadStudents, loadOpportunities, loadMyOpportunities]);

    // Filter students by search
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(s =>
            s.displayName?.toLowerCase().includes(query) ||
            s.email?.toLowerCase().includes(query) ||
            s.schoolInfo?.className?.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    // Filter opportunities by search
    const filteredOpportunities = useMemo(() => {
        if (!opportunitySearchQuery.trim()) return opportunities;
        const query = opportunitySearchQuery.toLowerCase();
        return opportunities.filter(o =>
            o.title?.toLowerCase().includes(query) ||
            o.category?.toLowerCase().includes(query)
        );
    }, [opportunities, opportunitySearchQuery]);

    // Get set of opportunity IDs that selected students have already registered for
    const alreadyRegisteredOpportunities = useMemo(() => {
        const registered = new Map<string, Set<string>>(); // opportunityId -> Set of student UIDs
        selectedStudents.forEach(studentUid => {
            const student = students.find(s => s.uid === studentUid);
            if (student?.appliedOpportunities) {
                student.appliedOpportunities.forEach(app => {
                    if (!registered.has(app.opportunityId)) {
                        registered.set(app.opportunityId, new Set());
                    }
                    registered.get(app.opportunityId)!.add(studentUid);
                });
            }
        });
        return registered;
    }, [students, selectedStudents]);

    // Toggle student selection
    const toggleStudent = (uid: string) => {
        setSelectedStudents(prev => {
            const next = new Set(prev);
            if (next.has(uid)) {
                next.delete(uid);
            } else {
                next.add(uid);
            }
            return next;
        });
    };

    // Select all visible students
    const selectAllStudents = () => {
        if (selectedStudents.size === filteredStudents.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(filteredStudents.map(s => s.uid)));
        }
    };

    // Bulk apply students to opportunity
    const handleBulkApply = async () => {
        if (!selectedOpportunity || selectedStudents.size === 0) {
            setError('Please select an opportunity and at least one student');
            return;
        }

        setIsApplying(true);
        setError(null);
        try {
            const token = await getIdToken();
            if (!token) throw new Error('Not authenticated');

            const response = await fetch('/api/schools/bulk-apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    opportunityId: selectedOpportunity,
                    studentUids: Array.from(selectedStudents),
                    schoolId: user.linkedSchoolId,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error ?? 'Failed to apply');

            setSuccessMessage(`Successfully registered ${data.success} students. ${data.failed} failed.`);
            setSelectedStudents(new Set());
            setSelectedOpportunity(null);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            console.error('Bulk apply failed', err);
            setError((err as Error).message);
        } finally {
            setIsApplying(false);
        }
    };

    const stats = useMemo(() => ({
        totalStudents: students.length,
        totalParticipations: students.reduce((acc, s) => acc + (s.stats?.competitionsParticipated ?? 0), 0),
        totalAwards: students.reduce((acc, s) => acc + (s.stats?.totalAwards ?? 0), 0),
    }), [students]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-xl backdrop-blur">
                <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {schoolInfo?.schoolLogoUrl ? (
                            <img
                                src={schoolInfo.schoolLogoUrl}
                                alt={schoolInfo.name}
                                className="h-16 w-16 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm uppercase tracking-wide text-slate-600 dark:text-white/60">School Dashboard</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                {schoolInfo?.name ?? user.displayName ?? 'School'}
                            </h1>
                            {schoolInfo?.isVerified && (
                                <Badge variant="outline" className="mt-1 border-emerald-500/40 text-emerald-500">
                                    Verified School
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => router.push('/host')}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:from-emerald-600 hover:to-teal-700"
                        >
                            Create Opportunity
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                            onClick={() => signOut()}
                        >
                            Sign out
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-500/10 p-2">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-white/60">Students</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-purple-500/10 p-2">
                                <GraduationCap className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-white/60">Participations</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.totalParticipations}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-500/10 p-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-white/60">Awards Won</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.totalAwards}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Messages */}
            {successMessage && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-600 dark:text-green-400">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
                <button
                    className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'students'
                        ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    onClick={() => setActiveTab('students')}
                >
                    <Users className="h-4 w-4" />
                    Students ({students.length})
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'opportunities'
                        ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    onClick={() => setActiveTab('opportunities')}
                >
                    <GraduationCap className="h-4 w-4" />
                    Apply for Opportunities
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'my-opportunities'
                        ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    onClick={() => setActiveTab('my-opportunities')}
                >
                    <Trophy className="h-4 w-4" />
                    My Opportunities ({myOpportunities.length})
                </button>
            </div>

            {/* Students Tab */}
            {activeTab === 'students' && (
                <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">School Students</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-8 text-center">
                            <Users className="h-12 w-12 mx-auto text-slate-300 dark:text-white/20" />
                            <p className="mt-4 text-slate-600 dark:text-white/60">
                                No students found. Students will appear here when they add your school to their profile.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.uid}
                                    className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        {student.photoUrl ? (
                                            <img
                                                src={student.photoUrl}
                                                alt={student.displayName}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {student.displayName?.charAt(0) ?? '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{student.displayName}</p>
                                        <p className="text-sm text-slate-600 dark:text-white/60">
                                            {student.schoolInfo?.className ?? 'Class N/A'} • {student.email ?? 'No email'}
                                        </p>
                                        {/* Applied Opportunities */}
                                        {student.appliedOpportunities && student.appliedOpportunities.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {student.appliedOpportunities.slice(0, 3).map((app, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs border-blue-500/40 text-blue-600 dark:text-blue-400">
                                                        {app.opportunityTitle.length > 25 ? app.opportunityTitle.substring(0, 25) + '...' : app.opportunityTitle}
                                                    </Badge>
                                                ))}
                                                {student.appliedOpportunities.length > 3 && (
                                                    <Badge variant="outline" className="text-xs border-slate-300 text-slate-500">
                                                        +{student.appliedOpportunities.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-sm text-slate-600 dark:text-white/60">
                                        <span className="flex items-center gap-1">
                                            <Trophy className="h-3.5 w-3.5" />
                                            {student.appliedOpportunities?.length ?? 0} participations
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="h-3.5 w-3.5" />
                                            {student.stats?.totalAwards ?? 0} awards
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Opportunities Tab - Bulk Apply */}
            {activeTab === 'opportunities' && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Student Selection */}
                    <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Students</h2>
                            <Button variant="ghost" size="sm" onClick={selectAllStudents}>
                                {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>

                        <div className="mt-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                            {filteredStudents.map((student) => (
                                <button
                                    key={student.uid}
                                    onClick={() => toggleStudent(student.uid)}
                                    className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${selectedStudents.has(student.uid)
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {selectedStudents.has(student.uid) ? (
                                        <CheckSquare className="h-5 w-5 text-emerald-500" />
                                    ) : (
                                        <Square className="h-5 w-5 text-slate-400" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{student.displayName}</p>
                                        <p className="text-sm text-slate-600 dark:text-white/60">{student.schoolInfo?.className ?? 'N/A'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedStudents.size > 0 && (
                            <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
                                {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </section>

                    {/* Opportunity Selection */}
                    <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Opportunity</h2>
                            {/* Toggle for internal/external */}
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 rounded-lg p-1">
                                <button
                                    onClick={() => setOpportunityFilter('internal')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${opportunityFilter === 'internal'
                                        ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm'
                                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    Internal
                                </button>
                                <button
                                    onClick={() => setOpportunityFilter('external')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${opportunityFilter === 'external'
                                        ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-sm'
                                        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    External
                                </button>
                            </div>
                        </div>

                        {/* External opportunity warning */}
                        {opportunityFilter === 'external' && (
                            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3">
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    ⚠️ <strong>External Opportunities:</strong> For external opportunities, students must register directly on the organizer's website. You cannot bulk apply for these.
                                </p>
                            </div>
                        )}

                        <p className="mt-3 text-sm text-slate-600 dark:text-white/60">
                            {opportunityFilter === 'internal'
                                ? 'Internal opportunities allow bulk student registration through MyArk.'
                                : 'External opportunities require students to register on the organizer\'s website.'}
                        </p>

                        {/* Opportunity Search Bar */}
                        <div className="mt-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search opportunities..."
                                value={opportunitySearchQuery}
                                onChange={(e) => setOpportunitySearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                            {filteredOpportunities.length === 0 ? (
                                <p className="text-center py-8 text-slate-600 dark:text-white/60">
                                    No {opportunityFilter} opportunities {opportunitySearchQuery ? 'matching your search' : 'available'}
                                </p>
                            ) : (
                                filteredOpportunities.map((opp) => {
                                    const registeredStudents = alreadyRegisteredOpportunities.get(opp.id);
                                    const hasRegisteredStudents = registeredStudents && registeredStudents.size > 0;
                                    const allSelectedRegistered = hasRegisteredStudents && registeredStudents.size === selectedStudents.size && selectedStudents.size > 0;

                                    return (
                                        <button
                                            key={opp.id}
                                            onClick={() => opportunityFilter === 'internal' ? setSelectedOpportunity(opp.id) : window.open(`/opportunity/${opp.id}`, '_blank')}
                                            className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${selectedOpportunity === opp.id && opportunityFilter === 'internal'
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : allSelectedRegistered
                                                    ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-500/5'
                                                    : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-white">{opp.title}</p>
                                                <p className="text-sm text-slate-600 dark:text-white/60">
                                                    Deadline: {formatDate(opp.registrationDeadline)}
                                                </p>
                                                {/* Already registered warning */}
                                                {hasRegisteredStudents && selectedStudents.size > 0 && (
                                                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                        ⚠️ {allSelectedRegistered ? 'All' : registeredStudents.size} selected student{registeredStudents.size !== 1 ? 's' : ''} already registered
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {allSelectedRegistered && (
                                                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-50 dark:bg-amber-500/10">
                                                        Already Registered
                                                    </Badge>
                                                )}
                                                {opportunityFilter === 'external' && (
                                                    <Badge variant="outline" className="border-amber-500/40 text-amber-600">
                                                        External
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="ml-2">
                                                    {opp.registrationCount ?? 0} registered
                                                </Badge>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Apply Button - Only show for internal */}
                        {opportunityFilter === 'internal' && (
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                                <Button
                                    onClick={handleBulkApply}
                                    disabled={!selectedOpportunity || selectedStudents.size === 0 || isApplying}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                                >
                                    {isApplying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Apply {selectedStudents.size} Student{selectedStudents.size !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* External - Show view button */}
                        {opportunityFilter === 'external' && (
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                                <p className="text-sm text-slate-500 dark:text-white/50 text-center">
                                    Click on an opportunity above to view details and registration instructions.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* My Opportunities Tab */}
            {activeTab === 'my-opportunities' && (
                <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Created Opportunities</h2>
                        <Button
                            onClick={() => router.push('/host')}
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        >
                            Create New
                        </Button>
                    </div>

                    {myOpportunities.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-8 text-center">
                            <GraduationCap className="h-12 w-12 mx-auto text-slate-300 dark:text-white/20" />
                            <p className="mt-4 text-slate-600 dark:text-white/60">
                                You haven&apos;t created any opportunities yet.
                            </p>
                            <Button
                                onClick={() => router.push('/host')}
                                className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            >
                                Create Your First Opportunity
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {myOpportunities.map((opp) => (
                                <div
                                    key={opp.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{opp.title}</p>
                                        <p className="text-sm text-slate-600 dark:text-white/60">
                                            Deadline: {formatDate(opp.registrationDeadline)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {opp.registrationMode === 'internal' && (
                                            <Badge variant="outline" className="border-blue-500/40 text-blue-500">
                                                {opp.registrationCount ?? 0} registrations
                                            </Badge>
                                        )}
                                        <Link
                                            href={`/opportunity/${opp.id}`}
                                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                        >
                                            View <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
