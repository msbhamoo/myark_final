'use client';

import { useState, useEffect } from 'react';
import {
    School,
    Phone,
    Mail,
    MapPin,
    User,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Trash2,
    RefreshCw,
    Search,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SchoolLead {
    id: string;
    schoolName: string;
    contactName: string;
    email: string;
    phone: string;
    city: string;
    status: 'new' | 'contacted' | 'converted' | 'rejected';
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

const STATUS_OPTIONS = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
    { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
    { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

export default function SchoolLeadsManager() {
    const [leads, setLeads] = useState<SchoolLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesValue, setNotesValue] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/school-leads');
            const data = await response.json();
            setLeads(data.leads || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateLeadStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/school-leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            setLeads(leads.map((l) => (l.id === id ? { ...l, status: status as SchoolLead['status'] } : l)));
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const updateLeadNotes = async (id: string) => {
        try {
            await fetch(`/api/school-leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: notesValue }),
            });
            setLeads(leads.map((l) => (l.id === id ? { ...l, notes: notesValue } : l)));
            setEditingNotes(null);
        } catch (error) {
            console.error('Error updating notes:', error);
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            await fetch(`/api/school-leads/${id}`, { method: 'DELETE' });
            setLeads(leads.filter((l) => l.id !== id));
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: leads.length,
        new: leads.filter((l) => l.status === 'new').length,
        contacted: leads.filter((l) => l.status === 'contacted').length,
        converted: leads.filter((l) => l.status === 'converted').length,
        rejected: leads.filter((l) => l.status === 'rejected').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Leads</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Manage inquiries from the For Schools page
                    </p>
                </div>
                <Button onClick={fetchLeads} variant="outline" size="sm">
                    <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                    { key: 'all', label: 'Total' },
                    { key: 'new', label: 'New' },
                    { key: 'contacted', label: 'Contacted' },
                    { key: 'converted', label: 'Converted' },
                    { key: 'rejected', label: 'Rejected' },
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setStatusFilter(item.key)}
                        className={cn(
                            'rounded-xl border p-4 text-center transition hover:shadow-md',
                            statusFilter === item.key
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                        )}
                    >
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {statusCounts[item.key as keyof typeof statusCounts]}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{item.label}</div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by school, name, email, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Leads List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                    <School className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                    <p className="mt-4 text-slate-600 dark:text-slate-400">No leads found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                {/* Lead Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {lead.schoolName}
                                        </h3>
                                        <Badge
                                            className={cn(
                                                STATUS_OPTIONS.find((s) => s.value === lead.status)?.color
                                            )}
                                        >
                                            {lead.status}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <User className="h-4 w-4" />
                                            {lead.contactName}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${lead.email}`} className="hover:text-primary">
                                                {lead.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <Phone className="h-4 w-4" />
                                            <a href={`tel:${lead.phone}`} className="hover:text-primary">
                                                {lead.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <MapPin className="h-4 w-4" />
                                            {lead.city}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock className="h-3 w-3" />
                                        Submitted: {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteLead(lead.id)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                {editingNotes === lead.id ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={notesValue}
                                            onChange={(e) => setNotesValue(e.target.value)}
                                            placeholder="Add notes..."
                                            className="flex-1"
                                        />
                                        <Button size="sm" onClick={() => updateLeadNotes(lead.id)}>
                                            Save
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingNotes(lead.id);
                                            setNotesValue(lead.notes || '');
                                        }}
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        {lead.notes || 'Add notes...'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
