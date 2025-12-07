import { BulkUploadStep } from '../types';
import { CheckCircle, Upload, FileCheck, CircleDot } from 'lucide-react';

interface StepperProps {
    currentStep: BulkUploadStep;
}

const STEPS: { key: BulkUploadStep; label: string; icon: typeof Upload }[] = [
    { key: 'upload', label: 'Upload File', icon: Upload },
    { key: 'validation', label: 'Validation', icon: FileCheck },
    { key: 'preview', label: 'Preview & Fix', icon: CircleDot },
    { key: 'success', label: 'Complete', icon: CheckCircle },
];

export function Stepper({ currentStep }: StepperProps) {
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                                        ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-orange-500 text-white ring-4 ring-orange-500/20'
                                                : 'bg-muted text-muted-foreground'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span
                                    className={`
                                        mt-2 text-xs font-medium
                                        ${isCurrent ? 'text-orange-500' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}
                                    `}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`
                                        flex-1 h-0.5 mx-4 transition-colors
                                        ${index < currentIndex ? 'bg-green-500' : 'bg-muted'}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
