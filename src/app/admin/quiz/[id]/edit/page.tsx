import { getQuizSubjects } from '../../actions';
import { EditQuizForm } from './EditQuizForm';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

export default async function EditQuizPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const subjects = await getQuizSubjects();
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', params.id).single();
  
  if (!quiz) notFound();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Quiz: {quiz.title}</h1>
        <p className="text-gray-500">Update quiz settings.</p>
      </div>
      
      <div className="bg-white dark:bg-[#111] shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <EditQuizForm subjects={subjects} quiz={quiz} />
      </div>
    </div>
  );
}
