import Link from 'next/link';
import { getActiveQuizzes } from './actions';

export default async function QuizHubPage() {
    const quizzes = await getActiveQuizzes();
    
    const competitions = quizzes.filter(q => q.quiz_type === 'Competition');
    const practices = quizzes.filter(q => q.quiz_type === 'Practice');

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-24 pb-16 px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-[#0a0a0a] z-0"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase mb-6 text-purple-300">Myark Arena</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        Test your knowledge. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">Beat the leaderboard.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Weekly quizzes across Science, Maths, Coding, AI, Robotics and more. Compete with students across India.
                    </p>
                    
                    {/* Live Stats Strip */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 py-6 border-y border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/20">
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">{quizzes.length}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Active Quizzes</div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-blue-400 animate-pulse">Live</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Real-time Stats</div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">Sunday</div>
                            <div className="text-xs text-purple-400 uppercase tracking-wider font-bold mt-1">Leaderboard Reveal</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-24 relative z-10">
                
                {competitions.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold">This Week&apos;s Competitions</h2>
                            <div className="h-px bg-gradient-to-r from-purple-500/60 to-transparent flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {competitions.map(quiz => (
                                <Link href={`/quiz/${quiz.slug}`} key={quiz.id} className="group relative block rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-1 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                                    <div className="relative bg-[#111] rounded-xl p-6 h-full flex flex-col border border-white/5 z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/10 text-xs font-bold shadow-inner" style={{ color: (quiz.subject as { colour?: string })?.colour || '#fff' }}>
                                                {(quiz.subject as { name?: string })?.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium bg-black/50 px-2 py-1 rounded-md border border-white/5">
                                                {quiz.questions_per_attempt} Qs • {Math.round(quiz.time_limit_seconds/60)} Min
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black mb-2 group-hover:text-purple-400 transition-colors drop-shadow-md">{quiz.title}</h3>
                                        <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">{quiz.description}</p>
                                        
                                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                <span>Leaderboard closes Sunday</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                
                {practices.length > 0 && (
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold">Practice Arenas</h2>
                            <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {practices.map(quiz => (
                                <Link href={`/quiz/${quiz.slug}`} key={quiz.id} className="group relative block rounded-2xl bg-gradient-to-b from-white/5 to-transparent p-1 transition-all hover:-translate-y-1 hover:bg-white/10">
                                    <div className="relative bg-[#111] rounded-xl p-6 h-full flex flex-col border border-white/5 z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 text-xs font-bold" style={{ color: (quiz.subject as { colour?: string })?.colour || '#fff' }}>
                                                {(quiz.subject as { name?: string })?.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium border border-gray-800 px-2 py-0.5 rounded">Practice Mode</span>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{quiz.title}</h3>
                                        <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">{quiz.description}</p>
                                        
                                        <div className="mt-auto flex items-center text-sm font-bold text-blue-500 group-hover:text-blue-400 uppercase tracking-wide">
                                            Start Practice &rarr;
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
