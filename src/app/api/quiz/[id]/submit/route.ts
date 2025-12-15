import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';
import { QuizAttempt, QuizResponse, QuizQuestion, LeaderboardEntry } from '@/types/quiz';
import { FieldValue } from 'firebase-admin/firestore';

const db = getDb();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await context.params;
    const body = await request.json();
    const { userId, userName, userEmail, responses, timeSpent } = body;

    // Fetch quiz data
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const quizData = quizDoc.data();
    const questions: QuizQuestion[] = quizData?.quizConfig?.questions || [];
    const enableNegativeMarking = quizData?.quizConfig?.settings?.enableNegativeMarking || false;

    // Evaluate responses
    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    const evaluatedResponses: QuizResponse[] = responses.map((response: QuizResponse) => {
      const question = questions.find((q) => q.id === response.questionId);
      if (!question) return response;

      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id)
        .sort();
      const selectedOptionIds = [...response.selectedOptions].sort();

      // Check if answer is correct
      const isCorrect =
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every((id, index) => id === selectedOptionIds[index]);

      let marksAwarded = 0;
      if (isCorrect) {
        marksAwarded = question.marks;
        correctAnswers++;
      } else if (selectedOptionIds.length > 0) {
        // Only apply negative marking if user attempted the question
        marksAwarded = enableNegativeMarking ? -question.negativeMarks : 0;
        incorrectAnswers++;
      }

      score += marksAwarded;

      return {
        ...response,
        isCorrect,
        marksAwarded,
      };
    });

    const unanswered = questions.length - correctAnswers - incorrectAnswers;
    const maxScore = questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = (score / maxScore) * 100;
    const passed = percentage >= (quizData?.quizConfig?.settings?.passingPercentage || 0);

    // Get attempt number
    const userAttemptsSnapshot = await db
      .collection('quizzes')
      .doc(quizId)
      .collection('attempts')
      .where('userId', '==', userId)
      .get();

    const attemptNumber = userAttemptsSnapshot.size + 1;

    // Create attempt document
    const attempt: Omit<QuizAttempt, 'id'> = {
      userId,
      userName,
      userEmail,
      quizId,
      attemptNumber,
      startedAt: new Date(Date.now() - timeSpent * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      timeSpent,
      responses: evaluatedResponses,
      score,
      maxScore,
      percentage,
      passed,
      evaluated: true,
      evaluatedAt: new Date().toISOString(),
    };

    // Save attempt
    const attemptRef = await db
      .collection('quizzes')
      .doc(quizId)
      .collection('attempts')
      .add(attempt);

    // Update leaderboard
    await updateLeaderboard(quizId, {
      userId,
      userName,
      userAvatar: '', // TODO: Get from user profile
      userSlug: '', // TODO: Get from user profile
      score,
      maxScore,
      percentage,
      rank: 0, // Will be calculated when fetching
      timeTaken: timeSpent,
      submittedAt: new Date().toISOString(),
      attemptId: attemptRef.id,
    });

    // Increment submission count
    await db
      .collection('quizzes')
      .doc(quizId)
      .update({
        submissionCount: FieldValue.increment(1),
      });

    return NextResponse.json({
      success: true,
      result: {
        attempt: { id: attemptRef.id, ...attempt },
        correctAnswers,
        incorrectAnswers,
        unanswered,
        totalQuestions: questions.length,
        score,
        maxScore,
        percentage,
        passed,
        timeTaken: timeSpent,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

async function updateLeaderboard(quizId: string, entry: LeaderboardEntry) {
  try {
    // Check if user already has an entry
    const existingEntrySnapshot = await db
      .collection('quizzes')
      .doc(quizId)
      .collection('leaderboard')
      .where('userId', '==', entry.userId)
      .get();

    if (!existingEntrySnapshot.empty) {
      // Update if new score is better
      const existingEntry = existingEntrySnapshot.docs[0];
      const existingData = existingEntry.data();

      if (entry.score > existingData.score) {
        // Convert to plain object for Firestore
        await existingEntry.ref.update({ ...entry } as any);
      }
    } else {
      // Add new entry - convert to plain object for Firestore
      await db
        .collection('quizzes')
        .doc(quizId)
        .collection('leaderboard')
        .add({ ...entry } as any);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}
