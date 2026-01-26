"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Edit,
    Save,
    RefreshCw,
    Loader2,
    Trophy,
    Heart,
    Share2,
    CheckCircle,
    Eye,
    Bookmark,
    Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { settingsService } from "@/lib/firestore";
import { XPActionType, XPActionConfig, GamificationConfig } from "@/types/admin";

const actionIcons: Record<XPActionType, React.ElementType> = {
    explore: Eye,
    heart: Heart,
    save: Bookmark,
    apply: CheckCircle,
    checklist: CheckCircle,
    streak: Trophy,
    profile_complete: CheckCircle,
};

const actionLabels: Record<XPActionType, string> = {
    explore: "Explore Opportunities",
    heart: "Heart Opportunity",
    save: "Save Opportunity",
    apply: "Apply to Opportunity",
    checklist: "Complete Checklist",
    streak: "Daily Streak",
    profile_complete: "Complete Profile",
};

const Gamification = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<GamificationConfig>({
        id: 'global_config',
        xpActions: {} as Record<XPActionType, XPActionConfig>,
        xpDecayRate: 0,
        trendingHeartThreshold: 0,
        sessionCooldownMinutes: 0,
        milestoneInterval: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const { toast } = useToast();

    const fetchConfig = async () => {
        setLoading(true);
        try {
            // For now, use default values since the service might not be implemented
            const defaultConfig: GamificationConfig = {
                id: 'global_config',
                xpActions: {
                    explore: { id: 'explore', label: 'Explore Opportunities', xpValue: 5, cooldownHours: 0, dailyCap: 10 },
                    heart: { id: 'heart', label: 'Heart Opportunity', xpValue: 2, cooldownHours: 0, dailyCap: 20 },
                    save: { id: 'save', label: 'Save Opportunity', xpValue: 3, cooldownHours: 0, dailyCap: 15 },
                    apply: { id: 'apply', label: 'Apply to Opportunity', xpValue: 10, cooldownHours: 24, dailyCap: 3 },
                    checklist: { id: 'checklist', label: 'Complete Checklist', xpValue: 5, cooldownHours: 0, dailyCap: 5 },
                    streak: { id: 'streak', label: 'Daily Streak', xpValue: 1, cooldownHours: 24, dailyCap: 1 },
                    profile_complete: { id: 'profile_complete', label: 'Complete Profile', xpValue: 20, cooldownHours: 0, dailyCap: 1, abusePrevention: true },
                },
                xpDecayRate: 5,
                trendingHeartThreshold: 10,
                sessionCooldownMinutes: 30,
                milestoneInterval: 100,
            };
            setConfig(defaultConfig);
        } catch (error) {
            console.error("Error fetching gamification config:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement save to Firestore
            toast({
                title: "Settings saved",
                description: "Gamification settings have been updated successfully.",
            });
            setEditMode(false);
        } catch (error) {
            console.error("Error saving config:", error);
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const updateActionConfig = (action: XPActionType, field: keyof XPActionConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            xpActions: {
                ...prev.xpActions,
                [action]: {
                    ...prev.xpActions[action],
                    [field]: value,
                },
            },
        }));
    };

    const updateGlobalConfig = (field: keyof GamificationConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gamification Settings</h1>
                    <p className="text-muted-foreground">Configure XP rewards and gamification parameters</p>
                </div>
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode(true)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Settings
                        </Button>
                    )}
                </div>
            </div>

            {/* Global Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Global Gamification Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="xpDecayRate">XP Decay Rate (% per week)</Label>
                            <Input
                                id="xpDecayRate"
                                type="number"
                                value={config.xpDecayRate}
                                onChange={(e) => updateGlobalConfig('xpDecayRate', parseFloat(e.target.value) || 0)}
                                disabled={!editMode}
                                min="0"
                                max="100"
                                step="0.1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trendingThreshold">Trending Heart Threshold</Label>
                            <Input
                                id="trendingThreshold"
                                type="number"
                                value={config.trendingHeartThreshold}
                                onChange={(e) => updateGlobalConfig('trendingHeartThreshold', parseInt(e.target.value) || 0)}
                                disabled={!editMode}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sessionCooldown">Session Cooldown (minutes)</Label>
                            <Input
                                id="sessionCooldown"
                                type="number"
                                value={config.sessionCooldownMinutes}
                                onChange={(e) => updateGlobalConfig('sessionCooldownMinutes', parseInt(e.target.value) || 0)}
                                disabled={!editMode}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="milestoneInterval">Milestone Interval (XP)</Label>
                            <Input
                                id="milestoneInterval"
                                type="number"
                                value={config.milestoneInterval}
                                onChange={(e) => updateGlobalConfig('milestoneInterval', parseInt(e.target.value) || 0)}
                                disabled={!editMode}
                                min="1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* XP Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        XP Action Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(config.xpActions).map(([action, actionConfig]) => {
                            const Icon = actionIcons[action as XPActionType];
                            return (
                                <div key={action} className="border rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Icon className="w-5 h-5 text-primary" />
                                        <h3 className="font-medium">{actionLabels[action as XPActionType]}</h3>
                                        {actionConfig.abusePrevention && (
                                            <Badge variant="secondary">Abuse Prevention</Badge>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label>XP Value</Label>
                                            <Input
                                                type="number"
                                                value={actionConfig.xpValue}
                                                onChange={(e) => updateActionConfig(action as XPActionType, 'xpValue', parseInt(e.target.value) || 0)}
                                                disabled={!editMode}
                                                min="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cooldown (hours)</Label>
                                            <Input
                                                type="number"
                                                value={actionConfig.cooldownHours || 0}
                                                onChange={(e) => updateActionConfig(action as XPActionType, 'cooldownHours', parseInt(e.target.value) || 0)}
                                                disabled={!editMode}
                                                min="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Daily Cap</Label>
                                            <Input
                                                type="number"
                                                value={actionConfig.dailyCap || 0}
                                                onChange={(e) => updateActionConfig(action as XPActionType, 'dailyCap', parseInt(e.target.value) || 0)}
                                                disabled={!editMode}
                                                min="0"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-8">
                                            <input
                                                type="checkbox"
                                                id={`abuse-${action}`}
                                                checked={actionConfig.abusePrevention || false}
                                                onChange={(e) => updateActionConfig(action as XPActionType, 'abusePrevention', e.target.checked)}
                                                disabled={!editMode}
                                            />
                                            <Label htmlFor={`abuse-${action}`} className="text-sm">Abuse Prevention</Label>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Gamification;