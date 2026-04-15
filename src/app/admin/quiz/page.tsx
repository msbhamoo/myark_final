import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';

export default async function AdminQuizPage() {
  const supabase = createServerClient();
  
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, subject:quiz_subjects(name)')
    .order('created_at', { ascending: false });

  const { data: attemptCounts } = await supabase.from('quiz_attempts').select('quiz_id');
  const counts = (attemptCounts || []).reduce((acc: Record<string, number>, curr: { quiz_id: string }) => {
      acc[curr.quiz_id] = (acc[curr.quiz_id] || 0) + 1;
      return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Management</h1>
          <p className="text-gray-500">Manage competition and practice quizzes.</p>
        </div>
        <Link 
          href="/admin/quiz/new" 
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          + Create Quiz
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111] overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#111] divide-y divide-gray-200 dark:divide-gray-800">
            {quizzes?.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{quiz.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{(quiz.subject as { name?: string })?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{counts[quiz.id] || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quiz.is_active ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {quiz.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/quiz/${quiz.id}/questions`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                    Questions
                  </Link>
                  <Link href={`/admin/quiz/${quiz.id}/attempts`} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4 font-bold">
                    Attempts
                  </Link>
                  <Link href={`/admin/quiz/${quiz.id}/leaderboard`} className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-4">
                    Leaderboard
                  </Link>
                  <Link href={`/admin/quiz/${quiz.id}/edit`} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!quizzes || quizzes.length === 0) && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No quizzes found. Create one to get started!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
