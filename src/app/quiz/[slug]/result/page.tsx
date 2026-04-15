import { getQuizBySlug } from '../../actions';
import { notFound } from 'next/navigation';
import { QuizResultClient } from './QuizResultClient';

export default async function QuizResultPage({ params }: { params: { slug: string } }) {
    const quiz = await getQuizBySlug(params.slug);
    if (!quiz) notFound();
    
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 relative overflow-hidden selection:bg-purple-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-3xl mx-auto relative z-10 w-full">
                <QuizResultClient quiz={quiz} />
            </div>
        </div>
    )
}
