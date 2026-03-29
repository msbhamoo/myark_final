'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

type LbEntry = { id: string, rank: number, student_name: string, school: string, class?: string, city: string, final_score: number, time_taken_seconds: number };
export function PublicLeaderboardClient({ quiz, period, entries }: { quiz: { title: string, slug?: string }, period: { period_label: string, leaderboard_revealed?: boolean }, entries: LbEntry[] }) {
    const router = useRouter();
    useEffect(() => {
        if (entries && entries.length > 0) {
            const duration = 2 * 1000;
            const end = Date.now() + duration;

            (function frame() {
              confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#fbbf24', '#f59e0b', '#d97706'], zIndex: 100 });
              confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#fbbf24', '#f59e0b', '#d97706'], zIndex: 100 });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }, [entries]);

    if (!period || !period.leaderboard_revealed) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111] rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden mt-10">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h2 className="text-3xl font-black mb-4 drop-shadow">Leaderboard Locked</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                        The leaderboard for this period hasn&apos;t been revealed yet. Check back on Sunday evening!
                    </p>
                    <button onClick={() => router.push(`/quiz/${quiz.slug}`)} className="bg-white text-black font-black uppercase tracking-wider py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors">
                        Return to Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center p-12 bg-[#111] rounded-2xl border border-white/5 mt-10">
                <h2 className="text-2xl font-bold mb-2">No Participants Yet</h2>
                <p className="text-gray-400">Be the first to get on the leaderboard next week!</p>
            </div>
        );
    }

    const top1 = entries.find((e: LbEntry) => e.rank === 1);
    const top2 = entries.find((e: LbEntry) => e.rank === 2);
    const top3 = entries.find((e: LbEntry) => e.rank === 3);
    const others = entries.filter((e: LbEntry) => e.rank > 3);

    return (
        <div className="space-y-12 pb-20">
            <header className="text-center mb-8">
                <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-yellow-500/10 text-xs font-bold uppercase tracking-widest text-yellow-500 mb-6 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    Official Results
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow">{quiz.title}</h1>
                <p className="text-gray-400 uppercase tracking-widest text-sm font-bold">{period.period_label} Standings</p>
            </header>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 md:gap-6 h-64 md:h-80 mb-16 px-2">
                {/* 2nd Place */}
                {top2 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-1/3 max-w-[160px] flex flex-col items-center group relative z-10">
                        <div className="text-center mb-3">
                            <div className="font-bold text-sm md:text-base truncate w-full px-2 drop-shadow text-gray-200">{top2.student_name}</div>
                            <div className="text-[10px] md:text-xs text-gray-400 font-bold ml-1">{top2.final_score} pts</div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-gray-400 via-gray-300 to-gray-200 h-32 md:h-40 rounded-t-lg border-t-4 border-white shadow-[0_-10px_20px_rgba(156,163,175,0.3)] relative flex justify-center">
                            <span className="text-5xl md:text-6xl font-black text-gray-800/20 mt-4 absolute">2</span>
                        </div>
                    </motion.div>
                )}

                {/* 1st Place */}
                {top1 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-1/3 max-w-[180px] flex flex-col items-center group relative z-20">
                        <div className="absolute -top-12 text-3xl md:text-4xl mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,1)] z-30">👑</div>
                        <div className="text-center mb-4 mt-2 relative z-30">
                            <div className="font-black text-base md:text-xl truncate w-full px-2 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{top1.student_name}</div>
                            <div className="text-xs md:text-sm font-bold bg-yellow-400/20 text-yellow-300 px-2 rounded-full mt-1 border border-yellow-400/30 inline-block">{top1.final_score} pts</div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-300 h-40 md:h-56 rounded-t-lg border-t-4 border-yellow-100 shadow-[0_-15px_30px_rgba(234,179,8,0.4)] relative flex justify-center">
                            <span className="text-6xl md:text-8xl font-black text-yellow-800/30 mt-4 absolute">1</span>
                        </div>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {top3 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="w-1/3 max-w-[160px] flex flex-col items-center group relative z-10">
                        <div className="text-center mb-3">
                            <div className="font-bold text-sm md:text-base truncate w-full px-2 text-amber-500 drop-shadow">{top3.student_name}</div>
                            <div className="text-[10px] md:text-xs text-amber-600 font-bold ml-1">{top3.final_score} pts</div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 h-28 md:h-32 rounded-t-lg border-t-4 border-amber-300 shadow-[0_-10px_20px_rgba(217,119,6,0.3)] relative flex justify-center">
                            <span className="text-5xl md:text-6xl font-black text-amber-900/40 mt-4 absolute">3</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* List */}
            {others.length > 0 && (
                <div className="bg-[#111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative z-20">
                    <div className="p-4 bg-white/5 border-b border-white/5">
                        <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400">All Contenders</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {others.map((e: LbEntry) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={e.id} className="flex items-center justify-between p-4 md:p-6 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-8 md:w-10 text-center font-black text-xl text-gray-600">#{e.rank}</div>
                                    <div>
                                        <div className="font-bold md:text-lg text-white">{e.student_name}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">{e.school}, {e.class}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-purple-400 md:text-lg drop-shadow">{e.final_score} pts</div>
                                    <div className="text-xs text-gray-500 font-mono">{e.time_taken_seconds}s</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="flex justify-center mt-12 relative z-20">
                 <button onClick={() => router.push('/quiz')} className="bg-white/10 text-white font-black uppercase tracking-widest py-4 px-10 rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02] shadow-xl">
                    Back to Arena Hub
                </button>
            </div>
        </div>
    )
}
