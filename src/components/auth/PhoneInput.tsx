/**
 * Phone Input Component
 * Mobile-first phone number input with Indian format
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    onSubmit?: () => void;
}

const PhoneInput = ({
    value,
    onChange,
    error,
    disabled = false,
    autoFocus = false,
    className = "",
    onSubmit,
}: PhoneInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, max 10
        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
        onChange(digits);
    }, [onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && value.length === 10 && onSubmit) {
            onSubmit();
        }
    }, [value, onSubmit]);

    // Format display value (e.g., "98765 43210")
    const formatDisplayValue = (digits: string): string => {
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    };

    return (
        <div className={cn("space-y-2", className)}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                    "relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200",
                    "bg-muted/30 backdrop-blur-sm",
                    isFocused && !error && "border-primary ring-4 ring-primary/20",
                    !isFocused && !error && "border-border hover:border-primary/50",
                    error && "border-destructive ring-4 ring-destructive/20",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
            >
                {/* Country code indicator */}
                <div className="flex items-center gap-2 pr-3 border-r border-border">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-sm font-medium text-muted-foreground">+91</span>
                </div>

                {/* Phone icon */}
                <Phone className={cn(
                    "w-5 h-5 transition-colors",
                    isFocused ? "text-primary" : "text-muted-foreground"
                )} />

                {/* Input field */}
                <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formatDisplayValue(value)}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    placeholder="98765 43210"
                    className={cn(
                        "flex-1 bg-transparent text-lg font-medium outline-none",
                        "placeholder:text-muted-foreground/50",
                        "tracking-wider"
                    )}
                    aria-label="Mobile number"
                />

                {/* Checkmark for valid number */}
                {value.length === 10 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="text-success text-xl"
                    >
                        âœ“
                    </motion.div>
                )}
            </motion.div>

            {/* Error message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                >
                    <span>âš ï¸</span> {error}
                </motion.p>
            )}

            {/* Helper text */}
            {!error && (
                <p className="text-xs text-muted-foreground">
                    We'll keep your number safe and won't spam you 🔒
                </p>
            )}
        </div>
    );
};

export default PhoneInput;
