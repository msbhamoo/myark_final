/**
 * Admin Theme Settings Page
 * Visual interface for customizing application theme
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeColors, ThemePreset } from '@/types/theme';
import { clearThemeCache } from '@/lib/themeInitializer';
import { Loader2, Save, RotateCcw, Download, Palette } from 'lucide-react';

// Preset themes
const PRESET_THEMES: Record<string, ThemePreset> = {
    green: {
        name: 'green',
        displayName: 'Myark Green',
        description: 'Fresh and vibrant green theme',
        colors: {
            primary: '#58CC02',
            primaryDark: '#3FA001',
            primaryDarker: '#4DBB00',
            accent: '#DFF7C8',
            accentForeground: '#1A2A33',
        },
    },
    blue: {
        name: 'blue',
        displayName: 'Ocean Blue',
        description: 'Professional blue theme',
        colors: {
            primary: '#3B82F6',
            primaryDark: '#2563EB',
            primaryDarker: '#1D4ED8',
            accent: '#DBEAFE',
            accentForeground: '#1E3A8A',
        },
    },
    purple: {
        name: 'purple',
        displayName: 'Royal Purple',
        description: 'Elegant purple theme',
        colors: {
            primary: '#8B5CF6',
            primaryDark: '#7C3AED',
            primaryDarker: '#6D28D9',
            accent: '#EDE9FE',
            accentForeground: '#5B21B6',
        },
    },
    orange: {
        name: 'orange',
        displayName: 'Sunset Orange',
        description: 'Warm orange theme',
        colors: {
            primary: '#F97316',
            primaryDark: '#EA580C',
            primaryDarker: '#C2410C',
            accent: '#FFEDD5',
            accentForeground: '#7C2D12',
        },
    },
};

export default function ThemeSettingsPage() {
    const [colors, setColors] = useState<Partial<ThemeColors>>({
        primary: '#58CC02',
        primaryDark: '#3FA001',
        primaryDarker: '#4DBB00',
        accent: '#DFF7C8',
        accentForeground: '#1A2A33',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Load current theme
    useEffect(() => {
        loadCurrentTheme();
    }, []);

    const loadCurrentTheme = async () => {
        try {
            const response = await fetch('/api/theme');
            const data = await response.json();
            if (data.success && data.theme) {
                setColors(data.theme.colors);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handlePresetSelect = (preset: ThemePreset) => {
        setColors(prev => ({
            ...prev,
            ...preset.colors,
        }));
        setMessage({ type: 'success', text: `Applied ${preset.displayName} theme preset` });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/theme', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ colors }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Clear cache so new theme loads immediately
                clearThemeCache();

                setMessage({ type: 'success', text: 'Theme saved successfully! Refreshing page...' });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save theme' });
            }
        } catch (error) {
            console.error('Failed to save theme:', error);
            setMessage({ type: 'error', text: 'Failed to save theme. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        loadCurrentTheme();
        setMessage({ type: 'success', text: 'Reset to saved theme' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleExport = () => {
        const dataStr = JSON.stringify({ colors }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'myark-theme.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Theme Settings</h1>
                <p className="text-muted-foreground">
                    Customize your application's color scheme. Changes will apply after page refresh.
                </p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preset Themes */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Quick Preset Themes</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.values(PRESET_THEMES).map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handlePresetSelect(preset)}
                                    className="group relative p-4 border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all"
                                >
                                    <div
                                        className="w-full h-20 rounded-lg mb-3 shadow-inner"
                                        style={{
                                            background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.primaryDark})`
                                        }}
                                    />
                                    <p className="font-semibold text-sm">{preset.displayName}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Color Customization */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Custom Colors</h2>

                        <Tabs defaultValue="primary" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="primary">Primary</TabsTrigger>
                                <TabsTrigger value="accent">Accent</TabsTrigger>
                                <TabsTrigger value="semantic">Semantic</TabsTrigger>
                            </TabsList>

                            <TabsContent value="primary" className="space-y-4 mt-6">
                                <ColorPicker
                                    label="Primary Color"
                                    description="Main brand color for buttons, links, and CTAs"
                                    value={colors.primary || '#58CC02'}
                                    onChange={(val) => handleColorChange('primary', val)}
                                />
                                <ColorPicker
                                    label="Primary Dark"
                                    description="Darker shade for gradients and hover states"
                                    value={colors.primaryDark || '#3FA001'}
                                    onChange={(val) => handleColorChange('primaryDark', val)}
                                />
                                <ColorPicker
                                    label="Primary Darker"
                                    description="Darkest shade for accents"
                                    value={colors.primaryDarker || '#4DBB00'}
                                    onChange={(val) => handleColorChange('primaryDarker', val)}
                                />
                            </TabsContent>

                            <TabsContent value="accent" className="space-y-4 mt-6">
                                <ColorPicker
                                    label="Accent Color"
                                    description="Light background color for badges and highlights"
                                    value={colors.accent || '#DFF7C8'}
                                    onChange={(val) => handleColorChange('accent', val)}
                                />
                                <ColorPicker
                                    label="Accent Foreground"
                                    description="Text color on accent backgrounds"
                                    value={colors.accentForeground || '#1A2A33'}
                                    onChange={(val) => handleColorChange('accentForeground', val)}
                                />
                            </TabsContent>

                            <TabsContent value="semantic" className="space-y-4 mt-6">
                                <ColorPicker
                                    label="Success Color"
                                    description="Used for success messages and positive states"
                                    value={colors.success || '#10B981'}
                                    onChange={(val) => handleColorChange('success', val)}
                                />
                                <ColorPicker
                                    label="Warning Color"
                                    description="Used for warning messages"
                                    value={colors.warning || '#F59E0B'}
                                    onChange={(val) => handleColorChange('warning', val)}
                                />
                                <ColorPicker
                                    label="Error Color"
                                    description="Used for error messages and destructive actions"
                                    value={colors.error || '#EF4444'}
                                    onChange={(val) => handleColorChange('error', val)}
                                />
                                <ColorPicker
                                    label="Info Color"
                                    description="Used for informational messages"
                                    value={colors.info || '#3B82F6'}
                                    onChange={(val) => handleColorChange('info', val)}
                                />
                            </TabsContent>
                        </Tabs>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 min-w-[200px]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Theme
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={saving}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={saving}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Preview Panel - 1 column */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-6">Live Preview</h2>
                        <div className="space-y-4">
                            {/* Primary Button */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">Primary Button</Label>
                                <button
                                    className="w-full py-2 px-4 rounded-lg font-medium text-white transition-colors"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    Button
                                </button>
                            </div>

                            {/* Gradient */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">Gradient</Label>
                                <div
                                    className="w-full h-20 rounded-lg"
                                    style={{
                                        background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`
                                    }}
                                />
                            </div>

                            {/* Accent Badge */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">Accent Badge</Label>
                                <div
                                    className="inline-block px-4 py-2 rounded-lg border"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: colors.accentForeground,
                                        borderColor: colors.primary,
                                    }}
                                >
                                    Badge
                                </div>
                            </div>

                            {/* Semantic Colors */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">Semantic Colors</Label>
                                <div className="space-y-2">
                                    <div
                                        className="p-2 rounded text-white text-sm"
                                        style={{ backgroundColor: colors.success }}
                                    >
                                        Success
                                    </div>
                                    <div
                                        className="p-2 rounded text-white text-sm"
                                        style={{ backgroundColor: colors.warning }}
                                    >
                                        Warning
                                    </div>
                                    <div
                                        className="p-2 rounded text-white text-sm"
                                        style={{ backgroundColor: colors.error }}
                                    >
                                        Error
                                    </div>
                                    <div
                                        className="p-2 rounded text-white text-sm"
                                        style={{ backgroundColor: colors.info }}
                                    >
                                        Info
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Color Picker Component
function ColorPicker({
    label,
    description,
    value,
    onChange
}: {
    label: string;
    description?: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label className="font-medium">{label}</Label>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div className="flex gap-3 items-center">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-12 w-20 rounded-lg cursor-pointer border-2 border-border"
                />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 font-mono uppercase"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}
