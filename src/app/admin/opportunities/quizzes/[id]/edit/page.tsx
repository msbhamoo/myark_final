import { QuizOpportunity } from '@/types/quiz';
import { getDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import EditQuizClient from './EditQuizClient';

export default async function EditQuizPage({ params }: { params: { id: string } }) {
    const db = getDb();
    const quizDoc = await db.collection('quizzes').doc(params.id).get();

    if (!quizDoc.exists) {
        redirect('/admin/opportunities/quizzes');
    }

    const quizData = { id: quizDoc.id, ...quizDoc.data() } as QuizOpportunity;

    return <EditQuizClient quizId={params.id} initialData={quizData} />;
}
