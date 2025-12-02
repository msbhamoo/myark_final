'use client';

import { useState } from 'react';
import { QuizCreatorFormState, QuizQuestion, QuizOption, QuestionType, QuizSettings } from '@/types/quiz';

interface QuizBuilderStepProps {
    formState: QuizCreatorFormState;
    updateFormState: (updates: Partial<QuizCreatorFormState>) => void;
}

export default function QuizBuilderStep({ formState, updateFormState }: QuizBuilderStepProps) {
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

    const handleAddQuestion = (question: QuizQuestion) => {
        const updatedQuestions = [...formState.questions, question];
        updateFormState({ questions: updatedQuestions });
        setIsAddingQuestion(false);
    };

    const handleEditQuestion = (question: QuizQuestion) => {
        const updatedQuestions = formState.questions.map((q) =>
            q.id === question.id ? question : q
        );
        updateFormState({ questions: updatedQuestions });
        setEditingQuestion(null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        if (confirm('Are you sure you want to delete this question?')) {
            const updatedQuestions = formState.questions.filter((q) => q.id !== questionId);
            updateFormState({ questions: updatedQuestions });
        }
    };

    const handleReorderQuestion = (questionId: string, direction: 'up' | 'down') => {
        const index = formState.questions.findIndex((q) => q.id === questionId);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === formState.questions.length - 1)
        ) {
            return;
        }

        const newQuestions = [...formState.questions];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];

        // Update order numbers
        newQuestions.forEach((q, i) => {
            q.order = i + 1;
        });

        updateFormState({ questions: newQuestions });
    };

    const handleSettingChange = (field: keyof QuizSettings, value: any) => {
        updateFormState({
            settings: {
                ...formState.settings,
                [field]: value,
            },
        });
    };

    const totalMarks = formState.questions.reduce((sum, q) => sum + q.marks, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Builder</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formState.questions.length} questions • {totalMarks} total marks
                    </p>
                </div>
                <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Question
                </button>
            </div>

            {/* Quiz Settings */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-indigo-200 dark:border-gray-500">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quiz Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Total Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="300"
                            value={formState.settings.totalDuration}
                            onChange={(e) => handleSettingChange('totalDuration', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.shuffleQuestions}
                                onChange={(e) => handleSettingChange('shuffleQuestions', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Shuffle questions for each participant
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.shuffleOptions}
                                onChange={(e) => handleSettingChange('shuffleOptions', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Shuffle answer options
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.showInstantResults}
                                onChange={(e) => handleSettingChange('showInstantResults', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Show instant results after submission
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.allowReview}
                                onChange={(e) => handleSettingChange('allowReview', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Allow reviewing answers before submit
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.showExplanations}
                                onChange={(e) => handleSettingChange('showExplanations', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Show explanations after submission
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formState.settings.enableNegativeMarking}
                                onChange={(e) => handleSettingChange('enableNegativeMarking', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Enable negative marking
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            {formState.questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No questions added yet
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                        Click "Add Question" to get started
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {formState.questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            onEdit={() => setEditingQuestion(question)}
                            onDelete={() => handleDeleteQuestion(question.id)}
                            onMoveUp={() => handleReorderQuestion(question.id, 'up')}
                            onMoveDown={() => handleReorderQuestion(question.id, 'down')}
                            isFirst={index === 0}
                            isLast={index === formState.questions.length - 1}
                        />
                    ))}
                </div>
            )}

            {/* Question Editor Modal */}
            {(isAddingQuestion || editingQuestion) && (
                <QuestionEditor
                    question={editingQuestion}
                    onSave={editingQuestion ? handleEditQuestion : handleAddQuestion}
                    onCancel={() => {
                        setIsAddingQuestion(false);
                        setEditingQuestion(null);
                    }}
                    questionNumber={editingQuestion ? editingQuestion.order : formState.questions.length + 1}
                    enableNegativeMarking={formState.settings.enableNegativeMarking}
                />
            )}
        </div>
    );
}

// Question Card Component
interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

function QuestionCard({
    question,
    index,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}: QuestionCardProps) {
    const correctOptions = question.options.filter((opt) => opt.isCorrect);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            Q{index + 1}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                            {question.type === 'single-choice' ? 'Single Choice' : question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                        </span>
                        {question.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded ${question.difficulty === 'easy'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : question.difficulty === 'medium'
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {question.difficulty}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-3">
                        {question.questionText}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 dark:text-green-400">
                            +{question.marks} marks
                        </span>
                        {question.negativeMarks > 0 && (
                            <span className="text-red-600 dark:text-red-400">
                                -{question.negativeMarks} for wrong
                            </span>
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                            {question.options.length} options • {correctOptions.length} correct
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                        title="Move up"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                        title="Move down"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
                        title="Edit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        title="Delete"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Question Editor Modal Component
interface QuestionEditorProps {
    question: QuizQuestion | null;
    onSave: (question: QuizQuestion) => void;
    onCancel: () => void;
    questionNumber: number;
    enableNegativeMarking: boolean;
}

function QuestionEditor({ question, onSave, onCancel, questionNumber, enableNegativeMarking }: QuestionEditorProps) {
    const [formData, setFormData] = useState<QuizQuestion>(
        question || {
            id: `q-${Date.now()}`,
            questionText: '',
            type: 'single-choice',
            options: [
                { id: `opt-1`, text: '', isCorrect: false },
                { id: `opt-2`, text: '', isCorrect: false },
            ],
            marks: 1,
            negativeMarks: 0,
            explanation: '',
            order: questionNumber,
        }
    );

    const handleSubmit = () => {
        // Validation
        if (!formData.questionText.trim()) {
            alert('Please enter a question');
            return;
        }
        if (formData.options.some((opt) => !opt.text.trim())) {
            alert('Please fill all options');
            return;
        }
        if (!formData.options.some((opt) => opt.isCorrect)) {
            alert('Please mark at least one correct answer');
            return;
        }

        onSave(formData);
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { id: `opt-${Date.now()}`, text: '', isCorrect: false }],
        });
    };

    const removeOption = (optionId: string) => {
        if (formData.options.length <= 2) {
            alert('Minimum 2 options required');
            return;
        }
        setFormData({
            ...formData,
            options: formData.options.filter((opt) => opt.id !== optionId),
        });
    };

    const updateOption = (optionId: string, updates: Partial<QuizOption>) => {
        setFormData({
            ...formData,
            options: formData.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
            ),
        });
    };

    const toggleCorrect = (optionId: string) => {
        if (formData.type === 'single-choice') {
            // For single choice, only one can be correct
            setFormData({
                ...formData,
                options: formData.options.map((opt) => ({
                    ...opt,
                    isCorrect: opt.id === optionId,
                })),
            });
        } else {
            // For multiple choice, toggle
            updateOption(optionId, {
                isCorrect: !formData.options.find((o) => o.id === optionId)?.isCorrect,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {question ? 'Edit Question' : `Add Question ${questionNumber}`}
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Question Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Question Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="single-choice">Single Choice (MCQ)</option>
                            <option value="multiple-choice">Multiple Choice (Multiple Correct)</option>
                            <option value="true-false">True/False</option>
                        </select>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Question *
                        </label>
                        <textarea
                            value={formData.questionText}
                            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your question here..."
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Answer Options *
                            </label>
                            <button
                                onClick={addOption}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                + Add Option
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-3">
                                    <input
                                        type={formData.type === 'single-choice' ? 'radio' : 'checkbox'}
                                        checked={option.isCorrect}
                                        onChange={() => toggleCorrect(option.id)}
                                        className="w-5 h-5 text-green-600"
                                    />
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => updateOption(option.id, { text: e.target.value })}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    {formData.options.length > 2 && (
                                        <button
                                            onClick={() => removeOption(option.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {formData.type === 'single-choice' ? 'Select one correct answer' : 'Select all correct answers'}
                        </p>
                    </div>

                    {/* Marks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Marks *
                            </label>
                            <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={formData.marks}
                                onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {enableNegativeMarking && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Negative Marks
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.25"
                                    value={formData.negativeMarks}
                                    onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        )}
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty (Optional)
                        </label>
                        <select
                            value={formData.difficulty || ''}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Not specified</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Explanation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Explanation (Optional)
                        </label>
                        <textarea
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Explain the correct answer..."
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
                    >
                        {question ? 'Update Question' : 'Add Question'}
                    </button>
                </div>
            </div>
        </div>
    );
}
