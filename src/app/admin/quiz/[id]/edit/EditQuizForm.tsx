'use client';

import { useState } from 'react';
import { updateQuiz } from '../../actions';
import { useRouter } from 'next/navigation';
import { Quiz, QuizSubject } from '@/lib/types';

export function EditQuizForm({ subjects, quiz }: { subjects: QuizSubject[], quiz: Quiz }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      try {
          const formData = new FormData(e.currentTarget);
          await updateQuiz(quiz.id, formData);
          router.push('/admin/quiz');
      } catch (err: unknown) {
          alert('Failed to update: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
          setLoading(false);
      }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title</label>
            <input required type="text" name="title" defaultValue={quiz.title} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <select required name="subject_id" defaultValue={quiz.subject_id} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <option value="" className="text-black">Select subject</option>
                {subjects.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Type (Readonly)</label>
            <input type="text" value={quiz.quiz_type} disabled className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 px-3 py-2 text-sm cursor-not-allowed" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Cadence</label>
            <select name="cadence" defaultValue={quiz.cadence || ''} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100">
                <option value="" className="text-black">None / Custom</option>
                <option value="Daily" className="text-black">Daily</option>
                <option value="Weekly" className="text-black">Weekly</option>
                <option value="Monthly" className="text-black">Monthly</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Questions Per Attempt</label>
            <input required type="number" name="questions_per_attempt" defaultValue={quiz.questions_per_attempt} min={1} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Limit (Seconds)</label>
            <input required type="number" name="time_limit_seconds" defaultValue={quiz.time_limit_seconds} min={10} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" rows={3} defaultValue={quiz.description || ''} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"></textarea>
      </div>

      <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={quiz.is_active} className="rounded border-gray-300 text-black focus:ring-black" />
          <label htmlFor="is_active" className="text-sm font-medium">Quiz is Active</label>
      </div>
      
      <div className="pt-4 flex justify-end">
          <button disabled={loading} type="submit" className="bg-black dark:bg-white text-white dark:text-black font-medium py-2 px-6 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
          </button>
      </div>
    </form>
  )
}
