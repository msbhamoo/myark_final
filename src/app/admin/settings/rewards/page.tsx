'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RewardConfig {
    enabled: boolean;
    pointsPerShare: number;
    pointsPerClick: number;
    pointsPerConversion: number;
}

export default function RewardsSettingsPage() {
    const [config, setConfig] = useState<RewardConfig>({
        enabled: true,
        pointsPerShare: 10,
        pointsPerClick: 2,
        pointsPerConversion: 50,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/rewards/config');
            if (response.ok) {
                const data = await response.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/rewards/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setConfig({
            enabled: true,
            pointsPerShare: 10,
            pointsPerClick: 2,
            pointsPerConversion: 50,
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Reward System Settings</h1>
                <p className="text-gray-600 mt-1">Manage gamification and reward configuration</p>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Enable/Disable Toggle */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label htmlFor="rewards-toggle" className="text-lg font-semibold">
                            🏆 Enable Reward System
                        </Label>
                        <p className="text-sm text-gray-600">
                            {config.enabled
                                ? 'Rewards are active - users can see points and badges'
                                : 'Rewards are hidden - points still calculated in background'}
                        </p>
                    </div>
                    <Switch
                        id="rewards-toggle"
                        checked={config.enabled}
                        onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                    />
                </div>
            </Card>

            {/* Points Configuration */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Points Configuration</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Points per Share */}
                        <div className="space-y-2">
                            <Label htmlFor="pointsPerShare">Points per Share</Label>
                            <Input
                                id="pointsPerShare"
                                type="number"
                                min="0"
                                value={config.pointsPerShare}
                                onChange={(e) => setConfig({ ...config, pointsPerShare: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-gray-500">Awarded when user shares an opportunity</p>
                        </div>

                        {/* Points per Click */}
                        <div className="space-y-2">
                            <Label htmlFor="pointsPerClick">Points per Click</Label>
                            <Input
                                id="pointsPerClick"
                                type="number"
                                min="0"
                                value={config.pointsPerClick}
                                onChange={(e) => setConfig({ ...config, pointsPerClick: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-gray-500">Awarded when someone clicks their share</p>
                        </div>

                        {/* Points per Conversion */}
                        <div className="space-y-2">
                            <Label htmlFor="pointsPerConversion">Points per Conversion</Label>
                            <Input
                                id="pointsPerConversion"
                                type="number"
                                min="0"
                                value={config.pointsPerConversion}
                                onChange={(e) => setConfig({ ...config, pointsPerConversion: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-gray-500">Awarded when visitor converts</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Badges Info */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Available Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">🎉</div>
                        <h3 className="font-semibold">First Share</h3>
                        <p className="text-sm text-gray-600">Awarded at 1 share</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">🌟</div>
                        <h3 className="font-semibold">Super Sharer</h3>
                        <p className="text-sm text-gray-600">Awarded at 10 shares</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">⭐</div>
                        <h3 className="font-semibold">Mega Sharer</h3>
                        <p className="text-sm text-gray-600">Awarded at 50 shares</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="font-semibold">Viral Master</h3>
                        <p className="text-sm text-gray-600">Awarded at 100 clicks</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">💫</div>
                        <h3 className="font-semibold">Influencer</h3>
                        <p className="text-sm text-gray-600">Awarded at 500 clicks</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-2">💎</div>
                        <h3 className="font-semibold">Converter</h3>
                        <p className="text-sm text-gray-600">Awarded at 50 conversions</p>
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={handleSave} disabled={saving} className="px-8">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleReset} variant="outline">
                    Reset to Defaults
                </Button>
            </div>

            {/* Important Note */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Points and badges are always calculated in the background, even when rewards are disabled.
                    This ensures no data is lost when you re-enable the system.
                </p>
            </Card>
        </div>
    );
}
