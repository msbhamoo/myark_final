'use server';

import { createServerClient } from '@/lib/supabase-server';
import { Quiz, QuizQuestion } from '@/lib/types';

export async function getActiveQuizzes() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      subject:quiz_subjects(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
  return data as Quiz[];
}

export async function getQuizBySlug(slug: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      subject:quiz_subjects(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
  return data as Quiz;
}

export async function getCurrentPeriod(quizId: string) {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('quiz_periods')
    .select('*')
    .eq('quiz_id', quizId)
    .lte('start_time', now)
    .gte('end_time', now)
    .single();
    
  if (error) {
    return null;
  }
  return data;
}

export async function startQuizAttempt(quizId: string, sessionId: string) {
  const supabase = createServerClient();
  
  const period = await getCurrentPeriod(quizId);
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
  
  if (!quiz) throw new Error('Quiz not found');
  
  if (quiz.quiz_type === 'Competition' && period) {
    const { data: existingAttempt } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('period_id', period.id)
      .eq('session_id', sessionId)
      .single();
      
    if (existingAttempt) {
      return { existing: true, attempt: existingAttempt };
    }
  }

  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('subject_id', quiz.subject_id)
    .eq('is_active', true);
    
  if (error || !questions || questions.length === 0) throw new Error('Failed to fetch questions');
  
  let selectedQuestions: QuizQuestion[] = [];
  if (quiz.quiz_type === 'Competition' && period && period.questions_used && period.questions_used.length > 0) {
     const pool = questions.filter(q => !period.questions_used.includes(q.id));
     selectedQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, quiz.questions_per_attempt);
     
     if (selectedQuestions.length < quiz.questions_per_attempt) {
         selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, quiz.questions_per_attempt);
     }
  } else {
     selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, quiz.questions_per_attempt);
  }

  const safeQuestions = selectedQuestions.map(q => ({
    id: q.id,
    question: q.question,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    subject_id: q.subject_id,
  }));

  return { existing: false, questions: safeQuestions, periodId: period?.id || null };
}

export async function submitQuizAttempt(payload: { quizId: string, periodId?: string, sessionId: string, studentInfo?: { name?: string, class?: string, school?: string, city?: string }, answers: Record<string, string>, timeTakenSeconds: number }) {
  const supabase = createServerClient();
  const { quizId, periodId, sessionId, studentInfo, answers, timeTakenSeconds } = payload;

  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
  if (!quiz) throw new Error('Quiz not found');

  const questionIds = Object.keys(answers);
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .in('id', questionIds);

  let correctCount = 0;
  let wrongCount = 0;
  const skippedCount = quiz.questions_per_attempt - questionIds.length;
  let score = 0;

  const results = questionIds.map(qId => {
    const q = questions?.find(i => i.id === qId);
    if (!q) return { id: qId, correct: false, skipped: true };
    const isCorrect = q.correct_option === answers[qId];
    if (isCorrect) correctCount++;
    else wrongCount++;
    return {
      id: qId,
      correct: isCorrect,
      correct_option: q.correct_option,
      explanation: q.explanation,
      originalQuestion: q
    };
  });

  score = (correctCount * 10);

  let speedBonus = 0;
  const timeLimit = quiz.time_limit_seconds;
  if (timeTakenSeconds < timeLimit * 0.3) speedBonus = 15;
  else if (timeTakenSeconds >= timeLimit * 0.3 && timeTakenSeconds < timeLimit * 0.5) speedBonus = 10;
  else if (timeTakenSeconds >= timeLimit * 0.5 && timeTakenSeconds < timeLimit * 0.7) speedBonus = 5;

  if (correctCount === quiz.questions_per_attempt) {
      speedBonus += 5;
  }

  const finalScore = score + speedBonus;

  const attemptData = {
    quiz_id: quizId,
    period_id: periodId,
    session_id: sessionId,
    student_name: studentInfo?.name || 'Anonymous',
    student_class: studentInfo?.class || null,
    school: studentInfo?.school || null,
    city: studentInfo?.city || null,
    questions_shown: questionIds,
    answers: answers,
    score: score,
    total_questions: quiz.questions_per_attempt,
    correct_answers: correctCount,
    wrong_answers: wrongCount,
    skipped_answers: skippedCount,
    time_taken_seconds: timeTakenSeconds,
    speed_bonus: speedBonus,
    final_score: finalScore,
  };

  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .insert(attemptData)
    .select()
    .single();

  if (error) {
    console.error('Error saving attempt:', error);
    throw new Error('Failed to save attempt');
  }

  if (questions) {
    await Promise.all(questions.map(async (q) => {
        const isCorrect = answers[q.id] === q.correct_option;
        await supabase.from('quiz_questions').update({
            times_shown: (q.times_shown || 0) + 1,
            times_correct: (q.times_correct || 0) + (isCorrect ? 1 : 0)
        }).eq('id', q.id);
    }));
  }

  return {
    attemptId: attempt.id,
    stats: {
      correctCount,
      wrongCount,
      skippedCount,
      score,
      speedBonus,
      finalScore
    },
    results 
  };
}

export async function getLeaderboard(quizId: string, periodId: string) {
    const supabase = createServerClient();
    const { data } = await supabase
        .from('quiz_leaderboard')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('period_id', periodId)
        .order('rank', { ascending: true });
        
    return data || [];
}
