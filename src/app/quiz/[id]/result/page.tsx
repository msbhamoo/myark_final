import { getDb } from '@/lib/firebaseAdmin';
import QuizResultPage from '@/components/quiz/QuizResultPage';
import { QuizResultSummary, QuizOpportunity } from '@/types/quiz';

export default async function QuizResultPageWrapper({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { attemptId?: string };
}) {
  const quizId = params.id;
  const attemptId = searchParams.attemptId;

  if (!attemptId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No attempt ID provided
          </h1>
          <a href={`/quiz/${quizId}`} className="text-indigo-600 hover:underline">
            Back to Quiz
          </a>
        </div>
      </div>
    );
  }

  const db = getDb();

  // Fetch quiz data
  const quizDoc = await db.collection('quizzes').doc(quizId).get();
  if (!quizDoc.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz not found
          </h1>
          <a href="/quizzes" className="text-indigo-600 hover:underline">
            Back to Quizzes
          </a>
        </div>
      </div>
    );
  }

  const quiz = { id: quizDoc.id, ...quizDoc.data() } as QuizOpportunity;

  // Fetch attempt data
  const attemptDoc = await db
    .collection('quizzes')
    .doc(quizId)
    .collection('attempts')
    .doc(attemptId)
    .get();

  if (!attemptDoc.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Result not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your quiz attempt could not be found.
          </p>
          <a href={`/quiz/${quizId}`} className="text-indigo-600 hover:underline">
            Back to Quiz
          </a>
        </div>
      </div>
    );
  }

  const attempt = attemptDoc.data()!;

  // Check if results are visible based on leaderboard settings
  const now = new Date();
  const leaderboardSettings = quiz.leaderboardSettings;
  let resultsVisible = true;
  let releaseTime: Date | null = null;

  if (leaderboardSettings?.type === 'scheduled' && leaderboardSettings.scheduledDate) {
    releaseTime = new Date(leaderboardSettings.scheduledDate);
    resultsVisible = now >= releaseTime;
  } else if (leaderboardSettings?.type === 'delayed' && leaderboardSettings.delayHours) {
    const quizEndDate = new Date(quiz.endDate);
    releaseTime = new Date(quizEndDate.getTime() + leaderboardSettings.delayHours * 60 * 60 * 1000);
    resultsVisible = now >= releaseTime;
  }

  // If results are not visible yet, show countdown
  if (!resultsVisible && releaseTime) {
    const timeRemaining = releaseTime.getTime() - now.getTime();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const daysRemaining = Math.floor(hoursRemaining / 24);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Submitted Successfully! 🎉
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your answers have been recorded. Results will be available:
            </p>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
              <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
                {daysRemaining > 0
                  ? `In ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
                  : `In ${hoursRemaining} ${hoursRemaining === 1 ? 'hour' : 'hours'}`
                }
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                {releaseTime.toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You'll be able to view your score, rank, and detailed performance once results are released.
            </p>

            <div className="flex gap-3">
              <a
                href={`/quiz/${quizId}`}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Back to Quiz
              </a>
              <a
                href="/quizzes"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Browse Quizzes
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch leaderboard to get rank
  const leaderboardSnapshot = await db
    .collection('quizzes')
    .doc(quizId)
    .collection('leaderboard')
    .get();

  // Sort leaderboard client-side to avoid composite index requirement
  const sortedLeaderboard = leaderboardSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      // Sort by score descending, then by timeTaken ascending
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    });

  let rank = 0;
  sortedLeaderboard.forEach((entry: any, index) => {
    if (entry.userId === attempt.userId) {
      rank = index + 1;
    }
  });

  const result: QuizResultSummary = {
    attemptId: attemptDoc.id,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    passed: attempt.passed,
    correctAnswers: attempt.responses.filter((r: any) => r.isCorrect).length,
    incorrectAnswers: attempt.responses.filter((r: any) => !r.isCorrect && r.selectedOptions.length > 0).length,
    unanswered: attempt.responses.filter((r: any) => r.selectedOptions.length === 0).length,
    totalQuestions: attempt.responses.length,
    timeTaken: attempt.timeSpent,
    rank,
    submittedAt: attempt.submittedAt,
  };

  return (
    <QuizResultPage
      result={result}
      quizId={quizId}
      showExplanations={quiz.quizConfig.settings.showExplanations}
    />
  );
}
