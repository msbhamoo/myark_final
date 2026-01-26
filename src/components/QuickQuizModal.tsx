
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Rocket,
    Trophy,
    Target,
    Zap,
    Clock,
    Globe,
    GraduationCap,
    Lightbulb,
    Search,
    Flame,
    Gem,
    Star
} from "lucide-react";
import { useStudentAuth } from "@/lib/studentAuth";
import { useToast } from "@/hooks/use-toast";
import Confetti from "./Confetti";

interface QuickQuizModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const QUIZ_STEPS = [
    {
        id: "grade",
        title: "Which class are you in? 🎓",
        options: [
            { value: 8, label: "Class 8", emoji: "8️⃣" },
            { value: 9, label: "Class 9", emoji: "9️⃣" },
            { value: 10, label: "Class 10", emoji: "🔟" },
            { value: 11, label: "Class 11", emoji: "1️⃣1️⃣" },
            { value: 12, label: "Class 12", emoji: "🎓" },
            { value: 13, label: "College+", emoji: "🏛️" },
        ],
        mascot: "Hey there! Let's get started. Which grade are you currently crushing? ✨"
    },
    {
        id: "interests",
        title: "What are you interested in right now? 🌈",
        multi: true,
        options: [
            { value: "Scholarships", label: "Scholarships", emoji: "✨" },
            { value: "Olympiads", label: "Olympiads", emoji: "🧬" },
            { value: "AI", label: "AI & Tech", emoji: "🤖" },
            { value: "Sports", label: "Sports", emoji: "⚽" },
            { value: "Art", label: "Art & Design", emoji: "🎨" },
            { value: "Math", label: "Math & STEM", emoji: "📐" },
            { value: "Science", label: "Science", emoji: "🧪" },
            { value: "Writing", label: "Storytelling", emoji: "📚" },
        ],
        mascot: "Ooh, choices! Tap the stuff that makes you go 'Whoa!'. Pick as many as you like. 🎒"
    },
    {
        id: "personaGoal",
        title: "What's your goal vibe? 🎯",
        options: [
            { value: "top_college", label: "Top College 🎓", icon: GraduationCap },
            { value: "skills", label: "Boss Skills 💡", icon: Lightbulb },
            { value: "recognition", label: "Total Fame 🏆", icon: Trophy },
            { value: "exploring", label: "Still Exploring 🔍", icon: Search },
        ],
        mascot: "What's the dream, legend? Where do you want to see yourself next? 💡"
    },
    {
        id: "competitiveness",
        title: "How competitive are you feeling? 🔥",
        options: [
            { value: "chill", label: "Chill Vibes Only 🌊", color: "bg-blue-500" },
            { value: "balanced", label: "Balanced & Ready ⚖️", color: "bg-primary" },
            { value: "beast_mode", label: "Full Beast Mode! 🔥", color: "bg-orange-500" },
        ],
        mascot: "How hard do you want to play? No pressure, just vibes! 🔥"
    },
    {
        id: "weeklyTimeCommitment",
        title: "How much time can you give weekly? ⏱️",
        options: [
            { value: "1_2_hours", label: "1-2 Hours", emoji: "⌛" },
            { value: "3_5_hours", label: "3-5 Hours", emoji: "📅" },
            { value: "5_plus_hours", label: "5+ Hours", emoji: "🔥" },
        ],
        mascot: "Gotta manage that stamina! How much time can you spare from your side-quests? ⏱️"
    },
    {
        id: "deliveryPreference",
        title: "Online or offline opportunities? 🌐📍",
        options: [
            { value: "online", label: "Digital World 🌐", icon: Globe },
            { value: "offline", label: "In-Person 📍", icon: Target },
            { value: "both", label: "Give me Both! ✨", icon: Sparkles },
        ],
        mascot: "Almost there! Do you prefer the matrix or the real world? 📍"
    }
];

const QuickQuizModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const router = useRouter(); // Changed from useNavigate to useRouter
    const { student, updateStudent, addXPWithPersist } = useStudentAuth(); // Corrected destructuring
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (!open) {
            // Reset on close
            setTimeout(() => {
                setCurrentStep(0);
                setAnswers({});
                setShowCelebration(false);
            }, 300);
        }
    }, [open]);

    const handleOptionSelect = (stepId: string, value: any, isMulti: boolean = false) => {
        if (isMulti) {
            const currentAnswers = answers[stepId] || [];
            if (currentAnswers.includes(value)) {
                setAnswers({ ...answers, [stepId]: currentAnswers.filter((v: any) => v !== value) });
            } else {
                setAnswers({ ...answers, [stepId]: [...currentAnswers, value] });
            }
        } else {
            setAnswers({ ...answers, [stepId]: value });
            // Auto advance for single choice
            if (currentStep < QUIZ_STEPS.length - 1) {
                setTimeout(() => setCurrentStep(prev => prev + 1), 300);
            }
        }
    };

    const handleFinish = async () => {
        if (!student) return;
        setIsSubmitting(true);
        try {
            // Update student profile in Firebase
            await updateStudent({
                grade: answers.grade,
                interests: answers.interests || [],
                personaGoal: answers.personaGoal,
                competitiveness: answers.competitiveness,
                weeklyTimeCommitment: answers.weeklyTimeCommitment,
                deliveryPreference: answers.deliveryPreference,
                // Add Pathfinder badge
                badges: [...(student.badges || []), 'pathfinder']
            });

            // Reward XP
            await addXPWithPersist(150);

            setShowCelebration(true);
            toast({
                title: "QUEST COMPLETE! 🏆",
                description: "You've earned 150 XP and the Pathfinder badge!",
                className: "bg-success text-white border-none"
            });

            setTimeout(() => {
                onOpenChange(false);
                setIsSubmitting(false);
                // Redirect to personalized opportunities
                router.push("/?filter=for-you&discovery=complete");
            }, 3000);
        } catch (error) {
            console.error("Quiz completion failed:", error);
            toast({
                title: "Error",
                description: "Failed to save your vibes. Try again!",
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    };

    const step = QUIZ_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === QUIZ_STEPS.length - 1;
    const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-0 overflow-hidden bg-background border-primary/20 sm:rounded-[32px]">
                <Confetti isActive={showCelebration} />

                <div className="relative p-6 md:p-10 pt-12">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Myro Mascot Message */}
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-muted/50 border border-white/5 relative">
                                <div className="w-16 h-16 flex-shrink-0 bg-primary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/myro.png" alt="Myro" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                        "{step.mascot}"
                                    </p>
                                    <div className="absolute -left-2 top-6 w-4 h-4 bg-muted/50 border-l border-b border-white/5 rotate-45" />
                                </div>
                            </div>

                            {/* Question Header */}
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-foreground uppercase">
                                    {step.title}
                                </h2>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {step.options.map((option: any) => {
                                    const isSelected = step.multi
                                        ? (answers[step.id] || []).includes(option.value)
                                        : answers[step.id] === option.value;

                                    const Icon = option.icon;

                                    return (
                                        <motion.button
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleOptionSelect(step.id, option.value, step.multi)}
                                            className={`
                                                relative p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4
                                                ${isSelected
                                                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                                    : "border-white/5 bg-white/5 hover:border-white/20"}
                                            `}
                                        >
                                            <div className={`
                                                w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl transition-all
                                                ${isSelected ? "bg-primary text-white scale-110" : "bg-muted/50 text-muted-foreground"}
                                            `}>
                                                {Icon ? <Icon className="w-6 h-6" /> : <span>{option.emoji || (typeof option.value === 'number' ? (option.value > 12 ? "🎓" : option.value) : "✨")}</span>}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base tracking-tight leading-tight">{option.label}</span>
                                                {isSelected && step.multi && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5"
                                                    >
                                                        Selected ✅
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-10">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={isFirstStep}
                            className="rounded-xl font-bold gap-2 text-muted-foreground"
                        >
                            <ChevronLeft className="w-5 h-5" /> Back
                        </Button>

                        {step.multi || isLastStep ? (
                            <Button
                                onClick={isLastStep ? handleFinish : () => setCurrentStep(prev => prev + 1)}
                                disabled={isSubmitting || (step.multi && (!answers[step.id] || answers[step.id].length === 0))}
                                className="rounded-xl font-black px-8 h-12 gap-2 shadow-glow-primary"
                            >
                                {isLastStep ? (isSubmitting ? "Locking it in..." : "Finalize Mission") : "Next Quest"}
                                {isLastStep ? <Trophy className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuickQuizModal;
