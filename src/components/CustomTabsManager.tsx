'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import type { CustomTab, CustomTabType } from '@/types/customTab';

interface CustomTabsManagerProps {
    customTabs: CustomTab[];
    onChange: (tabs: CustomTab[]) => void;
}

export function CustomTabsManager({ customTabs, onChange }: CustomTabsManagerProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const createNewTab = (): CustomTab => ({
        id: `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        label: '',
        type: 'rich-text',
        order: customTabs.length,
        required: false,
        content: { type: 'rich-text', html: '' },
    });

    const handleAddTab = () => {
        const newTab = createNewTab();
        onChange([...customTabs, newTab]);
        setEditingIndex(customTabs.length);
    };

    const handleRemoveTab = (index: number) => {
        const updated = customTabs.filter((_, i) => i !== index);
        // Reorder remaining tabs
        const reordered = updated.map((tab, i) => ({ ...tab, order: i }));
        onChange(reordered);
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...customTabs];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        // Update order values
        const reordered = updated.map((tab, i) => ({ ...tab, order: i }));
        onChange(reordered);
        setEditingIndex(index - 1);
    };

    const handleMoveDown = (index: number) => {
        if (index === customTabs.length - 1) return;
        const updated = [...customTabs];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        // Update order values
        const reordered = updated.map((tab, i) => ({ ...tab, order: i }));
        onChange(reordered);
        setEditingIndex(index + 1);
    };

    const handleUpdateTab = (index: number, updates: Partial<CustomTab>) => {
        const updated = customTabs.map((tab, i) => (i === index ? { ...tab, ...updates } : tab));
        onChange(updated);
    };

    const handleTypeChange = (index: number, newType: CustomTabType) => {
        const tab = customTabs[index];
        let newContent: CustomTab['content'];

        switch (newType) {
            case 'rich-text':
                newContent = { type: 'rich-text', html: '' };
                break;
            case 'list':
                newContent = { type: 'list', items: [] };
                break;
            case 'structured-data':
                newContent = { type: 'structured-data', schema: {} };
                break;
            case 'custom-json':
                newContent = { type: 'custom-json', data: {} };
                break;
        }

        handleUpdateTab(index, { type: newType, content: newContent });
    };

    const handleContentChange = (index: number, content: CustomTab['content']) => {
        handleUpdateTab(index, { content });
    };

    const renderContentEditor = (tab: CustomTab, index: number) => {
        switch (tab.content.type) {
            case 'rich-text':
                return (
                    <div className="space-y-2">
                        <Label>HTML Content</Label>
                        <Textarea
                            value={tab.content.html}
                            onChange={(e) =>
                                handleContentChange(index, { type: 'rich-text', html: e.target.value })
                            }
                            placeholder="Enter HTML content..."
                            rows={6}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            You can use HTML tags for formatting
                        </p>
                    </div>
                );

            case 'list':
                return (
                    <div className="space-y-2">
                        <Label>List Items (one per line)</Label>
                        <Textarea
                            value={tab.content.items.join('\n')}
                            onChange={(e) =>
                                handleContentChange(index, {
                                    type: 'list',
                                    items: e.target.value.split('\n').filter((line) => line.trim()),
                                })
                            }
                            placeholder="Enter list items, one per line..."
                            rows={6}
                        />
                    </div>
                );

            case 'structured-data':
                return (
                    <div className="space-y-2">
                        <Label>Structured Data (JSON)</Label>
                        <Textarea
                            value={JSON.stringify(tab.content.schema, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    handleContentChange(index, { type: 'structured-data', schema: parsed });
                                } catch {
                                    // Invalid JSON, don't update
                                }
                            }}
                            placeholder='{"field": "value"}'
                            rows={8}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter valid JSON for structured data
                        </p>
                    </div>
                );

            case 'custom-json':
                return (
                    <div className="space-y-2">
                        <Label>Custom JSON Data</Label>
                        <Textarea
                            value={JSON.stringify(tab.content.data, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    handleContentChange(index, { type: 'custom-json', data: parsed });
                                } catch {
                                    // Invalid JSON, don't update
                                }
                            }}
                            placeholder='{"key": "value"}'
                            rows={8}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Enter valid JSON data</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Custom Tabs</h3>
                    <p className="text-sm text-muted-foreground">
                        Add custom tabs with different content types
                    </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddTab}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tab
                </Button>
            </div>

            {customTabs.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                    <p>No custom tabs yet. Click "Add Tab" to create one.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {customTabs.map((tab, index) => (
                        <Card key={tab.id} className="p-4">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start gap-2">
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === customTabs.length - 1}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>Tab Label</Label>
                                                <Input
                                                    value={tab.label}
                                                    onChange={(e) => handleUpdateTab(index, { label: e.target.value })}
                                                    placeholder="e.g., Syllabus, Important Dates"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tab Type</Label>
                                                <Select
                                                    value={tab.type}
                                                    onValueChange={(value) => handleTypeChange(index, value as CustomTabType)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="rich-text">Rich Text (HTML)</SelectItem>
                                                        <SelectItem value="list">List (Bullet Points)</SelectItem>
                                                        <SelectItem value="structured-data">Structured Data (JSON)</SelectItem>
                                                        <SelectItem value="custom-json">Custom JSON</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`required-${tab.id}`}
                                                checked={tab.required}
                                                onCheckedChange={(checked) =>
                                                    handleUpdateTab(index, { required: checked === true })
                                                }
                                            />
                                            <Label htmlFor={`required-${tab.id}`} className="font-normal">
                                                Required tab (always visible)
                                            </Label>
                                        </div>

                                        {/* Content Editor */}
                                        {editingIndex === index && renderContentEditor(tab, index)}

                                        {/* Toggle Edit Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        >
                                            {editingIndex === index ? 'Hide Content Editor' : 'Edit Content'}
                                        </Button>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveTab(index)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
