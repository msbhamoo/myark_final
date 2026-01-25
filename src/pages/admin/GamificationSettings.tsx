import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Clock,
    Shield,
    TrendingUp,
    Save,
    Loader2,
    Heart,
    Search,
    Target,
    Flame,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { gamificationService } from "@/lib/gamificationService";
import { GamificationConfig, XPActionType } from "@/types/admin";

const GamificationSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<GamificationConfig | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await gamificationService.getConfig();
                setConfig(data);
            } catch (error) {
                console.error("Error fetching config:", error);
                toast({ title: "Error", description: "Failed to load gamification settings", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        try {
            await gamificationService.updateConfig(config);
            toast({ title: "Success", description: "Config updated successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save config", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const updateAction = (id: XPActionType, field: string, value: any) => {
        if (!config) return;
        setConfig({
            ...config,
            xpActions: {
                ...config.xpActions,
                [id]: {
                    ...config.xpActions[id],
                    [field]: value
                }
            }
        });
    };

    if (loading || !config) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-display">Gamification Engine</h2>
                    <p className="text-muted-foreground text-sm">Control the economy, social signals, and reward values</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg shadow-primary/20">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Config
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* XP Values Configuration */}
                <Card className="lg:col-span-8 bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-secondary" />
                            XP Action Values
                        </CardTitle>
                        <CardDescription>Configure how many XP points are awarded for student actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.entries(config.xpActions) as [XPActionType, any][]).map(([id, action]) => {
                                const Icon = id === 'explore' ? Search :
                                    id === 'heart' ? Heart :
                                        id === 'save' ? Award :
                                            id === 'apply' ? Target :
                                                id === 'checklist' ? Shield :
                                                    id === 'streak' ? Flame : Zap;
                                return (
                                    <div key={id} className="p-4 rounded-2xl bg-muted/30 border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-white/5">
                                                    <Icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <Label className="font-bold text-sm">{action.label}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-center font-bold text-primary bg-background border-transparent"
                                                    value={action.xpValue}
                                                    onChange={(e) => updateAction(id, 'xpValue', Number(e.target.value))}
                                                />
                                                <span className="text-[10px] font-black uppercase opacity-50">XP</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-black uppercase opacity-50">Cooldown (Hours)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="h-8 text-xs bg-background/50 border-transparent"
                                                    value={action.cooldownHours || 0}
                                                    onChange={(e) => updateAction(id, 'cooldownHours', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-black uppercase opacity-50">Daily Cap</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Unlimited"
                                                    className="h-8 text-xs bg-background/50 border-transparent"
                                                    value={action.dailyCap || 0}
                                                    onChange={(e) => updateAction(id, 'dailyCap', e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <Label className="text-[10px] font-black uppercase opacity-50">Abuse Protection</Label>
                                            <Switch
                                                checked={action.abusePrevention || false}
                                                onCheckedChange={(v) => updateAction(id, 'abusePrevention', v)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Global Mechanics */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <TrendingUp className="w-5 h-5" />
                                Social Velocity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">Trending Heart Threshold</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        className="font-bold text-lg"
                                        value={config.trendingHeartThreshold}
                                        onChange={(e) => setConfig({ ...config, trendingHeartThreshold: Number(e.target.value) })}
                                    />
                                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Hearts required before an opportunity is flagged as "Trending Now"</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">Session Cooldown (Min)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        className="font-bold text-lg"
                                        value={config.sessionCooldownMinutes}
                                        onChange={(e) => setConfig({ ...config, sessionCooldownMinutes: Number(e.target.value) })}
                                    />
                                    <Clock className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Time required before a student can "Hype" the same opportunity again</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
                        <CardHeader className="bg-destructive/5">
                            <CardTitle className="flex items-center gap-2 text-destructive font-display">
                                <Shield className="w-5 h-5" />
                                XP Decay & Economy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-bold">Enable XP Decay</Label>
                                    <Switch />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider">Passive XP loss for inactive students</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">Weekly Decay Rate (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 2"
                                    className="font-bold border-destructive/20"
                                    value={config.xpDecayRate || 0}
                                    onChange={(e) => setConfig({ ...config, xpDecayRate: Number(e.target.value) })}
                                />
                                <p className="text-[10px] text-muted-foreground">Students lose this % of total XP after 7 days of inactivity</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GamificationSettings;
