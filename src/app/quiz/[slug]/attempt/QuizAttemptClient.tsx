'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { startQuizAttempt, submitQuizAttempt } from '../../actions';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizAttemptClient({ quiz }: { quiz: { id: string, slug: string, title: string, time_limit_seconds: number } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [questions, setQuestions] = useState<{ id: string, question: string, option_a: string, option_b: string, option_c: string, option_d: string }[]>([]);
    const [periodId, setPeriodId] = useState<string|null>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const [studentInfo, setStudentInfo] = useState<{ name: string, class: string, school: string, city: string } | null>(null);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_seconds);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionSelect = (optionLabel: string) => {
        if (selectedOption !== null || isSubmitting) return; 
        
        setSelectedOption(optionLabel);
        
        const currentQ = questions[currentIndex];
        const newAnswers = { ...answers, [currentQ.id]: optionLabel };
        setAnswers(newAnswers);
        
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev: number) => prev + 1);
                setSelectedOption(null);
            } else {
                handleSubmit(newAnswers);
            }
        }, 600); 
    };

    const handleSubmit = useCallback(async (finalAnswers = answers) => {
        setIsSubmitting(true);
        const timeTakenSeconds = quiz.time_limit_seconds - timeRemaining;
        
        try {
            const res = await submitQuizAttempt({
                quizId: quiz.id,
                periodId: periodId || undefined,
                sessionId,
                studentInfo: studentInfo || undefined,
                answers: finalAnswers,
                timeTakenSeconds
            });
            
            localStorage.setItem('myark_quiz_latest_result', JSON.stringify({ ...res, quizId: quiz.id }));
            router.replace(`/quiz/${quiz.slug}/result`);
        } catch {
            setError('Submission failed. Please try again.');
            setIsSubmitting(false);
        }
    }, [quiz.id, quiz.slug, quiz.time_limit_seconds, timeRemaining, periodId, sessionId, studentInfo, answers, router]);

    useEffect(() => {
        const init = async () => {
            const sid = localStorage.getItem('myark_quiz_session');
            const sinfo = localStorage.getItem('myark_quiz_student');
            if (!sid || !sinfo) {
                router.replace(`/quiz/${quiz.slug}`);
                return;
            }
            
            setSessionId(sid);
            const parsedInfo = JSON.parse(sinfo);
            setStudentInfo(parsedInfo);
            
            try {
                const res = await startQuizAttempt(quiz.id, sid);
                if (res.existing) {
                    setError('You have already participated in this competition period.');
                    setLoading(false);
                    return;
                }
                setQuestions(res.questions || []);
                setPeriodId(res.periodId);
                setLoading(false);
            } catch (err: unknown) {
                setError((err instanceof Error ? err.message : String(err)) || 'Failed to start quiz');
                setLoading(false);
            }
        };
        init();
        
        // Disable scroll
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; }
    }, [quiz.id, quiz.slug, router]);

    useEffect(() => {
        if (loading || error || isSubmitting) return;
        
        if (timeRemaining <= 0) {
            handleSubmit();
            return;
        }
        
        const timer = setInterval(() => {
            setTimeRemaining((prev: number) => prev - 1);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [timeRemaining, loading, error, isSubmitting, handleSubmit]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Notice</h2>
                <p className="text-gray-400 mb-8 max-w-md">{error}</p>
                <button onClick={() => router.push('/quiz')} className="bg-white text-black px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95">Return to Hub</button>
            </div>
        )
    }

    if (isSubmitting) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent flex flex-col items-center justify-center z-10">
                    <div className="text-7xl mb-8 animate-bounce">⚡</div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm uppercase tracking-widest">Compiling Results</h2>
                    <div className="w-48 h-1 bg-white/10 mt-8 rounded-full overflow-hidden">
                        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500"></motion.div>
                    </div>
                </motion.div>
            </div>
        )
    }

    const currentQ = questions[currentIndex];
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    
    const isUrgent = timeRemaining <= 30;

    return (
        <div className="flex-1 flex flex-col relative z-10 w-full max-w-4xl mx-auto md:p-8 p-4 h-full">
            {/* Top Bar */}
            <header className="flex items-center justify-between mb-8 shrink-0 relative z-20 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="font-black text-xl text-white !text-white">{currentIndex + 1}</span>
                    </div>
                    <div>
                        <div className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mb-0.5 drop-shadow">{quiz.title}</div>
                        <div className="text-sm font-bold text-gray-400">{questions.length} Questions</div>
                    </div>
                </div>
                <div className={`px-5 py-2 rounded-xl font-black font-mono text-2xl border-2 flex items-center gap-3 shadow-lg transition-colors ${isUrgent ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-red-500/30' : 'bg-white/5 border-white/10 text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {formatTime(timeRemaining)}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-12 shrink-0">
                {questions.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full flex-1 transition-all duration-500 ${i < currentIndex ? 'bg-blue-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : i === currentIndex ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-y-150' : 'bg-white/10'}`} />
                ))}
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col justify-center gap-8 mb-8 relative">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
                        className="flex-1 flex flex-col justify-center"
                    >
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-12 drop-shadow-md pb-4 border-b border-white/5 !text-white">
                            {currentQ.question}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {[
                                { label: 'A', text: currentQ.option_a },
                                { label: 'B', text: currentQ.option_b },
                                { label: 'C', text: currentQ.option_c },
                                { label: 'D', text: currentQ.option_d }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => handleOptionSelect(opt.label)}
                                    disabled={selectedOption !== null}
                                    className={`
                                        p-6 md:p-8 rounded-[1.5rem] text-left border-4 transition-all group relative overflow-hidden shadow-lg
                                        ${selectedOption === opt.label 
                                            ? 'bg-purple-900/40 border-purple-500 scale-[0.98] shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                                            : 'bg-white/5 border-white/5 hover:border-purple-500/50 hover:bg-white/10 hover:-translate-y-1'
                                        }
                                        ${selectedOption !== null && selectedOption !== opt.label ? 'opacity-30 scale-95' : ''}
                                    `}
                                >
                                    {selectedOption === opt.label && (
                                        <motion.div layoutId="selection-glow" className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 z-0"></motion.div>
                                    )}
                                    <div className="relative z-10 flex items-center gap-6">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-xl transition-all ${selectedOption === opt.label ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-[#1a1a1a] text-gray-500 group-hover:bg-purple-500/20 group-hover:text-purple-400 shadow-inner'}`}>
                                            {opt.label}
                                        </div>
                                        <div className="text-xl md:text-2xl font-bold text-gray-200 group-hover:text-white transition-colors">{opt.text}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="shrink-0 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse shadow-[0_0_5px_rgba(34,197,94,1)]"></span>
                    Arena Mode Active
                </div>
                <div>Player ID: <span className="text-gray-400">{sessionId.substring(5, 12)}</span></div>
            </div>
        </div>
    )
}
