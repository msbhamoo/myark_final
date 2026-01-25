/**
 * Auth Modal Component
 * Game-like, mobile-first authentication modal/drawer
 * Handles both login and registration flows
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Loader2, Sparkles } from "lucide-react";
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
import { useStudentAuth } from "@/lib/studentAuth";
import MascotFeedback, { type MascotState } from "./MascotFeedback";
import PhoneInput from "./PhoneInput";
import PinInput from "./PinInput";
import Confetti from "@/components/Confetti";

// ============================================
// TYPES
// ============================================

type AuthStep =
    | 'phone'
    | 'pin_create'
    | 'pin_confirm'
    | 'pin_login'
    | 'success';

interface AuthState {
    step: AuthStep;
    mode: 'login' | 'register';
    phone: string;
    pin: string;
    confirmPin: string;
    error: string;
    loading: boolean;
}

// ============================================
// STEP CONFIGURATIONS
// ============================================

const stepConfig: Record<AuthStep, {
    title: string;
    subtitle: string;
    mascotState: MascotState;
    mascotMessage: string;
}> = {
    phone: {
        title: "Let's get started! 🚀",
        subtitle: "Enter your mobile number",
        mascotState: 'idle',
        mascotMessage: "Drop your digits, explorer! 📱",
    },
    pin_create: {
        title: "Create your secret code",
        subtitle: "Pick 4 digits you'll remember",
        mascotState: 'thinking',
        mascotMessage: "Make it memorable, make it yours! 🎯",
    },
    pin_confirm: {
        title: "Confirm your code",
        subtitle: "Enter the same 4 digits again",
        mascotState: 'thinking',
        mascotMessage: "One more time to lock it in! ✨",
    },
    pin_login: {
        title: "Welcome back! 👋",
        subtitle: "Enter your secret code",
        mascotState: 'excited',
        mascotMessage: "Ready to continue your adventure? 🎮",
    },
    success: {
        title: "You're in! 🎉",
        subtitle: "Welcome to MyArk",
        mascotState: 'celebrating',
        mascotMessage: "Let the games begin! 🏆",
    },
};

// ============================================
// AUTH MODAL COMPONENT
// ============================================

const AuthModal = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { authModalOpen, hideAuthModal, authModalOptions, login, register } = useStudentAuth();

    const [state, setState] = useState<AuthState>({
        step: 'phone',
        mode: authModalOptions?.mode || 'login',
        phone: '',
        pin: '',
        confirmPin: '',
        error: '',
        loading: false,
    });

    const [showConfetti, setShowConfetti] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (authModalOpen) {
            setState({
                step: 'phone',
                mode: authModalOptions?.mode || 'login',
                phone: '',
                pin: '',
                confirmPin: '',
                error: '',
                loading: false,
            });
        }
    }, [authModalOpen, authModalOptions]);

    // Get current step config
    const config = stepConfig[state.step];
    const mascotState: MascotState = state.error ? 'concerned' : config.mascotState;
    const mascotMessage = state.error || config.mascotMessage;

    // ============================================
    // HANDLERS
    // ============================================

    const handlePhoneSubmit = useCallback(async () => {
        if (state.phone.length !== 10) {
            setState(s => ({ ...s, error: "Please enter a valid 10-digit mobile number" }));
            return;
        }

        setState(s => ({ ...s, loading: true, error: '' }));

        // Try to detect if this is a new or existing user
        // For simplicity, we'll try login first and switch to register if not found
        const loginResult = await login(state.phone, '0000'); // Dummy PIN to check existence

        if (loginResult.errorCode === 'USER_NOT_FOUND') {
            // New user - go to registration
            setState(s => ({
                ...s,
                loading: false,
                mode: 'register',
                step: 'pin_create',
                error: '',
            }));
        } else if (loginResult.errorCode === 'WRONG_PIN' || loginResult.errorCode === 'RATE_LIMITED') {
            // Existing user - go to login
            setState(s => ({
                ...s,
                loading: false,
                mode: 'login',
                step: 'pin_login',
                error: '',
            }));
        } else if (loginResult.errorCode === 'BLOCKED') {
            setState(s => ({ ...s, loading: false, error: loginResult.error || "Account blocked" }));
        } else {
            // Unknown error or somehow succeeded with dummy PIN (shouldn't happen)
            setState(s => ({
                ...s,
                loading: false,
                mode: 'login',
                step: 'pin_login',
                error: '',
            }));
        }
    }, [state.phone, login]);

    const handlePinCreate = useCallback(() => {
        if (state.pin.length !== 4) {
            setState(s => ({ ...s, error: "PIN must be 4 digits" }));
            return;
        }

        setState(s => ({
            ...s,
            step: 'pin_confirm',
            error: '',
        }));
    }, [state.pin]);

    const handlePinConfirm = useCallback(async () => {
        if (state.confirmPin.length !== 4) {
            setState(s => ({ ...s, error: "Please confirm your PIN" }));
            return;
        }

        if (state.pin !== state.confirmPin) {
            setState(s => ({
                ...s,
                error: "Oops! Those PINs don't match. Try again! 💪",
                confirmPin: '',
            }));
            return;
        }

        setState(s => ({ ...s, loading: true, error: '' }));

        const result = await register(state.phone, state.pin);

        if (result.success) {
            setShowConfetti(true);
            setState(s => ({ ...s, loading: false, step: 'success' }));
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            setState(s => ({
                ...s,
                loading: false,
                error: result.error || "Something went wrong",
            }));
        }
    }, [state.pin, state.confirmPin, state.phone, register]);

    const handlePinLogin = useCallback(async () => {
        if (state.pin.length !== 4) {
            setState(s => ({ ...s, error: "Please enter your 4-digit PIN" }));
            return;
        }

        setState(s => ({ ...s, loading: true, error: '' }));

        const result = await login(state.phone, state.pin);

        if (result.success) {
            setShowConfetti(true);
            setState(s => ({ ...s, loading: false, step: 'success' }));
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            setState(s => ({
                ...s,
                loading: false,
                error: result.error || "Wrong PIN",
                pin: '',
            }));
        }
    }, [state.phone, state.pin, login]);

    const handleBack = useCallback(() => {
        if (state.step === 'pin_create' || state.step === 'pin_login') {
            setState(s => ({ ...s, step: 'phone', pin: '', confirmPin: '', error: '' }));
        } else if (state.step === 'pin_confirm') {
            setState(s => ({ ...s, step: 'pin_create', confirmPin: '', error: '' }));
        }
    }, [state.step]);

    const handleClose = useCallback(() => {
        if (state.step === 'success') {
            // Auto close after success
            hideAuthModal();
        } else {
            hideAuthModal();
        }
    }, [state.step, hideAuthModal]);

    // Auto close after success
    useEffect(() => {
        if (state.step === 'success') {
            const timer = setTimeout(() => {
                hideAuthModal();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [state.step, hideAuthModal]);

    // ============================================
    // RENDER CONTENT
    // ============================================

    const renderContent = () => (
        <div className="flex flex-col items-center px-6 py-8 space-y-6">
            {/* Confetti for success */}
            {showConfetti && <Confetti isActive={showConfetti} />}

            {/* Back button (not on first or success step) */}
            {state.step !== 'phone' && state.step !== 'success' && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleBack}
                    className="absolute top-4 left-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    disabled={state.loading}
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
            )}

            {/* Close button (Only show manual one on mobile/drawer where it's not built-in) */}
            {isMobile && state.step !== 'success' && (
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    disabled={state.loading}
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Mascot */}
            <MascotFeedback
                state={mascotState}
                message={mascotMessage}
            />

            {/* Title & Subtitle */}
            <div className="text-center space-y-1">
                <motion.h2
                    key={config.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display font-bold"
                >
                    {config.title}
                </motion.h2>
                <motion.p
                    key={config.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    {config.subtitle}
                </motion.p>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {state.step === 'phone' && (
                    <motion.div
                        key="phone"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-sm space-y-4"
                    >
                        <PhoneInput
                            value={state.phone}
                            onChange={(phone) => setState(s => ({ ...s, phone, error: '' }))}
                            error={state.error}
                            disabled={state.loading}
                            autoFocus
                            onSubmit={handlePhoneSubmit}
                        />
                        <Button
                            onClick={handlePhoneSubmit}
                            disabled={state.phone.length !== 10 || state.loading}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            {state.loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Continue <Sparkles className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </motion.div>
                )}

                {state.step === 'pin_create' && (
                    <motion.div
                        key="pin_create"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-sm space-y-6"
                    >
                        <PinInput
                            value={state.pin}
                            onChange={(pin) => setState(s => ({ ...s, pin, error: '' }))}
                            error={!!state.error}
                            disabled={state.loading}
                            autoFocus
                            onComplete={handlePinCreate}
                        />
                        <Button
                            onClick={handlePinCreate}
                            disabled={state.pin.length !== 4 || state.loading}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            Lock it in 🔐
                        </Button>
                    </motion.div>
                )}

                {state.step === 'pin_confirm' && (
                    <motion.div
                        key="pin_confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-sm space-y-6"
                    >
                        <PinInput
                            value={state.confirmPin}
                            onChange={(confirmPin) => setState(s => ({ ...s, confirmPin, error: '' }))}
                            error={!!state.error}
                            disabled={state.loading}
                            autoFocus
                            onComplete={handlePinConfirm}
                        />
                        <Button
                            onClick={handlePinConfirm}
                            disabled={state.confirmPin.length !== 4 || state.loading}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            {state.loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Create Account 🚀"
                            )}
                        </Button>
                    </motion.div>
                )}

                {state.step === 'pin_login' && (
                    <motion.div
                        key="pin_login"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-sm space-y-6"
                    >
                        <PinInput
                            value={state.pin}
                            onChange={(pin) => setState(s => ({ ...s, pin, error: '' }))}
                            error={!!state.error}
                            disabled={state.loading}
                            autoFocus
                            onComplete={handlePinLogin}
                        />
                        <Button
                            onClick={handlePinLogin}
                            disabled={state.pin.length !== 4 || state.loading}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            {state.loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Unlock 🔓"
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Forgot your PIN?{' '}
                            <button className="text-primary hover:underline">
                                Get help
                            </button>
                        </p>
                    </motion.div>
                )}

                {state.step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm space-y-4 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                        >
                            <span className="text-xl">🎮</span>
                            <span className="font-bold text-primary">+50 XP</span>
                        </motion.div>
                        <p className="text-muted-foreground">
                            {state.mode === 'register'
                                ? "You've earned your first XP! Start exploring to level up."
                                : "Welcome back! +10 XP for daily login."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger context message */}
            {authModalOptions?.message && state.step === 'phone' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        {authModalOptions.message}
                    </p>
                </motion.div>
            )}
        </div>
    );

    // ============================================
    // RENDER MODAL/DRAWER
    // ============================================

    if (isMobile) {
        return (
            <Drawer open={authModalOpen} onOpenChange={(open) => !open && handleClose()}>
                <DrawerContent className="max-h-[90vh]">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Authenticate</DrawerTitle>
                    </DrawerHeader>
                    {renderContent()}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={authModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Authenticate</DialogTitle>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
