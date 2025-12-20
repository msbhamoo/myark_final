'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    X,
    Save,
    LayoutList,
    GraduationCap,
    Sparkles,
    Loader2,
    Wand2,
    ImageIcon,
    Trash2,
    PlusCircle,
    BookOpen,
    IndianRupee,
    Info,
    Rocket
} from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import { CareerFormState } from '../types';
import { defaultCareerForm, careerToFormState, formStateToCareer, joinLines } from '../utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { INTEREST_CHIPS } from '@/constants/careers';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface CareerFormProps {
    editingSlug: string | null;
    career: any | null;
    onSubmit: (payload: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function CareerForm({
    editingSlug,
    career,
    onSubmit,
    onCancel,
    isSubmitting,
}: CareerFormProps) {
    const [formState, setFormState] = useState<CareerFormState>(defaultCareerForm);
    const [error, setError] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    // AI fetch states
    const [aiFetching, setAiFetching] = useState(false);
    const [aiProgress, setAiProgress] = useState('');

    useEffect(() => {
        if (career && editingSlug) {
            setFormState(careerToFormState(career));
        } else {
            setFormState(defaultCareerForm);
        }
    }, [career, editingSlug]);

    const handleSubmit = async () => {
        setError(null);
        if (!formState.title) {
            setError('Title is required');
            return;
        }
        if (!formState.slug) {
            setError('Slug is required');
            return;
        }

        try {
            const payload = formStateToCareer(formState);
            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        }
    };

    const handleAiFetchDetails = async () => {
        if (!formState.title || formState.title.trim().length < 3) {
            setError('Please enter at least 3 characters for the career title');
            return;
        }

        setAiFetching(true);
        setError(null);
        try {
            setAiProgress('🔍 Searching web and analyzing career path...');
            const response = await fetch('/api/admin/ai/fetch-career-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: formState.title }),
            });

            if (!response.ok) throw new Error('AI Fetch failed');
            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            const data = result.data;
            setFormState(prev => ({
                ...prev,
                category: data.category || prev.category,
                shortDescription: data.shortDescription || prev.shortDescription,
                fullDescription: data.fullDescription || prev.fullDescription,
                keywordsText: (data.keywords || []).join('\n') || prev.keywordsText,
                roadmapText: (data.roadmap || []).map((r: any) => `${r.title}|${r.description}`).join('\n') || prev.roadmapText,
                salaryMin: data.salary?.min?.toString() || prev.salaryMin,
                salaryMax: data.salary?.max?.toString() || prev.salaryMax,
                salaryNote: data.salaryNote || prev.salaryNote,
                examsText: (data.exams || []).join('\n') || prev.examsText,
                collegesIndiaText: (data.collegesIndia || []).join('\n') || prev.collegesIndiaText,
                collegesGlobalText: (data.collegesGlobal || []).join('\n') || prev.collegesGlobalText,
                degreesText: (data.degrees || []).join('\n') || prev.degreesText,
                relatedCareersText: (data.relatedCareers || []).join('\n') || prev.relatedCareersText,
                didYouKnowText: (data.didYouKnow || []).join('\n') || prev.didYouKnowText,
                goodStuffText: (data.goodStuff || []).join('\n') || prev.goodStuffText,
                challengesText: (data.challenges || []).join('\n') || prev.challengesText,
                slug: prev.slug || formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
            }));
        } catch (err) {
            console.error('AI error:', err);
            setError((err as Error).message);
        } finally {
            setAiFetching(false);
            setAiProgress('');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        try {
            const options = { maxSizeMB: 1.5, maxWidthOrHeight: 1200, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            setFormState(prev => ({ ...prev, images: [...prev.images, data.url] }));
        } catch (err) {
            console.error(err);
            setError('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormState(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-800/50 p-6 shadow-xl">
            <div className="relative mb-8 -mx-6 -mt-6 px-6 py-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onCancel} className="text-white/80 hover:text-white hover:bg-white/10">
                            <X className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {editingSlug ? '✏️ Edit Career' : '✨ Add New Career'}
                            </h2>
                            <p className="text-sm text-white/70">
                                {editingSlug ? `Updating ${editingSlug}` : 'Create a new career explorer page'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-white text-indigo-700 hover:bg-white/90 font-semibold shadow-lg transition-all active:scale-95"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Saving...' : 'Save Career'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    {error}
                </div>
            )}

            <Accordion type="multiple" defaultValue={['basic', 'content', 'roadmap', 'colleges']} className="space-y-4">

                {/* 1. Basic Info */}
                <AccordionItem value="basic" className="border-l-4 border-l-indigo-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]]:bg-indigo-50/50 dark:[&[data-state=open]]:bg-indigo-900/10">
                        <div className="flex items-center gap-3">
                            <LayoutList className="h-5 w-5 text-indigo-600" />
                            <div className="text-left">
                                <p className="font-semibold text-indigo-700 dark:text-indigo-300">Basic Info & Identity</p>
                                <p className="text-xs text-indigo-600/70">Title, slug, category, and AI tools</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Career Title *</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formState.title}
                                        onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g. Ethical Hacker"
                                    />
                                    <Button
                                        onClick={handleAiFetchDetails}
                                        disabled={aiFetching || formState.title.length < 3}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {aiFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                                        AI Info
                                    </Button>
                                </div>
                                {aiProgress && <p className="text-[10px] text-indigo-500 animate-pulse">{aiProgress}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug * (uniquely identifies career)</label>
                                <Input
                                    value={formState.slug}
                                    onChange={e => setFormState(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') }))}
                                    placeholder="ethical-hacker"
                                    disabled={!!editingSlug}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    value={formState.category}
                                    onChange={e => setFormState(prev => ({ ...prev, category: e.target.value }))}
                                    placeholder="Technology"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Color (Tailwind classes)</label>
                                <Input
                                    value={formState.categoryColor}
                                    onChange={e => setFormState(prev => ({ ...prev, categoryColor: e.target.value }))}
                                    placeholder="bg-blue-100 text-blue-800"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. Descriptions */}
                <AccordionItem value="content" className="border-l-4 border-l-blue-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <div className="text-left">
                                <p className="font-semibold text-blue-700 dark:text-blue-300">Descriptions & Keywords</p>
                                <p className="text-xs text-blue-600/70">Marketing text and search optimizations</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Description (Card view)</label>
                            <Textarea
                                value={formState.shortDescription}
                                onChange={e => setFormState(prev => ({ ...prev, shortDescription: e.target.value }))}
                                placeholder="Brief overview for the search results..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Description (HTML enabled)</label>
                            <div className="rounded-lg border border-border/60 bg-white dark:bg-slate-950 overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formState.fullDescription}
                                    onChange={val => setFormState(prev => ({ ...prev, fullDescription: val }))}
                                    className="min-h-[200px]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Keywords (One per line)</label>
                            <Textarea
                                value={formState.keywordsText}
                                onChange={e => setFormState(prev => ({ ...prev, keywordsText: e.target.value }))}
                                placeholder="Cybersecurity&#10;Hacking&#10;Security Specialist"
                                rows={4}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. Salary & Roadmap */}
                <AccordionItem value="roadmap" className="border-l-4 border-l-cyan-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <IndianRupee className="h-5 w-5 text-cyan-600" />
                            <div className="text-left">
                                <p className="font-semibold text-cyan-700 dark:text-cyan-300">Salary & Roadmap</p>
                                <p className="text-xs text-cyan-600/70">Earnings and the path to success</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Min Salary (INR/Year)</label>
                                <Input
                                    type="number"
                                    value={formState.salaryMin}
                                    onChange={e => setFormState(prev => ({ ...prev, salaryMin: e.target.value }))}
                                    placeholder="400000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Max Salary (INR/Year)</label>
                                <Input
                                    type="number"
                                    value={formState.salaryMax}
                                    onChange={e => setFormState(prev => ({ ...prev, salaryMax: e.target.value }))}
                                    placeholder="2000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Salary Note</label>
                                <Input
                                    value={formState.salaryNote}
                                    onChange={e => setFormState(prev => ({ ...prev, salaryNote: e.target.value }))}
                                    placeholder="Depends on experience and certifications"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Career Roadmap (Format: Title|Description - One per line)</label>
                            <Textarea
                                value={formState.roadmapText}
                                onChange={e => setFormState(prev => ({ ...prev, roadmapText: e.target.value }))}
                                placeholder="Class 12th|Science/Maths recommended&#10;Graduation|B.Tech/BCA in IT"
                                rows={6}
                                className="font-mono text-xs"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. Education & Colleges */}
                <AccordionItem value="colleges" className="border-l-4 border-l-purple-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            <div className="text-left">
                                <p className="font-semibold text-purple-700 dark:text-purple-300">Education & Institutions</p>
                                <p className="text-xs text-purple-600/70">Exams, degrees, and top colleges</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Top Colleges (India)</label>
                                <Textarea
                                    value={formState.collegesIndiaText}
                                    onChange={e => setFormState(prev => ({ ...prev, collegesIndiaText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Global Top Colleges</label>
                                <Textarea
                                    value={formState.collegesGlobalText}
                                    onChange={e => setFormState(prev => ({ ...prev, collegesGlobalText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Entrance Exams</label>
                                <Textarea
                                    value={formState.examsText}
                                    onChange={e => setFormState(prev => ({ ...prev, examsText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Required Degrees</label>
                                <Textarea
                                    value={formState.degreesText}
                                    onChange={e => setFormState(prev => ({ ...prev, degreesText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. Extras (Did you know, Pros/Cons) */}
                <AccordionItem value="extras" className="border-l-4 border-l-slate-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-slate-600" />
                            <div className="text-left">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">The "Extra" Stuff</p>
                                <p className="text-xs text-slate-600/70">Fun facts, pros, cons, and related fields</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-green-600 flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4" /> The Good Stuff
                                </label>
                                <Textarea
                                    value={formState.goodStuffText}
                                    onChange={e => setFormState(prev => ({ ...prev, goodStuffText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-red-600 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Challenges
                                </label>
                                <Textarea
                                    value={formState.challengesText}
                                    onChange={e => setFormState(prev => ({ ...prev, challengesText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Did You Know?</label>
                                <Textarea
                                    value={formState.didYouKnowText}
                                    onChange={e => setFormState(prev => ({ ...prev, didYouKnowText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Related Careers</label>
                                <Textarea
                                    value={formState.relatedCareersText}
                                    onChange={e => setFormState(prev => ({ ...prev, relatedCareersText: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 6. Media / Images (Multi-upload) */}
                <AccordionItem value="media" className="border-l-4 border-l-orange-500 rounded-xl border border-border/40 bg-white/50 dark:bg-black/20 overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="h-5 w-5 text-orange-600" />
                            <div className="text-left">
                                <p className="font-semibold text-orange-700 dark:text-orange-300">Gallery & Carousel</p>
                                <p className="text-xs text-orange-600/70">Upload multiple images for the page</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {formState.images.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square rounded-xl border border-border/60 overflow-hidden bg-slate-200">
                                    <img src={img} className="h-full w-full object-cover" alt={`Career ${idx}`} />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border/60 hover:border-indigo-500 hover:bg-slate-50 transition-all cursor-pointer group">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
                                {imageUploading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : <PlusCircle className="h-6 w-6 text-slate-400 group-hover:text-indigo-500" />}
                                <span className="text-[10px] mt-2 text-slate-400 font-medium">Add Image</span>
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>

            <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-border/60">
                <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {editingSlug ? 'Update Career' : 'Publish Career'}
                </Button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
                <Rocket className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                    <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Quick Tip</p>
                    <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80">
                        Use the "AI Info" button after entering a title to save hours of research. Gemini 2.0 will find current salaries, top colleges, and entrance exams in India automatically.
                    </p>
                </div>
            </div>
        </section>
    );
}
