'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export function QuizResultClient({ quiz }: { quiz: { id: string, slug: string, title: string, quiz_type?: string, questions_per_attempt?: number, subject?: { name?: string } | unknown } }) {
    const [result, setResult] = useState<{ stats: { finalScore: number, accuracy: number, speedBonus: number, correctCount?: number, wrongCount?: number }, results: { id: string, correct: boolean, is_correct: boolean, question: string, originalQuestion?: { question: string, option_a: string, option_b: string, option_c: string, option_d: string } & Record<string, string>, explanation: string, correct_option: string, user_answer_text: string, correct_answer_text: string }[], score: number, time_taken: number, details: { is_correct: boolean, question: string, explanation: string, correct_option: string, user_answer_text: string, correct_answer_text: string }[] } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('myark_quiz_latest_result');
        if (!stored) {
            router.replace(`/quiz/${quiz.slug}`);
            return;
        }
        
        const data = JSON.parse(stored);
        if (data.quizId !== quiz.id) {
            router.replace(`/quiz/${quiz.slug}`);
            return;
        }

        setResult(data);
        
        const pct = (data.stats.correctCount || 0) / data.stats.total_questions;
        if (pct >= 0.8 || (data.stats.correctCount || 0) === quiz.questions_per_attempt) {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
              confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#a855f7', '#ec4899', '#3b82f6'],
                zIndex: 100
              });
              confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#a855f7', '#ec4899', '#3b82f6'],
                zIndex: 100
              });

              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
        }
    }, [quiz.slug, router, quiz.id, quiz.questions_per_attempt]);

    if (!result) return null;

    const { stats, results } = result;
    const shareSubject = (quiz.subject as { name?: string })?.name || 'a';
    const shareText = encodeURIComponent(`I scored ${stats.finalScore} points on Myark's ${shareSubject} Quiz! 🏆\nCan you beat my score?\n\nTake the quiz: https://myark.in/quiz/${quiz.slug}`);
    
    return (
        <div className="space-y-8 pb-20">
            <header className="text-center mb-12">
                <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-purple-400 mb-6 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    Arena Completed
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">Your Performance</h1>
                <p className="text-gray-400">The leaderboard awaits. Let&apos;s see how you did.</p>
            </header>

            {/* Score Card */}
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 blur-[80px] rounded-full"></div>
                
                <div className="text-center relative z-10 mb-10">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Final Score</div>
                    <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tighter drop-shadow-2xl">
                        {stats.finalScore}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    <div className="bg-black/50 rounded-2xl p-4 border border-white/5 text-center shadow-inner">
                        <div className="text-3xl font-black text-green-400 mb-1 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">{stats.correctCount || 0}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Correct</div>
                    </div>
                    <div className="bg-black/50 rounded-2xl p-4 border border-white/5 text-center shadow-inner">
                        <div className="text-3xl font-black text-red-400 mb-1">{stats.wrongCount || 0}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Wrong</div>
                    </div>
                    <div className="bg-black/50 rounded-2xl p-4 border border-white/5 text-center shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors"></div>
                        <div className="text-3xl font-black text-yellow-500 mb-1 relative z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">+{stats.speedBonus}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider relative z-10">Speed Bonus</div>
                    </div>
                    <div className="bg-black/50 rounded-2xl p-4 border border-white/5 text-center shadow-inner">
                        <div className="text-3xl font-black text-blue-400 mb-1">{((stats.correctCount || 0) * 10)}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Base Points</div>
                    </div>
                </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center py-4">
                <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-[#128C7E] transition-colors shadow-[0_4px_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Brag on WhatsApp
                </a>
                
                {quiz.quiz_type === 'Competition' ? (
                    <button onClick={() => router.push(`/quiz/${quiz.slug}/leaderboard`)} className="flex-1 bg-white/10 text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl border border-white/10 hover:bg-white/20 transition-all hover:scale-[1.02] shadow-lg">
                        View Leaderboard
                    </button>
                ) : (
                    <button onClick={() => router.push(`/quiz/${quiz.slug}`)} className="flex-1 bg-white/10 text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl border border-white/10 hover:bg-white/20 transition-all hover:scale-[1.02] shadow-lg">
                        Retake Practice
                    </button>
                )}
            </div>
            
            <div className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold">Review Answers</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <div className="space-y-4">
                    {results.map((item: { id: string, correct: boolean, originalQuestion?: { question: string, option_a: string, option_b: string, option_c: string, option_d: string } & Record<string, string>, is_correct: boolean, question: string, explanation: string, correct_option: string, user_answer_text: string, correct_answer_text: string }) => (
                        <div key={item.id} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-lg backdrop-blur-sm ${item.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-inner ${item.correct ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-600 text-white'}`}>
                                    {item.correct ? '✓' : '✗'}
                                </div>
                                <div className="flex-1 mb-2">
                                    <h3 className="text-xl md:text-2xl font-bold mb-4 drop-shadow">{item.originalQuestion?.question || 'Question not found'}</h3>
                                    
                                    <div className="bg-black/60 rounded-xl p-5 border border-white/5 mb-5 shadow-inner">
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Correct Answer</div>
                                        <div className="text-lg font-black text-green-400">{item.originalQuestion?.[`option_${item.correct_option.toLowerCase()}`] || item.correct_option}</div>
                                    </div>
                                    
                                    {item.explanation && (
                                        <div className="text-sm md:text-base text-gray-300 leading-relaxed bg-blue-500/10 p-5 rounded-xl border border-blue-500/20 shadow-inner">
                                            <strong className="text-blue-400 block mb-2 font-bold uppercase tracking-wider text-xs">Explanation</strong>
                                            {item.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
