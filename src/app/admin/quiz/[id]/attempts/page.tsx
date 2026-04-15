import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Attempt = {
  id: string;
  student_name: string;
  session_id: string;
  school: string;
  student_class: string;
  city: string;
  period?: { period_label: string };
  final_score: number;
  time_taken_seconds: number;
  correct_answers: number;
  wrong_answers: number;
  speed_bonus: number;
  completed_at: string;
};

export default async function AdminAttemptsPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', params.id).single();
  if (!quiz) notFound();
  
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*, period:quiz_periods(period_label)')
    .eq('quiz_id', quiz.id)
    .order('completed_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
              <Link href="/admin/quiz" className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Quizzes</Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium">{quiz.title}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Attempts</h1>
          <p className="text-gray-500">Live feed of all student participants.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] overflow-x-auto shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School / Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time & Math</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {attempts?.map((att: Attempt) => (
              <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="font-bold text-sm text-gray-900 dark:text-white">{att.student_name}</div>
                   <div className="text-xs text-gray-500 font-mono">{att.session_id.substring(0,8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{att.school || 'N/A'}</div>
                   <div className="text-xs text-gray-500 mt-0.5">Class: {att.student_class || 'N/A'} • {att.city || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                     {att.period?.period_label || 'Practice'}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-lg font-black text-purple-600 dark:text-purple-400 drop-shadow-sm">{att.final_score} <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">pts</span></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-0.5">{att.time_taken_seconds} <span className="text-gray-500 font-normal">seconds</span></div>
                   <div className="text-xs font-medium">
                      <span className="text-blue-600 dark:text-blue-500">{att.correct_answers}✓</span> / 
                      <span className="text-red-600 dark:text-red-500 ml-1">{att.wrong_answers}✗</span> / 
                      <span className="text-yellow-600 dark:text-yellow-500 ml-1">+{att.speed_bonus}s.b</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                   {new Date(att.completed_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {(!attempts || attempts.length === 0) && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 border-t border-gray-200 dark:border-gray-800">
                        No students have attempted this quiz yet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
