'use server';

import { createServerClient } from '@/lib/supabase-server';
import { Quiz, QuizSubject } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getQuizSubjects() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('quiz_subjects').select('*').order('name');
  if (error) throw new Error(error.message);
  return data as QuizSubject[];
}

export async function createQuiz(formData: FormData) {
  const supabase = createServerClient();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const subject_id = formData.get('subject_id') as string;
  const quiz_type = formData.get('quiz_type') as string; 
  const cadence = formData.get('cadence') as string;
  const questions_per_attempt = parseInt(formData.get('questions_per_attempt') as string) || 5;
  const time_limit_seconds = parseInt(formData.get('time_limit_seconds') as string) || 300;
  
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const { data: quiz, error } = await supabase.from('quizzes').insert({
    title,
    slug,
    description,
    subject_id,
    quiz_type,
    cadence,
    questions_per_attempt,
    time_limit_seconds,
  }).select().single();
  
  if (error) throw new Error(error.message);
  
  if (quiz_type === 'Competition') {
      const start_time = new Date().toISOString();
      const end_time = new Date();
      end_time.setDate(end_time.getDate() + 7); 
      
      await supabase.from('quiz_periods').insert({
          quiz_id: quiz.id,
          period_number: 1,
          period_label: 'Week 1',
          start_time,
          end_time: end_time.toISOString()
      });
  }
  
  revalidatePath('/admin/quiz');
  return quiz as Quiz;
}

export async function addQuestionsBulk(subjectId: string, questionsData: Record<string, string | null | undefined>[]) {
  const supabase = createServerClient();
  
  const questionsToInsert = questionsData.map(q => ({
      subject_id: subjectId,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      explanation: q.explanation || null,
      difficulty: q.difficulty || 'medium',
      class_level: q.class_level || null,
      tags: q.tags ? q.tags.split(',').map((t: string) => t.trim()) : null,
  }));
  
  const { error } = await supabase.from('quiz_questions').insert(questionsToInsert);
  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/quiz/[id]/questions', 'page');
  return true;
}

export async function addSingleQuestion(subjectId: string, formData: FormData) {
  const supabase = createServerClient();
  
  const question = formData.get('question') as string;
  const option_a = formData.get('option_a') as string;
  const option_b = formData.get('option_b') as string;
  const option_c = formData.get('option_c') as string;
  const option_d = formData.get('option_d') as string;
  const correct_option = formData.get('correct_option') as string;
  const explanation = formData.get('explanation') as string;
  const difficulty = formData.get('difficulty') as string || 'medium';
  
  const { error } = await supabase.from('quiz_questions').insert({
      subject_id: subjectId,
      question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty
  });
  
  if (error) throw new Error(error.message);
  revalidatePath('/admin/quiz/[id]/questions', 'page');
  return true;
}

export async function revealLeaderboard(quizId: string, periodId: string) {
  const supabase = createServerClient();
  
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('period_id', periodId)
    .order('final_score', { ascending: false })
    .order('time_taken_seconds', { ascending: true });
    
  if (!attempts || attempts.length === 0) return false;
  
  const leaderboardEntries = attempts.map((attempt, index) => {
      const rank = index + 1;
      let badge = null;
      if (rank === 1) badge = 'Winner';
      else if (rank <= 3) badge = 'Top 3';
      else if (rank <= 10) badge = 'Top 10';
      
      return {
          quiz_id: quizId,
          period_id: periodId,
          attempt_id: attempt.id,
          rank,
          student_name: attempt.student_name,
          student_class: attempt.student_class,
          school: attempt.school,
          city: attempt.city,
          score: attempt.score,
          correct_answers: attempt.correct_answers,
          time_taken_seconds: attempt.time_taken_seconds,
          final_score: attempt.final_score,
          badge_earned: badge
      };
  });
  
  await supabase.from('quiz_leaderboard').delete().eq('period_id', periodId); 
  const { error } = await supabase.from('quiz_leaderboard').insert(leaderboardEntries);
  if (error) throw new Error(error.message);
  
  await supabase.from('quiz_periods').update({ leaderboard_revealed: true }).eq('id', periodId);
  await supabase.from('quizzes').update({ leaderboard_revealed: true }).eq('id', quizId);
  
  revalidatePath(`/admin/quiz/${quizId}/leaderboard`);
  return true;
}

export async function unrevealLeaderboard(quizId: string, periodId: string) {
  const supabase = createServerClient();
  await supabase.from('quiz_leaderboard').delete().eq('period_id', periodId);
  await supabase.from('quiz_periods').update({ leaderboard_revealed: false }).eq('id', periodId);
  await supabase.from('quizzes').update({ leaderboard_revealed: false }).eq('id', quizId);
  revalidatePath(`/admin/quiz/${quizId}/leaderboard`);
  return true;
}

export async function updateQuiz(id: string, formData: FormData) {
  const supabase = createServerClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const subject_id = formData.get('subject_id') as string;
  const cadence = formData.get('cadence') as string;
  const questions_per_attempt = parseInt(formData.get('questions_per_attempt') as string) || 5;
  const time_limit_seconds = parseInt(formData.get('time_limit_seconds') as string) || 300;
  const is_active = formData.get('is_active') === 'on';
  
  const { data: quiz, error } = await supabase.from('quizzes').update({ 
      title, description, subject_id, cadence, questions_per_attempt, time_limit_seconds, is_active 
  }).eq('id', id).select().single();
  
  if (error) throw new Error(error.message);
  revalidatePath('/admin/quiz');
  return quiz;
}

export async function updateQuestion(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient();
  const { error } = await supabase.from('quiz_questions').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/quiz/[id]/questions', 'page');
  return true;
}

export async function deleteQuestion(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/quiz/[id]/questions', 'page');
  return true;
}
