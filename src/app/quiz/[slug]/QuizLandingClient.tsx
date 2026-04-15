'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function QuizLandingClient({ quiz }: { quiz: { id: string, title: string, slug: string, description: string | null, questions_per_attempt: number, time_limit_seconds: number, quiz_type?: string, subject?: { name?: string, colour?: string } | unknown } }) {
    const [studentInfo, setStudentInfo] = useState<{ name: string, class: string, school: string, city: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const stored = localStorage.getItem('myark_quiz_student');
        if (stored) {
            setStudentInfo(JSON.parse(stored));
        }
        
        if (!localStorage.getItem('myark_quiz_session')) {
            localStorage.setItem('myark_quiz_session', 'sess_' + Math.random().toString(36).substr(2, 9));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const info = {
            name: (formData.get('name') || '') as string,
            class: (formData.get('class') || '') as string,
            school: (formData.get('school') || '') as string,
            city: (formData.get('city') || '') as string,
        };
        localStorage.setItem('myark_quiz_student', JSON.stringify(info));
        setStudentInfo(info);
    };

    const startQuiz = () => {
        setLoading(true);
        router.push(`/quiz/${quiz.slug}/attempt`);
    };

    return (
        <div className="bg-[#111] text-white rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-sm relative z-10 w-full mb-10">
            <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/10 text-xs font-bold shadow-inner" style={{ color: (quiz.subject as { colour?: string })?.colour || '#fff' }}>
                    {(quiz.subject as { name?: string })?.name}
                </span>
                <span className="text-xs font-medium text-gray-400 border border-white/10 px-2 py-1 rounded shadow-sm">
                    {quiz.quiz_type}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm !text-white">{quiz.title}</h1>
            <p className="text-gray-400 mb-8">{quiz.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center shadow-inner">
                    <div className="text-2xl font-black text-white !text-white">{quiz.questions_per_attempt}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Questions</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center shadow-inner">
                    <div className="text-2xl font-black text-white !text-white">{Math.round(quiz.time_limit_seconds/60)}m</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Time Limit</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center col-span-2 shadow-inner">
                    <div className="text-xl font-black text-purple-400 mt-1">Speed Bonus</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">+15 pts for fast finish</div>
                </div>
            </div>
            
            <div className="mb-10 p-5 rounded-xl bg-purple-900/20 border border-purple-500/30 text-sm text-gray-300 space-y-3 shadow-lg">
                <h3 className="font-bold text-white !text-white text-base">Rules of the Arena</h3>
                <ul className="space-y-2 list-disc list-inside">
                    <li>You&apos;ll get <strong className="text-white">{quiz.questions_per_attempt} random questions</strong> from the bank.</li>
                    <li>Each correct answer is <strong className="text-blue-400">10 points</strong>. Wrong answers are <strong className="text-red-400">0 points</strong> (no negative marking).</li>
                    <li>Answer fast to earn up to <strong className="text-yellow-400">15 Speed Bonus points</strong>!</li>
                    <li><strong className="text-white">Streak Bonus:</strong> Get a perfect run for a massive point boost.</li>
                    {quiz.quiz_type === 'Competition' && (
                        <li>You can play this competition only <strong className="text-white drop-shadow">ONCE</strong> this week.</li>
                    )}
                </ul>
            </div>

            {!studentInfo ? (
                <form onSubmit={handleSubmit} className="space-y-4 bg-black/40 p-6 rounded-xl border border-white/5 shadow-inner">
                    <h3 className="font-bold text-lg mb-4 text-white !text-white">Enter the Arena</h3>
                    <p className="text-xs text-gray-500 mb-4">Your details appear on the leaderboard. No sign-up required.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required name="name" placeholder="Your Name" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-colors" />
                        <select required name="class" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-colors appearance-none">
                            <option value="">Select Class</option>
                            {[...Array(12)].map((_, i) => <option key={i} value={`Class ${i+1}`}>Class {i+1}</option>)}
                        </select>
                        <input required name="school" placeholder="School Name" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-colors" />
                        <input required name="city" placeholder="City" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-colors" />
                    </div>
                    
                    <button type="submit" className="w-full mt-4 bg-white text-black font-black uppercase tracking-wider py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                        Save Profile & Continue
                    </button>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                        <div>
                            <div className="text-sm text-gray-500 font-medium">Playing as</div>
                            <div className="font-bold text-lg !text-white">{studentInfo.name}</div>
                            <div className="text-xs text-gray-400">{studentInfo.school}, {studentInfo.class}</div>
                        </div>
                        <button onClick={() => setStudentInfo(null)} className="text-xs font-bold text-purple-400 hover:text-purple-300 underline transition-colors uppercase tracking-wider">Switch Player</button>
                    </div>
                    
                    <button 
                        onClick={startQuiz} 
                        disabled={loading}
                        className="w-full relative group overflow-hidden rounded-xl p-[2px] shadow-2xl shadow-purple-500/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                        <div className="relative bg-[#111] px-8 py-5 rounded-[10px] flex items-center justify-center gap-3 transition-all group-hover:bg-opacity-0">
                            <span className="font-black text-xl tracking-wider text-white uppercase">{loading ? 'Preparing...' : 'Start Quiz Now'}</span>
                            {!loading && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-1 transition-transform drop-shadow"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            )}
                        </div>
                    </button>
                </div>
            )}

            {quiz.quiz_type === 'Competition' && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <button 
                        onClick={() => router.push(`/quiz/${quiz.slug}/leaderboard`)}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-300 hover:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                        View Official Leaderboard
                    </button>
                </div>
            )}
        </div>
    )
}
