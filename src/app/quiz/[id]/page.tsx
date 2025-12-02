import { QuizOpportunity } from '@/types/quiz';
import { getDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import QuizDetail from '@/components/quiz/QuizDetail';

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
    const db = getDb();
    const quizDoc = await db.collection('quizzes').doc(params.id).get();

    if (!quizDoc.exists) {
        redirect('/quizzes');
    }

    const quizData = { id: quizDoc.id, ...quizDoc.data() } as QuizOpportunity;

    return <QuizDetail quiz={quizData} />;
}
