import { createServerClient } from '@/lib/supabase-server';
import { QuestionManager } from './QuestionManager';

export default async function QuizQuestionsPage({ params }: { params: { id: string } }) {
    const supabase = createServerClient();
    
    // Fetch quiz info
    const { data: quiz } = await supabase.from('quizzes').select('*, subject:quiz_subjects(*)').eq('id', params.id).single();
    
    // Fetch all questions for this subject
    const { data: questions } = await supabase.from('quiz_questions').select('*').eq('subject_id', quiz?.subject_id).order('created_at', { ascending: false });
    
    if (!quiz) return <div>Quiz not found</div>;
    
    return (
        <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Question Bank: {quiz.title}</h1>
              <p className="text-gray-500">Subject: {(quiz.subject as { name?: string })?.name}</p>
            </div>
            
            <QuestionManager quiz={quiz} questions={questions || []} />
        </div>
    )
}
