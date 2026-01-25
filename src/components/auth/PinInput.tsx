/**
 * PIN Input Component
 * Game-like 4-digit PIN entry with animations
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    error?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    onComplete?: (pin: string) => void;
}

const PinInput = ({
    value,
    onChange,
    length = 4,
    error = false,
    disabled = false,
    autoFocus = false,
    className = "",
    onComplete,
}: PinInputProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Auto-focus first input
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    // Handle completion callback
    useEffect(() => {
        if (value.length === length && onComplete) {
            onComplete(value);
        }
    }, [value, length, onComplete]);

    const handleChange = useCallback((index: number, inputValue: string) => {
        // Only allow digits
        const digit = inputValue.replace(/\D/g, '').slice(-1);

        if (digit) {
            const newValue = value.slice(0, index) + digit + value.slice(index + 1);
            onChange(newValue.slice(0, length));

            // Auto-advance to next input
            if (index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    }, [value, onChange, length]);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            e.preventDefault();

            if (value[index]) {
                // Clear current digit
                const newValue = value.slice(0, index) + value.slice(index + 1);
                onChange(newValue);
            } else if (index > 0) {
                // Move to previous input and clear it
                inputRefs.current[index - 1]?.focus();
                const newValue = value.slice(0, index - 1) + value.slice(index);
                onChange(newValue);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [value, onChange, length]);

    const handleFocus = useCallback((index: number) => {
        setFocusedIndex(index);
        // Select input content on focus
        inputRefs.current[index]?.select();
    }, []);

    const handleBlur = useCallback(() => {
        setFocusedIndex(null);
    }, []);

    // Handle paste
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pastedData) {
            onChange(pastedData);
            // Focus the last filled input or the next empty one
            const focusIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    }, [onChange, length]);

    const slots = Array.from({ length }, (_, i) => i);

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-3",
                className
            )}
            onPaste={handlePaste}
        >
            {slots.map((index) => {
                const isFilled = !!value[index];
                const isFocused = focusedIndex === index;
                const isActive = index === value.length || (index === length - 1 && value.length === length);

                return (
                    <motion.div
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                    >
                        {/* Input container */}
                        <motion.div
                            className={cn(
                                "relative w-14 h-16 rounded-xl border-2 flex items-center justify-center",
                                "bg-muted/30 backdrop-blur-sm transition-all duration-200",
                                isFocused && "border-primary ring-4 ring-primary/20",
                                isActive && !isFocused && "border-primary/50",
                                !isFocused && !isActive && "border-border",
                                error && "border-destructive ring-4 ring-destructive/20",
                                disabled && "opacity-50 cursor-not-allowed",
                            )}
                            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Hidden input */}
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={value[index] || ''}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onFocus={() => handleFocus(index)}
                                onBlur={handleBlur}
                                disabled={disabled}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label={`PIN digit ${index + 1}`}
                            />

                            {/* Display dot or empty */}
                            <AnimatePresence mode="wait">
                                {isFilled ? (
                                    <motion.div
                                        key="dot"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className={cn(
                                            "w-4 h-4 rounded-full",
                                            error ? "bg-destructive" : "bg-primary"
                                        )}
                                    />
                                ) : isFocused ? (
                                    <motion.div
                                        key="cursor"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-0.5 h-8 bg-primary rounded-full"
                                    />
                                ) : null}
                            </AnimatePresence>
                        </motion.div>

                        {/* Success sparkle effect */}
                        <AnimatePresence>
                            {isFilled && !error && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="absolute -top-1 -right-1 text-sm"
                                >
                                    ✨
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PinInput;
