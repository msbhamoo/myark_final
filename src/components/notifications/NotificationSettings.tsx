'use client';

import { useState } from 'react';
import { Bell, BellOff, Loader2, Check, Mail, Smartphone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface NotificationSettingsProps {
    className?: string;
}

export default function NotificationSettings({ className }: NotificationSettingsProps) {
    const {
        isSupported,
        permission,
        isSubscribed,
        preferences,
        loading,
        error,
        subscribe,
        unsubscribe,
        updatePreferences,
    } = useNotifications();

    const [actionLoading, setActionLoading] = useState(false);

    const handleTogglePush = async () => {
        setActionLoading(true);
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handlePreferenceChange = async (key: string, value: boolean | string) => {
        await updatePreferences({ [key]: value });
    };

    return (
        <Card className={cn('p-6 space-y-6', className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 p-2.5">
                        <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        <p className="text-sm text-slate-500">Manage how you receive updates</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Push Notifications Section */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-slate-400" />
                        <div>
                            <Label className="text-base font-medium">Push Notifications</Label>
                            <p className="text-sm text-slate-500">
                                {isSupported
                                    ? isSubscribed
                                        ? 'Enabled - receiving instant updates'
                                        : 'Get notified instantly in your browser'
                                    : 'Not supported in this browser'}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant={isSubscribed ? 'outline' : 'default'}
                        size="sm"
                        onClick={handleTogglePush}
                        disabled={!isSupported || loading || actionLoading}
                        className={cn(
                            isSubscribed && 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        )}
                    >
                        {actionLoading || loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isSubscribed ? (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                Enabled
                            </>
                        ) : (
                            <>
                                <Bell className="h-4 w-4 mr-1" />
                                Enable
                            </>
                        )}
                    </Button>
                </div>

                {permission === 'denied' && (
                    <div className="ml-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-700 dark:text-amber-300">
                        Notifications are blocked. Please enable them in your browser settings.
                    </div>
                )}
            </div>

            {/* Email Notifications Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-400" />
                        <div>
                            <Label className="text-base font-medium">Email Notifications</Label>
                            <p className="text-sm text-slate-500">Receive updates via email</p>
                        </div>
                    </div>

                    <Switch
                        checked={preferences?.emailEnabled ?? true}
                        onCheckedChange={(checked) => handlePreferenceChange('emailEnabled', checked)}
                        disabled={loading}
                    />
                </div>

                {preferences?.emailEnabled && (
                    <div className="ml-8 flex items-center gap-3">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <Label className="text-sm">Frequency:</Label>
                        <Select
                            value={preferences?.emailFrequency || 'weekly'}
                            onValueChange={(value) => handlePreferenceChange('emailFrequency', value)}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instant">Instant</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Notification Types */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-white">What to notify</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">New Opportunities</Label>
                            <p className="text-xs text-slate-500">Matching your interests</p>
                        </div>
                        <Switch
                            checked={preferences?.newOpportunities ?? true}
                            onCheckedChange={(checked) => handlePreferenceChange('newOpportunities', checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">Deadline Reminders</Label>
                            <p className="text-xs text-slate-500">For saved opportunities</p>
                        </div>
                        <Switch
                            checked={preferences?.deadlineReminders ?? true}
                            onCheckedChange={(checked) => handlePreferenceChange('deadlineReminders', checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">Weekly Digest</Label>
                            <p className="text-xs text-slate-500">Personalized summary every week</p>
                        </div>
                        <Switch
                            checked={preferences?.weeklyDigest ?? true}
                            onCheckedChange={(checked) => handlePreferenceChange('weeklyDigest', checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">School Activity</Label>
                            <p className="text-xs text-slate-500">What's popular at your school</p>
                        </div>
                        <Switch
                            checked={preferences?.schoolActivity ?? true}
                            onCheckedChange={(checked) => handlePreferenceChange('schoolActivity', checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">Application Updates</Label>
                            <p className="text-xs text-slate-500">Status changes for registrations</p>
                        </div>
                        <Switch
                            checked={preferences?.applicationUpdates ?? true}
                            onCheckedChange={(checked) => handlePreferenceChange('applicationUpdates', checked)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}
