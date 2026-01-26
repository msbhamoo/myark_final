"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Sparkles, Trophy, Rocket, GraduationCap,
    School, Heart, ChevronRight, Loader2, Star
} from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStudentAuth } from "@/lib/studentAuth";
import Confetti from "@/components/Confetti";
import { cn } from "@/lib/utils";

// ============================================
// TYPES & CONSTANTS
// ============================================

type OnboardingStep = 'welcome' | 'grade' | 'school' | 'interests';

const INTERESTS_OPTIONS = [
    { label: "Scholarships", emoji: "✨", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { label: "Olympiads", emoji: "🧬", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Coding & AI", emoji: "🤖", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { label: "Sports", emoji: "⚽", color: "bg-green-100 text-green-700 border-green-200" },
    { label: "Design & Arts", emoji: "🎨", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { label: "Public Speaking", emoji: "🎤", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { label: "Quiz & Trivia", emoji: "🧠", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { label: "Space Science", emoji: "🚀", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12];

// ============================================
// COMPONENT
// ============================================

const OnboardingModal = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const {
        student,
        onboardingOpen,
        hideOnboardingModal,
        updateStudent,
        addXPWithPersist
    } = useStudentAuth();

    const [step, setStep] = useState<OnboardingStep>('welcome');
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Form State
    const [grade, setGrade] = useState<number | null>(null);
    const [school, setSchool] = useState('');
    const [city, setCity] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    // Progress Calculation
    const getProgress = () => {
        switch (step) {
            case 'welcome': return 5;
            case 'grade': return 33;
            case 'school': return 66;
            case 'interests': return 95;
            default: return 0;
        }
    };

    // Mascot Message
    const getMascotMessage = () => {
        switch (step) {
            case 'welcome': return "Welcome to the squad! Let's power up your profile for 50 XP! 🚀";
            case 'grade': return "Which class is lucky to have you? 🎓";
            case 'school': return "Where's your home base? School & City help us find local gems! 📍";
            case 'interests': return "What makes you go 'WHOA'? Choose your favorite vibes! ✨";
            default: return "";
        }
    };

    // ============================================
    // HANDLERS
    // ============================================

    const handleNext = () => {
        if (step === 'welcome') setStep('grade');
        else if (step === 'grade') setStep('school');
        else if (step === 'school') setStep('interests');
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            await updateStudent({
                grade: grade || undefined,
                school: school || undefined,
                city: city || undefined,
                interests: selectedInterests,
            });

            // Add Reward XP
            await addXPWithPersist(50);

            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
                hideOnboardingModal();
            }, 2000);
        } catch (error) {
            console.error("Failed to save onboarding:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        hideOnboardingModal();
    };

    // ============================================
    // RENDERERS
    // ============================================

    const renderWelcome = () => (
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
            <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center overflow-hidden border border-primary/20">
                    <img src="/myro.png" alt="Myro" className="w-20 h-20 object-contain" />
                </div>
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground p-1.5 rounded-full shadow-lg"
                >
                    <Star className="w-4 h-4 fill-current" />
                </motion.div>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold">Power-Up Your Profile! ⚡</h3>
                <p className="text-muted-foreground">
                    Complete your profile to unlock <span className="font-bold text-primary">50 XP</span> and get personalized opportunities just for you!
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <Trophy className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unlock</p>
                    <p className="text-sm font-semibold">Rare Badges</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Get</p>
                    <p className="text-sm font-semibold">Perfect Matches</p>
                </div>
            </div>

            <Button onClick={handleNext} className="w-full h-12 text-lg font-bold group">
                Let's Go! <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>

            <button onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                I'll do it later, let me explore
            </button>
        </div>
    );

    const renderGrade = () => (
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h4 className="font-bold">Choose your Grade</h4>
                    <p className="text-sm text-muted-foreground">We'll show you age-appropriate events</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {GRADES.map(g => (
                    <button
                        key={g}
                        onClick={() => {
                            setGrade(g);
                            setTimeout(handleNext, 300);
                        }}
                        className={cn(
                            "h-16 rounded-2xl border-2 font-display font-bold text-lg transition-all",
                            grade === g
                                ? "border-primary bg-primary/10 text-primary shadow-glow-primary"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderSchool = () => (
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <School className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                    <h4 className="font-bold">School & City</h4>
                    <p className="text-sm text-muted-foreground">Find local tournaments near you</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">School Name</p>
                    <Input
                        placeholder="e.g. DPS, St. Mary's..."
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">City</p>
                    <Input
                        placeholder="e.g. Mumbai, Delhi, Jaipur..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                </div>
            </div>

            <Button
                onClick={handleNext}
                className="w-full h-12 text-lg font-bold"
                disabled={!school || !city}
            >
                Almost Done! <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
        </div>
    );

    const renderInterests = () => (
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h4 className="font-bold">What interests you?</h4>
                    <p className="text-sm text-muted-foreground">Pick at least 2 for better results</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map(opt => {
                    const active = selectedInterests.includes(opt.label);
                    return (
                        <button
                            key={opt.label}
                            onClick={() => toggleInterest(opt.label)}
                            className={cn(
                                "flex items-center px-4 py-2.5 rounded-full border-2 transition-all font-bold text-sm",
                                active
                                    ? "bg-primary border-primary text-white shadow-lg scale-105"
                                    : "bg-background border-border hover:border-primary/50"
                            )}
                        >
                            <span className="mr-2">{opt.emoji}</span>
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            <Button
                onClick={handleFinish}
                disabled={loading || selectedInterests.length < 2}
                className="w-full h-14 text-lg font-black uppercase tracking-wider"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Claim 50 XP & Finish 🏆"}
            </Button>
        </div>
    );

    const content = (
        <div className="px-6 py-8 space-y-6 relative overflow-hidden bg-gradient-to-br from-card to-background">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress()}%` }}
                    className="h-full bg-primary glow-primary"
                />
            </div>

            <Confetti isActive={showConfetti} />

            {/* Mascot Tip */}
            {step !== 'welcome' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10 glass-card"
                >
                    <div className="w-12 h-12 flex-shrink-0 bg-primary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                        <img src="/myro.png" alt="Myro" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                        "{getMascotMessage()}"
                    </p>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {step === 'welcome' && renderWelcome()}
                    {step === 'grade' && renderGrade()}
                    {step === 'school' && renderSchool()}
                    {step === 'interests' && renderInterests()}
                </motion.div>
            </AnimatePresence>

            {/* Progress breadcrumbs */}
            {step !== 'welcome' && (
                <div className="flex justify-center gap-1.5 pb-2">
                    {['grade', 'school', 'interests'].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                step === s ? "bg-primary w-6" : s === 'grade' || (s === 'school' && step === 'interests') ? "bg-primary/40" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={onboardingOpen} onOpenChange={(open) => !open && handleClose()}>
                <DrawerContent className="max-h-[90vh]">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Complete Profile</DrawerTitle>
                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={onboardingOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Complete Profile</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
};

export default OnboardingModal;
