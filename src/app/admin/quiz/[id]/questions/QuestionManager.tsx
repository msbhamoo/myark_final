'use client';

import { useState } from 'react';
import { addQuestionsBulk, updateQuestion, deleteQuestion } from '@/app/admin/quiz/actions';

type FormQuestion = { id: string, question?: string, option_a?: string, option_b?: string, option_c?: string, option_d?: string, correct_option?: string, explanation?: string | null, difficulty?: string, class_level?: string | null, tags?: string | null, times_shown?: number, times_correct?: number };

export function QuestionManager({ quiz, questions }: { quiz: { subject_id: string, title?: string }, questions: FormQuestion[] }) {
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<FormQuestion>>({});
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split('\n').filter(r => r.trim().length > 0).slice(1);
                const parsed = rows.map(r => {
                    const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
                    return {
                        question: cols[0], option_a: cols[1], option_b: cols[2], option_c: cols[3], option_d: cols[4],
                        correct_option: cols[5], explanation: cols[6] || null, difficulty: cols[7] || 'medium',
                        class_level: cols[8] || null, tags: cols[9] || null
                    };
                });
                
                await addQuestionsBulk(quiz.subject_id, parsed);
                alert(`Successfully imported ${parsed.length} questions`);
            } catch (err: unknown) {
                alert('Error parsing CSV: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setLoading(false);
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const startEdit = (q: FormQuestion) => {
        setEditingId(q.id || null);
        setEditForm(q);
    };

    const handleEditChange = (e: { target: { name: string, value: string } }) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const saveEdit = async () => {
        setLoading(true);
        try {
            await updateQuestion(editingId as string, {
                question: editForm.question, option_a: editForm.option_a, option_b: editForm.option_b, 
                option_c: editForm.option_c, option_d: editForm.option_d, correct_option: editForm.correct_option,
                explanation: editForm.explanation, difficulty: editForm.difficulty
            });
            setEditingId(null);
        } catch(err:unknown) {
            alert('Failed to update: ' + (err instanceof Error ? err.message : String(err)));
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        setLoading(true);
        try {
            await deleteQuestion(id);
        } catch(err:unknown) {
            alert('Failed to delete: ' + (err instanceof Error ? err.message : String(err)));
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-medium">Bulk Import Questions</h3>
                    <p className="text-sm text-gray-500">Upload a CSV file with columns: <br/><code>question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, class_level, tags</code></p>
                </div>
                <div>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" disabled={loading} />
                    <label htmlFor="csv-upload" className="cursor-pointer bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity inline-block text-sm font-medium">
                        {loading ? 'Importing...' : 'Upload CSV'}
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] overflow-x-auto shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question Bank ({questions.length})</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {questions.map((q) => (
                          <tr key={q.id}>
                              <td className="px-6 py-4">
                                {editingId === q.id ? (
                                    <div className="space-y-2 max-w-2xl">
                                        <textarea name="question" value={editForm.question} onChange={handleEditChange} className="w-full text-sm p-2 border rounded bg-transparent dark:border-gray-700" rows={2}/>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input name="option_a" value={editForm.option_a} onChange={handleEditChange} className="w-full text-xs p-1.5 border rounded bg-transparent dark:border-gray-700" placeholder="Option A"/>
                                            <input name="option_b" value={editForm.option_b} onChange={handleEditChange} className="w-full text-xs p-1.5 border rounded bg-transparent dark:border-gray-700" placeholder="Option B"/>
                                            <input name="option_c" value={editForm.option_c} onChange={handleEditChange} className="w-full text-xs p-1.5 border rounded bg-transparent dark:border-gray-700" placeholder="Option C"/>
                                            <input name="option_d" value={editForm.option_d} onChange={handleEditChange} className="w-full text-xs p-1.5 border rounded bg-transparent dark:border-gray-700" placeholder="Option D"/>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <select name="correct_option" value={editForm.correct_option} onChange={handleEditChange} className="text-xs p-1.5 border rounded bg-transparent dark:border-gray-700 text-black dark:text-white">
                                                <option value="A" className="text-black">Option A</option>
                                                <option value="B" className="text-black">Option B</option>
                                                <option value="C" className="text-black">Option C</option>
                                                <option value="D" className="text-black">Option D</option>
                                            </select>
                                            <select name="difficulty" value={editForm.difficulty} onChange={handleEditChange} className="text-xs p-1.5 border rounded bg-transparent dark:border-gray-700 text-black dark:text-white">
                                                <option value="easy" className="text-black">Easy</option>
                                                <option value="medium" className="text-black">Medium</option>
                                                <option value="hard" className="text-black">Hard</option>
                                            </select>
                                            <input name="explanation" value={editForm.explanation || ''} onChange={handleEditChange} className="flex-1 text-xs p-1.5 border rounded bg-transparent dark:border-gray-700" placeholder="Explanation"/>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-sm font-medium">{q.question}</div>
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xl hidden md:block">Correct: {q.correct_option} - {q.explanation}</div>
                                    </>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{q.difficulty}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              { (q.times_shown || 0) > 0 ? Math.round(((q.times_correct || 0) / (q.times_shown || 1)) * 100) + '%' : 'N/A' }
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                  {editingId === q.id ? (
                                      <div className="flex items-center justify-end gap-4 min-w-[120px]">
                                          <button disabled={loading} onClick={saveEdit} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded">Save</button>
                                          <button disabled={loading} onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 transition-colors">Cancel</button>
                                      </div>
                                  ) : (
                                      <div className="flex items-center justify-end gap-3 min-w-[120px]">
                                          <button disabled={loading} onClick={() => startEdit(q)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 transition-colors hover:underline">Edit</button>
                                          <span className="text-gray-300 dark:text-gray-700">|</span>
                                          <button disabled={loading} onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 transition-colors hover:underline">Delete</button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {questions.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No questions found for this subject.</td></tr>
                      )}
                  </tbody>
                </table>
            </div>
        </div>
    )
}
