import { Check, LucideIcon } from 'lucide-react';

export interface Step {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />

                {/* Progress Bar Fill */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;
                    const isClickable = onStepClick && index <= currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center bg-background px-2 ${isClickable ? 'cursor-pointer' : ''}`}
                            onClick={() => isClickable && onStepClick(index)}
                        >
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : isCurrent
                                            ? 'border-orange-500 text-orange-500 bg-background ring-4 ring-orange-500/20'
                                            : 'border-muted-foreground/30 text-muted-foreground bg-background'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <span
                                className={`
                  mt-2 text-sm font-medium transition-colors duration-300 hidden md:block
                  ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
