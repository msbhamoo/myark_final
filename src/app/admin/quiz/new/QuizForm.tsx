'use client';

import { useState } from 'react';
import { createQuiz } from '../actions';
import { useRouter } from 'next/navigation';
import { QuizSubject } from '@/lib/types';

export function QuizForm({ subjects }: { subjects: QuizSubject[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      try {
          const formData = new FormData(e.currentTarget);
          await createQuiz(formData);
          router.push('/admin/quiz');
      } catch (err: unknown) {
          alert(err instanceof Error ? err.message : String(err));
          setLoading(false);
      }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title</label>
            <input required type="text" name="title" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" placeholder="e.g. Weekly Tech Challenge" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <select required name="subject_id" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <option value="" className="text-black">Select subject</option>
                {subjects.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Type</label>
            <select required name="quiz_type" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <option value="Competition" className="text-black">Competition (Leaderboard, Timing)</option>
                <option value="Practice" className="text-black">Practice (Self-paced, Unlimited)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Cadence (If Competition)</label>
            <select name="cadence" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <option value="" className="text-black">None / Custom</option>
                <option value="Daily" className="text-black">Daily</option>
                <option value="Weekly" className="text-black">Weekly</option>
                <option value="Monthly" className="text-black">Monthly</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Questions Per Attempt</label>
            <input required type="number" name="questions_per_attempt" defaultValue={5} min={1} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Limit (Seconds)</label>
            <input required type="number" name="time_limit_seconds" defaultValue={300} min={10} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" rows={3} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" placeholder="Brief description visible to students..."></textarea>
      </div>
      
      <div className="pt-4 flex justify-end">
          <button disabled={loading} type="submit" className="bg-black dark:bg-white text-white dark:text-black font-medium py-2 px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Quiz'}
          </button>
      </div>
    </form>
  )
}
