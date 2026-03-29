import { getQuizBySlug } from '../actions';
import { notFound } from 'next/navigation';
import { QuizLandingClient } from './QuizLandingClient';

export default async function QuizLandingPage({ params }: { params: { slug: string } }) {
    const quiz = await getQuizBySlug(params.slug);
    
    if (!quiz) notFound();
    
    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0a] text-white py-12 px-4 md:py-20 relative overflow-hidden flex flex-col selection:bg-purple-500/40">
            {/* Background gamified elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 hover:bg-purple-600/20 transition-colors blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-xl mx-auto w-full relative z-10 flex-1">
                <QuizLandingClient quiz={quiz} />
            </div>
        </div>
    )
}
