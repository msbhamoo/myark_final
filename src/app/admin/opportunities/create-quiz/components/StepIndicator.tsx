interface Step {
    id: number;
    name: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (stepId: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    const isUpcoming = step.id > currentStep;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <button
                                onClick={() => onStepClick(step.id)}
                                className={`flex flex-col items-center group transition-all ${isCurrent ? 'scale-110' : ''
                                    }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>

                                <div className="mt-2 text-center">
                                    <p
                                        className={`text-sm font-medium ${isCurrent
                                                ? 'text-indigo-700 dark:text-indigo-400'
                                                : isCompleted
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {step.name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {step.description}
                                    </p>
                                </div>
                            </button>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-4 transition-all ${step.id < currentStep
                                            ? 'bg-green-500'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                    style={{ marginTop: '-40px' }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
