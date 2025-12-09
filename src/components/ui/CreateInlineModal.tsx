'use client';

import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
}

interface CreateInlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, string>) => Promise<void>;
    title: string;
    description?: string;
    fields: FieldConfig[];
    submitLabel?: string;
    accentColor?: string;
}

export function CreateInlineModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    fields,
    submitLabel = 'Create',
    accentColor = 'violet'
}: CreateInlineModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate required fields
        for (const field of fields) {
            if (field.required && !formData[field.name]?.trim()) {
                setError(`${field.label} is required`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({});
            onClose();
        } catch (err) {
            setError((err as Error).message || 'Failed to create');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({});
        setError(null);
        onClose();
    };

    const accentColors: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
        violet: {
            bg: 'bg-violet-500',
            border: 'border-violet-500',
            text: 'text-violet-600 dark:text-violet-400',
            gradient: 'from-violet-600 to-purple-600'
        },
        emerald: {
            bg: 'bg-emerald-500',
            border: 'border-emerald-500',
            text: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-600 to-teal-600'
        },
        orange: {
            bg: 'bg-orange-500',
            border: 'border-orange-500',
            text: 'text-orange-600 dark:text-orange-400',
            gradient: 'from-orange-600 to-amber-600'
        }
    };

    const colors = accentColors[accentColor] || accentColors.violet;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={cn('px-6 py-4 bg-gradient-to-r', colors.gradient)}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/20">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{title}</h3>
                                {description && (
                                    <p className="text-sm text-white/70">{description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="text-sm font-medium text-foreground dark:text-white">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                                <Textarea
                                    value={formData[field.name] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    placeholder={field.placeholder}
                                    className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white resize-none"
                                    rows={3}
                                />
                            ) : field.type === 'select' && field.options ? (
                                <select
                                    value={formData[field.name] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    className="h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
                                >
                                    <option value="">Select {field.label.toLowerCase()}</option>
                                    {field.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    value={formData[field.name] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    placeholder={field.placeholder}
                                    className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
                                />
                            )}
                        </div>
                    ))}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn('flex-1 text-white', colors.bg, `hover:${colors.bg}/90`)}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
