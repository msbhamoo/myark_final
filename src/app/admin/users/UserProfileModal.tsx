"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface UserProfileModalProps {
    user: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        createdAt?: string;
        lastActiveAt?: string;
        profileCompletion?: number;
        opportunitiesViewed?: number;
        opportunitiesApplied?: number;
        opportunitiesCreated?: number;
    } | null;
    open: boolean;
    onClose: () => void;
}

export function UserProfileModal({ user, open, onClose }: UserProfileModalProps) {
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    if (!user) return null;

    const handlePasswordReset = async () => {
        if (!confirm(`Send password reset email to ${user.email}?`)) return;

        setIsResetting(true);
        setResetSuccess(false);

        try {
            const response = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send password reset email');
            }

            setResetSuccess(true);
            setTimeout(() => setResetSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert('Failed to send password reset email');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">User Profile Details</DialogTitle>
                    <DialogDescription>
                        Viewing profile for {user.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Role</p>
                                <Badge variant="outline" className="mt-1 capitalize">
                                    {user.role === 'business' ? 'Organizer' : user.role.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">First Name</p>
                                <p className="text-sm font-medium">{user.firstName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Last Name</p>
                                <p className="text-sm font-medium">{user.lastName || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white">Activity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Created At</p>
                                <p className="text-sm font-medium">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Last Active</p>
                                <p className="text-sm font-medium">
                                    {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'Never'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student Analytics */}
                    {user.role === 'student' && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground dark:text-white">Student Analytics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Profile Completion</p>
                                    <p className="text-sm font-medium">{user.profileCompletion}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Opportunities Viewed</p>
                                    <p className="text-sm font-medium">{user.opportunitiesViewed}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Opportunities Applied</p>
                                    <p className="text-sm font-medium">{user.opportunitiesApplied}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Organizer Analytics */}
                    {(user.role === 'organizer' || user.role === 'business') && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground dark:text-white">Organizer Analytics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Opportunities Created</p>
                                    <p className="text-sm font-medium">{user.opportunitiesCreated}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Reset Section */}
                    <div className="border-t pt-4 space-y-3">
                        <h3 className="text-sm font-semibold text-foreground dark:text-white">Account Actions</h3>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handlePasswordReset}
                                disabled={isResetting}
                                variant="outline"
                                size="sm"
                            >
                                {isResetting ? 'Sending...' : 'Send Password Reset Email'}
                            </Button>
                            {resetSuccess && (
                                <span className="text-sm text-green-500">✓ Password reset email sent!</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This will send a password reset link to {user.email}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
