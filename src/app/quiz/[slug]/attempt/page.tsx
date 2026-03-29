import { getQuizBySlug } from '../../actions';
import { notFound } from 'next/navigation';
import { QuizAttemptClient } from './QuizAttemptClient';

export default async function QuizAttemptPage({ params }: { params: { slug: string } }) {
    const quiz = await getQuizBySlug(params.slug);
    if (!quiz) notFound();
    
    return (
        <div className="fixed inset-0 z-[100] bg-[#111110] text-white flex flex-col overflow-hidden selection:bg-purple-500/30">
            <QuizAttemptClient quiz={quiz} />
        </div>
    )
}
