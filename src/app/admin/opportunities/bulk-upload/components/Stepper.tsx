import { BulkUploadStep } from '../types';
import { Check, Upload, FileCheck, Table, Save } from 'lucide-react';

interface StepperProps {
    currentStep: BulkUploadStep;
}

export function Stepper({ currentStep }: StepperProps) {
    const steps = [
        { id: 'upload', label: 'Upload File', icon: Upload },
        { id: 'validation', label: 'Validation', icon: FileCheck },
        { id: 'preview', label: 'Preview & Fix', icon: Table },
        { id: 'success', label: 'Save to Drafts', icon: Save },
    ];

    const getCurrentStepIndex = () => {
        return steps.findIndex(s => s.id === currentStep);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />

                {/* Progress Bar Fill */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-background px-2">
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
                  mt-2 text-sm font-medium transition-colors duration-300
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
